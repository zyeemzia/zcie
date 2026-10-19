window.TRACK = window.TRACK || { modules: [], exam: [] };
TRACK.modules.push({
 "id": "m5",
 "order": 5,
 "code": "Label",
 "title": "Label — MPLS and Segment Routing",
 "subtitle": "Build, scale, engineer and troubleshoot label-switched transport and the VPN services that ride on it.",
 "outcomes": [
  "Build and harden an LDP or SR-MPLS transport and explain every label operation along a path.",
  "Deliver MPLS L3VPN services end to end, including PE-CE design, route-target topologies and route reflection at scale.",
  "Compare inter-AS options and SRv6 with SR-MPLS, and choose the right one for a given scale and trust model.",
  "Engineer traffic with SR policies, colour steering and Flex-Algo, contrasting them with RSVP-TE.",
  "Troubleshoot broken label paths with a disciplined layer-by-layer method."
 ],
 "lessons": [
  {
   "id": "m5-l1",
   "title": "Label Switching and LDP: The Transport Foundation",
   "subtitle": "How labels decouple services from the core, and how LDP builds the label-switched paths underneath them",
   "minutes": 40,
   "objectives": [
    "Trace a packet through push, swap and pop operations and explain penultimate hop popping.",
    "Explain LDP discovery, session establishment and label distribution well enough to debug each stage.",
    "Harden an LDP core with IGP synchronisation, session protection, label filtering and correct MTU."
   ],
   "blocks": [
    {
     "type": "text",
     "text": "The **Label** segment of the ZCIE Mastery Ring is where enterprise and service-provider thinking meet. Labels matter in 2026 for the same reason they mattered twenty years ago: they **decouple the service from the core**. A provider router in the middle of the network does not need customer routes, Internet routes or VPN state; it only needs to know how to reach the egress edge. Every expert lab that contains a VPN, traffic engineering or fast reroute rests on a working label-switched path (LSP), so this lesson makes that foundation solid before we stack services on top."
    },
    {
     "type": "layers",
     "title": "What travels on the wire in an MPLS L3VPN",
     "items": [
      {
       "label": "Payload",
       "parts": [
        "Customer IPv4 or IPv6 packet",
        "Untouched by the core"
       ]
      },
      {
       "label": "Service label (bottom, S=1)",
       "parts": [
        "Identifies VRF or prefix at the egress PE",
        "Signalled by MP-BGP"
       ]
      },
      {
       "label": "Transport label (top)",
       "parts": [
        "Identifies the LSP to the egress PE loopback",
        "Signalled by LDP, RSVP-TE or the IGP (SR)"
       ]
      },
      {
       "label": "Layer 2 header",
       "parts": [
        "EtherType 0x8847 for MPLS unicast",
        "Rewritten hop by hop"
       ]
      }
     ]
    },
    {
     "type": "table",
     "title": "The 32-bit label stack entry and the reserved labels you must recognise",
     "head": [
      "Field or value",
      "Size or meaning",
      "Why an expert cares"
     ],
     "rows": [
      [
       "Label",
       "20 bits (0 to 1,048,575)",
       "Values 0 to 15 are reserved; dynamic ranges are platform-specific"
      ],
      [
       "Traffic Class (TC)",
       "3 bits",
       "Carries QoS across the core; set from DSCP on imposition or by policy"
      ],
      [
       "Bottom of Stack (S)",
       "1 bit",
       "Set only on the innermost label; tells the egress node that IP follows"
      ],
      [
       "TTL",
       "8 bits",
       "Copied from IP by default; disabling propagation hides the core from traceroute"
      ],
      [
       "Label 0 / 2",
       "IPv4 / IPv6 explicit null",
       "Keeps TC marking visible to the egress PE instead of popping early"
      ],
      [
       "Label 3",
       "Implicit null",
       "Signalled only, never seen on the wire; asks the upstream router to pop (PHP)"
      ],
      [
       "Label 7 / 13",
       "Entropy label indicator / generic associated channel",
       "Load-balancing entropy and in-band OAM respectively"
      ]
     ]
    },
    {
     "type": "flow",
     "title": "Life of a labelled packet across one LSP",
     "items": [
      {
       "label": "Ingress PE: push",
       "text": "FIB lookup on the destination; impose the service label, then the transport label for the BGP next hop"
      },
      {
       "label": "P router: swap",
       "text": "Pure LFIB lookup on the top label; swap to the label the downstream neighbour advertised"
      },
      {
       "label": "Penultimate hop: pop",
       "text": "Egress PE advertised implicit null, so the top label is removed one hop early"
      },
      {
       "label": "Egress PE: service lookup",
       "text": "Only the service label remains; it maps straight to a VRF or a CE next hop"
      },
      {
       "label": "CE: plain IP",
       "text": "The customer never sees a label"
      }
     ]
    },
    {
     "type": "compare",
     "title": "Three tables, three jobs",
     "columns": [
      {
       "title": "LIB (label information base)",
       "items": [
        "Every binding learned from every LDP neighbour",
        "With liberal retention, also holds unused bindings",
        "Enables fast switch-over when the IGP next hop changes"
       ]
      },
      {
       "title": "LFIB (label forwarding table)",
       "items": [
        "Only the binding from the current IGP next hop",
        "Local label to outgoing label plus interface",
        "Used for packets that arrive labelled"
       ]
      },
      {
       "title": "FIB (CEF-style table)",
       "items": [
        "IP prefixes with imposition instructions",
        "Used for packets that arrive unlabelled",
        "Must show a label for the BGP next hop of every VPN route"
       ]
      }
     ]
    },
    {
     "type": "steps",
     "title": "LDP from silence to label exchange",
     "items": [
      {
       "title": "Discovery",
       "text": "Link hellos are sent to UDP 646 at 224.0.0.2 on every LDP-enabled interface; targeted hellos are unicast for non-adjacent peers."
      },
      {
       "title": "Transport address",
       "text": "Each hello advertises a transport address, by default the LDP router ID. It must be reachable through the IGP, which is why a /32 loopback is used."
      },
      {
       "title": "TCP session",
       "text": "The peer with the higher transport address takes the active role and opens TCP to port 646."
      },
      {
       "title": "Initialisation",
       "text": "Session parameters such as keepalive time and label advertisement mode are negotiated; a mismatch keeps the session in a non-operational state."
      },
      {
       "title": "Address and label exchange",
       "text": "Peers exchange their interface addresses, then label mappings for each FEC, typically every IGP prefix or only host routes if filtered."
      }
     ]
    },
    {
     "type": "cli",
     "title": "LDP on a provider router",
     "device": "P1 · IOS-style CLI",
     "lines": [
      "mpls label protocol ldp",
      "mpls ldp router-id Loopback0 force",
      "mpls ldp igp sync holddown 2000",
      "mpls ldp session protection",
      "! advertise labels for loopbacks only",
      "ip access-list standard LDP-FEC",
      " permit 10.255.0.0 0.0.255.255",
      "no mpls ldp advertise-labels",
      "mpls ldp advertise-labels for LDP-FEC",
      "!",
      "interface GigabitEthernet0/1",
      " mtu 9100",
      " mpls ip",
      "!",
      "router isis CORE",
      " mpls ldp sync",
      " mpls ldp autoconfig level-2"
     ],
     "note": "With autoconfig the IGP enables LDP on its interfaces, so a link cannot run IS-IS without also running LDP. The per-interface `mpls ip` is shown for clarity."
    },
    {
     "type": "cli",
     "title": "Verifying sessions and bindings",
     "device": "P1 · IOS-style CLI",
     "lines": [
      "P1# show mpls ldp neighbor 10.255.0.4",
      "    Peer LDP Ident: 10.255.0.4:0; Local LDP Ident 10.255.0.1:0",
      "        TCP connection: 10.255.0.4.31544 - 10.255.0.1.646",
      "        State: Oper; Msgs sent/rcvd: 1204/1199; Downstream",
      "        LDP discovery sources:",
      "          GigabitEthernet0/1, Src IP addr: 10.1.14.4",
      "          Targeted Hello 10.255.0.1 -> 10.255.0.4, active, passive",
      "P1# show mpls forwarding-table 10.255.0.9 32",
      "Local  Outgoing   Prefix            Bytes Label  Outgoing  Next Hop",
      "Label  Label      or Tunnel Id      Switched     interface",
      "24017  24033      10.255.0.9/32     88412907     Gi0/1     10.1.14.4",
      "P1# show mpls forwarding-table 10.255.0.4 32",
      "24005  Pop Label  10.255.0.4/32     102939       Gi0/1     10.1.14.4"
     ],
     "note": "Peer 10.255.0.4 has the higher transport address, so it opened the TCP session to port 646. The targeted hello is session protection: it keeps the session and its bindings alive if the direct link fails."
    },
    {
     "type": "callout",
     "kind": "warning",
     "text": "LDP binds labels to the **exact** prefixes in the routing table. If an ABR or level boundary summarises PE loopbacks into a /16, downstream routers only hold a label for the summary. The ingress PE then finds no label for the /32 BGP next hop and either drops VPN traffic or forwards it unlabelled into a core that has no customer routes. Keep PE loopbacks as /32 host routes end to end, or move to a design (BGP labelled unicast or segment routing) that explicitly handles hierarchy.",
     "title": "The classic black hole: summarised loopbacks"
    },
    {
     "type": "framework",
     "title": "LDP hardening kit",
     "items": [
      {
       "label": "SYNC",
       "title": "LDP-IGP synchronisation",
       "text": "The IGP advertises maximum metric on a link until LDP is operational on it, so traffic is not drawn onto a link that cannot yet label-switch."
      },
      {
       "label": "PROT",
       "title": "Session protection",
       "text": "A targeted hello keeps the session and retains bindings when a direct link flaps, avoiding a full relearn on restoration."
      },
      {
       "label": "FILT",
       "title": "Label filtering",
       "text": "Allocate or advertise labels only for loopbacks; it shrinks the LIB and speeds convergence in large cores."
      },
      {
       "label": "AUTH",
       "title": "Session authentication",
       "text": "Protect the TCP session with TCP-AO or MD5 so a rogue device cannot inject bindings."
      },
      {
       "label": "MTU",
       "title": "Core MTU headroom",
       "text": "Size core links for the largest customer frame plus the deepest label stack you will impose."
      }
     ]
    },
    {
     "type": "formula",
     "title": "MTU arithmetic",
     "items": [
      {
       "name": "Required MPLS MTU",
       "expr": "customer IP MTU + (4 bytes × labels in stack)",
       "meaning": "1500-byte packets with transport + VPN + TI-LFA repair labels (4 labels) need at least 1516 bytes of MPLS MTU."
      },
      {
       "name": "Ethernet frame on the core",
       "expr": "MPLS MTU + 14 (+4 per 802.1Q tag)",
       "meaning": "Configure jumbo frames on core links rather than calculating the minimum and living on the edge."
      }
     ]
    },
    {
     "type": "scenario",
     "title": "Twenty seconds of loss after a link comes back",
     "situation": "A core link between P2 and P3 is restored after maintenance. IS-IS adjacency forms in two seconds and immediately attracts traffic, but LDP takes another eighteen seconds to come up because the TCP session waits on a hello hold timer. VPN customers report about twenty seconds of loss every time a core link recovers. What is the best permanent fix?",
     "options": [
      {
       "text": "Lower the IS-IS hello interval so the adjacency forms faster than it does today.",
       "feedback": "This makes the problem worse: the IGP would attract traffic even sooner while LDP is still down.",
       "best": false
      },
      {
       "text": "Disable penultimate hop popping so the egress PE always receives a label it understands.",
       "feedback": "PHP is unrelated. The loss happens because the link carries traffic before any labels are bound on it.",
       "best": false
      },
      {
       "text": "Enable LDP-IGP synchronisation so IS-IS advertises maximum metric on the link until LDP is operational.",
       "feedback": "Correct. Synchronisation keeps the IGP from preferring the link until labels exist on it, removing the black hole without slowing failure detection.",
       "best": true
      },
      {
       "text": "Summarise PE loopbacks at the area boundary so fewer LDP bindings need to be exchanged.",
       "feedback": "Summarising PE loopbacks breaks the end-to-end LSP and would create a far larger outage.",
       "best": false
      }
     ]
    },
    {
     "type": "terms",
     "items": [
      {
       "term": "Label-switched path (LSP)",
       "def": "The unidirectional sequence of label operations that carries traffic from an ingress to an egress router."
      },
      {
       "term": "Forwarding equivalence class (FEC)",
       "def": "The set of packets forwarded the same way and therefore given the same label, typically all traffic to one prefix."
      },
      {
       "term": "Penultimate hop popping (PHP)",
       "def": "Removal of the top label by the router before the egress, triggered when the egress advertises implicit null."
      },
      {
       "term": "Implicit null",
       "def": "Reserved label 3, signalled by an egress router to request PHP; it never appears in a packet."
      },
      {
       "term": "Explicit null",
       "def": "Reserved label 0 (IPv4) or 2 (IPv6) that the egress receives, preserving TC bits for QoS until the last hop."
      },
      {
       "term": "LFIB",
       "def": "The label forwarding table used for packets that arrive with a label; contains only bindings from the best next hop."
      },
      {
       "term": "Liberal label retention",
       "def": "Keeping bindings from every LDP neighbour, not just the current next hop, so reconvergence needs no new signalling."
      },
      {
       "term": "LDP transport address",
       "def": "The address used for the LDP TCP session; it must be reachable and is normally the router ID loopback."
      },
      {
       "term": "LDP-IGP synchronisation",
       "def": "Mechanism that keeps the IGP from using a link for forwarding until LDP has converged on it."
      },
      {
       "term": "Session protection",
       "def": "A targeted LDP hello that preserves a session and its bindings across a direct link failure."
      }
     ]
    },
    {
     "type": "quiz",
     "items": [
      {
       "q": "An ingress PE has a BGP VPN route whose next hop is 10.255.0.9, but its FIB shows the next hop as reachable via 10.255.0.0/16 with no outgoing label. What is the most likely cause?",
       "options": [
        "The VPN route target is missing on the remote PE, so the route was never exported correctly.",
        "PE loopbacks are summarised somewhere in the core, so no node holds a label for the /32 next hop.",
        "The LDP session uses the wrong transport address and therefore never leaves the initialised state.",
        "Penultimate hop popping is disabled, so the egress PE expects explicit null instead of a label."
       ],
       "answer": 1,
       "explain": "LDP binds labels to exact routing-table prefixes; a summary hides the /32 and leaves the next hop unlabelled. An RT problem would stop the route existing at all, a broken session would remove all labels, and PHP mode does not remove a binding."
      },
      {
       "q": "Two LDP neighbours have transport addresses 10.255.0.3 and 10.255.0.7. Which statement about the session is true?",
       "options": [
        "10.255.0.3 opens the session because the lower address always takes the active role in LDP.",
        "Both routers open TCP connections at once and the session with the lower port number is retained.",
        "The session runs over UDP 646 because LDP only needs TCP for targeted sessions between non-neighbours.",
        "10.255.0.7 has the higher address, so it actively opens the TCP connection to port 646 on 10.255.0.3."
       ],
       "answer": 3,
       "explain": "The peer with the higher transport address is active. LDP discovery uses UDP 646 but the session itself is always TCP 646, for link and targeted sessions alike."
      },
      {
       "q": "Why does an egress PE usually advertise implicit null for its own loopback?",
       "options": [
        "It tells upstream routers to stop forwarding labelled traffic and fall back to plain IP routing.",
        "It reserves label 3 for VPN traffic so the egress can distinguish customer packets from core traffic.",
        "It asks the penultimate router to pop the transport label so the egress performs only one lookup.",
        "It forces the TC bits to be preserved so QoS markings survive until the packet reaches the egress."
       ],
       "answer": 2,
       "explain": "Implicit null triggers PHP, saving the egress a label lookup. Preserving TC bits is the job of explicit null, and label 3 never appears on the wire."
      },
      {
       "q": "A core uses liberal label retention. What is the operational benefit after an IGP next-hop change?",
       "options": [
        "The router already holds the new next hop's binding, so it can update the LFIB without new signalling.",
        "The router can reuse its own local label for every prefix, which avoids allocating new labels at all.",
        "The router can ignore IGP changes for a hold period, which prevents transient loops while LDP updates.",
        "The router no longer needs LDP-IGP synchronisation because bindings exist before the adjacency forms."
       ],
       "answer": 0,
       "explain": "Liberal retention stores bindings from all neighbours, so reconvergence is a local LFIB rewrite. It does not replace synchronisation, which protects a newly restored link that has no session yet."
      },
      {
       "q": "Customer packets of 1500 bytes cross a core using transport, VPN and a TI-LFA repair label during failures. What is the minimum MPLS MTU that avoids fragmentation or drops in that state?",
       "options": [
        "1504 bytes, because only the top label counts toward the MTU on each individual core link.",
        "1508 bytes, because the transport label is popped before the last hop and never counts twice.",
        "1512 bytes, because three 4-byte labels are added to the 1500-byte IP packet.",
        "1500 bytes, because MPLS labels are carried inside the Ethernet header and never affect MTU."
       ],
       "answer": 2,
       "explain": "Every label in the stack adds 4 bytes: 1500 + 3 × 4 = 1512. PHP removes a label only at the penultimate hop, so the worst-case stack must fit everywhere else."
      }
     ]
    }
   ]
  },
  {
   "id": "m5-l2",
   "title": "MPLS L3VPN End to End",
   "subtitle": "VRFs, route distinguishers, route targets and MP-BGP working together across a shared core",
   "minutes": 45,
   "objectives": [
    "Explain precisely what a route distinguisher does and what a route target does, and why they are not interchangeable.",
    "Build and verify a working L3VPN across VRF, MP-BGP VPNv4/VPNv6 and PE-CE routing.",
    "Choose PE-CE protocols and loop-prevention tools for multi-site and multi-homed customers."
   ],
   "blocks": [
    {
     "type": "text",
     "text": "An MPLS Layer 3 VPN (RFC 4364) lets one provider core carry thousands of customers with overlapping address space. Every moving part has a single job: the **VRF** isolates a customer's routes on a PE, the **route distinguisher** makes overlapping prefixes unique inside BGP, the **route target** decides which VRFs import a route, **MP-BGP** carries the routes and their service labels between PEs, and the **transport LSP** from the previous lesson delivers packets to the right PE. Most failed lab tasks come from confusing two of these jobs, so we keep them strictly separate."
    },
    {
     "type": "layers",
     "title": "L3VPN building blocks, from customer to core",
     "items": [
      {
       "label": "Customer edge (CE)",
       "parts": [
        "Runs plain IP routing",
        "Static, eBGP, OSPF or IS-IS toward the PE"
       ]
      },
      {
       "label": "PE: VRF",
       "parts": [
        "Per-customer RIB and FIB",
        "Interfaces bound to the VRF"
       ]
      },
      {
       "label": "PE: MP-BGP",
       "parts": [
        "VPNv4 / VPNv6 address families",
        "RD + prefix, RT communities, service label"
       ]
      },
      {
       "label": "Route reflectors",
       "parts": [
        "Distribute VPN routes",
        "Need no VRFs themselves"
       ]
      },
      {
       "label": "Transport",
       "parts": [
        "LDP, SR or RSVP-TE LSPs between PE loopbacks",
        "P routers hold no customer state"
       ]
      }
     ]
    },
    {
     "type": "compare",
     "title": "Route distinguisher versus route target",
     "columns": [
      {
       "title": "Route distinguisher (RD)",
       "items": [
        "8 bytes prepended to the prefix to form a VPN-IPv4 or VPN-IPv6 address",
        "Makes overlapping customer prefixes distinct in BGP",
        "Has no effect on import or export",
        "Unique RD per VRF per PE allows multipath and fast convergence across multi-homed sites"
       ]
      },
      {
       "title": "Route target (RT)",
       "items": [
        "BGP extended community attached on export",
        "Matched against import RTs on every PE",
        "Defines topology: any-to-any, hub-and-spoke, extranet",
        "A route may carry many RTs; a VRF may import many"
       ]
      }
     ]
    },
    {
     "type": "table",
     "title": "Address families involved",
     "head": [
      "Address family",
      "AFI / SAFI",
      "Carries"
     ],
     "rows": [
      [
       "VPNv4 unicast",
       "1 / 128",
       "RD:IPv4 prefix, RT communities, service label"
      ],
      [
       "VPNv6 unicast",
       "2 / 128",
       "RD:IPv6 prefix, carried over an IPv4 or IPv6 transport"
      ],
      [
       "IPv4 labelled unicast",
       "1 / 4",
       "Loopbacks with labels for inter-AS option C and seamless MPLS"
      ],
      [
       "Route target constraint",
       "1 / 132",
       "Which RTs a PE wants, so reflectors send only relevant VPN routes"
      ]
     ]
    },
    {
     "type": "flow",
     "title": "Control plane: from CE route to remote VRF",
     "items": [
      {
       "label": "CE advertises",
       "text": "PE learns 172.16.10.0/24 in VRF BLUE via eBGP, OSPF or static"
      },
      {
       "label": "Export",
       "text": "PE prepends RD 65000:101, attaches RT 65000:100 and allocates a service label"
      },
      {
       "label": "MP-BGP",
       "text": "VPNv4 update to the route reflectors with next hop = PE loopback"
      },
      {
       "label": "Import",
       "text": "Remote PE compares RTs with each VRF's import list and copies matches"
      },
      {
       "label": "Install",
       "text": "VRF route installed with recursive next hop: transport label + service label"
      }
     ]
    },
    {
     "type": "cli",
     "title": "PE1: VRF, PE-CE eBGP and VPNv4",
     "device": "PE1 · IOS-style CLI",
     "lines": [
      "vrf definition BLUE",
      " rd 65000:101",
      " address-family ipv4",
      "  route-target export 65000:100",
      "  route-target import 65000:100",
      "!",
      "interface GigabitEthernet0/2",
      " vrf forwarding BLUE",
      " ip address 192.0.2.1 255.255.255.252",
      "!",
      "router bgp 65000",
      " neighbor 10.255.0.100 remote-as 65000",
      " neighbor 10.255.0.100 update-source Loopback0",
      " address-family vpnv4",
      "  neighbor 10.255.0.100 activate",
      "  neighbor 10.255.0.100 send-community extended",
      " address-family ipv4 vrf BLUE",
      "  neighbor 192.0.2.2 remote-as 65010",
      "  neighbor 192.0.2.2 activate",
      "  neighbor 192.0.2.2 as-override"
     ],
     "note": "The RD is unique to this PE and VRF; the RT is shared by every site of the customer. as-override lets other sites that also use AS 65010 accept these routes."
    },
    {
     "type": "cli",
     "title": "Following one route from BGP to the label stack",
     "device": "PE3 · IOS-style CLI",
     "lines": [
      "PE3# show bgp vpnv4 unicast vrf BLUE 172.16.10.0/24",
      "  Paths: (1 available, best #1, table BLUE)",
      "  65010",
      "    10.255.0.1 (metric 30) from 10.255.0.100 (10.255.0.100)",
      "      Origin IGP, metric 0, localpref 100, valid, internal, best",
      "      Extended Community: RT:65000:100",
      "      Originator: 10.255.0.1, Cluster list: 10.255.0.100",
      "      mpls labels in/out nolabel/24120",
      "PE3# show ip cef vrf BLUE 172.16.10.0/24 detail",
      "172.16.10.0/24, epoch 0",
      "  recursive via 10.255.0.1 label 24120",
      "    nexthop 10.1.35.5 GigabitEthernet0/1 label 24017-(local:24044)"
     ],
     "note": "Outer label 24017 is the transport label toward PE1's loopback; inner label 24120 is PE1's service label for the prefix. If the transport label were missing, the problem is in LDP or SR, not BGP."
    },
    {
     "type": "framework",
     "title": "PE-CE routing choices",
     "items": [
      {
       "label": "STAT",
       "title": "Static routes",
       "text": "Simplest and most predictable; redistribute into the VRF's BGP. No dynamic failure detection unless tracked or paired with BFD."
      },
      {
       "label": "EBGP",
       "title": "eBGP",
       "text": "The default choice. Use as-override or allowas-in when sites share an AS, and site-of-origin to stop routes re-entering a multi-homed site."
      },
      {
       "label": "OSPF",
       "title": "OSPF",
       "text": "Routes cross the core as BGP but return as inter-area (or external) routes. Domain ID and the down bit prevent loops; a sham-link restores intra-area preference over a backdoor link."
      },
      {
       "label": "ISIS",
       "title": "IS-IS or others",
       "text": "Possible but rarely chosen; follow the same redistribution and loop-prevention discipline."
      }
     ]
    },
    {
     "type": "callout",
     "kind": "insight",
     "text": "Per-prefix allocation gives each VPN prefix its own service label: simple to troubleshoot but costly at scale. Per-CE (per next hop) allocation shares one label among all prefixes from the same CE, so the egress forwards with no IP lookup. Per-VRF allocation uses one label for the whole VRF and requires an IP lookup at the egress, which also enables features such as egress filtering, but costs extra processing. Know which mode your platform uses before you reason about what a label means in a trace.",
     "title": "Label allocation modes change both scale and failure behaviour"
    },
    {
     "type": "scenario",
     "title": "Two sites, one customer AS, no routes",
     "situation": "Customer GREEN uses AS 65010 at every site and runs eBGP to the provider. Site A's prefixes reach PE3 in VRF GREEN, and PE3 advertises them to the site B CE, but the site B CE rejects them. What is the best provider-side fix?",
     "options": [
      {
       "text": "Give site B a different route distinguisher so its routes are treated as distinct from site A's.",
       "feedback": "RDs only make prefixes unique inside BGP; they do not affect AS path loop detection at the CE.",
       "best": false
      },
      {
       "text": "Remove the route target from site A's export so that site B imports the routes another way.",
       "feedback": "Without the RT the route would never be imported into site B's VRF, so the problem gets worse, not better.",
       "best": false
      },
      {
       "text": "Redistribute the VRF routes into the provider IGP so site B learns them without BGP at all.",
       "feedback": "Leaking customer routes into the core IGP destroys the isolation the VPN exists to provide.",
       "best": false
      },
      {
       "text": "Configure as-override toward the site B CE on PE3 so the customer AS in the path is replaced with the provider AS.",
       "feedback": "Correct. The CE drops the route because its own AS 65010 appears in the AS path. as-override on the PE solves it without changing the customer's routers.",
       "best": true
      }
     ]
    },
    {
     "type": "template",
     "title": "VRF and route-target plan",
     "purpose": "Plan every VRF before configuring it, so RD and RT values are consistent, unique and documented across all PEs.",
     "columns": [
      "VRF name",
      "Customer / purpose",
      "RD scheme",
      "Export RT(s)",
      "Import RT(s)",
      "Topology",
      "PE-CE protocol"
     ],
     "example": [
      [
       "BLUE",
       "Retail chain, all sites",
       "65000:1<PE-id> (unique per PE)",
       "65000:100",
       "65000:100",
       "Any-to-any",
       "eBGP + as-override"
      ],
      [
       "BLUE-SPOKE",
       "Retail branches via firewall hub",
       "65000:2<PE-id>",
       "65000:201 (spoke)",
       "65000:202 (hub)",
       "Hub-and-spoke",
       "eBGP, SoO per site"
      ]
     ],
     "rows": 6
    },
    {
     "type": "checklist",
     "title": "L3VPN bring-up checklist",
     "items": [
      "VRF defined with a unique RD on every PE and correct import/export RTs",
      "Customer interfaces bound to the VRF before addressing (binding removes the address)",
      "VPNv4/VPNv6 sessions established to the reflectors and extended communities sent",
      "PE-CE routing up and customer routes present in the local VRF table",
      "Routes present in the remote PE's VRF with the expected RT and next hop",
      "Remote next hop resolves to a /32 with a transport label in the FIB",
      "End-to-end LSP ping or trace succeeds between the PE loopbacks",
      "Ping from the VRF with large DF-set packets proves MTU across the core"
     ]
    },
    {
     "type": "quiz",
     "items": [
      {
       "q": "Two PEs both serve customer RED and use different RDs for the same VRF. A third PE imports RED routes. What decides whether it imports them?",
       "options": [
        "Only the RD, which must match the importing VRF's RD before the route can be copied into it.",
        "Both RD and RT, because the RD selects the VRF and the RT then filters which prefixes are kept.",
        "The BGP next hop, which must belong to a PE listed in the VRF's configured peer-PE table.",
        "Only the route targets attached to the routes, compared with the import RTs of each local VRF."
       ],
       "answer": 3,
       "explain": "RTs control import and export. The RD only makes the prefix unique in BGP and plays no role in VRF selection."
      },
      {
       "q": "Why do designers often give each PE a unique RD for the same customer VRF?",
       "options": [
        "So a reflector sees distinct paths for a dual-homed prefix and can pass both on, enabling fast failover.",
        "So the route targets can be omitted, because the unique RD already identifies the customer.",
        "So the service label can be derived from the RD and does not need to be signalled at all.",
        "So the P routers can separate customer traffic, since they inspect the RD when switching labels."
       ],
       "answer": 0,
       "explain": "With identical RDs a reflector picks one best VPN path and hides the other. Unique RDs keep both paths visible for multipath and quick convergence. P routers never see RDs."
      },
      {
       "q": "A PE shows a customer route in its VRF table, but the CEF entry has only one label. Which label is most likely missing and what does that point to?",
       "options": [
        "The service label, pointing at a missing route target on the PE where the route was originated.",
        "The transport label for the remote PE loopback, pointing at an LDP or SR problem in the core.",
        "The service label, pointing at a missing RD on the importing PE for this particular VRF.",
        "The transport label, pointing at a missing send-community setting toward the CE router."
       ],
       "answer": 1,
       "explain": "If BGP delivered the route, it delivered the service label with it. A missing outer label means the next hop has no LSP. Communities toward a CE have nothing to do with labels."
      },
      {
       "q": "A multihomed customer site is learning its own prefixes back from the VPN through its second PE. Which tool is designed to stop this?",
       "options": [
        "allowas-in on the CE, which accepts its own AS in the path and filters the duplicate routes.",
        "A unique RD per site, which keeps the routes in separate tables so they cannot loop back.",
        "Site of origin, which tags routes from the site and blocks them from being sent back to it.",
        "Per-VRF label allocation, which forces an IP lookup at the egress and drops looping packets."
       ],
       "answer": 2,
       "explain": "SoO marks the routes with the site identity; PEs refuse to advertise them to a CE with the same SoO. allowas-in does the opposite, and RDs and label modes do not filter routes."
      },
      {
       "q": "Customer BLUE runs OSPF to its PEs and also has a backdoor link between two sites in area 0. Traffic prefers the backdoor even when the VPN path is better. Which feature restores the intended preference?",
       "options": [
        "A sham-link between the PEs, so the VPN path appears as an intra-area link in the customer's area.",
        "The down bit, so routes learned over the backdoor are ignored by the PEs during redistribution.",
        "A matching OSPF domain ID on both PEs, so VPN routes are advertised as external type 1 routes.",
        "A route target per site, so the backdoor routes are filtered from the VRF before they are installed."
       ],
       "answer": 0,
       "explain": "VPN routes normally arrive as inter-area, which loses to intra-area backdoor routes. A sham-link makes the VPN path intra-area so cost decides. The down bit and domain ID solve different loop and route-type problems."
      }
     ]
    }
   ]
  },
  {
   "id": "m5-l3",
   "title": "Scaling and Interconnecting VPNs",
   "subtitle": "Route reflection, RT constraint, hub-and-spoke topologies and the inter-AS options",
   "minutes": 45,
   "objectives": [
    "Design VPN route reflection that scales without leaking unnecessary state to PEs.",
    "Build hub-and-spoke and extranet topologies purely with route-target policy.",
    "Compare inter-AS options A, B and C and select one for a given trust and scale requirement."
   ],
   "blocks": [
    {
     "type": "text",
     "text": "A five-PE lab can full-mesh VPNv4 sessions; a national backbone cannot. This lesson covers the tools that make L3VPN scale inside one AS, the route-target patterns that turn the same VPN machinery into different topologies, and the overview of how VPNs cross autonomous-system boundaries. The inter-AS material is deliberately at design level: an expert must recognise each option, know what state lives where, and pick one under pressure."
    },
    {
     "type": "compare",
     "title": "How VPN routes are filtered",
     "columns": [
      {
       "title": "On a PE",
       "items": [
        "Automatic RT filtering drops VPN routes whose RTs match no local import list",
        "Saves memory, but a newly added VRF needs a route refresh to learn routes",
        "Route refresh is automatic on most modern implementations"
       ]
      },
      {
       "title": "On a route reflector",
       "items": [
        "Holds no VRFs, so RT filtering is disabled and it keeps all VPN routes",
        "Uses its own resources for every VPN in the network",
        "Can be partitioned into planes or clusters by RT"
       ]
      },
      {
       "title": "With RT constraint (RFC 4684)",
       "items": [
        "PEs advertise which RTs they import",
        "Reflectors send each PE only matching routes",
        "Cuts update churn and memory on every PE"
       ]
      }
     ]
    },
    {
     "type": "steps",
     "title": "RT constraint in operation",
     "items": [
      {
       "title": "Enable the address family",
       "text": "PEs and reflectors negotiate the route-target constraint address family alongside VPNv4/VPNv6."
      },
      {
       "title": "Advertise interest",
       "text": "Each PE originates one membership route per import RT of its VRFs."
      },
      {
       "title": "Build filters",
       "text": "The reflector forms an outbound filter per client from those membership routes."
      },
      {
       "title": "Send only what matters",
       "text": "VPN updates go only to PEs that asked for at least one attached RT."
      },
      {
       "title": "React to change",
       "text": "A new VRF triggers a new membership route and the reflector sends the matching routes immediately."
      }
     ]
    },
    {
     "type": "table",
     "title": "Topologies built from route targets alone",
     "head": [
      "Topology",
      "Export policy",
      "Import policy",
      "Notes"
     ],
     "rows": [
      [
       "Any-to-any",
       "All sites export RT A",
       "All sites import RT A",
       "The default full-mesh VPN"
      ],
      [
       "Hub-and-spoke",
       "Spokes export RT SPOKE; hub exports RT HUB",
       "Spokes import HUB; hub imports SPOKE",
       "Forcing spoke-to-spoke traffic through the hub needs two hub VRFs or interfaces (hub-in / hub-out)"
      ],
      [
       "Extranet",
       "Shared-service VRF exports RT SHARED",
       "Consumer VRFs import SHARED; shared VRF imports each consumer's RT",
       "Export only the needed prefixes with export maps to avoid leaking everything"
      ],
      [
       "Management VRF",
       "Each customer VRF exports CE loopbacks with RT MGMT via export map",
       "NOC VRF imports MGMT",
       "Overlapping customer addresses need NAT or unique loopback ranges"
      ]
     ]
    },
    {
     "type": "table",
     "title": "Inter-AS options at a glance",
     "head": [
      "Aspect",
      "Option A (back-to-back VRFs)",
      "Option B (eBGP VPNv4 between ASBRs)",
      "Option C (multihop VPNv4 between RRs)"
     ],
     "rows": [
      [
       "Inter-AS link carries",
       "Plain IP, one subinterface or VRF per customer",
       "Labelled VPN packets",
       "Labelled packets with transport + service labels"
      ],
      [
       "ASBR state",
       "Every VRF and every customer route",
       "Every VPN route, no VRFs",
       "Only PE loopbacks (BGP labelled unicast)"
      ],
      [
       "Scale",
       "Low: per-customer configuration",
       "Medium: ASBR holds all VPN routes",
       "High: ASBRs hold no VPN routes"
      ],
      [
       "Trust and security",
       "Strongest isolation; QoS and filtering per VRF",
       "Shared labels; moderate trust needed",
       "Exposes internal loopbacks and labels; high trust needed"
      ],
      [
       "Typical use",
       "Few shared customers, different operators",
       "Partner networks, mergers",
       "Same organisation, multiple ASes"
      ]
     ]
    },
    {
     "type": "flow",
     "title": "Option B: what each ASBR does to a VPN route",
     "items": [
      {
       "label": "PE in AS 65000",
       "text": "Exports with RT and service label L1; next hop PE1"
      },
      {
       "label": "ASBR1",
       "text": "Keeps the route without a VRF, sets next hop self toward ASBR2, allocates new label L2"
      },
      {
       "label": "ASBR2",
       "text": "Receives with L2, sets next hop self toward its RR, allocates L3"
      },
      {
       "label": "PE in AS 65100",
       "text": "Imports by RT; pushes L3 + transport label to ASBR2"
      },
      {
       "label": "Forwarding",
       "text": "ASBR2 swaps L3 to L2; ASBR1 swaps L2 to L1 and pushes transport to PE1"
      }
     ]
    },
    {
     "type": "cli",
     "title": "Option B ASBR in AS 65000",
     "device": "ASBR1 · IOS-style CLI",
     "lines": [
      "router bgp 65000",
      " no bgp default route-target filter",
      " neighbor 203.0.113.2 remote-as 65100",
      " neighbor 10.255.0.100 remote-as 65000",
      " neighbor 10.255.0.100 update-source Loopback0",
      " address-family vpnv4",
      "  neighbor 203.0.113.2 activate",
      "  neighbor 203.0.113.2 send-community extended",
      "  neighbor 10.255.0.100 activate",
      "  neighbor 10.255.0.100 send-community extended",
      "  neighbor 10.255.0.100 next-hop-self",
      "!",
      "interface GigabitEthernet0/3",
      " ip address 203.0.113.1 255.255.255.252",
      " mpls bgp forwarding"
     ],
     "note": "Without disabling RT filtering, an ASBR with no VRFs would discard every VPN route it receives. `mpls bgp forwarding` lets the eBGP link carry labelled packets without LDP."
    },
    {
     "type": "callout",
     "kind": "warning",
     "text": "In option C each AS must be able to reach the other's PE loopbacks with labels, usually by exchanging them as BGP labelled unicast. That means internal addresses and label space are visible to the other side, and a misconfiguration in one AS can attract traffic in the other. Choose it when both ASes belong to the same organisation or a tightly governed partnership; otherwise option B or A is safer.",
     "title": "Option C needs a trust conversation before a config session"
    },
    {
     "type": "text",
     "text": "Two related patterns appear in large designs. **Carrier supporting carrier** lets a provider sell label-switched connectivity to another provider: the customer carrier's loopbacks live in a VRF of the backbone carrier, labels are exchanged on the PE-CE link (labelled BGP or LDP), and the customer carrier runs its own VPNs over the top. **Seamless MPLS** extends end-to-end LSPs across a hierarchical access, aggregation and core design by carrying loopbacks in BGP labelled unicast, so the IGP of each domain stays small while services still terminate end to end."
    },
    {
     "type": "case",
     "title": "A mobile operator's L3VPN backbone",
     "context": "A mobile operator runs 14,000 cell sites over an access-aggregation-core network. Radio sites need connectivity to the mobile core for user-plane and control-plane traffic, to a separate OAM network and to timing services. The current design runs one flat IS-IS domain with LDP and full VPNv4 tables on every cell-site router, and convergence after an aggregation failure exceeds five seconds. Cell-site routers have small FIBs and leadership wants a design that supports 30,000 sites and a later move to segment routing.",
     "questions": [
      "Which VRFs would you build, and what RT topology fits radio-to-core traffic?",
      "How do you stop every cell-site router from holding every VPN route?",
      "How do you shrink the IGP and still keep end-to-end LSPs?",
      "What would you verify first after migrating one aggregation region?"
     ],
     "answer": "Build separate VRFs for user plane, control plane and OAM, each **hub-and-spoke**: cell sites export a spoke RT and import only the core hub RT, while the core data-centre PEs import all spokes; there is no business need for site-to-site traffic, so blocking it reduces state and attack surface. Enable **RT constraint** on the reflectors and place regional reflectors in each aggregation domain so cell-site routers receive only hub routes; a cell-site router then needs a handful of prefixes per VRF, not thousands. Split IS-IS into separate access, aggregation and core domains and carry PE loopbacks across boundaries with **BGP labelled unicast** (seamless MPLS), with aggregation routers acting as inline reflectors and next-hop-self; access routers may even use a default route plus labels on demand. This also prepares the move to segment routing, where TI-LFA gives sub-50 ms protection in each domain. After migrating a region, verify loopback reachability with labels end to end (LSP ping from cell-site to core PE), route counts per VRF on a sample of cell-site routers, failover timing during a controlled aggregation link failure, and MTU with the deepest label stack."
    },
    {
     "type": "scenario",
     "title": "Spokes must talk only through the firewall hub",
     "situation": "A retailer's 400 branches must reach each other only through a central firewall attached to the hub PE. Today all sites import and export the same RT and branch-to-branch traffic bypasses the firewall. What design achieves the goal with the least new configuration at branches?",
     "options": [
      {
       "text": "Branches export SPOKE and import HUB; the hub PE uses one VRF importing SPOKE toward the firewall inside interface and another exporting HUB from its outside interface.",
       "feedback": "Correct. Two hub VRFs force every spoke-to-spoke flow up into the firewall and back down, while branches only change their RT policy.",
       "best": true
      },
      {
       "text": "Give every branch a unique RD so branch routes no longer overlap and cannot be imported by other branches.",
       "feedback": "RDs do not influence import, so branches would still learn each other's routes through the shared RT.",
       "best": false
      },
      {
       "text": "Keep the shared RT and put an access list on every branch PE interface that drops branch-to-branch flows.",
       "feedback": "This blocks the traffic instead of steering it through the firewall, and it needs constant maintenance at 400 sites.",
       "best": false
      },
      {
       "text": "Use a single hub VRF that imports SPOKE and exports HUB, and point a default route at the firewall.",
       "feedback": "With one hub VRF the hub PE holds specific spoke routes and can switch spoke-to-spoke traffic directly, bypassing the firewall.",
       "best": false
      }
     ]
    },
    {
     "type": "reflection",
     "prompt": "Think of a network you know that interconnects two administrative domains. Which inter-AS option does it resemble today, what state sits at the boundary, and what would change if the organisations merged or separated?"
    },
    {
     "type": "terms",
     "items": [
      {
       "term": "Route target constraint",
       "def": "An MP-BGP address family in which PEs advertise the RTs they import, so reflectors send them only relevant VPN routes."
      },
      {
       "term": "Automatic RT filtering",
       "def": "Default PE behaviour of discarding VPN routes whose RTs match no local import policy."
      },
      {
       "term": "Hub-and-spoke VPN",
       "def": "A topology in which spokes import only hub routes and the hub imports spoke routes, forcing traffic through the hub."
      },
      {
       "term": "Extranet",
       "def": "Selective route sharing between VRFs of different customers or a shared-service VRF via RT policy."
      },
      {
       "term": "Inter-AS option A",
       "def": "Back-to-back VRFs on the ASBRs, exchanging plain IP per customer across the boundary."
      },
      {
       "term": "Inter-AS option B",
       "def": "ASBRs exchange VPN routes over eBGP and swap service labels, without holding VRFs."
      },
      {
       "term": "Inter-AS option C",
       "def": "Reflectors exchange VPN routes over multihop eBGP while ASBRs carry only labelled PE loopbacks."
      },
      {
       "term": "BGP labelled unicast",
       "def": "BGP advertisement of IPv4 or IPv6 prefixes with an MPLS label, used for hierarchical and inter-AS LSPs."
      },
      {
       "term": "Seamless MPLS",
       "def": "A hierarchical design that builds end-to-end LSPs across separate IGP domains using BGP labelled unicast."
      },
      {
       "term": "Carrier supporting carrier",
       "def": "A service in which one provider carries another provider's labelled traffic inside a VRF."
      }
     ]
    },
    {
     "type": "quiz",
     "items": [
      {
       "q": "A new VRF is added on a PE that has automatic RT filtering, but its routes from remote sites do not appear until much later. What is the most likely reason?",
       "options": [
        "The new VRF needs its RD to match the remote PEs' RDs before any routes can be imported into it.",
        "The reflector holds no VRFs, so it cannot send routes for a VRF until one is configured on it too.",
        "The service labels must be reallocated network-wide before a new VRF can use the existing routes.",
        "The PE had discarded those VPN routes earlier and must request them again with a route refresh."
       ],
       "answer": 3,
       "explain": "RT filtering drops routes nobody imports; after adding a VRF the PE must ask its peers to resend them. Reflectors never need VRFs, and RDs do not control import."
      },
      {
       "q": "What is the main benefit of RT constraint for a large VPN deployment?",
       "options": [
        "PEs can omit route targets entirely, because the reflector now assigns them to each VPN route.",
        "Reflectors send each PE only the VPN routes whose RTs it imports, cutting memory and update churn.",
        "P routers can filter labelled packets by RT, which adds an extra isolation layer in the core.",
        "Route distinguishers can be shared by all PEs, because duplicates are now resolved by the reflector."
       ],
       "answer": 1,
       "explain": "RT constraint moves filtering upstream to the reflector. It does not remove RTs, involve P routers or change RD design."
      },
      {
       "q": "Which inter-AS option keeps VPN routes off the ASBRs entirely?",
       "options": [
        "Option A, because each ASBR keeps customer routes inside VRFs rather than in a VPN table.",
        "Option B, because the ASBRs swap service labels without needing to install the VPN routes.",
        "Option C, because ASBRs carry only labelled PE loopbacks while reflectors exchange VPN routes.",
        "Option A combined with B, because the VRFs filter whatever routes option B would have carried."
       ],
       "answer": 2,
       "explain": "Option C moves VPN route exchange to multihop sessions between reflectors. Option A holds every customer route in VRFs; option B holds every VPN route without VRFs."
      },
      {
       "q": "An option B ASBR shows the eBGP VPNv4 session established but receives zero prefixes from its partner, while the partner sends thousands. What should be checked first?",
       "options": [
        "Whether the ASBR's RD values match the partner's, because mismatched RDs block VPN import.",
        "Whether RT filtering is still active on the ASBR, which has no VRFs and so discards everything.",
        "Whether LDP runs on the inter-AS link, because eBGP VPNv4 cannot start without LDP labels.",
        "Whether the IGP of each AS is redistributed into the other, so next hops resolve on both sides."
       ],
       "answer": 1,
       "explain": "Without VRFs, default RT filtering drops all VPN routes. Option B uses BGP-assigned labels on the link rather than LDP, and redistributing IGPs between ASes is neither required nor wise."
      },
      {
       "q": "Why does a strict hub-and-spoke VPN that must force spoke-to-spoke traffic through a hub firewall need two VRFs on the hub PE?",
       "options": [
        "One VRF is needed per address family, because spokes and the hub use different route distinguishers.",
        "One VRF is needed per reflector cluster, because spokes and hub are reflected by different devices.",
        "One VRF is needed per label allocation mode, because spokes use per-prefix and the hub per-VRF labels.",
        "So spoke routes and hub routes sit in different tables and the PE cannot shortcut spoke-to-spoke traffic."
       ],
       "answer": 3,
       "explain": "With one hub VRF the PE would know specific spoke routes and switch spoke-to-spoke traffic itself. Splitting the hub VRF forces traffic through the firewall. The other reasons are invented."
      }
     ]
    }
   ]
  },
  {
   "id": "m5-l4",
   "title": "Segment Routing: SR-MPLS, TI-LFA and SRv6",
   "subtitle": "Source routing with IGP-distributed segments, full-coverage fast reroute and the IPv6 data plane",
   "minutes": 50,
   "objectives": [
    "Calculate SR-MPLS labels from SRGB and index, and explain prefix, node, anycast and adjacency SIDs.",
    "Plan a migration from LDP to SR-MPLS, including interworking with LDP-only nodes.",
    "Describe SRv6 locators, behaviours and compressed SIDs, and compare SRv6 with SR-MPLS."
   ],
   "blocks": [
    {
     "type": "text",
     "text": "Segment routing (architecture in RFC 8402) replaces label-distribution protocols with segments advertised by the IGP. The headend expresses a path as an ordered list of segments; transit nodes keep **no per-path state**. With the MPLS data plane, a segment is a label; with the IPv6 data plane (SRv6), a segment is an IPv6 address. Experts must be fluent in both, because 2026 networks routinely run SR-MPLS in the core while evaluating or deploying SRv6 at the edge or in new builds."
    },
    {
     "type": "compare",
     "title": "LDP versus SR-MPLS",
     "columns": [
      {
       "title": "LDP",
       "items": [
        "Separate protocol with its own sessions and timers",
        "Labels locally significant and different on every hop",
        "Needs IGP synchronisation to avoid black holes",
        "Remote LFA coverage depends on topology",
        "No native traffic engineering"
       ]
      },
      {
       "title": "SR-MPLS",
       "items": [
        "Labels carried in IS-IS or OSPF extensions",
        "Prefix SIDs are global: the same label everywhere when SRGBs match",
        "No separate session, so no sync problem",
        "TI-LFA gives full coverage in any topology",
        "SR policies and Flex-Algo provide TE without midpoint state"
       ]
      }
     ]
    },
    {
     "type": "table",
     "title": "Segment types",
     "head": [
      "Segment",
      "Scope",
      "Allocated from",
      "Typical use"
     ],
     "rows": [
      [
       "Prefix SID",
       "Global",
       "SRGB as an index",
       "Shortest-path forwarding to a prefix"
      ],
      [
       "Node SID",
       "Global",
       "SRGB (prefix SID with the node flag on a loopback)",
       "Identifies a router; the basic building block of paths"
      ],
      [
       "Anycast SID",
       "Global",
       "SRGB, same index on several routers",
       "Reach the nearest of a group, such as a pair of ABRs"
      ],
      [
       "Adjacency SID",
       "Local",
       "SRLB or dynamic range",
       "Force traffic over a specific link; used by TI-LFA repair paths"
      ],
      [
       "Binding SID",
       "Local",
       "SRLB or dynamic range",
       "Represents an entire SR policy as one label for stitching or steering"
      ],
      [
       "BGP peering SIDs",
       "Local",
       "Dynamic range",
       "Egress peer engineering toward a chosen external peer or link"
      ]
     ]
    },
    {
     "type": "formula",
     "title": "SR-MPLS label arithmetic",
     "items": [
      {
       "name": "Local label for a prefix SID",
       "expr": "own SRGB base + index",
       "meaning": "With SRGB 16000-23999 and index 4, the router installs local label 16004."
      },
      {
       "name": "Outgoing label",
       "expr": "next hop's SRGB base + index",
       "meaning": "If the next hop uses SRGB 900000-907999, the router sends 900004. Matching SRGBs everywhere keep labels identical and troubleshooting simple."
      },
      {
       "name": "SRGB sizing",
       "expr": "highest index + 1 ≤ SRGB size",
       "meaning": "An 8,000-label SRGB fits node indexes 0-7999; plan index ranges per region and per Flex-Algo up front."
      }
     ]
    },
    {
     "type": "cli",
     "title": "Enabling SR-MPLS and TI-LFA in IS-IS",
     "device": "P2 · hierarchical IOS-style CLI",
     "lines": [
      "segment-routing",
      " global-block 16000 23999",
      "!",
      "router isis CORE",
      " is-type level-2-only",
      " net 49.0001.0102.5500.0002.00",
      " address-family ipv4 unicast",
      "  metric-style wide",
      "  segment-routing mpls",
      " interface Loopback0",
      "  passive",
      "  address-family ipv4 unicast",
      "   prefix-sid index 2",
      " interface GigabitEthernet0/0/0/1",
      "  point-to-point",
      "  address-family ipv4 unicast",
      "   fast-reroute per-prefix",
      "   fast-reroute per-prefix ti-lfa"
     ],
     "note": "Index 2 on the loopback becomes label 16002 on every router that uses the same SRGB. Adjacency SIDs are allocated automatically per IS-IS adjacency."
    },
    {
     "type": "cli",
     "title": "Reading the result",
     "device": "PE1 · hierarchical IOS-style CLI",
     "lines": [
      "PE1# show mpls forwarding prefix 10.255.0.4/32",
      "Local  Outgoing    Prefix           Outgoing     Next Hop     Bytes",
      "Label  Label       or ID            Interface                 Switched",
      "16004  16004       SR Pfx (idx 4)   Gi0/0/0/0    10.1.12.2    5539012",
      "       16004       SR Pfx (idx 4)   Gi0/0/0/1    10.1.13.3    0        (!)",
      "PE1# show isis fast-reroute 10.255.0.4/32 detail",
      "  Primary: via 10.1.12.2, Gi0/0/0/0, P2",
      "  Backup (TI-LFA): via 10.1.13.3, Gi0/0/0/1, P3",
      "    Repair label stack (top to bottom): 16006, 24001, 16004",
      "    Repair path: node SID of P6, then P6-to-P4 adjacency SID"
     ],
     "note": "The (!) marks the pre-installed backup path. The repair pushes P6's node SID, then P6's adjacency SID toward P4, then the destination SID, which matches the post-convergence route."
    },
    {
     "type": "callout",
     "kind": "insight",
     "text": "Classic LFA works only when a neighbour happens to have a loop-free path, and remote LFA adds tunnels but still leaves gaps. TI-LFA computes the **post-convergence path** for each destination and encodes it with node and adjacency SIDs, so every destination is protected in any topology with redundancy, and traffic follows the path it will use after the IGP converges. Pair it with **microloop avoidance**, which briefly steers traffic along an explicit segment list while the rest of the network catches up, and you remove most transient loss after failures and restorations.",
     "title": "Why TI-LFA changed the fast-reroute conversation"
    },
    {
     "type": "steps",
     "title": "Migrating an LDP core to SR-MPLS",
     "items": [
      {
       "title": "Prepare",
       "text": "Agree SRGB and index plan, check platform support and maximum SID depth, and confirm that MTU allows the extra labels TI-LFA may push."
      },
      {
       "title": "Enable SR alongside LDP",
       "text": "Turn on SR in the IGP and assign prefix SIDs. LDP labels remain preferred, so forwarding does not change yet."
      },
      {
       "title": "Interwork with LDP-only nodes",
       "text": "Configure an SR mapping server to advertise SIDs on behalf of LDP-only prefixes; boundary routers stitch SR and LDP LSPs."
      },
      {
       "title": "Prefer SR",
       "text": "Switch imposition preference to SR on the headends, region by region, verifying LSP ping and trace after each step."
      },
      {
       "title": "Remove LDP",
       "text": "Once every PE loopback is reachable over SR, disable LDP and remove the synchronisation and session-protection configuration it needed."
      }
     ]
    },
    {
     "type": "table",
     "title": "SRv6 behaviours you must recognise",
     "head": [
      "Behaviour",
      "What the node does",
      "Typical role"
     ],
     "rows": [
      [
       "End",
       "Process the SRH and move to the next segment",
       "Transit waypoint, equivalent to a node SID"
      ],
      [
       "End.X",
       "As End, then forward over a specific adjacency",
       "Adjacency segment for TE and TI-LFA"
      ],
      [
       "End.DT4 / End.DT6 / End.DT46",
       "Decapsulate and look up the inner packet in a given VRF table",
       "L3VPN service SID, typically per VRF"
      ],
      [
       "End.DX4 / End.DX6",
       "Decapsulate and forward to a specific next hop",
       "Per-CE L3VPN service"
      ],
      [
       "End.DT2U / End.DX2",
       "Decapsulate and bridge in a Layer 2 table or to an interface",
       "EVPN and pseudowire services"
      ],
      [
       "End.B6.Encaps",
       "Bind to an SR policy and encapsulate in a new SRH",
       "Binding SID for stitching domains"
      ]
     ]
    },
    {
     "type": "layers",
     "title": "Anatomy of an SRv6 SID",
     "items": [
      {
       "label": "Locator: block",
       "parts": [
        "Common prefix for the SRv6 domain, for example fcbb:bb00::/32",
        "Summarisable and filterable"
       ]
      },
      {
       "label": "Locator: node",
       "parts": [
        "Identifies the node within the block",
        "Advertised by the IGP as a routable prefix"
       ]
      },
      {
       "label": "Function",
       "parts": [
        "Behaviour bound to the SID: End, End.X, End.DT4 and so on",
        "Locally significant to the node"
       ]
      },
      {
       "label": "Argument",
       "parts": [
        "Optional parameters for some behaviours",
        "Often zero"
       ]
      }
     ]
    },
    {
     "type": "cli",
     "title": "SRv6 locator and L3VPN service",
     "device": "PE1 · hierarchical IOS-style CLI",
     "lines": [
      "segment-routing",
      " srv6",
      "  encapsulation",
      "   source-address 2001:db8:255::1",
      "  locators",
      "   locator MAIN",
      "    micro-segment behavior unode psp-usd",
      "    prefix fcbb:bb00:1::/48",
      "!",
      "router isis CORE",
      " address-family ipv6 unicast",
      "  segment-routing srv6",
      "   locator MAIN",
      "!",
      "router bgp 65000",
      " vrf BLUE",
      "  address-family ipv4 unicast",
      "   segment-routing srv6",
      "    locator MAIN",
      "    alloc mode per-vrf"
     ],
     "note": "The locator is advertised in IS-IS as an ordinary IPv6 prefix, so non-SRv6 routers can still forward toward it. BGP now advertises an SRv6 service SID (End.DT4-style) instead of an MPLS service label."
    },
    {
     "type": "compare",
     "title": "SR-MPLS versus SRv6 in 2026 designs",
     "columns": [
      {
       "title": "SR-MPLS",
       "items": [
        "Small 4-byte segments",
        "Mature hardware support and tooling",
        "Reuses existing MPLS services and OAM",
        "Needs MPLS on every transit node"
       ]
      },
      {
       "title": "SRv6",
       "items": [
        "Plain IPv6 transit: non-SRv6 routers forward on the locator prefix",
        "Service and transport in one address",
        "Full 128-bit SIDs are heavy; compressed micro-SIDs pack several segments into one address",
        "Requires careful filtering of the SID block at domain edges and solid IPv6 operations"
       ]
      }
     ]
    },
    {
     "type": "scenario",
     "title": "Retiring LDP on a mixed core",
     "situation": "Your core has twelve SR-capable routers and two legacy PEs that only support LDP. You want to disable LDP on the P routers, but the legacy PEs still terminate VPN services. What must be in place first?",
     "options": [
      {
       "text": "Nothing further: SR headends will automatically fall back to plain IP forwarding toward any LDP-only PE.",
       "feedback": "VPN traffic needs a label to reach the remote PE; plain IP across a BGP-free core would drop it.",
       "best": false
      },
      {
       "text": "An SR mapping server advertising prefix SIDs for the legacy PE loopbacks, with LDP kept only on the boundary routers next to them for stitching.",
       "feedback": "Correct. The mapping server lets SR headends build paths to LDP-only prefixes, and the boundary routers stitch SR to LDP so services keep working.",
       "best": true
      },
      {
       "text": "A larger SRGB on the legacy PEs so that they can learn SR labels from their SR-capable neighbours.",
       "feedback": "The legacy PEs do not support SR at all, so the size of their SRGB is irrelevant.",
       "best": false
      },
      {
       "text": "RSVP-TE tunnels from every SR headend to each legacy PE, configured in addition to the SR policies.",
       "feedback": "That would work but adds the midpoint state SR is meant to remove; a mapping server is the intended interworking tool.",
       "best": false
      }
     ]
    },
    {
     "type": "terms",
     "items": [
      {
       "term": "Segment",
       "def": "An instruction in a source-routed path: a label in SR-MPLS or an IPv6 address in SRv6."
      },
      {
       "term": "SRGB",
       "def": "Segment Routing Global Block: the label range a node reserves for global segments such as prefix SIDs."
      },
      {
       "term": "SRLB",
       "def": "Segment Routing Local Block: a label range for locally significant segments such as adjacency SIDs."
      },
      {
       "term": "Prefix SID index",
       "def": "The offset added to a node's SRGB base to form the label for a prefix segment."
      },
      {
       "term": "Adjacency SID",
       "def": "A local segment that forces forwarding over a specific IGP adjacency."
      },
      {
       "term": "Anycast SID",
       "def": "The same prefix SID advertised by several routers, so traffic goes to the nearest one."
      },
      {
       "term": "TI-LFA",
       "def": "Topology-independent loop-free alternate: fast reroute that pre-computes the post-convergence path for every destination."
      },
      {
       "term": "Mapping server",
       "def": "A function that advertises SIDs on behalf of LDP-only prefixes to allow SR and LDP interworking."
      },
      {
       "term": "SRv6 locator",
       "def": "The routable IPv6 prefix of a node from which its SRv6 SIDs are allocated."
      },
      {
       "term": "Segment routing header (SRH)",
       "def": "An IPv6 routing extension header that carries the SRv6 segment list."
      },
      {
       "term": "Micro-SID",
       "def": "A compressed SRv6 format that packs several short segments into one 128-bit address."
      },
      {
       "term": "End.DT4",
       "def": "SRv6 behaviour that decapsulates and performs an IPv4 lookup in a specific VRF table."
      }
     ]
    },
    {
     "type": "quiz",
     "items": [
      {
       "q": "Router R5 has SRGB 16000-23999 and advertises its loopback with index 5. Its neighbour R4 uses SRGB 20000-27999. Which label does R4 send toward R5 for that prefix, and which label does R4 install as its local label?",
       "options": [
        "R4 sends 16005, which is R5's SRGB base plus index, and installs 20005 locally from its own SRGB.",
        "R4 sends 20005 and installs 16005, because the sender always uses its own SRGB for outgoing labels.",
        "R4 sends and installs 16005, because the prefix owner's SRGB is the only one that is used anywhere.",
        "R4 sends and installs 20005, because SR labels are always taken from the local SRGB on every hop."
       ],
       "answer": 0,
       "explain": "The outgoing label uses the next hop's SRGB; the local label uses the router's own SRGB. That is why identical SRGBs are recommended: the label is then the same everywhere."
      },
      {
       "q": "What does TI-LFA protect against that classic LFA often cannot?",
       "options": [
        "Node failures of the egress PE itself, because TI-LFA can redirect traffic to any other PE in the VPN.",
        "Control-plane failures of BGP, because TI-LFA re-signals VPN routes over a pre-computed backup session.",
        "Failures in topologies where no neighbour has a loop-free path, by encoding the repair path with segments.",
        "Congestion on the primary path, because TI-LFA moves traffic away whenever link utilisation crosses a threshold."
       ],
       "answer": 2,
       "explain": "TI-LFA guarantees coverage by expressing the post-convergence path with node and adjacency SIDs. Egress PE failure needs BGP-level protection such as PIC, and TI-LFA is not congestion-driven."
      },
      {
       "q": "During an LDP to SR migration, prefix SIDs are configured everywhere but traces still show LDP labels. What explains this?",
       "options": [
        "LDP remains the preferred imposition method until SR preference is explicitly enabled on the headends.",
        "The SRGB is too small, so routers silently fall back to LDP for any prefix outside the label range.",
        "SR labels are only used for traffic-engineered paths and never for ordinary shortest-path forwarding.",
        "Adjacency SIDs have not been configured manually, so the IGP cannot advertise any prefix SIDs yet."
       ],
       "answer": 0,
       "explain": "By default most implementations keep LDP labels when both exist. SR is used for shortest-path forwarding too, and adjacency SIDs are allocated automatically. An undersized SRGB would cause SID errors, not a silent preference for LDP."
      },
      {
       "q": "Which SRv6 behaviour would a PE bind to a per-VRF L3VPN service SID for IPv4 and IPv6 customers in the same VRF?",
       "options": [
        "End.X, which forwards the packet over a specific adjacency toward the customer edge router.",
        "End.B6.Encaps, which binds the VRF to an SR policy and encapsulates traffic in a new header.",
        "End, which processes the routing header and continues to the next segment in the segment list.",
        "End.DT46, which decapsulates and looks up the inner packet in the VRF's IPv4 or IPv6 table."
       ],
       "answer": 3,
       "explain": "End.DT46 is the dual-stack table-lookup decapsulation behaviour. End and End.X are transport behaviours; End.B6.Encaps represents a policy."
      },
      {
       "q": "Why do SRv6 designs filter the SID block at the domain boundary?",
       "options": [
        "SIDs use private label space, so leaking them would cause label collisions with partner networks.",
        "SIDs are routable IPv6 addresses, so outside packets aimed at them could invoke network functions.",
        "SIDs require MPLS on every hop, so external networks would drop them and generate error traffic.",
        "SIDs change every few minutes, so external routers would cache stale entries and black-hole traffic."
       ],
       "answer": 1,
       "explain": "An SRv6 SID is just an IPv6 address bound to a behaviour, so spoofed packets from outside could trigger it. SRv6 does not use MPLS labels, and SIDs are stable."
      }
     ]
    }
   ]
  },
  {
   "id": "m5-l5",
   "title": "Traffic Engineering and Troubleshooting Label Paths",
   "subtitle": "RSVP-TE, SR policies and Flex-Algo, then a disciplined method for broken LSPs",
   "minutes": 45,
   "objectives": [
    "Compare RSVP-TE with SR-TE and choose between explicit SR policies, on-demand policies and Flex-Algo.",
    "Configure colour-based automated steering of VPN traffic into an SR policy.",
    "Troubleshoot a failing label path layer by layer with LSP ping, trace and table inspection."
   ],
   "blocks": [
    {
     "type": "text",
     "text": "Traffic engineering moves traffic off the IGP shortest path to meet latency, diversity or capacity goals. The industry has shifted from **RSVP-TE**, which signals and holds state at every midpoint, toward **SR-TE**, where only the headend holds the path. Experts still meet RSVP-TE in brownfield cores and must compare the two calmly. The second half of the lesson is the payoff of the whole module: a repeatable method for finding why labelled traffic does not arrive."
    },
    {
     "type": "compare",
     "title": "RSVP-TE versus SR-TE",
     "columns": [
      {
       "title": "RSVP-TE",
       "items": [
        "PATH and RESV messages signal every LSP hop by hop",
        "Every midpoint holds per-LSP state and refresh timers",
        "Native bandwidth reservation and admission control",
        "Facility FRR protects links and nodes with bypass tunnels",
        "Scale limited by midpoint state (n² tunnels in full meshes)"
       ]
      },
      {
       "title": "SR-TE",
       "items": [
        "Path is a segment list imposed at the headend",
        "No midpoint state; the core only knows SIDs",
        "Bandwidth managed by a PCE or controller, not by signalling",
        "TI-LFA protects every segment",
        "Scales to large meshes and on-demand policies"
       ]
      }
     ]
    },
    {
     "type": "framework",
     "title": "Anatomy of an SR policy",
     "items": [
      {
       "label": "KEY",
       "title": "Headend, colour, endpoint",
       "text": "A policy is identified by where it starts, a colour that represents intent (for example 100 = low latency) and the endpoint address."
      },
      {
       "label": "CP",
       "title": "Candidate paths",
       "text": "One or more paths with a preference; the highest valid preference is active, the others are standby."
      },
      {
       "label": "SL",
       "title": "Segment lists",
       "text": "Explicit lists of SIDs, or dynamic paths computed locally or by a PCE against metric and constraints."
      },
      {
       "label": "BSID",
       "title": "Binding SID",
       "text": "A label (or SRv6 SID) representing the whole policy, so remote nodes or other domains can steer into it."
      },
      {
       "label": "AS",
       "title": "Automated steering",
       "text": "BGP routes carrying a colour extended community are steered into the policy whose colour and endpoint match their next hop."
      },
      {
       "label": "ODN",
       "title": "On-demand next hop",
       "text": "The headend instantiates a policy automatically when it receives a coloured route for an endpoint with no existing policy."
      }
     ]
    },
    {
     "type": "cli",
     "title": "Low-latency VPN traffic with colour steering",
     "device": "PE1 · hierarchical IOS-style CLI",
     "lines": [
      "segment-routing",
      " traffic-eng",
      "  on-demand color 100",
      "   dynamic",
      "    metric",
      "     type latency",
      "  policy GOLD-TO-PE4",
      "   color 100 end-point ipv4 10.255.0.4",
      "   candidate-paths",
      "    preference 200",
      "     explicit segment-list VIA-P6",
      "    preference 100",
      "     dynamic",
      "      metric",
      "       type latency",
      "!",
      "! On PE4: colour set used by the GOLD VRF export policy",
      "extcommunity-set opaque COLOR-100",
      "  100",
      "end-set"
     ],
     "note": "PE4 attaches colour 100 to the GOLD VRF routes it exports, using its export route policy. PE1 then steers those routes into the colour-100 policy toward 10.255.0.4: the explicit list when valid, otherwise the dynamic low-latency path."
    },
    {
     "type": "callout",
     "kind": "insight",
     "text": "Flexible Algorithm lets the IGP compute additional topologies, numbered 128 to 255, each with its own metric type (IGP, delay or TE) and constraints such as excluding links with a given affinity. Every router that participates in an algorithm advertises an extra prefix SID for it. A headend that wants the low-latency topology simply pushes the algorithm-specific SID of the destination. Combined with automated steering, Flex-Algo delivers latency-optimised or plane-disjoint paths with one SID and no controller.",
     "title": "Flex-Algo: traffic engineering without explicit policies"
    },
    {
     "type": "flow",
     "title": "Troubleshooting a broken label path, layer by layer",
     "items": [
      {
       "label": "1 Underlay",
       "text": "Is the egress /32 loopback in the IGP with the expected next hop?"
      },
      {
       "label": "2 Transport label",
       "text": "Does every hop hold a label (LDP binding or SR SID) for that /32?"
      },
      {
       "label": "3 LFIB",
       "text": "Do local and outgoing labels line up hop by hop, with no untagged entries?"
      },
      {
       "label": "4 Service",
       "text": "Is the VPN route imported with the expected RT, next hop and service label?"
      },
      {
       "label": "5 Data plane",
       "text": "Do LSP ping and LSP trace succeed to the egress loopback?"
      },
      {
       "label": "6 MTU and QoS",
       "text": "Do large packets and marked traffic survive the full label stack?"
      }
     ]
    },
    {
     "type": "cli",
     "title": "An LSP trace that reveals the fault",
     "device": "PE1 · IOS-style CLI",
     "lines": [
      "PE1# traceroute mpls ipv4 10.255.0.4/32",
      "Codes: '!' - success, 'L' - labeled output interface,",
      "       'D' - DS map mismatch, 'U' - unlabeled output, '.' - timeout",
      "  0 10.1.12.1 MRU 1500 [Labels: 16004 Exp: 0]",
      "L 1 10.1.12.2 MRU 1500 [Labels: 16004 Exp: 0] 2 ms",
      "U 2 10.1.26.6 MRU 1500 [No Label] 3 ms",
      "! 3 10.1.46.4 4 ms"
     ],
     "note": "The LSP breaks at P6, which forwards unlabelled toward PE4. A ping to the loopback still succeeds, but VPN traffic is dropped at P6 because a BGP-free core has no VRF routes. Check the IGP-to-label configuration on P6 first: SR not enabled in its IGP instance, LDP missing on the P6-PE4 link, or a label filter. Also note MRU 1500: the core links are not jumbo."
    },
    {
     "type": "table",
     "title": "Symptom to cause",
     "head": [
      "Symptom",
      "Most likely cause",
      "Prove it with",
      "Fix"
     ],
     "rows": [
      [
       "VPN route present, FIB shows no transport label",
       "Next hop summarised or not bound",
       "FIB entry and LIB/SID table for the /32",
       "Keep /32 loopbacks; fix binding or filters"
      ],
      [
       "Small pings work, large transfers stall",
       "MTU too small for the label stack",
       "Ping in the VRF with DF set at 1500 and 1472",
       "Raise core MTU; check MRU in LSP trace"
      ],
      [
       "Route missing in remote VRF",
       "RT mismatch or RT filtering",
       "VPN table on the RR and remote PE",
       "Align RTs; route refresh"
      ],
      [
       "Loss for seconds after link restoration",
       "IGP uses link before LDP is ready",
       "Timestamps of IGP adjacency vs LDP session",
       "LDP-IGP sync or move to SR"
      ],
      [
       "Traceroute in VRF shows core hops",
       "TTL propagation enabled",
       "Customer traceroute output",
       "Disable TTL propagation for forwarded traffic if policy requires"
      ]
     ]
    },
    {
     "type": "scenario",
     "title": "Large transfers stall in one VPN",
     "situation": "Customer ORANGE reports that web pages load slowly and file copies stall between two sites. Pings with default size succeed. The path recently moved onto an SR policy with a four-label stack across a newly added link whose MPLS MTU is 1500. What is the most precise next step?",
     "options": [
      {
       "text": "Clear the BGP sessions on both PEs so that the VPN routes are re-advertised with fresh service labels.",
       "feedback": "The route and labels work for small packets; resetting BGP adds an outage without testing the likely cause.",
       "best": false
      },
      {
       "text": "Change the customer's route distinguisher so that its routes are recalculated through the original path.",
       "feedback": "RDs have no influence on path selection or MTU, so this changes nothing relevant.",
       "best": false
      },
      {
       "text": "Disable TI-LFA on the core because repair labels make every packet too large for the existing links.",
       "feedback": "Repair labels only appear during failures, and disabling protection removes resilience without proving anything.",
       "best": false
      },
      {
       "text": "Ping inside the VRF with the DF bit set at 1500 bytes, then check the MRU reported by an LSP trace along the policy path.",
       "feedback": "Correct. This confirms or rules out an MTU problem caused by the deeper label stack on the new link, which matches every symptom.",
       "best": true
      }
     ]
    },
    {
     "type": "checklist",
     "title": "Label path troubleshooting checklist",
     "items": [
      "Identify ingress PE, egress PE, VRF, prefix and BGP next hop before touching anything",
      "Confirm the next hop is a /32 in the IGP on every hop toward the egress",
      "Confirm a label binding or prefix SID exists for the /32 on every hop",
      "Walk the LFIB hop by hop, or run LSP trace, looking for untagged or no-label entries",
      "Confirm the service route: RT, RD, service label and best path on the ingress PE",
      "Test MTU with DF-set packets in the VRF and compare with the MRU in the LSP trace",
      "Check TE: which policy or tunnel the traffic is steered into and whether it is up",
      "Record findings and the fix, then re-run the same tests to prove recovery"
     ]
    },
    {
     "type": "reflection",
     "prompt": "Recall the last time a VPN or tunnel failed in a network you supported. Map the investigation onto the six-layer flow in this lesson. Which layer did you check first, which layer held the root cause, and how much time would the disciplined order have saved?"
    },
    {
     "type": "terms",
     "items": [
      {
       "term": "RSVP-TE",
       "def": "Signalling protocol that establishes traffic-engineered LSPs with per-hop state and optional bandwidth reservation."
      },
      {
       "term": "SR policy",
       "def": "A source-routed path identified by headend, colour and endpoint, with one or more candidate paths."
      },
      {
       "term": "Colour",
       "def": "A numeric intent value attached to an SR policy and, as an extended community, to BGP routes."
      },
      {
       "term": "Automated steering",
       "def": "Placing BGP traffic into the SR policy whose colour and endpoint match the route's colour and next hop."
      },
      {
       "term": "On-demand next hop (ODN)",
       "def": "Automatic creation of an SR policy when a coloured route arrives for an endpoint without one."
      },
      {
       "term": "Flexible Algorithm",
       "def": "IGP extension that computes extra constraint-based topologies, each with its own prefix SIDs."
      },
      {
       "term": "PCE",
       "def": "Path computation element: a controller that computes paths for headends, often over PCEP."
      },
      {
       "term": "LSP ping and trace",
       "def": "MPLS echo tests (RFC 8029) that validate a label path end to end and hop by hop."
      },
      {
       "term": "MRU",
       "def": "Maximum receive unit for labelled packets on a hop, reported by LSP trace."
      }
     ]
    },
    {
     "type": "quiz",
     "items": [
      {
       "q": "Why does SR-TE scale better than RSVP-TE in a large full-mesh design?",
       "options": [
        "SR-TE reserves bandwidth on every link through the IGP, so no separate signalling is needed.",
        "Only the headend holds path state, so midpoints keep no per-LSP state or refresh timers.",
        "SR-TE paths are computed by each midpoint, which spreads the computing load around the core.",
        "SR-TE tunnels are bidirectional, so each pair of routers needs only half as many tunnels."
       ],
       "answer": 1,
       "explain": "Removing midpoint state is the scaling win. SR-TE does not reserve bandwidth in the IGP, midpoints do not compute the path, and SR policies are unidirectional."
      },
      {
       "q": "A PE receives VPN routes carrying colour 100 from PE4 but has no policy configured for colour 100 to PE4. With an on-demand template for colour 100, what happens?",
       "options": [
        "The PE drops the coloured routes, because steering requires a policy to exist before routes arrive.",
        "The PE installs the routes on the IGP shortest path and ignores the colour until a policy is added.",
        "The PE asks PE4 to create a matching policy in the reverse direction and waits for its binding SID.",
        "The PE instantiates a colour-100 policy to PE4 from the template and steers the routes into it."
       ],
       "answer": 3,
       "explain": "On-demand next hop creates policies when coloured routes arrive. Without ODN the routes would normally follow the default path, and policies are never created in the reverse direction automatically."
      },
      {
       "q": "An LSP trace shows 'U' at the third hop with [No Label]. What does that tell you?",
       "options": [
        "The third-hop router forwards the traffic unlabelled, so it has no outgoing label for the destination.",
        "The third-hop router dropped the packet because the imposed label stack exceeded its maximum supported depth.",
        "The third-hop router is the egress PE and has correctly popped the last label for that FEC.",
        "The third-hop router received the packet with a DS map mismatch and returned it to the source."
       ],
       "answer": 0,
       "explain": "U means unlabelled output: the label path breaks there. A correct egress returns '!', a mismatch is 'D', and depth problems produce other error codes."
      },
      {
       "q": "Which Flex-Algo property lets a headend steer into a low-latency topology with a single label?",
       "options": [
        "Each router advertises a binding SID per algorithm, which represents the full explicit path.",
        "Each router floods its delay values in BGP, so the headend can build an explicit segment list.",
        "Each participating router advertises a prefix SID per algorithm, so pushing that SID selects the topology.",
        "Each router reserves bandwidth for the algorithm, so the label carries an admission guarantee."
       ],
       "answer": 2,
       "explain": "Flex-Algo prefix SIDs are per algorithm, and every node forwards them along that algorithm's topology. It is computed by the IGP, not BGP, and does not reserve bandwidth."
      },
      {
       "q": "Customer traceroutes across the VPN show provider core addresses, and the security team objects. What is the usual change?",
       "options": [
        "Enable explicit null on all egress PEs, so the core addresses are replaced with the PE address.",
        "Disable TTL propagation into the label stack for forwarded customer traffic at the ingress PEs.",
        "Enable PHP on every P router, so the core hops no longer decrement the TTL of labelled packets.",
        "Filter ICMP on the CE routers, so time-exceeded messages from the core never reach customers."
       ],
       "answer": 1,
       "explain": "With TTL propagation disabled, the label TTL starts at 255 and core hops never expire customer packets. Explicit null and PHP affect label popping, and CE filtering would break legitimate diagnostics."
      }
     ]
    }
   ]
  }
 ]
});
TRACK.modules.push({
 "id": "m6",
 "order": 6,
 "code": "Fabric",
 "title": "Fabric — Overlays, VXLAN EVPN and SD-WAN",
 "subtitle": "Design, build, scale and migrate overlay networks in the data centre and across the WAN.",
 "outcomes": [
  "Explain the VXLAN data plane and every EVPN route type, and use them to reason about forwarding.",
  "Build tenant routing with symmetric IRB, anycast gateways and type-5 routes, including border connectivity.",
  "Design multihoming and a robust leaf-spine underlay with correct EVPN control-plane roles.",
  "Architect SD-WAN overlay routing, policy, application steering and security integration.",
  "Plan and execute migrations from legacy WAN and data-centre networks with safe coexistence."
 ],
 "lessons": [
  {
   "id": "m6-l1",
   "title": "VXLAN Data Plane and the EVPN Control Plane",
   "subtitle": "What the encapsulation does, what each EVPN route type carries and how hosts are learned",
   "minutes": 45,
   "objectives": [
    "Describe the VXLAN encapsulation, its overhead and how it provides entropy for ECMP.",
    "Explain EVPN route types 1 to 5 and identify which one solves which problem.",
    "Configure a leaf for Layer 2 VNIs with BGP-signalled ingress replication and verify host learning."
   ],
   "blocks": [
    {
     "type": "text",
     "text": "The **Fabric** segment of the Mastery Ring covers overlays: networks built on top of a simple routed underlay. In the data centre the dominant pattern is **VXLAN with an EVPN control plane** (EVPN is defined in RFC 7432 for MPLS; its use with VXLAN and other overlays is specified separately). VXLAN supplies the encapsulation; EVPN replaces flood-and-learn with BGP advertisement of MAC addresses, IP addresses and flooding lists. In the WAN the same idea appears as SD-WAN. This lesson nails down the data plane and the route types, because every later topic, from symmetric IRB to multihoming, is just a particular use of them."
    },
    {
     "type": "layers",
     "title": "A VXLAN packet, outermost header first",
     "items": [
      {
       "label": "Outer Ethernet",
       "parts": [
        "Leaf to spine next hop",
        "Rewritten at every underlay hop"
       ]
      },
      {
       "label": "Outer IP",
       "parts": [
        "Source and destination are VTEP addresses",
        "DSCP copied from the inner packet by default on most platforms"
       ]
      },
      {
       "label": "Outer UDP",
       "parts": [
        "Destination port 4789",
        "Source port derived from a hash of the inner headers, giving ECMP entropy"
       ]
      },
      {
       "label": "VXLAN header (8 bytes)",
       "parts": [
        "I flag set",
        "24-bit VNI: about 16 million segments"
       ]
      },
      {
       "label": "Inner frame",
       "parts": [
        "Original Ethernet frame without FCS",
        "Tenant VLAN tag normally stripped and mapped to the VNI"
       ]
      }
     ]
    },
    {
     "type": "formula",
     "title": "Overlay arithmetic",
     "items": [
      {
       "name": "VXLAN overhead (IPv4 underlay)",
       "expr": "14 outer Ethernet + 20 IP + 8 UDP + 8 VXLAN = 50 bytes",
       "meaning": "Add 4 for an outer 802.1Q tag; an IPv6 underlay adds 20 more because its header is 40 bytes."
      },
      {
       "name": "Minimum underlay IP MTU",
       "expr": "tenant MTU + 14 inner Ethernet + 8 VXLAN + 8 UDP + 20 outer IP",
       "meaning": "A 1500-byte tenant MTU needs at least 1550 on underlay interfaces; real fabrics run 9216-byte frames and give tenants 9000 or so."
      },
      {
       "name": "Segment space",
       "expr": "2^24 = 16,777,216 VNIs",
       "meaning": "Far beyond the 4,094 usable VLAN IDs, which is why VLANs become locally significant per leaf."
      }
     ]
    },
    {
     "type": "compare",
     "title": "Flood-and-learn versus EVPN",
     "columns": [
      {
       "title": "Flood-and-learn VXLAN",
       "items": [
        "Unknown unicast and ARP flooded to every VTEP in the VNI",
        "Remote MACs learned from the data plane",
        "Needs underlay multicast or static peer lists",
        "No integrated routing, no mobility detection, poor multihoming"
       ]
      },
      {
       "title": "EVPN control plane",
       "items": [
        "MAC and IP learned locally, advertised in BGP",
        "Remote VTEPs discovered from route type 3",
        "ARP suppression answers locally from known bindings",
        "Built-in mobility, multihoming and routing (IRB, type 5)"
       ]
      }
     ]
    },
    {
     "type": "table",
     "title": "EVPN route types",
     "head": [
      "Type",
      "Name",
      "What it does",
      "Key fields"
     ],
     "rows": [
      [
       "1",
       "Ethernet auto-discovery",
       "Per ES: mass withdrawal on link failure. Per EVI: aliasing, so remote leaves load-balance to all multihomed peers",
       "ESI, Ethernet tag, label"
      ],
      [
       "2",
       "MAC/IP advertisement",
       "Advertises a host MAC and optionally its IP; drives remote MAC tables, ARP suppression and host routes",
       "MAC, IP, L2 VNI (label 1), L3 VNI (label 2), router MAC, MAC mobility"
      ],
      [
       "3",
       "Inclusive multicast Ethernet tag",
       "Announces that a VTEP participates in a VNI; builds the ingress-replication flood list",
       "Originating VTEP, PMSI tunnel attribute"
      ],
      [
       "4",
       "Ethernet segment",
       "Discovers peers on the same ES and drives designated-forwarder election",
       "ESI, originator, ES-import RT"
      ],
      [
       "5",
       "IP prefix",
       "Advertises IP prefixes independent of any MAC: subnets, external routes, summaries",
       "Prefix, L3 VNI, router MAC, gateway IP"
      ]
     ]
    },
    {
     "type": "flow",
     "title": "How a host becomes reachable across the fabric",
     "items": [
      {
       "label": "Attach",
       "text": "Host 10.1.10.21 sends ARP or any frame into VLAN 10 on Leaf4"
      },
      {
       "label": "Local learn",
       "text": "Leaf4 learns the MAC on the port and the IP from ARP or DHCP snooping"
      },
      {
       "label": "Advertise",
       "text": "Leaf4 sends a type-2 route with MAC, IP, L2 VNI 10010, L3 VNI 50001 and its router MAC"
      },
      {
       "label": "Install",
       "text": "Other leaves install the MAC behind VTEP Leaf4 and, for symmetric IRB, a /32 host route in the tenant VRF"
      },
      {
       "label": "Suppress",
       "text": "When Host A ARPs for 10.1.10.21, its own leaf answers from the known binding instead of flooding"
      }
     ]
    },
    {
     "type": "cli",
     "title": "Leaf with a Layer 2 VNI and BGP ingress replication",
     "device": "Leaf1 · IOS-style CLI (fabric)",
     "lines": [
      "vlan 10",
      " vn-segment 10010",
      "!",
      "interface nve1",
      " no shutdown",
      " source-interface loopback1",
      " host-reachability protocol bgp",
      " member vni 10010",
      "  suppress-arp",
      "  ingress-replication protocol bgp",
      "!",
      "evpn",
      " vni 10010 l2",
      "  rd auto",
      "  route-target import auto",
      "  route-target export auto",
      "!",
      "router bgp 65101",
      " neighbor 10.255.0.1 remote-as 65000",
      "  update-source loopback0",
      "  ebgp-multihop 3",
      "  address-family l2vpn evpn",
      "   send-community extended"
     ],
     "note": "Auto RTs are derived from the local AS and VNI. With a different AS per leaf (eBGP underlay design), auto-derived RTs differ between leaves, so either configure explicit RTs or use an implementation option that ignores the AS when importing."
    },
    {
     "type": "cli",
     "title": "Reading a type-2 route",
     "device": "Leaf1 · IOS-style CLI (fabric)",
     "lines": [
      "Leaf1# show bgp l2vpn evpn route-type 2 10.1.10.21",
      "Route Distinguisher: 10.255.1.4:32777",
      "*>e[2]:[0]:[0]:[48]:[0050.56a1.0021]:[32]:[10.1.10.21]/272",
      "      10.255.2.4            0        65000 65104 i",
      "      Extcommunity: RT:65104:10010 RT:65104:50001 ENCAP:8",
      "                    Router MAC:5254.0012.0004",
      "      Received label 10010 50001",
      "Leaf1# show l2route evpn mac-ip all | include 10.1.10.21",
      "10    0050.56a1.0021 BGP  --   0   10.1.10.21   10.255.2.4"
     ],
     "note": "Label 10010 is the L2 VNI for bridging, label 50001 the L3 VNI for routing, ENCAP:8 means VXLAN, and 10.255.2.4 is Leaf4's VTEP address on loopback1."
    },
    {
     "type": "callout",
     "kind": "insight",
     "text": "When a VM moves from Leaf4 to Leaf7, Leaf7 advertises the same MAC with a **MAC mobility** extended community carrying a higher sequence number, and every leaf, including Leaf4, prefers it. If the same MAC keeps moving back and forth, typically more than five moves in 180 seconds, leaves declare it a **duplicate** and freeze advertisement, which protects the control plane from a looped or misconfigured host. In a lab, a frozen duplicate MAC is a classic hidden fault after a temporary loop.",
     "title": "MAC mobility and duplicate detection"
    },
    {
     "type": "scenario",
     "title": "Broadcast fails to reach one leaf",
     "situation": "Hosts on Leaf1 and Leaf2 in VNI 10010 communicate normally. A new host on Leaf3 in the same VNI can ping hosts whose MAC addresses are already known, but DHCP (broadcast) from Leaf3 never reaches the server behind Leaf1, and silent hosts on Leaf1 are unreachable from Leaf3. Leaf1 does not list Leaf3's VTEP in its flood list for VNI 10010. What is the most likely cause?",
     "options": [
      {
       "text": "Leaf3 is using a different route distinguisher from Leaf1, so the type-2 routes are ignored by Leaf1.",
       "feedback": "RDs are expected to differ per leaf and do not cause routes to be ignored. Known unicast works, so type-2 routes are fine.",
       "best": false
      },
      {
       "text": "The underlay MTU is too small, so the broadcast frames are fragmented and dropped by the spines.",
       "feedback": "MTU problems affect large frames of any type, not specifically broadcast; DHCP discovers are small.",
       "best": false
      },
      {
       "text": "Leaf3 is not originating a type-3 route for VNI 10010, for example because ingress replication is not set to BGP for that VNI.",
       "feedback": "Correct. Without a type-3 route from Leaf3, other leaves do not add it to their flood lists, so BUM traffic never crosses between them while known unicast still works.",
       "best": true
      },
      {
       "text": "ARP suppression is enabled, so all broadcast traffic in the VNI is blocked at every leaf by design.",
       "feedback": "ARP suppression only answers ARP for known bindings locally; it does not block DHCP or other broadcast traffic.",
       "best": false
      }
     ]
    },
    {
     "type": "terms",
     "items": [
      {
       "term": "VTEP",
       "def": "VXLAN tunnel endpoint: the device that encapsulates and decapsulates VXLAN, identified by a loopback address."
      },
      {
       "term": "VNI",
       "def": "VXLAN network identifier: a 24-bit segment ID that maps to a bridge domain (L2 VNI) or a VRF (L3 VNI)."
      },
      {
       "term": "EVI",
       "def": "EVPN instance: the set of Ethernet segments and bridge domains that make up one EVPN service."
      },
      {
       "term": "Type-2 route",
       "def": "EVPN MAC/IP advertisement carrying a host MAC and optional IP with L2 and L3 VNI labels."
      },
      {
       "term": "Type-3 route",
       "def": "EVPN inclusive multicast route announcing VTEP membership in a VNI for BUM replication."
      },
      {
       "term": "Ingress replication",
       "def": "Head-end copying of BUM traffic as unicast to every remote VTEP in the flood list."
      },
      {
       "term": "ARP suppression",
       "def": "Answering ARP requests locally on a leaf from EVPN-learned IP-to-MAC bindings."
      },
      {
       "term": "MAC mobility",
       "def": "EVPN extended community with a sequence number that lets the newest location of a moved MAC win."
      },
      {
       "term": "BUM traffic",
       "def": "Broadcast, unknown-unicast and multicast frames that must be flooded within a segment."
      }
     ]
    },
    {
     "type": "quiz",
     "items": [
      {
       "q": "Why does the VXLAN source UDP port vary between flows?",
       "options": [
        "It identifies the tenant VRF, so the remote VTEP can select the right routing table without using the VNI.",
        "It is incremented for every packet, so the receiving VTEP can detect loss and reordering.",
        "It encodes the inner VLAN tag, so the remote VTEP can rebuild the original 802.1Q header.",
        "It is derived from a hash of the inner headers, so underlay ECMP can spread different tenant flows."
       ],
       "answer": 3,
       "explain": "The hash-derived source port gives the underlay entropy for load balancing. The VNI identifies the segment; VXLAN carries no sequence numbers or VLAN tag in the port."
      },
      {
       "q": "A tenant uses 1500-byte packets and the underlay is IPv4 without outer VLAN tags. What is the minimum underlay IP MTU?",
       "options": [
        "1524 bytes, adding only the VXLAN and UDP headers because inner Ethernet is stripped.",
        "1500 bytes, because VXLAN fragments packets at the VTEP before they enter the underlay.",
        "1550 bytes, adding the inner Ethernet header, VXLAN, UDP and the outer IP header.",
        "1554 bytes, because the outer Ethernet header is always counted as part of the IP MTU."
       ],
       "answer": 2,
       "explain": "1500 + 14 + 8 + 8 + 20 = 1550. The inner Ethernet header is carried, not stripped; VTEPs normally do not fragment; and the outer Ethernet header is not part of the IP MTU."
      },
      {
       "q": "Which EVPN route type lets a remote leaf load-balance toward both leaves of an all-active multihomed server even if only one of them learned the MAC?",
       "options": [
        "Type 1 per EVI, which provides aliasing for every leaf attached to the Ethernet segment.",
        "Type 3, which lists every VTEP in the VNI and therefore every possible path to the server.",
        "Type 4, which elects a designated forwarder and shares the MAC table with the non-DF leaf.",
        "Type 5, which advertises the server subnet so remote leaves can use any leaf as next hop."
       ],
       "answer": 0,
       "explain": "Aliasing comes from type 1 per EVI: the remote leaf associates the MAC's ESI with every leaf advertising that ES. Type 4 handles DF election, type 3 flood lists and type 5 prefixes."
      },
      {
       "q": "In a type-2 route, what does the second label (for example 50001) represent in a symmetric IRB fabric?",
       "options": [
        "The L3 VNI of the tenant VRF, used when the remote leaf routes traffic to that host.",
        "The ESI label, used for split horizon when the host sits on a multihomed segment.",
        "The MAC mobility sequence number, used to decide which advertisement is most recent.",
        "The L2 VNI of the gateway subnet, used when the host is reached through the default gateway."
       ],
       "answer": 0,
       "explain": "Label 1 is the L2 VNI and label 2 is the L3 VNI for routed traffic. Mobility uses an extended community and split horizon in VXLAN uses local bias rather than a label."
      },
      {
       "q": "After a temporary loop, one host's MAC is no longer advertised by any leaf and the host is unreachable from remote leaves. What should be checked first?",
       "options": [
        "Whether the host's route distinguisher was reset by the loop and must be configured again.",
        "Whether the spine route reflectors dropped the type-3 routes because of the loop.",
        "Whether the leaves have flagged the MAC as a duplicate after rapid moves and frozen its advertisement.",
        "Whether the L3 VNI was removed automatically because the loop overloaded the control plane."
       ],
       "answer": 2,
       "explain": "Rapid MAC moves trigger duplicate detection, which stops advertisement until the condition clears or is reset. Hosts have no RDs, and type-3 or L3 VNI loss would affect many hosts."
      }
     ]
    }
   ]
  },
  {
   "id": "m6-l2",
   "title": "Routing in the Fabric: IRB, Anycast Gateway and Type-5 Routes",
   "subtitle": "Where routing happens, how gateways stay local everywhere and how prefixes enter the overlay",
   "minutes": 45,
   "objectives": [
    "Contrast symmetric and asymmetric IRB and justify symmetric IRB for most fabrics.",
    "Configure a tenant VRF with an L3 VNI and distributed anycast gateway.",
    "Use type-5 routes for silent hosts, external prefixes and border connectivity."
   ],
   "blocks": [
    {
     "type": "text",
     "text": "Bridging across a fabric is only half the story; tenants route between subnets and to the outside world. EVPN supports **integrated routing and bridging (IRB)** on every leaf, so a packet is routed at the first leaf it meets instead of hairpinning to a central gateway. How that routing is split between the ingress and egress leaf, symmetric or asymmetric, decides how much state each leaf must hold."
    },
    {
     "type": "compare",
     "title": "Symmetric versus asymmetric IRB",
     "columns": [
      {
       "title": "Asymmetric IRB",
       "items": [
        "Ingress leaf routes and bridges into the destination VNI",
        "Egress leaf only bridges",
        "Every leaf must have every VLAN, VNI and gateway it might route into",
        "No L3 VNI needed; simpler packet walk",
        "State grows with tenant subnets times leaves"
       ]
      },
      {
       "title": "Symmetric IRB",
       "items": [
        "Ingress leaf routes into the tenant L3 VNI; egress leaf routes again to the host",
        "Both leaves route, hence symmetric",
        "Leaves need only local subnets plus one L3 VNI per VRF",
        "Supports type-5 prefixes and external routes naturally",
        "The default choice for production fabrics in 2026"
       ]
      }
     ]
    },
    {
     "type": "flow",
     "title": "Symmetric IRB packet walk: 10.1.10.11 on Leaf1 to 10.1.20.25 on Leaf4",
     "items": [
      {
       "label": "Ingress route",
       "text": "Leaf1 receives the frame on its anycast gateway MAC and looks up 10.1.20.25 in VRF TENANT-A"
      },
      {
       "label": "Encapsulate",
       "text": "Host route via Leaf4: VXLAN with VNI 50001, inner destination MAC = Leaf4 router MAC"
      },
      {
       "label": "Underlay",
       "text": "Spines forward on the outer IP like any other packet"
      },
      {
       "label": "Egress route",
       "text": "Leaf4 maps VNI 50001 to TENANT-A, looks up the host and resolves its MAC"
      },
      {
       "label": "Deliver",
       "text": "Frame bridged into VLAN 20 toward the host"
      }
     ]
    },
    {
     "type": "cli",
     "title": "Tenant VRF, L3 VNI and anycast gateway",
     "device": "Leaf1 · IOS-style CLI (fabric)",
     "lines": [
      "fabric forwarding anycast-gateway-mac 0000.2222.3333",
      "vlan 3001",
      " vn-segment 50001",
      "vrf context TENANT-A",
      " vni 50001",
      " rd auto",
      " address-family ipv4 unicast",
      "  route-target both auto evpn",
      "interface Vlan3001",
      " vrf member TENANT-A",
      " ip forward",
      " no shutdown",
      "interface Vlan20",
      " vrf member TENANT-A",
      " ip address 10.1.20.1/24",
      " fabric forwarding mode anycast-gateway",
      "interface nve1",
      " member vni 50001 associate-vrf"
     ],
     "note": "VLAN 3001 and its interface exist only to give the L3 VNI a local routing context; they carry no hosts. Every leaf with VLAN 20 uses the identical gateway IP and the identical anycast gateway MAC."
    },
    {
     "type": "callout",
     "kind": "definition",
     "text": "Every leaf that serves a subnet owns the same gateway IP and the same virtual MAC. Hosts always find their gateway one hop away, a moved VM keeps working without re-ARPing, and no first-hop redundancy protocol runs anywhere. The trade-off is that gateway-sourced traffic, such as ARP probes the leaf sends to hosts, needs care: implementations use the anycast address with special handling, or a unique per-leaf address, so replies return to the right leaf.",
     "title": "Distributed anycast gateway"
    },
    {
     "type": "table",
     "title": "Type 2 or type 5?",
     "head": [
      "Need",
      "Route type",
      "Why"
     ],
     "rows": [
      [
       "Reach a known host anywhere in the fabric",
       "Type 2 with IP (host route)",
       "Exact /32 or /128 follows the host and supports mobility"
      ],
      [
       "Reach a subnet that exists only on some leaves, including silent hosts",
       "Type 5 for the subnet",
       "Remote leaves route to a leaf that owns the subnet, which then resolves the host with ARP"
      ],
      [
       "Inject external or summary routes from a border leaf",
       "Type 5",
       "Prefixes have no MAC; carries L3 VNI and router MAC only"
      ],
      [
       "Advertise routes learned from a firewall or load balancer inside a VRF",
       "Type 5",
       "Treated like any IP prefix with a VTEP next hop"
      ]
     ]
    },
    {
     "type": "cli",
     "title": "Type-5 prefixes in the tenant routing table",
     "device": "Leaf1 · IOS-style CLI (fabric)",
     "lines": [
      "Leaf1# show ip route vrf TENANT-A",
      "0.0.0.0/0, ubest/mbest: 2/0",
      "    *via 10.255.2.9%default, [20/0], bgp-65101, external, tag 65109",
      "       (evpn) segid: 50001 tunnelid: 0xaff0209 encap: VXLAN",
      "    *via 10.255.2.10%default, [20/0], bgp-65101, external, tag 65110",
      "10.1.20.0/24, ubest/mbest: 1/0, attached",
      "    *via 10.1.20.1, Vlan20, [0/0], direct",
      "10.1.30.0/24, ubest/mbest: 2/0",
      "    *via 10.255.2.4%default, [20/0], bgp-65101, external, tag 65104",
      "       (evpn) segid: 50001 encap: VXLAN",
      "    *via 10.255.2.5%default, [20/0], bgp-65101, external, tag 65105"
     ],
     "note": "The default route arrives as type 5 from two border leaves; 10.1.30.0/24 arrives as type 5 from the two leaves that host it. Both are ECMP across VTEPs in the default (underlay) VRF."
    },
    {
     "type": "framework",
     "title": "Connecting the fabric to the outside world",
     "items": [
      {
       "label": "BL",
       "title": "Border leaf",
       "text": "A leaf pair that peers with WAN routers or firewalls; it is also an ordinary VTEP for tenant traffic."
      },
      {
       "label": "VRF",
       "title": "VRF-lite handoff",
       "text": "One subinterface and eBGP session per tenant VRF toward the external router; simple and widely supported."
      },
      {
       "label": "FW",
       "title": "Firewall insertion",
       "text": "Place a firewall between VRFs (inter-tenant) or between a VRF and the outside; advertise its routes back as type 5."
      },
      {
       "label": "LEAK",
       "title": "Route leaking",
       "text": "Import a shared-services VRF's RT into tenant VRFs for DNS or backup, with export filters to avoid leaking everything."
      },
      {
       "label": "DCI",
       "title": "Data-centre interconnect",
       "text": "Multi-site EVPN with border gateways re-originating routes, so each site's fabric stays a separate failure domain."
      }
     ]
    },
    {
     "type": "scenario",
     "title": "Silent hosts in a subnet that is not everywhere",
     "situation": "In a symmetric IRB fabric, subnet 10.1.20.0/24 exists only on Leaf4 and Leaf5. A backup appliance at 10.1.20.25 behind Leaf4 never initiates traffic. Hosts on Leaf1, which has no VLAN 20, cannot reach it; hosts that do send traffic in the same subnet are reachable. What is the best fix?",
     "options": [
      {
       "text": "Configure VLAN 20 and its anycast gateway on Leaf1 as well, so that Leaf1 can broadcast ARP for the host itself.",
       "feedback": "This can work but spreads every subnet to every leaf, which is the scaling cost symmetric IRB is meant to avoid.",
       "best": false
      },
      {
       "text": "Advertise 10.1.20.0/24 as a type-5 route from Leaf4 and Leaf5 so Leaf1 forwards toward them and they ARP for the silent host.",
       "feedback": "Correct. Type-2 host routes exist only for hosts that have been learned. A type-5 subnet route gives remote leaves a path, and the egress leaf glean-resolves the silent host.",
       "best": true
      },
      {
       "text": "Disable ARP suppression in VNI 10020 so that all ARP requests flood throughout the fabric again.",
       "feedback": "Leaf1 has no VNI 10020 and routes the traffic, so ARP suppression is irrelevant here.",
       "best": false
      },
      {
       "text": "Add a static MAC entry for the appliance on Leaf1 pointing at Leaf4's VTEP address.",
       "feedback": "Leaf1 routes this traffic; a static MAC in a VLAN it does not have does not create a route, and it would not scale.",
       "best": false
      }
     ]
    },
    {
     "type": "terms",
     "items": [
      {
       "term": "IRB",
       "def": "Integrated routing and bridging: routing between subnets on the same device that bridges them, here on every leaf."
      },
      {
       "term": "Symmetric IRB",
       "def": "Model in which both the ingress and egress leaf route, using a per-VRF L3 VNI between them."
      },
      {
       "term": "Asymmetric IRB",
       "def": "Model in which the ingress leaf routes and bridges into the destination VNI, and the egress leaf only bridges."
      },
      {
       "term": "L3 VNI",
       "def": "A VNI that identifies a tenant VRF for routed traffic between VTEPs."
      },
      {
       "term": "Router MAC",
       "def": "EVPN extended community carrying the egress VTEP's MAC, used as inner destination MAC for routed traffic."
      },
      {
       "term": "Anycast gateway",
       "def": "Identical gateway IP and MAC on every leaf serving a subnet."
      },
      {
       "term": "Type-5 route",
       "def": "EVPN IP prefix route used for subnets, external routes and summaries without a MAC."
      },
      {
       "term": "Border leaf",
       "def": "A leaf that connects tenant VRFs to external networks, firewalls or other sites."
      }
     ]
    },
    {
     "type": "quiz",
     "items": [
      {
       "q": "A fabric has 200 tenant subnets but each leaf hosts only about 20 of them. Why is symmetric IRB preferable here?",
       "options": [
        "Each leaf can drop the underlay routing protocol entirely, because routing is handled by the L3 VNI alone.",
        "Each leaf needs only its local subnets plus one L3 VNI per VRF, rather than every subnet in the fabric.",
        "Each leaf can avoid BGP entirely, because symmetric IRB learns remote hosts in the data plane.",
        "Each leaf can use a unique gateway MAC per subnet, which removes the need for ARP suppression."
       ],
       "answer": 1,
       "explain": "With asymmetric IRB every leaf must hold every VNI it might bridge into. Symmetric IRB still needs the underlay and BGP EVPN, and uses one shared anycast MAC."
      },
      {
       "q": "In symmetric IRB, which inner destination MAC does the ingress leaf use for a routed packet?",
       "options": [
        "The destination host's MAC, because the ingress leaf already holds the full ARP entry for it.",
        "The anycast gateway MAC, because every leaf owns it and accepts routed traffic addressed to it.",
        "The broadcast MAC, because the egress leaf identifies the VRF from the VNI and ignores the MAC.",
        "The egress leaf's router MAC, learned from the router MAC extended community in EVPN."
       ],
       "answer": 3,
       "explain": "Routed VXLAN frames are addressed to the egress VTEP's router MAC. The host MAC is used only after the egress leaf routes; the anycast MAC is host-facing."
      },
      {
       "q": "Why must every leaf use the same anycast gateway MAC?",
       "options": [
        "So that spines can recognise gateway traffic and route it locally instead of forwarding it on.",
        "So that the L3 VNI can be derived from the MAC address and not configured on each leaf by hand.",
        "So that hosts and moved VMs keep a valid gateway ARP entry no matter which leaf they connect to.",
        "So that type-5 routes can be advertised without a router MAC extended community attached."
       ],
       "answer": 2,
       "explain": "A consistent gateway MAC is what makes mobility seamless. Spines are pure underlay routers, VNIs are configured, and type-5 routes still carry the router MAC."
      },
      {
       "q": "A border leaf pair learns a default route from two WAN routers. How should it reach the other leaves?",
       "options": [
        "As a type-5 route in each tenant VRF, with the border leaves' VTEPs as ECMP next hops.",
        "As a type-2 route with the WAN routers' MAC addresses, so leaves can bridge directly to them.",
        "As a type-3 route, so the default route is flooded to every VTEP that participates in the VNI.",
        "As an underlay IGP route, so tenant traffic follows the default route without any encapsulation."
       ],
       "answer": 0,
       "explain": "External prefixes enter the overlay as type 5. Type 2 is for hosts, type 3 for flood lists, and leaking tenant routes into the underlay breaks isolation."
      },
      {
       "q": "With asymmetric IRB, a leaf routes from VLAN 10 to a host in VLAN 30 on a remote leaf. What must exist on the ingress leaf?",
       "options": [
        "Only the L3 VNI of the tenant VRF, because the egress leaf always performs the final routing step itself.",
        "Only a type-5 route for VLAN 30's subnet, because the egress leaf will resolve the host.",
        "Only the router MAC of the remote leaf, because routed traffic is addressed to that MAC.",
        "VLAN 30 and its VNI, because the ingress leaf bridges into the destination segment after routing."
       ],
       "answer": 3,
       "explain": "In asymmetric IRB the ingress leaf routes then bridges into the destination VNI, so it needs that VNI locally. The other answers describe symmetric IRB."
      }
     ]
    }
   ]
  },
  {
   "id": "m6-l3",
   "title": "Multihoming and Underlay Design",
   "subtitle": "Ethernet segments, designated forwarders and the routed underlay that carries everything",
   "minutes": 45,
   "objectives": [
    "Explain how ESI multihoming uses route types 1 and 4 for aliasing, mass withdrawal and DF election.",
    "Compare EVPN multihoming with peer-link based multi-chassis link aggregation.",
    "Design an underlay: protocol, addressing, MTU, ECMP, and the role of spines in the EVPN control plane."
   ],
   "blocks": [
    {
     "type": "text",
     "text": "Servers, firewalls and legacy switches attach to two leaves for resilience. EVPN multihoming achieves this with standard BGP signalling and no peer link: the two leaves share an **Ethernet segment (ES)** identified by a 10-byte **ESI**. Beneath every overlay sits an underlay whose only job is fast, equal-cost IP reachability between VTEP loopbacks; a good underlay is boring by design."
    },
    {
     "type": "framework",
     "title": "EVPN multihoming mechanics",
     "items": [
      {
       "label": "ESI",
       "title": "Ethernet segment identifier",
       "text": "Same 10-byte ESI and same LACP system ID on every leaf attached to the bundle, so the server sees one partner."
      },
      {
       "label": "RT4",
       "title": "ES route and DF election",
       "text": "Leaves discover each other on the ES and elect a designated forwarder per VLAN, which alone floods BUM from the fabric to the ES."
      },
      {
       "label": "RT1E",
       "title": "Type 1 per ES",
       "text": "Advertised with the ES; withdrawing it tells remote leaves to drop every MAC on that ES at once (mass withdrawal)."
      },
      {
       "label": "RT1V",
       "title": "Type 1 per EVI",
       "text": "Lets remote leaves load-balance to all leaves on the ES even if only one advertised the MAC (aliasing)."
      },
      {
       "label": "SH",
       "title": "Split horizon",
       "text": "With VXLAN, local bias: a leaf does not forward BUM back to an ES it shares with the sending VTEP."
      }
     ]
    },
    {
     "type": "cli",
     "title": "All-active Ethernet segment toward a server",
     "device": "Leaf1 · IOS-style CLI (fabric)",
     "lines": [
      "interface port-channel11",
      " description srv-db-01 dual-homed",
      " switchport mode trunk",
      " switchport trunk allowed vlan 10,20",
      " evpn ethernet-segment",
      "  identifier 0011:2233:4455:6677:8899",
      "  redundancy all-active",
      "  designated-forwarder election preference 200",
      " lacp system-id 02aa.bb00.0011",
      "!",
      "Leaf1# show evpn ethernet-segment 0011:2233:4455:6677:8899",
      "  ESI: 0011.2233.4455.6677.8899  Interface: port-channel11  State: Up",
      "  Peers: 10.255.2.1, 10.255.2.2   Mode: all-active",
      "  DF VLANs: 10   Non-DF VLANs: 20"
     ],
     "note": "Configure the identical ESI and LACP system ID on Leaf2. The DF output shows per-VLAN election: Leaf1 floods BUM for VLAN 10 toward the server, Leaf2 for VLAN 20."
    },
    {
     "type": "table",
     "title": "Failure events and the route that handles them",
     "head": [
      "Event",
      "What the affected leaf does",
      "What remote leaves do"
     ],
     "rows": [
      [
       "Server link to Leaf1 fails",
       "Withdraws type 1 per ES for the ESI",
       "Remove Leaf1 from every MAC on that ES in one step"
      ],
      [
       "Leaf1 fails entirely",
       "Nothing; it is gone",
       "Underlay withdraws the VTEP loopback; BGP and BFD remove its routes"
      ],
      [
       "New VLAN added on the ES",
       "Re-runs DF election for that VLAN",
       "Add the ES leaves as aliasing next hops for MACs in that VLAN"
      ],
      [
       "Leaf1 restored",
       "Waits a hold timer before taking DF role",
       "Resume load-balancing once type 1 routes return"
      ]
     ]
    },
    {
     "type": "compare",
     "title": "EVPN multihoming versus peer-link MLAG",
     "columns": [
      {
       "title": "EVPN ESI multihoming",
       "items": [
        "Standards-based BGP signalling",
        "No peer link; leaves can be different platforms",
        "Scales beyond two leaves per segment",
        "Per-VLAN DF election and fast mass withdrawal"
       ]
      },
      {
       "title": "Peer-link MLAG",
       "items": [
        "Proprietary state sync between a fixed pair",
        "Peer link carries orphan and failure traffic",
        "Shared virtual VTEP address",
        "Mature and familiar, but pairs are tightly coupled"
       ]
      }
     ]
    },
    {
     "type": "layers",
     "title": "A leaf-spine fabric as layers",
     "items": [
      {
       "label": "Tenant services",
       "parts": [
        "VRFs, L2 and L3 VNIs, anycast gateway, policy"
       ]
      },
      {
       "label": "Overlay control plane",
       "parts": [
        "BGP EVPN; spines as route reflectors or route servers"
       ]
      },
      {
       "label": "Underlay routing",
       "parts": [
        "eBGP per leaf or IS-IS/OSPF, BFD, ECMP across all spines"
       ]
      },
      {
       "label": "Physical",
       "parts": [
        "Leaf-spine Clos, point-to-point /31 or unnumbered links, jumbo MTU"
       ]
      }
     ]
    },
    {
     "type": "compare",
     "title": "Underlay protocol choice",
     "columns": [
      {
       "title": "eBGP underlay",
       "items": [
        "One AS per leaf (or per leaf pair), shared AS on spines",
        "Policy-rich and scales to very large fabrics (RFC 7938 pattern)",
        "Needs allowas-in or AS planning for some designs",
        "EVPN often on separate multihop sessions to the spines"
       ]
      },
      {
       "title": "IS-IS or OSPF underlay",
       "items": [
        "Simple, fast and familiar link-state",
        "iBGP EVPN with spines as route reflectors",
        "Good choice up to large single-pod sizes",
        "Clear separation: IGP for underlay, BGP only for overlay"
       ]
      }
     ]
    },
    {
     "type": "cli",
     "title": "Spine as EVPN route server in an eBGP design",
     "device": "Spine1 · IOS-style CLI (fabric)",
     "lines": [
      "route-map NH-UNCHANGED permit 10",
      " set ip next-hop unchanged",
      "router bgp 65000",
      " address-family l2vpn evpn",
      "  retain route-target all",
      " template peer LEAF-EVPN",
      "  update-source loopback0",
      "  ebgp-multihop 3",
      "  address-family l2vpn evpn",
      "   send-community extended",
      "   route-map NH-UNCHANGED out",
      " neighbor 10.255.1.1 remote-as 65101",
      "  inherit peer LEAF-EVPN"
     ],
     "note": "Spines hold no VRFs, so they must retain all route targets, and they must not rewrite the next hop: the next hop has to remain the originating leaf's VTEP address."
    },
    {
     "type": "formula",
     "title": "Sizing checks",
     "items": [
      {
       "name": "Leaf oversubscription",
       "expr": "server-facing bandwidth ÷ spine-facing bandwidth",
       "meaning": "48 × 25G down and 6 × 100G up gives 1200 ÷ 600 = 2:1; storage and AI clusters often demand 1:1."
      },
      {
       "name": "Spine count for ECMP",
       "expr": "uplinks per leaf = spines (one link each)",
       "meaning": "Losing one of four spines removes 25% of fabric capacity; plan failure headroom."
      }
     ]
    },
    {
     "type": "template",
     "title": "EVPN fabric design sheet",
     "purpose": "Capture each tenant and fabric-wide decision once, so leaves are configured consistently and audits are quick.",
     "columns": [
      "Tenant / VRF",
      "L3 VNI",
      "VLAN : L2 VNI : subnet",
      "Gateway (anycast)",
      "RT scheme",
      "Multihomed ESs",
      "Border / external handoff"
     ],
     "example": [
      [
       "TENANT-A",
       "50001",
       "10 : 10010 : 10.1.10.0/24; 20 : 10020 : 10.1.20.0/24",
       "10.1.x.1, MAC 0000.2222.3333",
       "Explicit 65000:VNI",
       "ESI ...8899 srv-db-01 (Leaf1/2)",
       "Border leaves 9/10, eBGP VRF-lite to FW"
      ]
     ],
     "rows": 6
    },
    {
     "type": "scenario",
     "title": "Remote leaves never use the second leaf",
     "situation": "A server is dual-homed to Leaf1 and Leaf2 in an all-active bundle. Remote leaves send all traffic for the server's MAC only to Leaf1, and during a test both leaves flooded the same broadcast to the server, which logged duplicate packets. What is the most likely cause?",
     "options": [
      {
       "text": "The ESI was mistyped on one leaf, so the leaves see two different segments: no aliasing and no shared DF election.",
       "feedback": "Correct. Different ESIs mean no common segment: each leaf believes it is the sole DF and remote leaves cannot alias. LACP may still bundle if the system ID matches, hiding the error.",
       "best": true
      },
      {
       "text": "The spines are rewriting the next hop to themselves, so remote leaves cannot tell Leaf1 and Leaf2 apart.",
       "feedback": "A next-hop rewrite would break forwarding to all hosts rather than causing this specific pattern.",
       "best": false
      },
      {
       "text": "ARP suppression is enabled on Leaf2, so it never advertises the server's MAC address to the fabric.",
       "feedback": "ARP suppression does not stop MAC advertisement, and aliasing should work even when only one leaf learns the MAC.",
       "best": false
      },
      {
       "text": "The server's NIC teaming is in active-standby mode, so only one leaf can ever learn its MAC address.",
       "feedback": "Active-standby could explain one-sided learning but not two leaves flooding duplicates as DF.",
       "best": false
      }
     ]
    },
    {
     "type": "checklist",
     "title": "Underlay readiness checklist",
     "items": [
      "All fabric links up with the agreed MTU (for example 9216) verified by DF-set pings between loopbacks",
      "Every VTEP loopback reachable from every leaf with the expected number of ECMP paths",
      "BFD running on underlay sessions with agreed timers",
      "Underlay and overlay sessions use separate loopbacks if the design requires it",
      "Spines retain all route targets and leave EVPN next hops unchanged (eBGP) or reflect correctly (iBGP)",
      "Identical ESI and LACP system ID on both leaves of every multihomed bundle",
      "DF election per VLAN verified on each Ethernet segment",
      "Graceful insertion and removal (maintenance mode) tested on one spine and one leaf"
     ]
    },
    {
     "type": "quiz",
     "items": [
      {
       "q": "A server link to Leaf1 fails in an all-active ES carrying 3,000 MACs. Which mechanism lets remote leaves react quickly?",
       "options": [
        "Leaf1 withdraws all 3,000 type-2 routes individually, which remote leaves process in sequence.",
        "Leaf1 withdraws its type-1 per-ES route, so remote leaves remove Leaf1 for all those MACs at once.",
        "Leaf1 sends a type-3 withdrawal, which removes it from the flood list and all MAC entries.",
        "Leaf1 lowers its DF preference, which signals remote leaves to stop sending unicast to it."
       ],
       "answer": 1,
       "explain": "Mass withdrawal through type 1 per ES makes convergence independent of the MAC count. Withdrawing type 2 routes one by one is slow; type 3 and DF affect BUM only."
      },
      {
       "q": "What does designated-forwarder election control on an Ethernet segment?",
       "options": [
        "Which leaf advertises the device's MAC address, while the other leaves stay silent about it.",
        "Which leaf receives all known unicast traffic for the device from remote leaves in the fabric.",
        "Which leaf forwards BUM traffic from the fabric toward the multihomed device for each VLAN.",
        "Which leaf runs LACP with the device, while the other leaf keeps its links in standby."
       ],
       "answer": 2,
       "explain": "The DF prevents duplicate BUM delivery. Both leaves may advertise MACs, both receive unicast through aliasing, and both run LACP in all-active mode."
      },
      {
       "q": "Why must spines acting as eBGP EVPN route servers keep the next hop unchanged?",
       "options": [
        "The next hop must stay unchanged so that the spines can perform symmetric IRB on behalf of all leaves.",
        "The next hop must stay unchanged so the route distinguisher can be derived from it by each leaf.",
        "The next hop must stay unchanged because eBGP never modifies next hops for the EVPN address family.",
        "The next hop must stay the originating leaf's VTEP, because spines are not VTEPs for tenant traffic."
       ],
       "answer": 3,
       "explain": "eBGP would normally set next hop self, which would make spines the VXLAN tunnel endpoint. Spines do not route tenant traffic, RDs are not derived this way, and eBGP does change next hops by default."
      },
      {
       "q": "A leaf has 48 × 25G server ports and 4 × 100G uplinks. What is its oversubscription ratio?",
       "options": [
        "3:1, because 1,200 Gbit/s of server capacity shares 400 Gbit/s of uplink capacity.",
        "2:1, because only half of the server ports are expected to transmit at the same time.",
        "1.2:1, because each 100G uplink can carry four 25G flows with some headroom left.",
        "12:1, because there are twelve server ports for each individual uplink port on the leaf."
       ],
       "answer": 0,
       "explain": "48 × 25 = 1,200 and 4 × 100 = 400, giving 3:1. Ratios compare bandwidth, not port counts, and do not assume traffic patterns."
      },
      {
       "q": "Which statement about EVPN multihoming compared with peer-link MLAG is accurate?",
       "options": [
        "EVPN multihoming requires both leaves to share a single virtual VTEP address and a peer link.",
        "EVPN multihoming signals the segment in BGP and needs no peer link between the leaves.",
        "EVPN multihoming limits each Ethernet segment to exactly two leaves of the same platform.",
        "EVPN multihoming forwards BUM traffic from every leaf, relying on the server to drop duplicates."
       ],
       "answer": 1,
       "explain": "EVPN multihoming is standards-based and peer-link free, supports more than two leaves and prevents duplicates with DF election. The shared virtual VTEP and peer link describe MLAG."
      }
     ]
    }
   ]
  },
  {
   "id": "m6-l4",
   "title": "SD-WAN Architecture Deep Dive",
   "subtitle": "Overlay routing, policy, application-aware steering and integrated security across many transports",
   "minutes": 45,
   "objectives": [
    "Describe the planes and components of an SD-WAN and how an edge joins the overlay.",
    "Design control, data and application-aware routing policies with measurable SLA classes.",
    "Integrate direct internet access with local or cloud-delivered security."
   ],
   "blocks": [
    {
     "type": "text",
     "text": "SD-WAN is the WAN's version of the overlay idea: a controller-driven overlay of encrypted tunnels across any mix of MPLS, broadband, 5G and satellite, with routing and forwarding decisions driven by central policy and live path measurements. Products differ in vocabulary, but the architecture is consistent across them. An expert describes it in neutral terms, configures intent rather than per-device detail, and keeps the transports, the overlay and the policy clearly separate when troubleshooting."
    },
    {
     "type": "layers",
     "title": "SD-WAN planes",
     "items": [
      {
       "label": "Orchestration and management",
       "parts": [
        "Central GUI and API",
        "Templates, software images, monitoring and analytics"
       ]
      },
      {
       "label": "Control",
       "parts": [
        "Controllers authenticate edges and distribute overlay routes, transport locators, keys and policy",
        "Optional route reflection hierarchy for scale"
       ]
      },
      {
       "label": "Data",
       "parts": [
        "Edges build IPsec tunnels between transport locators",
        "Probes measure loss, latency and jitter per tunnel"
       ]
      },
      {
       "label": "Transport",
       "parts": [
        "MPLS, internet, 5G/LTE, satellite",
        "Each identified by a colour or transport label"
       ]
      }
     ]
    },
    {
     "type": "table",
     "title": "Core components and their roles",
     "head": [
      "Component",
      "Role",
      "Expert detail"
     ],
     "rows": [
      [
       "Onboarding service",
       "Zero-touch provisioning: tells a new edge where its controllers are",
       "Device identity is a hardware certificate, not a password"
      ],
      [
       "Controller",
       "Overlay routing and policy distribution",
       "Edges learn remote prefixes with next hop = transport locator(s) of the owning edge"
      ],
      [
       "Manager / orchestrator",
       "Configuration templates, inventory and monitoring",
       "Treat its API as the source of change for automation"
      ],
      [
       "Edge",
       "Forwards traffic, enforces policy, runs local routing to the LAN",
       "Keeps forwarding with last-known state if controllers are briefly unreachable"
      ],
      [
       "Transport locator",
       "Endpoint of tunnels on one transport: public IP, private IP, colour, encapsulation",
       "Behind NAT, the public address is discovered via the controllers"
      ]
     ]
    },
    {
     "type": "flow",
     "title": "An edge joins the overlay",
     "items": [
      {
       "label": "Boot and discover",
       "text": "Edge reaches the onboarding service over any working transport"
      },
      {
       "label": "Authenticate",
       "text": "Mutual certificate authentication with controllers over TLS or DTLS"
      },
      {
       "label": "Receive intent",
       "text": "Configuration template, policies and data-plane keys"
      },
      {
       "label": "Advertise",
       "text": "Its LAN prefixes and transport locators to the controllers"
      },
      {
       "label": "Build tunnels",
       "text": "IPsec to permitted peers on each transport; probes start immediately"
      }
     ]
    },
    {
     "type": "framework",
     "title": "Policy types",
     "items": [
      {
       "label": "CTRL",
       "title": "Control (topology) policy",
       "text": "Shapes which routes and transport locators each site receives: full mesh, hub-and-spoke, regional meshes, or service insertion."
      },
      {
       "label": "DATA",
       "title": "Data policy",
       "text": "Matches flows and sets actions: drop, NAT to local internet, steer to a service, set DSCP."
      },
      {
       "label": "AAR",
       "title": "Application-aware routing",
       "text": "Chooses tunnels per application based on live loss, latency and jitter versus an SLA class."
      },
      {
       "label": "QOS",
       "title": "QoS",
       "text": "Queuing and shaping per transport, often with per-tunnel shaping toward small sites."
      },
      {
       "label": "SEC",
       "title": "Security",
       "text": "Zone firewall, IPS, URL filtering, or redirection to cloud security for direct internet access."
      }
     ]
    },
    {
     "type": "cli",
     "title": "Live tunnel measurements against SLA classes",
     "device": "Edge E12 · SD-WAN edge CLI (generic)",
     "lines": [
      "E12# show overlay tunnel-sla remote-site HUB1",
      "Local-TLOC   Remote-TLOC  Loss%  Latency  Jitter  Meets SLA",
      "mpls         mpls         0.0    18 ms    2 ms    VOICE BUSINESS DEFAULT",
      "biz-inet     biz-inet     1.6    39 ms    17 ms   BUSINESS DEFAULT",
      "lte          biz-inet     0.4    71 ms    9 ms    BUSINESS DEFAULT",
      "E12# show overlay app-route policy VOICE",
      "SLA VOICE: loss <= 1%, latency <= 150 ms, jitter <= 30 ms",
      "Preferred colour: mpls  Backup: lte  Action if none meet: best-tunnel"
     ],
     "note": "biz-inet fails VOICE on loss, so voice uses mpls and would fail over to lte, not to the lossy internet path. Measurements are averaged over a configurable window, which sets how fast steering reacts."
    },
    {
     "type": "formula",
     "title": "Steering responsiveness",
     "items": [
      {
       "name": "Detection window",
       "expr": "probe interval × probes per bucket × buckets averaged",
       "meaning": "1 s probes, 60 per bucket and 6 buckets give a 6-minute rolling average: stable, but slow to react to brownouts."
      },
      {
       "name": "Tunnel liveness",
       "expr": "hello interval × multiplier",
       "meaning": "1 s × 7 = 7 s to declare a tunnel down; shorter values react faster but risk flaps on lossy links."
      }
     ]
    },
    {
     "type": "compare",
     "title": "Internet-bound traffic from branches",
     "columns": [
      {
       "title": "Backhaul to hub",
       "items": [
        "Central security stack and logging",
        "Adds latency and consumes hub bandwidth",
        "Poor experience for SaaS and video"
       ]
      },
      {
       "title": "Direct internet with on-box security",
       "items": [
        "Local firewall, IPS and URL filtering on the edge",
        "Low latency; security updated from the manager",
        "Edge sizing must include security throughput"
       ]
      },
      {
       "title": "Direct internet to cloud security",
       "items": [
        "Tunnels from edge to a cloud security service (SSE/SASE)",
        "Consistent policy for branch and remote users",
        "Choose the nearest point of presence and monitor it like a transport"
       ]
      }
     ]
    },
    {
     "type": "callout",
     "kind": "warning",
     "text": "Deep packet inspection may need several packets before it recognises an application, by which time the flow has already been placed on a path. Unless the platform uses first-packet techniques, such as learning from DNS responses or cached application-to-address mappings, the first flow of an application may stick to the default path. When testing steering policies, look at new flows after the cache is warm, not at the first connection.",
     "title": "Application identification is not instant"
    },
    {
     "type": "scenario",
     "title": "SaaS is slow at every branch",
     "situation": "A retailer's 300 branches send all internet traffic, including collaboration and SaaS, through two hub data centres for inspection. Users complain of slow SaaS and choppy video calls; hub internet links run at 85% at peak. Security requires consistent web filtering and threat inspection. What is the best design change?",
     "options": [
      {
       "text": "Double the hub internet bandwidth and keep backhauling all traffic so that security stays centralised.",
       "feedback": "This eases congestion but keeps the latency penalty for every SaaS session and scales cost with traffic.",
       "best": false
      },
      {
       "text": "Send all internet traffic directly from branches without inspection, because SaaS providers already secure their applications.",
       "feedback": "This violates the stated security requirement and exposes branches to threats.",
       "best": false
      },
      {
       "text": "Prioritise SaaS traffic in the hub QoS policy, so it is protected at the congested internet links.",
       "feedback": "QoS helps under congestion but does not remove the extra round trip through the hubs.",
       "best": false
      },
      {
       "text": "Use direct internet access for trusted SaaS and collaboration, steered by application-aware policy, with inspection by on-box security or a nearby cloud security service.",
       "feedback": "Correct. Breaking out locally removes the hub detour and congestion, while keeping inspection meets the security requirement.",
       "best": true
      }
     ]
    },
    {
     "type": "terms",
     "items": [
      {
       "term": "Transport locator",
       "def": "An SD-WAN tunnel endpoint on one transport, defined by addresses, colour and encapsulation."
      },
      {
       "term": "Colour",
       "def": "Label identifying a transport type, such as mpls, biz-inet or lte, used in policy."
      },
      {
       "term": "Application-aware routing",
       "def": "Per-application path selection based on measured loss, latency and jitter against SLA classes."
      },
      {
       "term": "SLA class",
       "def": "A set of loss, latency and jitter thresholds that a path must meet for an application."
      },
      {
       "term": "Zero-touch provisioning",
       "def": "Automatic onboarding of a new device using a hardware identity and a cloud discovery service."
      },
      {
       "term": "Direct internet access",
       "def": "Sending internet-bound traffic out of a local branch transport rather than backhauling it."
      },
      {
       "term": "SSE / SASE",
       "def": "Cloud-delivered security edge services, combined with SD-WAN in a secure access service edge architecture."
      },
      {
       "term": "Control policy",
       "def": "Policy that manipulates which routes and transport locators sites receive, shaping the overlay topology."
      }
     ]
    },
    {
     "type": "quiz",
     "items": [
      {
       "q": "An edge behind a NAT router must build tunnels to other edges. How does it learn its public transport address?",
       "options": [
        "From a static entry in its configuration template, which administrators must update for each site.",
        "From the IPsec peer, which sends its translated address after the first tunnel has been built.",
        "Through its sessions with the controllers, which observe the translated address and distribute it.",
        "From the DHCP server on the broadband link, which hands out the public address as an option."
       ],
       "answer": 2,
       "explain": "Controllers see the post-NAT address and advertise it in the transport locator, enabling NAT traversal. Static entries do not scale and the other mechanisms do not exist for this purpose."
      },
      {
       "q": "Voice must use MPLS while it meets the SLA, fail over to LTE, and never use internet broadband. Which policy type implements this?",
       "options": [
        "Control policy that removes internet broadband locators from every site's routing table.",
        "Application-aware routing with a VOICE SLA class, preferred colour MPLS and LTE as backup.",
        "Data policy that sets DSCP EF on voice so the underlay providers prioritise it.",
        "QoS policy that places voice in the priority queue on every transport interface."
       ],
       "answer": 1,
       "explain": "Application-aware routing selects paths per application against SLA thresholds. Control policy would remove broadband for all traffic; DSCP and queuing do not choose paths."
      },
      {
       "q": "Tunnel SLA averages are calculated over six minutes. Users report brief brownouts that steering never reacts to. What is the most direct adjustment?",
       "options": [
        "Lengthen the hello multiplier so tunnels stay up during brownouts and keep forwarding traffic.",
        "Raise the SLA thresholds so that the degraded path continues to meet the class during brownouts.",
        "Move the affected application into the default class so it is excluded from any SLA steering.",
        "Shorten the measurement window so averages react faster, accepting more frequent path changes."
       ],
       "answer": 3,
       "explain": "Long averaging windows smooth out short events. A higher multiplier or looser thresholds make steering even less sensitive, and removing the class abandons protection."
      },
      {
       "q": "What is the main architectural difference between a control policy and a data policy in SD-WAN?",
       "options": [
        "Control policy shapes the routes and locators sites learn; data policy acts on traffic flows themselves.",
        "Control policy runs on the edges only; data policy runs on the controllers and is never sent to the edges.",
        "Control policy applies to internet traffic only; data policy applies to traffic between branch sites.",
        "Control policy encrypts traffic; data policy chooses which encryption algorithm each tunnel uses."
       ],
       "answer": 0,
       "explain": "Control policy changes the topology by filtering or modifying route and locator advertisements; data policy matches packets and sets forwarding actions. Both are distributed from the control plane."
      },
      {
       "q": "A new edge cannot join the overlay and logs a certificate validation error to the controllers. Everything else, including internet reachability, works. What is most likely wrong?",
       "options": [
        "The edge's LAN routing protocol has not yet formed adjacencies with the local branch switches and routers.",
        "The edge's application-aware routing policy has no SLA class defined for the VOICE application.",
        "The edge's device certificate is not in the authorised device list or its trust chain is not accepted.",
        "The edge's LTE modem has no data plan, so it cannot provide a backup transport for the tunnels."
       ],
       "answer": 2,
       "explain": "Onboarding relies on mutual certificate authentication; a missing allow-list entry or chain problem stops it. LAN routing, SLA classes and backup transports come later."
      }
     ]
    }
   ]
  },
  {
   "id": "m6-l5",
   "title": "Migrating Legacy WANs and Data-Centre Networks",
   "subtitle": "Coexistence routing, loop prevention, gateway moves and cutover discipline",
   "minutes": 45,
   "objectives": [
    "Plan a phased migration from MPLS WAN to SD-WAN with safe coexistence routing.",
    "Prevent redistribution loops and suboptimal routing with tags, communities and preference.",
    "Migrate a Layer 2 data centre to an EVPN fabric, including the default-gateway move."
   ],
   "blocks": [
    {
     "type": "text",
     "text": "Most expert work is not greenfield. Migrations succeed when the old and new networks coexist safely for weeks or months, every site can reach every other site during the transition, and each step can be rolled back. The technical heart of both WAN and data-centre migrations is the same: a controlled **boundary** where routes and, sometimes, Layer 2 domains cross from old to new."
    },
    {
     "type": "steps",
     "title": "Phased WAN migration",
     "items": [
      {
       "title": "Discover",
       "text": "Inventory sites, transports, applications and current routing; baseline performance and peak utilisation."
      },
      {
       "title": "Design coexistence",
       "text": "Choose transit sites (usually hubs or data centres) that run both the legacy CE and an SD-WAN edge and will exchange routes."
      },
      {
       "title": "Pilot",
       "text": "Migrate a few representative sites; test failover, application steering and support processes."
      },
      {
       "title": "Wave migration",
       "text": "Move sites in waves by region; each wave has a cutover window, rollback plan and acceptance tests."
      },
      {
       "title": "Optimise and retire",
       "text": "Introduce direct internet access and new policies, then decommission legacy circuits once traffic is gone."
      }
     ]
    },
    {
     "type": "flow",
     "title": "Coexistence routing through a transit hub",
     "items": [
      {
       "label": "Legacy site",
       "text": "Advertises prefixes into the MPLS VPN"
      },
      {
       "label": "Hub CE",
       "text": "Learns them via eBGP from the provider PE"
      },
      {
       "label": "Hub boundary",
       "text": "Redistributes into the overlay with a 'from-legacy' tag or community"
      },
      {
       "label": "SD-WAN site",
       "text": "Reaches legacy sites via the hub edge"
      },
      {
       "label": "Reverse path",
       "text": "Overlay prefixes go to MPLS tagged 'from-overlay'; anything carrying that tag is never redistributed back"
      }
     ]
    },
    {
     "type": "cli",
     "title": "Loop-safe mutual redistribution at a hub",
     "device": "HUB-CE1 · IOS-style CLI",
     "lines": [
      "route-map OVERLAY-TO-MPLS deny 10",
      " match tag 65110",
      "route-map OVERLAY-TO-MPLS permit 20",
      " set community 65000:900 additive",
      "!",
      "ip community-list standard FROM-OVERLAY permit 65000:900",
      "route-map MPLS-TO-OVERLAY deny 10",
      " match community FROM-OVERLAY",
      "route-map MPLS-TO-OVERLAY permit 20",
      " set tag 65110",
      "!",
      "router bgp 65110",
      " address-family ipv4",
      "  redistribute ospf 1 route-map OVERLAY-TO-MPLS",
      "router ospf 1",
      " redistribute bgp 65110 route-map MPLS-TO-OVERLAY"
     ],
     "note": "In this design the SD-WAN edge peers with the hub CE over OSPF. Routes that came from MPLS are tagged 65110 entering OSPF and are refused on the way back; routes from the overlay carry community 65000:900 into MPLS and are refused if they ever return. This relies on the provider passing communities across the VPN; confirm it, or use another marker such as an AS-path filter."
    },
    {
     "type": "callout",
     "kind": "warning",
     "text": "With two transit hubs, a route can leave the overlay at hub A, cross the MPLS VPN and re-enter the overlay at hub B. Tags or communities must be applied consistently at both hubs, and the preference between the two worlds must be explicit: for example, prefer the overlay path for migrated sites by setting local preference or administrative distance, so a dual-connected hub never chooses a hairpin through the legacy cloud.",
     "title": "Two hubs double the risk"
    },
    {
     "type": "compare",
     "title": "Data-centre migration strategies",
     "columns": [
      {
       "title": "Gateway stays on legacy first",
       "items": [
        "Extend VLANs from legacy core into the fabric with a Layer 2 handoff on border leaves",
        "Move hosts rack by rack while routing stays on the old core",
        "Move the gateway last, per VLAN, in one maintenance window"
       ]
      },
      {
       "title": "Gateway moves to fabric early",
       "items": [
        "Anycast gateway on the fabric as soon as the VLAN is extended",
        "Legacy FHRP shut down for that VLAN at the same moment",
        "Hosts still on legacy hairpin through the Layer 2 link to the fabric gateway"
       ]
      }
     ]
    },
    {
     "type": "table",
     "title": "Data-centre migration risk register",
     "head": [
      "Risk",
      "Effect",
      "Mitigation"
     ],
     "rows": [
      [
       "Spanning-tree event on the Layer 2 extension",
       "Outage across both worlds",
       "Single logical link (bundle) to the fabric, BPDU guard and storm control at the border"
      ],
      [
       "Two active gateways for one VLAN",
       "Asymmetric routing, firewall drops",
       "Move gateway per VLAN in one change; disable legacy FHRP immediately"
      ],
      [
       "Stale ARP entries for the gateway MAC",
       "Hosts lose off-subnet reachability",
       "Reuse the legacy virtual MAC as anycast gateway MAC, or send gratuitous ARP"
      ],
      [
       "MTU mismatch on the extension",
       "Large frames dropped silently",
       "Verify jumbo end to end before moving storage or backup traffic"
      ],
      [
       "Missing firewall or load-balancer policies",
       "Applications fail after the gateway move",
       "Map every VLAN to its security policy before the cutover"
      ]
     ]
    },
    {
     "type": "case",
     "title": "Data-centre EVPN migration at a payments processor",
     "context": "A payments processor runs a ten-year-old three-tier data centre: two core switches with FHRP gateways for 140 VLANs, spanning tree everywhere and firewall clusters attached to the core. A new 24-leaf EVPN fabric with symmetric IRB, border leaves and an all-active ES toward the legacy core has been built. Regulators require no unplanned downtime for card-authorisation services and evidence that every change was tested. Hosts include bare-metal databases that cannot be re-addressed.",
     "questions": [
      "How do you connect the old and new worlds safely?",
      "In what order do you move hosts and gateways, and why?",
      "How do you avoid ARP problems when the gateway moves?",
      "What evidence would you collect for the regulator?"
     ],
     "answer": "Connect the legacy core to a pair of border leaves with a **single LACP bundle** forming one all-active Ethernet segment, so spanning tree sees one logical link; apply BPDU guard, storm control and an explicit VLAN allow-list, extending only VLANs in the current wave. Move **hosts first, gateways last**: migrate racks VLAN by VLAN while the legacy FHRP remains the gateway, so routing and firewall paths are unchanged during host moves. When all or most hosts of a VLAN are on the fabric, move its gateway in one change: shut the legacy FHRP and enable the anycast gateway. Configure the anycast gateway to answer for the **same virtual MAC** that the legacy FHRP used (or generate gratuitous ARP), so hosts and databases keep valid ARP entries and no re-addressing is needed. Insert firewalls on the border leaves as type-5 next hops before the first gateway move so security policy is identical. For evidence, run automated pre- and post-checks for each wave (MAC and ARP counts, gateway reachability, transaction test scripts, firewall session counts), store them with the change record, and rehearse the cutover and rollback in a lab with the same configuration templates."
    },
    {
     "type": "scenario",
     "title": "Hosts lose off-subnet reachability after a gateway move",
     "situation": "VLAN 140 is moved from the legacy FHRP gateway to the fabric's anycast gateway with the same IP address. Hosts in the VLAN can reach each other, but most cannot reach other subnets for several minutes; a few recovered immediately. The fabric uses its default anycast MAC, different from the legacy virtual MAC. What would have prevented this?",
     "options": [
      {
       "text": "Configuring the fabric to use the legacy virtual MAC for the VLAN's gateway, or sending gratuitous ARP at cutover.",
       "feedback": "Correct. Hosts kept the old gateway MAC in their ARP caches; with the same MAC, or an immediate gratuitous ARP update, they would have switched seamlessly.",
       "best": true
      },
      {
       "text": "Lowering the IGP timers on the border leaves so the new gateway is advertised to the rest of the fabric faster.",
       "feedback": "The routes were available; the hosts were sending frames to a MAC that no longer existed.",
       "best": false
      },
      {
       "text": "Moving the gateway before migrating any hosts, so that the fabric holds every ARP entry from the start.",
       "feedback": "Order does not change host ARP caches, which still point at the legacy MAC whenever the gateway moves.",
       "best": false
      },
      {
       "text": "Enabling ARP suppression on the VLAN so the fabric answers host ARP requests from its own tables.",
       "feedback": "Hosts were not ARPing; they used cached entries until they expired.",
       "best": false
      }
     ]
    },
    {
     "type": "checklist",
     "title": "Cutover readiness checklist",
     "items": [
      "Change scope limited to one wave of VLANs or sites with a written rollback",
      "Pre-checks captured: routes, MACs, ARP, sessions, application tests",
      "Boundary protections in place: tags or communities, BPDU guard, storm control",
      "Gateway MAC strategy agreed (reuse legacy MAC or gratuitous ARP)",
      "Security policies mapped and tested for every moved VLAN or site",
      "Monitoring dashboards and alert suppression windows prepared",
      "Post-checks identical to pre-checks and compared automatically",
      "Stakeholders informed and an explicit go or no-go point before each irreversible step"
     ]
    },
    {
     "type": "reflection",
     "prompt": "Pick a migration you have been part of or have watched. Where was the boundary between old and new, what protected it against loops and duplicate gateways, and what single extra check would most have reduced risk?"
    },
    {
     "type": "quiz",
     "items": [
      {
       "q": "During WAN migration, a prefix from an SD-WAN site appears in the overlay twice: once natively and once re-entering through the second hub from MPLS. What is the root cause?",
       "options": [
        "The SD-WAN controller cannot support more than one transit hub, so the second hub re-advertises everything.",
        "Routes redistributed into MPLS at one hub are not tagged or filtered when re-entering at the other hub.",
        "The MPLS provider changed the route distinguisher, which makes the prefix look like a new route.",
        "The SD-WAN site advertised the prefix with two transport locators, which doubles every route."
       ],
       "answer": 1,
       "explain": "Consistent tagging at every boundary is what stops re-entry. Controllers support multiple hubs, RDs are invisible to the customer, and multiple locators are one route with several next hops."
      },
      {
       "q": "Why do many data-centre migrations move hosts first and gateways last?",
       "options": [
        "Gateways cannot be configured on an EVPN fabric until every host in the VLAN has been migrated.",
        "Hosts must learn the fabric's router MAC before the gateway moves, or symmetric IRB will fail.",
        "Gateways moved first would require re-addressing every host, which the fabric cannot do automatically.",
        "Routing and security stay unchanged while hosts move, so each move is a low-risk Layer 2 change."
       ],
       "answer": 3,
       "explain": "Keeping the gateway in place isolates host moves from routing and firewall changes. Fabrics can host gateways anytime; hosts never need the router MAC; gateway moves do not require re-addressing."
      },
      {
       "q": "Which protection is most important on the Layer 2 link between a legacy core and a new fabric?",
       "options": [
        "A single logical bundle with BPDU guard and storm control, extending only the VLANs being migrated.",
        "Multiple independent links running spanning tree, so the legacy core can block the redundant ones.",
        "A routed link with no VLANs at all, because EVPN fabrics cannot extend Layer 2 to legacy switches.",
        "An extension of every VLAN at once, so that later waves do not need any further changes."
       ],
       "answer": 0,
       "explain": "One bundle avoids spanning-tree interaction, and limited VLANs limit the blast radius. Fabrics can extend VLANs to legacy switches, but extending everything at once maximises risk."
      },
      {
       "q": "In mutual redistribution at a hub, what does tagging routes from MPLS before they enter the overlay achieve?",
       "options": [
        "It marks their origin so they can be refused if they try to return to MPLS through any boundary.",
        "It sets their administrative distance so that the overlay always prefers them to native routes.",
        "It encrypts their attributes so that the MPLS provider cannot read customer routing information.",
        "It summarises them into a single route so the overlay receives fewer prefixes from the legacy WAN."
       ],
       "answer": 0,
       "explain": "Tags and communities record origin for loop prevention. They do not change distance by themselves, encrypt anything or summarise routes."
      },
      {
       "q": "What is the best evidence that a migration wave succeeded?",
       "options": [
        "A screenshot of the fabric dashboard showing all devices green at the end of the maintenance window.",
        "A statement from the engineer that no alarms were raised during the change and users did not complain.",
        "Automated post-checks that match the pre-check baseline, plus application tests, stored with the change.",
        "A count of BGP sessions that are up, compared with the number of sessions expected in the original design."
       ],
       "answer": 2,
       "explain": "Comparing post-checks with a baseline and testing applications proves function. Dashboards, absence of complaints and session counts are useful but incomplete."
      }
     ]
    }
   ]
  }
 ]
});
TRACK.modules.push({
 "id": "m7",
 "order": 7,
 "code": "Stream",
 "title": "Stream — Multicast and QoS",
 "subtitle": "Deliver one-to-many traffic reliably and give every class of traffic the treatment the business needs.",
 "outcomes": [
  "Build and explain PIM-SM operation from IGMP/MLD membership to shortest-path trees.",
  "Design RP placement and discovery with static, BSR and anycast RP, and choose SSM where it fits.",
  "Troubleshoot multicast quickly with RPF-centred, hop-by-hop methods.",
  "Apply classification, marking, queuing, policing, shaping and congestion avoidance correctly.",
  "Design and verify an end-to-end QoS policy for voice, video and business-critical applications."
 ],
 "lessons": [
  {
   "id": "m7-l1",
   "title": "Multicast Foundations: Group Management and PIM Sparse Mode",
   "subtitle": "How receivers signal interest, and how PIM-SM builds shared and shortest-path trees",
   "minutes": 45,
   "objectives": [
    "Explain IGMPv2/v3 and MLDv1/v2 operation, querier election and the role of snooping.",
    "Walk through PIM-SM joins, source registration and switchover to the shortest-path tree.",
    "Read multicast routing table entries and flags with confidence."
   ],
   "blocks": [
    {
     "type": "text",
     "text": "The **Stream** segment of the Mastery Ring covers traffic that is not simple unicast best effort: one-to-many multicast and differentiated treatment with QoS. Multicast powers IPTV, market-data feeds, video surveillance, software distribution and many industrial systems. It fails in ways unicast engineers find strange, because it is **receiver-driven** and every forwarding decision depends on a reverse-path check. This lesson builds the model; the next two cover rendezvous-point design and troubleshooting."
    },
    {
     "type": "layers",
     "title": "Multicast responsibilities by layer",
     "items": [
      {
       "label": "Application",
       "parts": [
        "Source sends to group G; receivers open sockets for G or (S,G)"
       ]
      },
      {
       "label": "Host signalling",
       "parts": [
        "IGMP (IPv4) or MLD (IPv6) between receivers and the last-hop router"
       ]
      },
      {
       "label": "Layer 2 optimisation",
       "parts": [
        "IGMP/MLD snooping limits flooding to ports with receivers or routers"
       ]
      },
      {
       "label": "Routing",
       "parts": [
        "PIM builds distribution trees between routers using the unicast RIB for RPF"
       ]
      },
      {
       "label": "Inter-domain",
       "parts": [
        "MSDP shares active sources between RPs; multiprotocol BGP can carry RPF routes"
       ]
      }
     ]
    },
    {
     "type": "table",
     "title": "Group management versions",
     "head": [
      "Protocol",
      "Key behaviour",
      "Expert notes"
     ],
     "rows": [
      [
       "IGMPv2",
       "Joins and leaves per group; group-specific query on leave",
       "Lowest IP address on the segment becomes querier"
      ],
      [
       "IGMPv3",
       "Source filtering: INCLUDE or EXCLUDE lists; reports sent to 224.0.0.22",
       "Required for SSM; enables explicit tracking and fast leave"
      ],
      [
       "MLDv1",
       "IPv6 equivalent of IGMPv2, carried in ICMPv6",
       "Uses link-local addresses; same querier logic"
      ],
      [
       "MLDv2",
       "IPv6 equivalent of IGMPv3 with source filtering",
       "Required for IPv6 SSM"
      ],
      [
       "Snooping",
       "Switch inspects reports to build per-port group membership",
       "Needs a querier on the VLAN, or memberships time out"
      ]
     ]
    },
    {
     "type": "flow",
     "title": "PIM-SM from first packet to shortest-path tree",
     "items": [
      {
       "label": "Receiver joins",
       "text": "Last-hop router (receiver DR) gets an IGMP report and sends (*,G) join toward the RP"
      },
      {
       "label": "Source registers",
       "text": "First-hop router (source DR) encapsulates packets in unicast register messages to the RP"
      },
      {
       "label": "RP joins source",
       "text": "RP sends (S,G) join toward the source, then a register-stop once native traffic arrives"
      },
      {
       "label": "Shared tree",
       "text": "Traffic flows source to RP to receivers along the (*,G) tree"
      },
      {
       "label": "SPT switchover",
       "text": "Last-hop router joins (S,G) toward the source and prunes S from the shared tree"
      }
     ]
    },
    {
     "type": "cli",
     "title": "Enabling PIM-SM with a static RP",
     "device": "R3 · IOS-style CLI",
     "lines": [
      "ip multicast-routing",
      "ip pim rp-address 10.255.0.100",
      "!",
      "interface GigabitEthernet0/0",
      " description to core",
      " ip pim sparse-mode",
      "!",
      "interface Vlan20",
      " description receivers",
      " ip address 10.20.0.1 255.255.255.0",
      " ip pim sparse-mode",
      " ip pim dr-priority 200",
      " ip igmp version 3"
     ],
     "note": "PIM must be enabled on every interface along the path, including the RP's loopback where it lives. DR priority makes the intended router the designated router on the receiver VLAN."
    },
    {
     "type": "cli",
     "title": "Reading the multicast routing table",
     "device": "R3 · IOS-style CLI",
     "lines": [
      "R3# show ip mroute 239.1.1.1",
      "(*, 239.1.1.1), 00:12:01/stopped, RP 10.255.0.100, flags: SJC",
      "  Incoming interface: GigabitEthernet0/0, RPF nbr 10.1.23.2",
      "  Outgoing interface list:",
      "    Vlan20, Forward/Sparse, 00:12:01/00:02:41",
      "(10.50.0.5, 239.1.1.1), 00:11:58/00:02:57, flags: JT",
      "  Incoming interface: GigabitEthernet0/1, RPF nbr 10.1.13.1",
      "  Outgoing interface list:",
      "    Vlan20, Forward/Sparse, 00:11:58/00:02:41"
     ],
     "note": "S = sparse, J = join SPT, C = connected receiver, T = traffic flowing on the shortest-path tree. The (S,G) entry has a different incoming interface from the (*,G) entry because the source path does not run through the RP."
    },
    {
     "type": "table",
     "title": "Common mroute flags",
     "head": [
      "Flag",
      "Meaning"
     ],
     "rows": [
      [
       "S",
       "Sparse mode entry"
      ],
      [
       "C",
       "Directly connected receiver (IGMP/MLD membership)"
      ],
      [
       "L",
       "Local: the router itself joined the group"
      ],
      [
       "J",
       "Join to SPT triggered for this group"
      ],
      [
       "T",
       "SPT bit: traffic is arriving on the shortest-path tree"
      ],
      [
       "P",
       "Pruned: no outgoing interfaces"
      ],
      [
       "F",
       "Register flag: this router is registering a directly connected source"
      ],
      [
       "R",
       "RP bit: (S,G) entry pruned off the shared tree"
      ],
      [
       "A",
       "Candidate for MSDP advertisement"
      ]
     ]
    },
    {
     "type": "callout",
     "kind": "insight",
     "text": "Two PIM roles on a multi-access segment are often confused. The **DR**, elected by priority then highest IP, sends joins for receivers and registers for sources on that segment. The **assert winner** is decided only when two routers both forward the same flow onto a segment: the router with the better administrative distance and then metric to the source wins, and the loser prunes. Traffic arriving in duplicates on a receiver LAN for a second or two is often an assert, not a loop.",
     "title": "Asserts and designated routers on shared segments"
    },
    {
     "type": "scenario",
     "title": "Receivers on a VLAN lose the stream every few minutes",
     "situation": "Receivers on an access VLAN join group 239.10.10.10 and watch video for a few minutes, then the stream stops until they rejoin. The VLAN has IGMP snooping enabled on the switches but the router interface for the VLAN was moved to a different switch stack, and no PIM router is now attached to the VLAN. What is the best fix?",
     "options": [
      {
       "text": "Lower the PIM hello interval on the core routers so that the multicast tree is refreshed more frequently.",
       "feedback": "PIM hellos maintain neighbourships between routers; they do not refresh host memberships on a snooping switch.",
       "best": false
      },
      {
       "text": "Enable an IGMP snooping querier on the VLAN or restore a router interface, so general queries keep memberships refreshed.",
       "feedback": "Correct. Without a querier, snooping memberships age out because hosts only re-report in response to queries, so the switch stops forwarding.",
       "best": true
      },
      {
       "text": "Disable IGMP snooping on the switches so the stream is flooded to every port in the VLAN at all times.",
       "feedback": "Flooding would hide the symptom at a high cost and is unacceptable for video bandwidth on access ports.",
       "best": false
      },
      {
       "text": "Configure a static RP on the access switches so they can build the shared tree for the VLAN themselves.",
       "feedback": "Layer 2 switches do not build PIM trees; the problem is the missing querier.",
       "best": false
      }
     ]
    },
    {
     "type": "terms",
     "items": [
      {
       "term": "IGMP / MLD",
       "def": "Protocols hosts use to report multicast group membership to the local router, for IPv4 and IPv6 respectively."
      },
      {
       "term": "Querier",
       "def": "The router or switch that sends general queries on a segment; with IGMP the lowest IP address wins."
      },
      {
       "term": "IGMP snooping",
       "def": "A switch feature that forwards multicast only to ports where membership reports or routers were seen."
      },
      {
       "term": "Designated router (DR)",
       "def": "The PIM router on a segment that sends joins for receivers and registers for sources."
      },
      {
       "term": "Rendezvous point (RP)",
       "def": "The root of the shared tree where sources and receivers first meet in PIM-SM."
      },
      {
       "term": "Shared tree",
       "def": "The (*,G) distribution tree rooted at the RP."
      },
      {
       "term": "Shortest-path tree",
       "def": "The (S,G) distribution tree rooted at the source's first-hop router."
      },
      {
       "term": "Register message",
       "def": "Unicast encapsulation of multicast packets from the source DR to the RP until native forwarding begins."
      },
      {
       "term": "Assert",
       "def": "PIM election that removes duplicate forwarders onto a shared segment."
      }
     ]
    },
    {
     "type": "quiz",
     "items": [
      {
       "q": "Why does the last-hop router normally switch from the shared tree to the shortest-path tree?",
       "options": [
        "To stop the RP from sending register-stop messages toward the first-hop router.",
        "To allow IGMPv2 receivers to join source-specific channels without upgrading to IGMPv3.",
        "To reduce the number of PIM neighbours it must maintain on its upstream interfaces.",
        "To receive traffic on the most direct path from the source instead of through the RP."
       ],
       "answer": 3,
       "explain": "SPT switchover optimises the path and offloads the RP. Register-stop is between RP and source DR, IGMP version is unrelated, and neighbour count does not change."
      },
      {
       "q": "An (S,G) entry shows flags 'JT' and an (*,G) entry shows 'SJC'. What is happening?",
       "options": [
        "The router is registering a local source, and the RP has not yet sent a register-stop.",
        "A connected receiver joined, and traffic for S now arrives on the shortest-path tree.",
        "The entry is pruned, and the router is waiting for the RP to send a fresh join for it.",
        "The router is the RP, and it is forwarding encapsulated register messages to the receivers."
       ],
       "answer": 1,
       "explain": "C indicates a connected receiver; J and T mean SPT join and traffic on the SPT. Registering would show F, pruned would show P."
      },
      {
       "q": "Which IGMP version must receivers use to join a source-specific (S,G) channel without any translation on the router?",
       "options": [
        "IGMPv2, because leave messages identify the source the host wants to leave.",
        "IGMPv1, because its reports are sent to the group address and carry the source.",
        "Any version, because the router derives the source from the unicast routing table.",
        "IGMPv3, because it carries INCLUDE source lists in membership reports."
       ],
       "answer": 3,
       "explain": "Only IGMPv3 (and MLDv2 for IPv6) can express a source. Earlier versions are group-only; some routers offer mapping for legacy hosts, but that is a translation."
      },
      {
       "q": "Two routers on a receiver LAN both forward the same (S,G) stream for a moment, then one stops. Which mechanism caused this?",
       "options": [
        "The DR election, which is repeated whenever duplicate traffic is seen on the LAN segment.",
        "The PIM assert process, which elects a single forwarder based on distance and metric to the source.",
        "The IGMP querier election, which decides which router forwards each group to the segment.",
        "The SPT switchover, which always produces duplicates until the RP sends a prune message."
       ],
       "answer": 1,
       "explain": "Asserts resolve duplicate forwarders. DR election uses priority and IP and is not triggered by duplicates; the querier controls queries, not forwarding."
      },
      {
       "q": "Where is the RP address needed in a static-RP PIM-SM design?",
       "options": [
        "On every PIM router that may serve receivers or sources, so each can join or register to it.",
        "Only on the RP itself, because other routers learn its address from PIM hello messages.",
        "Only on first-hop routers, because last-hop routers always build shortest-path trees directly.",
        "Only on the receivers, because IGMP reports carry the RP address to the last-hop router."
       ],
       "answer": 0,
       "explain": "With static RP every relevant router needs the mapping. PIM hellos do not carry RP information, last-hop routers initially join toward the RP, and hosts never know the RP."
      }
     ]
    }
   ]
  },
  {
   "id": "m7-l2",
   "title": "RP Design: Static, BSR, Anycast RP and SSM",
   "subtitle": "Placing and discovering rendezvous points, making them redundant, or removing them entirely",
   "minutes": 45,
   "objectives": [
    "Compare static RP, BSR, anycast RP with MSDP or PIM, and embedded RP.",
    "Configure anycast RP with MSDP and verify that active sources are shared.",
    "Design SSM services and decide when SSM is the better answer."
   ],
   "blocks": [
    {
     "type": "text",
     "text": "The RP is the meeting place of PIM sparse mode, so its placement, discovery and redundancy decide how a multicast network behaves under failure. An expert can configure every option, but more importantly can say which one fits: some networks need dynamic discovery, some need sub-second RP failover, and many modern services need no RP at all because they use **source-specific multicast (SSM)**."
    },
    {
     "type": "table",
     "title": "RP discovery and redundancy options",
     "head": [
      "Option",
      "How routers learn the RP",
      "Redundancy",
      "Best fit"
     ],
     "rows": [
      [
       "Static RP",
       "Configured on every router",
       "Only with anycast addressing",
       "Small or tightly automated networks"
      ],
      [
       "BSR (RFC 5059)",
       "Elected bootstrap router floods the RP set hop by hop; routers hash groups to RPs",
       "Multiple candidate RPs and BSRs; failover takes seconds",
       "Multi-vendor networks needing dynamic RP sets"
      ],
      [
       "Anycast RP with MSDP",
       "Same RP address on several routers (static or BSR advertised)",
       "Unicast routing picks the nearest RP; failover at IGP speed",
       "Enterprise and provider IPv4 networks"
      ],
      [
       "Anycast RP with PIM (RFC 4610)",
       "Same as above, sources shared by PIM register forwarding",
       "As above, without MSDP",
       "Networks that also need IPv6 anycast RP"
      ],
      [
       "Embedded RP (IPv6)",
       "RP address encoded in the group address",
       "Depends on the RP address chosen",
       "IPv6 inter-domain ASM without configuration"
      ]
     ]
    },
    {
     "type": "flow",
     "title": "Anycast RP with MSDP in action",
     "items": [
      {
       "label": "Shared address",
       "text": "RP1 and RP2 both own 10.255.0.100/32 on a loopback, advertised in the IGP"
      },
      {
       "label": "Nearest RP",
       "text": "Each first- and last-hop router reaches the closest instance of 10.255.0.100"
      },
      {
       "label": "Source registers",
       "text": "A source near RP1 registers to RP1 only"
      },
      {
       "label": "SA exchange",
       "text": "RP1 sends an MSDP source-active message to RP2 over a TCP 639 session using unique addresses"
      },
      {
       "label": "Join source",
       "text": "RP2, which has receivers, joins (S,G) toward the source; traffic flows"
      }
     ]
    },
    {
     "type": "cli",
     "title": "Anycast RP pair with MSDP",
     "device": "RP1 · IOS-style CLI",
     "lines": [
      "interface Loopback0",
      " description unique router ID",
      " ip address 10.255.0.11 255.255.255.255",
      "interface Loopback100",
      " description anycast RP address",
      " ip address 10.255.0.100 255.255.255.255",
      " ip pim sparse-mode",
      "!",
      "ip pim rp-address 10.255.0.100",
      "ip msdp peer 10.255.0.12 connect-source Loopback0",
      "ip msdp originator-id Loopback0",
      "!",
      "RP1# show ip msdp sa-cache",
      "MSDP Source-Active Cache - 2 entries",
      "(10.50.0.5, 239.1.1.1), RP 10.255.0.12, AS ?, 00:04:11/00:05:39, Peer 10.255.0.12"
     ],
     "note": "The MSDP session and the originator ID must use the unique loopback; if SA messages named the shared anycast address as their RP, the receiving RP would see its own address as the originator, peer-RPF checks would fail and the SAs would be discarded. The SA cache entry proves RP2 is telling RP1 about a source registered at RP2."
    },
    {
     "type": "callout",
     "kind": "warning",
     "text": "On any router holding the anycast RP address, make sure the IGP, BGP and PIM router IDs do not choose the anycast loopback. Two routers with the same OSPF router ID cause adjacency failures or flapping that look unrelated to multicast. Configure router IDs explicitly on every RP.",
     "title": "The router ID trap"
    },
    {
     "type": "compare",
     "title": "Any-source versus source-specific multicast",
     "columns": [
      {
       "title": "ASM (PIM-SM with RP)",
       "items": [
        "Receivers join (*,G) without knowing the source",
        "Needs RP placement, discovery and redundancy",
        "Register and SPT switchover add complexity",
        "Supports many-to-many applications such as some discovery protocols"
       ]
      },
      {
       "title": "SSM",
       "items": [
        "Receivers join (S,G) with IGMPv3 or MLDv2",
        "No RP, no registers, no shared tree",
        "Default range 232.0.0.0/8 and ff3x::/32",
        "Ideal for IPTV, market data and one-to-many video"
       ]
      }
     ]
    },
    {
     "type": "cli",
     "title": "Enabling SSM",
     "device": "R3 · IOS-style CLI",
     "lines": [
      "ip pim ssm default",
      "!",
      "interface Vlan20",
      " ip pim sparse-mode",
      " ip igmp version 3",
      "!",
      "R3# show ip mroute 232.1.1.1",
      "(10.50.0.5, 232.1.1.1), 00:03:20/00:02:51, flags: sTI",
      "  Incoming interface: GigabitEthernet0/1, RPF nbr 10.1.13.1",
      "  Outgoing interface list:",
      "    Vlan20, Forward/Sparse, 00:03:20/00:02:39"
     ],
     "note": "Lowercase s marks an SSM entry and I indicates an IGMPv3 source-specific report. There is no (*,G) entry and no RP for 232.0.0.0/8."
    },
    {
     "type": "framework",
     "title": "RP placement principles",
     "items": [
      {
       "label": "TOP",
       "title": "Central in the topology",
       "text": "Place RPs where they are close, in IGP terms, to most sources and receivers to keep shared trees short."
      },
      {
       "label": "PAIR",
       "title": "Always redundant",
       "text": "At least two anycast RPs in different failure domains."
      },
      {
       "label": "ROLE",
       "title": "Dedicated control role",
       "text": "RPs should not be on a congested edge; register decapsulation and state must not compete with heavy data forwarding."
      },
      {
       "label": "SCOP",
       "title": "Scoped groups",
       "text": "Use administratively scoped groups (239.0.0.0/8) per region with boundaries, so local streams stay local."
      },
      {
       "label": "SSM",
       "title": "Prefer SSM where possible",
       "text": "Every flow moved to SSM is a flow that no longer depends on RP health."
      }
     ]
    },
    {
     "type": "scenario",
     "title": "Choosing a design for a broadcast video service",
     "situation": "A broadcaster will deliver 400 live channels from two encoder sites to 3,000 set-top boxes over its own network. Set-top boxes support IGMPv3, the source addresses are known and fixed, and leadership wants the simplest design with the fewest failure points. What should you recommend?",
     "options": [
      {
       "text": "ASM with a single static RP placed in the primary data centre close to both encoder sites.",
       "feedback": "A single RP is a single point of failure and adds register and shared-tree complexity that this service does not need.",
       "best": false
      },
      {
       "text": "ASM with anycast RP and MSDP across both encoder sites, using BSR to advertise the RP address.",
       "feedback": "This is redundant but far more complex than necessary when receivers can join (S,G) directly.",
       "best": false
      },
      {
       "text": "SSM with IGMPv3, so each box joins (S,G) channels and no RP is required.",
       "feedback": "Correct. Known fixed sources and IGMPv3 support make SSM the simplest and most robust design, with no RP to place, protect or troubleshoot.",
       "best": true
      },
      {
       "text": "Dense mode, because every set-top box should receive every channel at all times anyway.",
       "feedback": "Dense mode floods and prunes, wasting bandwidth; boxes watch only one or two channels at a time.",
       "best": false
      }
     ]
    },
    {
     "type": "terms",
     "items": [
      {
       "term": "BSR",
       "def": "Bootstrap router: an elected router that floods the set of candidate RPs to all PIM routers."
      },
      {
       "term": "Candidate RP",
       "def": "A router that offers itself to the BSR as an RP for a range of groups."
      },
      {
       "term": "Anycast RP",
       "def": "Several RPs sharing one address so unicast routing selects the nearest and provides failover."
      },
      {
       "term": "MSDP",
       "def": "Multicast Source Discovery Protocol: shares active-source information between RPs over TCP 639."
      },
      {
       "term": "Source-active message",
       "def": "MSDP announcement that a source is actively sending to a group via a given RP."
      },
      {
       "term": "SSM",
       "def": "Source-specific multicast: receivers join (S,G) channels directly; no RP is used."
      },
      {
       "term": "Embedded RP",
       "def": "IPv6 technique that encodes the RP address inside the multicast group address."
      },
      {
       "term": "Administrative scoping",
       "def": "Use of 239.0.0.0/8 groups with boundaries so streams stay inside a region or organisation."
      }
     ]
    },
    {
     "type": "quiz",
     "items": [
      {
       "q": "Two anycast RPs share 10.255.0.100. A source registers with RP1, but receivers near RP2 get nothing. What is the most likely missing piece?",
       "options": [
        "A BSR election, so that both RPs agree which of them is responsible for the group range.",
        "A higher DR priority on the receiver VLAN, so that joins are sent to RP1 instead of RP2.",
        "Source sharing between the RPs, through MSDP or PIM anycast RP, so RP2 learns about the source.",
        "A static mroute on RP2 pointing to RP1, so the shared tree is rooted at RP1 for all groups."
       ],
       "answer": 2,
       "explain": "Anycast RP splits sources between RP instances; without source-active sharing each RP sees only its own sources. BSR, DR priority and static mroutes do not share source information."
      },
      {
       "q": "Why must the MSDP originator ID on an anycast RP be a unique address rather than the anycast address?",
       "options": [
        "MSDP peers cannot establish TCP sessions to an address that is configured on more than one router in the same AS.",
        "SA messages name the originating RP; a shared address looks self-originated, fails peer-RPF and is discarded.",
        "The anycast address is reserved for IGMP and cannot be used by any routing protocol that runs on the RP.",
        "The originator ID is used as the BSR priority, and identical values would cause a BSR election loop."
       ],
       "answer": 1,
       "explain": "SA messages carry the originating RP address; an SA claiming RP 10.255.0.100 looks like RP2's own advertisement and is discarded. Unique addresses are also used for the TCP session itself; the other options describe behaviours that do not exist."
      },
      {
       "q": "Which statement about SSM is correct?",
       "options": [
        "SSM uses the RP only for the first packet and then switches to the shortest-path tree immediately.",
        "SSM requires MSDP between domains, because each domain must learn the active sources from peers.",
        "SSM builds only (S,G) trees and needs no RP; receivers must signal the source with IGMPv3 or MLDv2.",
        "SSM works with any IGMP version because routers derive the source from the group address itself."
       ],
       "answer": 2,
       "explain": "SSM removes the RP entirely and depends on source-aware membership. MSDP is an ASM tool; legacy IGMP needs explicit mapping configuration."
      },
      {
       "q": "An RP pair runs OSPF, and after anycast RP was configured the two RPs started flapping their OSPF adjacencies with neighbours. What is the most likely cause?",
       "options": [
        "Both RPs selected the anycast loopback as OSPF router ID, creating a duplicate router ID.",
        "MSDP sessions consume the OSPF hello packets and cause dead-timer expiry on the RPs.",
        "PIM sparse mode on the anycast loopback disables OSPF on that interface automatically.",
        "BSR messages flood the anycast address into OSPF as a type-5 external route every minute."
       ],
       "answer": 0,
       "explain": "Router IDs are often chosen from the highest loopback; a shared anycast /32 then becomes a duplicate RID. Configure router IDs explicitly. The other explanations do not occur."
      },
      {
       "q": "When is BSR a better choice than static RP configuration?",
       "options": [
        "When the network needs SSM, because BSR advertises the 232.0.0.0/8 range to every receiver.",
        "When sources are in another AS, because BSR exchanges active source information between domains.",
        "When the RP must be selected per receiver, because BSR runs inside IGMP membership reports.",
        "When a multi-vendor network needs RP sets to change dynamically without touching every router."
       ],
       "answer": 3,
       "explain": "BSR distributes candidate RPs automatically. SSM needs no RP, inter-domain source exchange is MSDP's job, and BSR does not involve IGMP."
      }
     ]
    }
   ]
  },
  {
   "id": "m7-l3",
   "title": "Multicast Troubleshooting: RPF and Beyond",
   "subtitle": "A source-to-receiver method that finds the broken link in minutes",
   "minutes": 40,
   "objectives": [
    "Explain the RPF check and diagnose RPF failures caused by asymmetric routing.",
    "Apply a structured troubleshooting sequence from receiver to source.",
    "Fix RPF problems with the least disruptive tool: IGP change, static mroute or multicast BGP."
   ],
   "blocks": [
    {
     "type": "text",
     "text": "Most multicast outages reduce to one of a handful of causes: no membership, no PIM neighbour, no RP mapping, a failed RPF check, a TTL or filter problem at the source, or a boundary dropping the group. The method below works hop by hop from the receiver toward the source, because each router's state tells you what it believes about the next upstream hop."
    },
    {
     "type": "callout",
     "kind": "definition",
     "text": "A router accepts a multicast packet only if it arrives on the interface the router would use to send unicast traffic **back to the source** (for (S,G)) or **to the RP** (for (*,G)). The lookup uses the unicast RIB, or a separate multicast RIB when one is populated by static mroutes or multicast BGP. Packets that fail the check are dropped silently, which prevents loops but also makes asymmetric routing invisible until you look.",
     "title": "Reverse path forwarding (RPF) check"
    },
    {
     "type": "flow",
     "title": "Troubleshooting from receiver to source",
     "items": [
      {
       "label": "Membership",
       "text": "Does the last-hop router show the group (and source) from the receiver? Is a querier present?"
      },
      {
       "label": "Last-hop state",
       "text": "Is there a (*,G) or (S,G) with the receiver interface in the outgoing list?"
      },
      {
       "label": "RPF and neighbours",
       "text": "What is the RPF interface and neighbour, and is that neighbour a PIM neighbour?"
      },
      {
       "label": "Walk upstream",
       "text": "Repeat on the RPF neighbour until you reach the RP or first-hop router"
      },
      {
       "label": "Source side",
       "text": "Is the source sending, with sufficient TTL, and is the first-hop router registering or forwarding?"
      },
      {
       "label": "Boundaries and filters",
       "text": "Check scoped boundaries, ACLs, and rate limits along the path"
      }
     ]
    },
    {
     "type": "cli",
     "title": "Finding an RPF failure",
     "device": "R5 · IOS-style CLI",
     "lines": [
      "R5# show ip rpf 10.50.0.5",
      "RPF information for ? (10.50.0.5)",
      "  RPF interface: GigabitEthernet0/2",
      "  RPF neighbor: ? (10.1.56.6)",
      "  RPF route/mask: 10.50.0.0/16",
      "  RPF type: unicast (ospf 1)",
      "R5# show ip pim neighbor GigabitEthernet0/2",
      "PIM Neighbor Table",
      "Neighbor Address  Interface   Uptime/Expires  Ver  DR Prio/Mode",
      "R5# show ip mroute 10.50.0.5 239.1.1.1 count",
      "  Source: 10.50.0.5/32, Forwarding: 0/0/0/0, Other: 4183/4183/0"
     ],
     "note": "The unicast path to the source now points out Gi0/2, where no PIM neighbour exists, so R5 sends its join into nowhere. 'Other' counters equal to total packets mean every packet arriving on the old interface fails RPF and is dropped."
    },
    {
     "type": "table",
     "title": "Fixing RPF problems",
     "head": [
      "Tool",
      "How it works",
      "Use when"
     ],
     "rows": [
      [
       "Enable PIM on the new path",
       "Make the unicast path multicast-capable",
       "The unicast change is intended and the link should carry multicast"
      ],
      [
       "Static mroute",
       "Overrides the RPF interface for a source prefix, in the multicast RIB only",
       "A small, stable exception such as a tunnel or a one-off asymmetric link"
      ],
      [
       "Multicast BGP (IPv4 multicast SAFI)",
       "Carries separate RPF routes in BGP",
       "Large or inter-domain designs that need multicast paths to differ from unicast"
      ],
      [
       "IGP metric change",
       "Aligns unicast with the multicast-capable path",
       "Unicast and multicast should share the same topology anyway"
      ]
     ]
    },
    {
     "type": "cli",
     "title": "Two RPF fixes, IOS-style",
     "device": "R5 · IOS-style CLI",
     "lines": [
      "! Option 1: make the new unicast path multicast-capable",
      "interface GigabitEthernet0/2",
      " ip pim sparse-mode",
      "! Option 2: keep multicast on the old path for this source",
      "ip mroute 10.50.0.0 255.255.0.0 10.1.35.3",
      "R5# show ip rpf 10.50.0.5",
      "  RPF interface: GigabitEthernet0/1",
      "  RPF neighbor: ? (10.1.35.3)",
      "  RPF type: multicast (static)"
     ],
     "note": "Prefer option 1 when the topology change is permanent. A static mroute is invisible to unicast routing, so document it, or it will confuse the next engineer."
    },
    {
     "type": "table",
     "title": "Quick fault catalogue",
     "head": [
      "Symptom",
      "Likely cause",
      "Check"
     ],
     "rows": [
      [
       "Receivers on the source's own VLAN get traffic, nobody else does",
       "Source TTL of 1",
       "Capture at the first-hop router: TTL field of the stream"
      ],
      [
       "(*,G) exists, no (S,G) anywhere",
       "Registers not reaching or not accepted by RP",
       "RP mapping on the first-hop router; register path and filters"
      ],
      [
       "Stream works through the RP but stops after SPT switchover",
       "RPF toward the source fails on the SPT path",
       "show ip rpf for the source on the last-hop router"
      ],
      [
       "Some groups fail, others in the same range work",
       "Different RP mapping per group or scoped boundary",
       "RP mapping for each group; boundary ACLs"
      ],
      [
       "Stream stops every few minutes on a VLAN",
       "No querier; snooping memberships expire",
       "Querier status on the VLAN"
      ]
     ]
    },
    {
     "type": "case",
     "title": "An IPTV outage after a core upgrade",
     "context": "A regional operator delivers 220 IPTV channels with SSM from head-end encoders in 10.50.0.0/16. Overnight, a new 400G link was added between two core routers, C2 and C5, and IS-IS metrics were tuned to move unicast traffic onto it. By morning, 40% of subscribers, all behind aggregation routers fed by C5, have no TV, while internet service is fine. On C5, show ip mroute for a channel shows the (S,G) with incoming interface Null and the RPF neighbour as C2's address on the new link. The change ticket listed only IS-IS and interface configuration.",
     "questions": [
      "What is the root cause?",
      "Why is internet service unaffected?",
      "What is the immediate fix, and what is the permanent fix?",
      "What process change prevents a repeat?"
     ],
     "answer": "The new C2-C5 link carries the unicast best path to the encoders, so C5's RPF interface for 10.50.0.0/16 moved onto it, but **PIM was not enabled on the new interfaces**. C5 sends (S,G) joins toward C2 on a link with no PIM neighbour, nothing is built, and the entry shows a Null incoming interface. Unicast does not need PIM, so internet traffic simply follows the new path. The immediate fix is to enable PIM sparse mode on both ends of the new link (fast and aligned with the intended design); if that cannot happen within the window, temporarily restore the old IS-IS metrics or add a static mroute on C5 for 10.50.0.0/16 via the old path. The permanent fix is the PIM configuration plus verification that BFD and any multicast boundaries are consistent. For prevention, add multicast to the standard link-addition template, include 'PIM neighbour up and RPF check for head-end prefixes' in automated post-checks, and monitor a sample of channels end to end so a loss of joins raises an alarm within minutes, not at breakfast."
    },
    {
     "type": "scenario",
     "title": "Only the source's own subnet receives the stream",
     "situation": "A new trading application sends market data to 239.20.1.1. Receivers on the same VLAN as the source receive it; receivers elsewhere, with correct joins and PIM state up to the RP, receive nothing. The RP shows no (S,G) and no registers from the first-hop router. What should you check first?",
     "options": [
      {
       "text": "The IGMP version on the receiver VLANs, because IGMPv2 receivers cannot join groups in the 239.0.0.0/8 range.",
       "feedback": "IGMPv2 can join any ASM group, and the receivers' joins are already present up to the RP.",
       "best": false
      },
      {
       "text": "The MSDP sessions between the RPs, because the RP will not accept registers until MSDP is established.",
       "feedback": "Registers do not depend on MSDP, and the RP saw no register attempts at all.",
       "best": false
      },
      {
       "text": "The SPT threshold on the last-hop routers, because switching to the shortest-path tree too early drops the stream.",
       "feedback": "SPT switchover requires traffic to arrive first; here no traffic ever leaves the source subnet.",
       "best": false
      },
      {
       "text": "The TTL of the multicast packets leaving the source, because an application default of 1 stops routing at the first hop.",
       "feedback": "Correct. A TTL of 1 means the first-hop router cannot forward or register the packets, which matches every symptom including local delivery.",
       "best": true
      }
     ]
    },
    {
     "type": "checklist",
     "title": "Multicast troubleshooting checklist",
     "items": [
      "Identify group, source, receivers and the expected service model (ASM or SSM)",
      "Verify membership and querier on the receiver segment",
      "Verify (*,G) and (S,G) state and the outgoing interface list on the last-hop router",
      "Check RPF interface and neighbour for the source and the RP on each hop",
      "Confirm PIM neighbours on every RPF interface",
      "Confirm consistent RP mapping for the group on all routers (ASM)",
      "Confirm the source is sending with an adequate TTL and the first-hop router is registering or forwarding",
      "Check boundaries, ACLs and rate limits along the path"
     ]
    },
    {
     "type": "quiz",
     "items": [
      {
       "q": "A router receives (S,G) traffic on Gi0/1 but its unicast route to S points out Gi0/2. What happens and why?",
       "options": [
        "The packets are forwarded normally, because RPF applies only to traffic on the shared tree from the RP.",
        "The packets are forwarded and an assert is sent on Gi0/2 to move the source traffic to that interface.",
        "The packets fail the RPF check and are dropped, because they arrive on an interface not used to reach S.",
        "The packets are re-encapsulated as registers and sent to the RP, which forwards them down the shared tree."
       ],
       "answer": 2,
       "explain": "The RPF check applies to (S,G) and (*,G) traffic; failure means silent drop. Asserts resolve duplicate forwarders on a LAN, and registers come only from the source's first-hop router."
      },
      {
       "q": "A static mroute fixes an RPF failure. What is its main operational drawback?",
       "options": [
        "It disables PIM on the original interface, so other groups using that path stop working.",
        "It must be configured on every router in the domain, because RPF decisions are made globally.",
        "It forces all groups into SSM mode, because the static entry contains a source prefix.",
        "It changes multicast RPF only, so unicast and multicast topologies silently diverge unless documented."
       ],
       "answer": 3,
       "explain": "Static mroutes live in the multicast RIB and are invisible to unicast troubleshooting. They are local to the router, leave PIM untouched and do not change the service model."
      },
      {
       "q": "On a last-hop router the (S,G) entry shows incoming interface Null and the RPF neighbour as 10.1.56.6. What is the most likely cause?",
       "options": [
        "There is no PIM neighbour at 10.1.56.6 on the RPF interface, so the join cannot be sent upstream.",
        "The source has stopped transmitting, so the router has removed the incoming interface after a timeout.",
        "The RP has pruned the source, so the router no longer knows which interface faces the source.",
        "The receiver left the group, so the router cleared the incoming interface but kept the entry."
       ],
       "answer": 0,
       "explain": "A Null incoming interface with a defined RPF neighbour points to an unusable upstream: typically PIM is not enabled there. Source silence, prunes or leaves affect timers and outgoing lists instead."
      },
      {
       "q": "Which first check best separates a source-side problem from a network problem when nobody beyond the source subnet receives traffic?",
       "options": [
        "Whether the receivers are running IGMPv3, because only v3 receivers can join streams from remote sources.",
        "Whether the first-hop router sees the stream with a TTL above 1 and creates (S,G) state or registers.",
        "Whether the RP is reachable from the receivers, because remote receivers must ping the RP before joining.",
        "Whether MSDP is configured on the last-hop router, because it must learn the source before joining."
       ],
       "answer": 1,
       "explain": "Checking the first-hop router confirms the stream is routable and entering the multicast network. IGMPv2 receivers can join remote ASM sources, receivers never ping the RP, and MSDP runs only between RPs."
      },
      {
       "q": "In the IPTV case, why was internet service unaffected while TV failed?",
       "options": [
        "Unicast forwarding does not depend on PIM, so only the RPF-dependent multicast trees broke.",
        "Internet traffic uses MPLS labels, which are exempt from the RPF checks applied to IP packets.",
        "Internet traffic was protected by QoS priority, so it was moved to the old link automatically.",
        "Internet traffic uses SSM, which is not affected by changes to IS-IS metrics in the core."
       ],
       "answer": 0,
       "explain": "The new link was fine for unicast; multicast failed because RPF pointed at a link without PIM. Labels, QoS and SSM do not explain the asymmetry."
      }
     ]
    }
   ]
  },
  {
   "id": "m7-l4",
   "title": "The QoS Toolkit: Classify, Mark, Queue, Police, Shape, Avoid",
   "subtitle": "Each QoS mechanism, what it can and cannot do, and how it behaves under congestion",
   "minutes": 45,
   "objectives": [
    "Design a DSCP plan with trust boundaries and consistent mapping into MPLS and overlays.",
    "Configure priority and weighted queuing, and explain why queuing only matters during congestion.",
    "Choose between policing and shaping and calculate committed bursts and intervals.",
    "Apply congestion avoidance with WRED and ECN."
   ],
   "blocks": [
    {
     "type": "text",
     "text": "QoS does not create bandwidth; it decides **who suffers** when there is not enough. Every mechanism acts at a specific point: classification and marking at the edge, queuing and congestion avoidance at congested egress interfaces, policing at contract boundaries and shaping wherever a fast interface feeds a slower service. Expert labs test whether you know which tool solves which problem and whether your configuration survives a detailed show command."
    },
    {
     "type": "flow",
     "title": "Where each QoS tool acts",
     "items": [
      {
       "label": "Classify",
       "text": "Identify traffic at the trust boundary: ports, ACLs, application recognition, or trusted markings"
      },
      {
       "label": "Mark",
       "text": "Write DSCP (and CoS or MPLS TC where needed) once, at the edge"
      },
      {
       "label": "Police",
       "text": "Enforce a rate at ingress or contract points; drop or re-mark the excess"
      },
      {
       "label": "Queue",
       "text": "At congested egress: priority for real-time, weighted shares for the rest"
      },
      {
       "label": "Avoid",
       "text": "Drop or ECN-mark early and selectively before queues overflow"
      },
      {
       "label": "Shape",
       "text": "Buffer to a sub-rate so the provider's policer never drops"
      }
     ]
    },
    {
     "type": "table",
     "title": "A practical enterprise DSCP plan",
     "head": [
      "Class",
      "DSCP",
      "Decimal",
      "Treatment"
     ],
     "rows": [
      [
       "Network control",
       "CS6",
       "48",
       "Small guaranteed share; never policed aggressively"
      ],
      [
       "Voice",
       "EF",
       "46",
       "Strict priority, policed to its share"
      ],
      [
       "Interactive video",
       "AF41 (AF42/43 for excess)",
       "34",
       "Guaranteed share, low drop"
      ],
      [
       "Call signalling",
       "CS3",
       "24",
       "Small guaranteed share"
      ],
      [
       "Business-critical / transactional",
       "AF21",
       "18",
       "Guaranteed share, WRED by drop precedence"
      ],
      [
       "Bulk data",
       "AF11",
       "10",
       "Guaranteed small share, WRED"
      ],
      [
       "Best effort",
       "DF",
       "0",
       "Remaining bandwidth, fair queuing"
      ],
      [
       "Scavenger",
       "CS1 or LE (1)",
       "8 / 1",
       "Minimal share; first to be starved"
      ]
     ]
    },
    {
     "type": "callout",
     "kind": "pro",
     "text": "Trust markings only from devices you control: IP phones identified by the access switch, servers in managed segments, and core links. Everything else is re-marked at ingress. In MPLS cores decide the DiffServ tunnelling model explicitly: **uniform** copies core TC changes back to the customer DSCP, **pipe** and **short-pipe** preserve the customer's DSCP and apply provider treatment only to the TC bits, differing in which marking the egress PE uses for its own queuing. In VXLAN fabrics the outer DSCP is normally copied from the inner header, so the underlay can queue correctly.",
     "title": "Trust boundaries and remarking"
    },
    {
     "type": "cli",
     "title": "Classification, LLQ and CBWFQ",
     "device": "WAN-R1 · IOS-style CLI",
     "lines": [
      "class-map match-any VOICE",
      " match dscp ef",
      "class-map match-any VIDEO",
      " match dscp af41 af42 af43",
      "class-map match-any CRITICAL",
      " match dscp af21 af22 af23",
      "class-map match-any SCAVENGER",
      " match dscp cs1",
      "!",
      "policy-map WAN-QUEUING",
      " class VOICE",
      "  priority percent 10",
      " class VIDEO",
      "  bandwidth remaining percent 30",
      " class CRITICAL",
      "  bandwidth remaining percent 35",
      "  random-detect dscp-based",
      " class SCAVENGER",
      "  bandwidth remaining percent 1",
      " class class-default",
      "  bandwidth remaining percent 34",
      "  fair-queue"
     ],
     "note": "Priority traffic is served first and policed to 10% during congestion, so voice cannot starve other classes. 'bandwidth remaining' shares divide what is left after the priority queue."
    },
    {
     "type": "compare",
     "title": "Policing versus shaping",
     "columns": [
      {
       "title": "Policing",
       "items": [
        "Measures against a token bucket and drops or re-marks the excess",
        "No buffering, so no added delay",
        "Works inbound or outbound",
        "TCP sees drops and backs off sharply, causing sawtooth throughput",
        "Right for contracts, scavenger limits and voice queue protection"
       ]
      },
      {
       "title": "Shaping",
       "items": [
        "Buffers excess and releases it at the target rate",
        "Adds delay and needs queue memory",
        "Outbound only",
        "Smooths bursts so a downstream policer never drops",
        "Right for sub-rate handoffs such as 200 Mbit/s over a 1G port"
       ]
      }
     ]
    },
    {
     "type": "formula",
     "title": "Token bucket and delay arithmetic",
     "items": [
      {
       "name": "Committed burst",
       "expr": "Bc = CIR × Tc",
       "meaning": "Shaping to 200 Mbit/s with Tc = 4 ms gives Bc = 800,000 bits (100 KB) per interval."
      },
      {
       "name": "Interval",
       "expr": "Tc = Bc ÷ CIR",
       "meaning": "Smaller Tc means smoother output and less burst latency for voice behind the shaper; 10 ms or less is typical where real-time traffic exists."
      },
      {
       "name": "Serialisation delay",
       "expr": "frame bits ÷ link rate",
       "meaning": "A 1500-byte frame on a 2 Mbit/s link takes 6 ms; on 1 Gbit/s only 12 µs, which is why fragmentation matters only on very slow links."
      },
      {
       "name": "G.711 call on Ethernet",
       "expr": "(160 payload + 40 IP/UDP/RTP + 18 Ethernet) bytes × 8 × 50 pps",
       "meaning": "About 87.2 kbit/s per call at 20 ms packetisation; size the priority class from concurrent calls, not from the codec rate of 64 kbit/s."
      }
     ]
    },
    {
     "type": "table",
     "title": "Congestion avoidance",
     "head": [
      "Mechanism",
      "Behaviour",
      "Notes"
     ],
     "rows": [
      [
       "Tail drop",
       "Queue full, every new packet dropped",
       "Causes TCP global synchronisation and unfairness"
      ],
      [
       "WRED",
       "Random early drops between minimum and maximum thresholds, steeper for higher drop precedence",
       "AFx3 dropped before AFx2 before AFx1 within a class"
      ],
      [
       "ECN",
       "Marks Congestion Experienced instead of dropping for ECN-capable flows",
       "Requires both ends to negotiate ECN; WRED with ECN marks rather than drops"
      ],
      [
       "Fair queuing",
       "Separate flow queues within a class",
       "Stops one elephant flow from dominating best effort"
      ]
     ]
    },
    {
     "type": "scenario",
     "title": "Bulk transfers wreck interactive traffic",
     "situation": "A branch has a 100 Mbit/s service delivered on a 1 Gbit/s Ethernet handoff. The provider polices at 100 Mbit/s. The branch router has an LLQ/CBWFQ policy applied directly to the 1G interface, but voice quality collapses whenever backups run. Interface counters show no drops on the router. What is the best fix?",
     "options": [
      {
       "text": "Apply a hierarchical policy: a parent shaper at 100 Mbit/s with the existing queuing policy as its child.",
       "feedback": "Correct. The 1G interface never congests, so the router's queues never engage and the provider's policer drops indiscriminately. Shaping to the contract moves congestion into the router where the queuing policy can protect voice.",
       "best": true
      },
      {
       "text": "Increase the priority percentage for voice from 10% to 30% on the existing interface policy.",
       "feedback": "The queuing policy never activates because the 1G interface is not congested, so a bigger share changes nothing.",
       "best": false
      },
      {
       "text": "Ask the provider to shape instead of police, so their device buffers the excess and protects voice for you.",
       "feedback": "The provider does not know your classes; their shaper would delay voice along with the backups.",
       "best": false
      },
      {
       "text": "Police the backup traffic to 50 Mbit/s at ingress from the LAN so the total stays under the contract.",
       "feedback": "This might reduce congestion but wastes capacity when there is no voice, and bursts can still exceed the policer at the provider edge.",
       "best": false
      }
     ]
    },
    {
     "type": "terms",
     "items": [
      {
       "term": "DSCP",
       "def": "Differentiated Services Code Point: the 6-bit field in the IP header used to mark per-hop behaviour."
      },
      {
       "term": "EF",
       "def": "Expedited Forwarding (DSCP 46): low-latency, low-loss behaviour for real-time traffic such as voice."
      },
      {
       "term": "Assured Forwarding",
       "def": "Four AF classes with three drop precedences each, for example AF41, AF42, AF43."
      },
      {
       "term": "Trust boundary",
       "def": "The point in the network where markings start to be accepted rather than rewritten."
      },
      {
       "term": "LLQ",
       "def": "Low-latency queuing: a strict-priority queue with an implicit policer, added to weighted queuing."
      },
      {
       "term": "CBWFQ",
       "def": "Class-based weighted fair queuing: guaranteed bandwidth shares per class during congestion."
      },
      {
       "term": "Policer",
       "def": "A rate enforcer that drops or re-marks traffic exceeding a token bucket, without buffering."
      },
      {
       "term": "Shaper",
       "def": "A rate enforcer that buffers excess traffic and releases it at a target rate."
      },
      {
       "term": "WRED",
       "def": "Weighted random early detection: probabilistic early drops weighted by drop precedence."
      },
      {
       "term": "ECN",
       "def": "Explicit Congestion Notification: marking packets instead of dropping them to signal congestion."
      },
      {
       "term": "Hierarchical QoS",
       "def": "Nested policies, typically a parent shaper with a child queuing policy."
      }
     ]
    },
    {
     "type": "quiz",
     "items": [
      {
       "q": "A router's LLQ policy is configured on an interface that never reaches its line rate. When does the priority queue protect voice?",
       "options": [
        "Always, because priority traffic is moved to the front of the hardware queue even without congestion.",
        "Only when the implicit policer of the priority class is exceeded by voice traffic on that interface.",
        "Never on that interface, because queuing policies take effect only when the interface is congested.",
        "Only for traffic in class-default, because the other classes have guaranteed bandwidth already."
       ],
       "answer": 2,
       "explain": "Without congestion there is no queue to reorder; the problem then occurs somewhere else, often at a provider policer. The other options misdescribe LLQ."
      },
      {
       "q": "Within AF class 2, which packets does WRED drop first when the queue begins to fill?",
       "options": [
        "AF21, because it has the lowest DSCP value in the class and the least priority.",
        "AF22, because WRED always starts with the middle drop precedence of each class.",
        "All three equally, because WRED treats every packet in one queue identically.",
        "AF23, because it has the highest drop precedence in the class."
       ],
       "answer": 3,
       "explain": "Higher drop precedence (AFx3) has lower thresholds and is dropped first. DSCP-based WRED differentiates within a class by design."
      },
      {
       "q": "A provider polices a 50 Mbit/s service. Which configuration at the customer edge best avoids random provider drops?",
       "options": [
        "Police outbound traffic to 50 Mbit/s so the customer edge drops excess traffic before the provider does.",
        "Shape outbound traffic to 50 Mbit/s with a child queuing policy, so excess is buffered by class.",
        "Mark all traffic EF so that the provider's policer treats it as priority and does not drop it.",
        "Enable WRED on the physical interface so that early drops occur before the provider policer."
       ],
       "answer": 1,
       "explain": "Shaping turns the provider's drop point into a queue the customer controls. Policing still drops without class protection, marking everything EF breaks differentiation, and WRED on an uncongested interface does nothing."
      },
      {
       "q": "Using Bc = CIR × Tc, what is Bc when shaping to 20 Mbit/s with Tc = 10 ms?",
       "options": [
        "2,000,000 bits, which is 250,000 bytes per interval.",
        "20,000 bits, which is 2,500 bytes per interval.",
        "200,000 bytes, which is 1,600,000 bits per interval.",
        "200,000 bits, which is 25,000 bytes per interval."
       ],
       "answer": 3,
       "explain": "20,000,000 × 0.01 = 200,000 bits. The other values slip a decimal place or confuse bits with bytes."
      },
      {
       "q": "In an MPLS core using the short-pipe model, what does the egress PE use to choose the outgoing queue toward the CE?",
       "options": [
        "The provider's TC bits from the label, because they always overwrite the customer DSCP at the egress.",
        "The outer DSCP of the VXLAN header, because MPLS cores re-encapsulate traffic before the egress PE.",
        "The customer's original DSCP, because the provider TC marking is not copied back into the IP header.",
        "The IP precedence of the provider's own control traffic, which is copied into every customer packet."
       ],
       "answer": 2,
       "explain": "Short pipe preserves customer DSCP and the egress PE queues on it; pipe uses the provider marking for the egress queue; uniform rewrites customer DSCP. VXLAN is unrelated here."
      }
     ]
    }
   ]
  },
  {
   "id": "m7-l5",
   "title": "Designing End-to-End QoS for Voice, Video and Business-Critical Traffic",
   "subtitle": "From business priorities to a consistent, verifiable policy across LAN, WAN, overlay and data centre",
   "minutes": 45,
   "objectives": [
    "Translate business requirements into a class model with latency, jitter and loss budgets.",
    "Build a QoS policy matrix that stays consistent across LAN, WAN, SD-WAN and data centre.",
    "Verify QoS behaviour with counters and controlled congestion tests."
   ],
   "blocks": [
    {
     "type": "text",
     "text": "A QoS design is a contract between the business and the network: which applications are protected, how much they are allowed to consume and what happens to everything else under congestion. It must be **consistent end to end**, because a single hop that ignores markings, or a provider policer you forgot, undoes every careful policy elsewhere."
    },
    {
     "type": "framework",
     "title": "ZCIE QoS design sequence",
     "items": [
      {
       "label": "BIZ",
       "title": "Business priorities",
       "text": "List applications that must be protected, and those that may be starved, with sponsors."
      },
      {
       "label": "BUD",
       "title": "Budgets",
       "text": "One-way targets: voice about 150 ms latency, 30 ms jitter, 1% loss; interactive video similar on latency, slightly more tolerant of loss."
      },
      {
       "label": "CLS",
       "title": "Class model",
       "text": "Choose 4, 8 or 12 classes; fewer classes are easier to keep consistent across domains and providers."
      },
      {
       "label": "MAP",
       "title": "Mapping",
       "text": "DSCP to CoS, MPLS TC, provider classes, SD-WAN queues and wireless access categories."
      },
      {
       "label": "POL",
       "title": "Per-hop policies",
       "text": "Edge marking, WAN hierarchical shaping and queuing, core and data-centre queuing."
      },
      {
       "label": "VER",
       "title": "Verification",
       "text": "Controlled congestion tests and per-class counters, repeated after every change."
      }
     ]
    },
    {
     "type": "formula",
     "title": "Budgets and sizing",
     "items": [
      {
       "name": "One-way delay budget",
       "expr": "codec + packetisation + serialisation + propagation + queuing + jitter buffer",
       "meaning": "If propagation is 60 ms and the jitter buffer 40 ms, there is about 50 ms left for all queuing and serialisation within a 150 ms target."
      },
      {
       "name": "Priority class size",
       "expr": "concurrent calls × per-call rate + video in priority (if any)",
       "meaning": "200 concurrent G.711 calls at 87.2 kbit/s need about 17.5 Mbit/s; keep total priority traffic at roughly a third of the link or less."
      },
      {
       "name": "Provider class mapping",
       "expr": "your classes → provider's classes",
       "meaning": "Six internal classes may collapse into four provider classes; decide which share a class and re-mark to the provider's expected DSCPs at the CE."
      }
     ]
    },
    {
     "type": "template",
     "title": "QoS policy matrix",
     "purpose": "One row per class: the single source for every device policy, provider mapping and test case.",
     "columns": [
      "Class",
      "DSCP (and CoS/TC)",
      "Applications",
      "Queue and share",
      "Drop / police behaviour",
      "Provider / SD-WAN mapping",
      "Test"
     ],
     "example": [
      [
       "Voice",
       "EF (CoS 5, TC 5)",
       "IP telephony media",
       "Priority, 10% (policed)",
       "Police excess in priority; no WRED",
       "Provider real-time; SD-WAN VOICE SLA",
       "200-call load at 100% link"
      ],
      [
       "Business-critical",
       "AF21 (CoS 2, TC 2)",
       "Payments, ERP, order entry",
       "35% of remaining",
       "WRED dscp-based",
       "Provider critical data; SD-WAN BUSINESS SLA",
       "Throughput floor under backup load"
      ]
     ],
     "rows": 8
    },
    {
     "type": "cli",
     "title": "Hierarchical policy at a 200 Mbit/s branch",
     "device": "BR-EDGE · IOS-style CLI",
     "lines": [
      "policy-map WAN-SHAPE-200M",
      " class class-default",
      "  shape average 200000000",
      "  service-policy WAN-QUEUING",
      "!",
      "policy-map LAN-INGRESS-MARK",
      " class VOICE-PHONES",
      "  set dscp ef",
      " class CRITICAL-APPS",
      "  set dscp af21",
      " class class-default",
      "  set dscp default",
      "!",
      "interface GigabitEthernet0/0",
      " description WAN handoff, 200M service on 1G port",
      " service-policy output WAN-SHAPE-200M",
      "interface GigabitEthernet0/1",
      " service-policy input LAN-INGRESS-MARK"
     ],
     "note": "The child policy is the WAN-QUEUING policy from the previous lesson; its percentages now apply to the 200 Mbit/s shaped rate, not to 1 Gbit/s. Marking on LAN ingress makes this router the trust boundary for unmanaged devices."
    },
    {
     "type": "cli",
     "title": "Proving the policy works under congestion",
     "device": "BR-EDGE · IOS-style CLI",
     "lines": [
      "BR-EDGE# show policy-map interface GigabitEthernet0/0 output",
      "  Service-policy output: WAN-SHAPE-200M",
      "    Class-map: class-default (match-any)",
      "      shape (average) cir 200000000, bc 800000, be 800000",
      "      Service-policy : WAN-QUEUING",
      "        Class-map: VOICE (match-any)",
      "          Priority: 10% (20000 kbps), burst bytes 500000, b/w exceed drops: 0",
      "          30 second offered rate 15233000 bps, drop rate 0000 bps",
      "        Class-map: CRITICAL (match-any)",
      "          (total drops/no-buffer drops) 312/0",
      "          30 second offered rate 61022000 bps, drop rate 18000 bps",
      "        Class-map: class-default (match-any)",
      "          (total drops/no-buffer drops) 48213/0",
      "          30 second offered rate 171230000 bps, drop rate 46200000 bps"
     ],
     "note": "Under a deliberate backup load, voice has zero drops, critical data loses a little through WRED, and best effort absorbs the congestion. This is the shape of a healthy policy."
    },
    {
     "type": "table",
     "title": "Keeping policy consistent across domains",
     "head": [
      "Domain",
      "What to configure",
      "Common mistake"
     ],
     "rows": [
      [
       "Access LAN",
       "Trust boundary, marking, priority queue on uplinks",
       "Trusting PCs that mark their own traffic EF"
      ],
      [
       "WAN edge",
       "Hierarchical shaping and queuing, provider re-marking",
       "Queuing on an uncongested physical interface"
      ],
      [
       "MPLS provider core",
       "DSCP-to-TC mapping and DiffServ tunnelling model",
       "Assuming the provider honours all eight of your classes"
      ],
      [
       "SD-WAN overlay",
       "Copy DSCP to the tunnel header; per-tunnel shaping; SLA steering",
       "Encrypted tunnels marked default, so the underlay cannot differentiate"
      ],
      [
       "Data-centre fabric",
       "Queuing on leaf uplinks; lossless classes only where storage requires them",
       "Applying WAN-style policies where congestion is microbursts in buffers"
      ]
     ]
    },
    {
     "type": "scenario",
     "title": "Video calls degrade only across SD-WAN",
     "situation": "After moving branches to SD-WAN over broadband and MPLS, video calls between branches degrade at busy hours. Inside each branch, DSCP AF41 is set correctly. Captures on the underlay show the encrypted tunnel packets all marked DSCP 0. What is the most likely cause and fix?",
     "options": [
      {
       "text": "The provider does not support AF41, so all branch policies must be changed to mark video EF instead.",
       "feedback": "Re-marking video EF does not help if the outer header is still 0, and it would compete with voice in the priority queue.",
       "best": false
      },
      {
       "text": "The edges are not copying the inner DSCP to the outer tunnel header; enable DSCP copy so the underlay and provider can queue correctly.",
       "feedback": "Correct. Once encrypted, the underlay sees only the outer header; DSCP 0 means every video packet competes as best effort on the provider and transport links.",
       "best": true
      },
      {
       "text": "The SD-WAN SLA class for video is too strict, so video is kept on the broadband path at busy hours.",
       "feedback": "The captures already explain the degradation; SLA thresholds would affect path choice, not the outer marking.",
       "best": false
      },
      {
       "text": "The branch LAN switches are not trusting the endpoints, so video should be re-marked at the WAN edge.",
       "feedback": "Inner marking is already correct; the loss of marking happens at encapsulation.",
       "best": false
      }
     ]
    },
    {
     "type": "checklist",
     "title": "QoS verification checklist",
     "items": [
      "Markings captured at the trust boundary match the policy matrix",
      "Markings captured on the WAN, MPLS and overlay headers match the mapping",
      "Shapers match contracted rates, not physical rates",
      "Priority class sized from concurrent sessions, and kept to roughly a third of the link or less",
      "Controlled congestion test shows zero voice loss and expected drops elsewhere",
      "Per-class counters exported to telemetry and baselined",
      "Provider class mapping confirmed in writing and tested",
      "Policy matrix version stored with the device configurations"
     ]
    },
    {
     "type": "reflection",
     "prompt": "Write down the four applications in your organisation whose users complain first when the network is busy. Do they share a class today? What would you change in the policy matrix to protect each one without starving the others?"
    },
    {
     "type": "quiz",
     "items": [
      {
       "q": "Within a 150 ms one-way voice budget, propagation is 70 ms and the jitter buffer 40 ms. Codec and packetisation take 25 ms. How much remains for queuing and serialisation along the whole path?",
       "options": [
        "40 ms, because the jitter buffer can be counted twice, once as delay and once as protection for queuing.",
        "15 ms, which is tight and argues for strict priority queuing and shaping on every congestion point.",
        "55 ms, because codec and packetisation are performed in the handset and do not count toward it.",
        "80 ms, because only propagation counts against the end-to-end budget for interactive voice."
       ],
       "answer": 1,
       "explain": "150 − 70 − 40 − 25 = 15 ms. Every component counts toward one-way delay; ignoring the codec or jitter buffer understates the problem."
      },
      {
       "q": "Your design has eight internal classes but the provider offers four. What is the right approach?",
       "options": [
        "Decide which internal classes share each provider class and re-mark to its DSCPs at the CE.",
        "Keep all eight markings and let the provider's network decide how to map them into its classes.",
        "Mark everything as best effort toward the provider, because only four classes cannot protect eight.",
        "Request eight separate provider VPNs, one per class, so markings no longer matter in the core."
       ],
       "answer": 0,
       "explain": "Explicit mapping keeps behaviour predictable; unknown markings are often treated as best effort. Separate VPNs per class are wasteful and unnecessary."
      },
      {
       "q": "A healthy QoS policy under deliberate congestion should show which pattern?",
       "options": [
        "No priority drops, small drops in critical data, and most drops in best effort or scavenger.",
        "Equal drop percentages in every class, because fair treatment shows the policy is balanced.",
        "No drops in any class, because a correct policy prevents congestion rather than managing it.",
        "Drops only in the priority class, because its implicit policer should always be the first to act."
       ],
       "answer": 0,
       "explain": "QoS decides who suffers; the protected classes should suffer least. Equal drops mean no differentiation; zero drops mean the test did not congest the link."
      },
      {
       "q": "Why size the priority class from concurrent sessions rather than from the total number of phones?",
       "options": [
        "Phones that are not on a call send keepalives in EF that would otherwise overflow the queue.",
        "Only active calls consume bandwidth, and over-sizing the priority queue risks starving other classes.",
        "The implicit policer counts registered endpoints, so the total phone count is already included.",
        "The priority queue is shared with network control, which consumes whatever voice leaves unused."
       ],
       "answer": 1,
       "explain": "Busy-hour concurrency determines real demand; an oversized priority queue can take bandwidth that other classes need. The other statements are incorrect."
      },
      {
       "q": "Where is QoS most likely to fail silently in an SD-WAN deployment?",
       "options": [
        "At the LAN switch, because SD-WAN edges reset DSCP on all traffic arriving from the branch.",
        "At the controller, because control-plane traffic is always placed ahead of user voice traffic.",
        "At the jitter buffer, because SD-WAN tunnels disable jitter buffering in voice endpoints.",
        "At tunnel encapsulation, if inner DSCP is not copied to the outer header used by the underlay."
       ],
       "answer": 3,
       "explain": "Encryption hides the inner header from the underlay, so missing DSCP copy flattens all classes. The other statements are not general behaviours."
      }
     ]
    }
   ]
  }
 ]
});
TRACK.modules.push({
 "id": "m8",
 "order": 8,
 "code": "Code",
 "title": "Code — Expert Automation and Lab Mastery",
 "subtitle": "Automate safely at scale, close the loop with telemetry, and bring every ring segment together under exam conditions.",
 "outcomes": [
  "Use YANG with NETCONF, RESTCONF and gNMI for safe, transactional configuration and streaming telemetry.",
  "Build a source of truth, templates and verification code that prove the network matches intent.",
  "Design CI pipelines, closed-loop remediation and AI-assisted operations with strong guardrails.",
  "Complete an integrated mock practical lab across all eight Mastery Ring segments and score it honestly.",
  "Apply an exam-day strategy and plan the ZCIE capstone deliverables."
 ],
 "lessons": [
  {
   "id": "m8-l1",
   "title": "Model-Driven Interfaces at Scale: YANG, NETCONF, RESTCONF and gNMI",
   "subtitle": "Structured configuration and state through data models, transactions and streaming",
   "minutes": 45,
   "objectives": [
    "Read YANG models and choose between native, OpenConfig and IETF models.",
    "Use NETCONF transactions safely with candidate datastores, validation and confirmed commits.",
    "Compare NETCONF, RESTCONF and gNMI and pick the right one for configuration and telemetry."
   ],
   "blocks": [
    {
     "type": "text",
     "text": "The **Code** segment closes the Mastery Ring. An expert who configures a hundred PEs by hand is not an expert at scale. Model-driven interfaces replace screen-scraping with structured data: a **YANG** model (RFC 7950) defines what can be configured and observed, and a protocol moves that data with transactions and error handling. This lesson focuses on the protocols and the habits that keep automated changes safe; the next lessons build pipelines on top of them."
    },
    {
     "type": "layers",
     "title": "The model-driven stack",
     "items": [
      {
       "label": "Automation",
       "parts": [
        "Scripts, Ansible, controllers, CI pipelines, closed-loop systems"
       ]
      },
      {
       "label": "Protocol",
       "parts": [
        "NETCONF (RFC 6241)",
        "RESTCONF (RFC 8040)",
        "gNMI"
       ]
      },
      {
       "label": "Encoding",
       "parts": [
        "XML",
        "JSON / JSON_IETF",
        "Protobuf"
       ]
      },
      {
       "label": "Transport",
       "parts": [
        "SSH (NETCONF, port 830)",
        "HTTPS (RESTCONF)",
        "gRPC over HTTP/2 with TLS (gNMI)"
       ]
      },
      {
       "label": "Data models",
       "parts": [
        "Native vendor models: complete coverage",
        "OpenConfig: operator-defined, consistent across platforms",
        "IETF: standard building blocks"
       ]
      }
     ]
    },
    {
     "type": "cli",
     "title": "Reading a YANG model as a tree",
     "device": "Linux host",
     "lines": [
      "$ pyang -f tree ietf-interfaces.yang",
      "module: ietf-interfaces",
      "  +--rw interfaces",
      "     +--rw interface* [name]",
      "        +--rw name                 string",
      "        +--rw description?         string",
      "        +--rw type                 identityref",
      "        +--rw enabled?             boolean",
      "        +--ro oper-status          enumeration",
      "        +--ro statistics",
      "           +--ro in-octets?        yang:counter64",
      "           +--ro in-errors?        yang:counter32"
     ],
     "note": "rw nodes are configuration, ro nodes are operational state. The asterisk marks a list keyed by name, and a question mark marks an optional leaf."
    },
    {
     "type": "compare",
     "title": "NETCONF, RESTCONF and gNMI",
     "columns": [
      {
       "title": "NETCONF",
       "items": [
        "RPCs over SSH with XML encoding",
        "Multiple datastores: running, candidate, startup",
        "Locks, validate, commit and confirmed commit",
        "Best for transactional configuration of many devices"
       ]
      },
      {
       "title": "RESTCONF",
       "items": [
        "HTTP methods over HTTPS with JSON or XML",
        "Resource URLs map to the YANG tree",
        "No candidate commit in typical use; each call applies directly",
        "Best for simple integrations and web tooling"
       ]
      },
      {
       "title": "gNMI",
       "items": [
        "gRPC with protobuf or JSON encoding",
        "Get, Set and Subscribe RPCs",
        "Streaming telemetry: sample, on-change, once and poll modes",
        "Best for high-volume telemetry; Set is atomic per call"
       ]
      }
     ]
    },
    {
     "type": "table",
     "title": "NETCONF operations that matter for safety",
     "head": [
      "Operation",
      "Purpose",
      "Safe-change habit"
     ],
     "rows": [
      [
       "lock / unlock",
       "Prevent concurrent changes to a datastore",
       "Lock the candidate before editing, always unlock in a finally block"
      ],
      [
       "edit-config (candidate)",
       "Stage changes without affecting forwarding",
       "Use merge for additive changes; replace only on fully owned subtrees"
      ],
      [
       "validate",
       "Check the candidate for errors before commit",
       "Fail the run before anything reaches running"
      ],
      [
       "commit confirmed",
       "Apply with automatic rollback unless confirmed",
       "Confirm only after post-checks pass; otherwise let it roll back"
      ],
      [
       "get-data (NMDA)",
       "Read a specific datastore, including operational",
       "Compare intended and operational state after the change"
      ]
     ]
    },
    {
     "type": "cli",
     "title": "A confirmed NETCONF change",
     "device": "NETCONF RPC payload (XML)",
     "lines": [
      "<rpc message-id=\"101\" xmlns=\"urn:ietf:params:xml:ns:netconf:base:1.0\">",
      "  <edit-config>",
      "    <target><candidate/></target>",
      "    <default-operation>merge</default-operation>",
      "    <config>",
      "      <interfaces xmlns=\"urn:ietf:params:xml:ns:yang:ietf-interfaces\">",
      "        <interface>",
      "          <name>GigabitEthernet0/0/0/3</name>",
      "          <description>to PE7 - change CHG-4711</description>",
      "        </interface>",
      "      </interfaces>",
      "    </config>",
      "  </edit-config>",
      "</rpc>",
      "<rpc message-id=\"102\" xmlns=\"urn:ietf:params:xml:ns:netconf:base:1.0\">",
      "  <commit><confirmed/><confirm-timeout>300</confirm-timeout></commit>",
      "</rpc>"
     ],
     "note": "If no confirming commit arrives within 300 seconds, for example because the change cut off management access, the device rolls back by itself."
    },
    {
     "type": "cli",
     "title": "Streaming interface counters with gNMI",
     "device": "Linux host · gnmic (open source)",
     "lines": [
      "$ gnmic -a pe1.lab:9339 -u telemetry --tls-ca ca.pem subscribe \\",
      "    --path \"/interfaces/interface[name=GigabitEthernet0/0/0/3]/state/counters\" \\",
      "    --mode stream --stream-mode sample --sample-interval 10s",
      "{",
      "  \"source\": \"pe1.lab:9339\",",
      "  \"timestamp\": 1792396800000000000,",
      "  \"updates\": [ { \"Path\": \"interfaces/interface[name=GigabitEthernet0/0/0/3]/state/counters\",",
      "      \"values\": { \"in-octets\": \"918273645512\", \"in-errors\": \"0\", \"out-discards\": \"12\" } } ]",
      "}"
     ],
     "note": "Sample mode sends every 10 seconds whether or not values change; on-change mode suits state such as oper-status or BGP session state. The password is prompted for, never written into scripts or history."
    },
    {
     "type": "framework",
     "title": "Patterns for automation at scale",
     "items": [
      {
       "label": "IDEM",
       "title": "Idempotent intent",
       "text": "Running the same job twice yields the same result and no extra changes."
      },
      {
       "label": "TXN",
       "title": "Transactions",
       "text": "Stage, validate and commit per device; roll back automatically on failure."
      },
      {
       "label": "DIFF",
       "title": "Dry-run diffs",
       "text": "Show the exact configuration diff for review before any commit."
      },
      {
       "label": "BATCH",
       "title": "Batches and canaries",
       "text": "Change a small canary group, verify, then expand in batches with a stop condition."
      },
      {
       "label": "CONC",
       "title": "Bounded concurrency",
       "text": "Limit parallel sessions so controllers and devices are not overwhelmed."
      },
      {
       "label": "ERR",
       "title": "Explicit error handling",
       "text": "Treat partial failure as failure: report, roll back and stop the batch."
      }
     ]
    },
    {
     "type": "callout",
     "kind": "warning",
     "text": "In RESTCONF, PUT replaces the target resource with exactly what you send, and POST creates a child resource. PATCH merges. A PUT to the whole interfaces container with one interface in the body can delete the configuration of every other interface. Target the narrowest resource, use PATCH for additive changes, and test destructive methods only in a lab.",
     "title": "PUT replaces, PATCH merges"
    },
    {
     "type": "scenario",
     "title": "A RESTCONF call that removed too much",
     "situation": "An engineer wanted to update the description on one interface of 400 access routers. The script sent a PUT to /restconf/data/ietf-interfaces:interfaces with a body containing only that interface. On the first ten routers, all other interface configuration disappeared. What should the script do instead?",
     "options": [
      {
       "text": "Keep using PUT but add every other interface to the body, copied from a backup taken last month.",
       "feedback": "A stale backup risks reverting other changes, and the method is still needlessly destructive.",
       "best": false
      },
      {
       "text": "Send a POST to the interfaces container, because POST never deletes any existing configuration.",
       "feedback": "POST creates a new child resource and fails if it already exists; it is the wrong method for an update.",
       "best": false
      },
      {
       "text": "Send a PATCH to the specific list entry, interface=<name>, containing only the description leaf.",
       "feedback": "Correct. PATCH merges and the narrow URL limits the scope to one interface and one leaf, so nothing else can be replaced.",
       "best": true
      },
      {
       "text": "Switch to screen-scraping the CLI, because model-driven interfaces are too risky for production use.",
       "feedback": "The problem is the HTTP method and scope, not model-driven automation itself.",
       "best": false
      }
     ]
    },
    {
     "type": "terms",
     "items": [
      {
       "term": "YANG",
       "def": "Data modelling language (RFC 7950) describing configuration and operational data as a tree."
      },
      {
       "term": "NETCONF",
       "def": "XML-based network configuration protocol over SSH with datastores, locks and transactions."
      },
      {
       "term": "RESTCONF",
       "def": "HTTP-based protocol that exposes YANG data as resources, usually with JSON."
      },
      {
       "term": "gNMI",
       "def": "gRPC network management interface providing Get, Set and Subscribe, widely used for streaming telemetry."
      },
      {
       "term": "Candidate datastore",
       "def": "A scratch configuration that can be edited and validated before being committed to running."
      },
      {
       "term": "Confirmed commit",
       "def": "A commit that rolls back automatically unless a confirming commit arrives before a timeout."
      },
      {
       "term": "OpenConfig",
       "def": "Operator-led, vendor-neutral YANG models for configuration and telemetry."
      },
      {
       "term": "NMDA",
       "def": "Network Management Datastore Architecture: separates intended configuration from operational state."
      },
      {
       "term": "On-change subscription",
       "def": "A telemetry mode that sends updates only when a value changes."
      }
     ]
    },
    {
     "type": "quiz",
     "items": [
      {
       "q": "A change might cut off the automation server's management access. Which NETCONF feature limits the damage best?",
       "options": [
        "A lock on the running datastore, so no other session can change the configuration meanwhile.",
        "A validate operation, so the device checks the syntax before it applies the new configuration.",
        "Commit confirmed with a timeout, so the device rolls back if no confirming commit arrives.",
        "A get-config operation, so the script stores a backup of the running configuration first."
       ],
       "answer": 2,
       "explain": "Only confirmed commit recovers automatically when connectivity is lost. Locks prevent conflicts, validate catches errors but not lockouts, and a backup needs a working session to restore."
      },
      {
       "q": "Which protocol and mode suit tracking BGP session state changes across 2,000 routers with minimal load?",
       "options": [
        "RESTCONF GET every 10 seconds, so the collector always has the latest state of every session.",
        "NETCONF get-config every minute, so the collector compares configured peers against the intent.",
        "gNMI Subscribe in sample mode every second, so no state change can ever be missed by the collector.",
        "gNMI Subscribe in on-change mode, so updates are sent only when a session state changes."
       ],
       "answer": 3,
       "explain": "On-change streaming is efficient for discrete state. Polling and high-frequency sampling add load, and get-config returns configuration, not operational state."
      },
      {
       "q": "In a YANG tree, what does '+--ro oper-status' tell you?",
       "options": [
        "It is a configuration leaf that is optional and has a default value.",
        "It is a list key that must be supplied when creating a new entry.",
        "It is operational state that can be read but not configured.",
        "It is a deprecated node that will be removed in the next revision."
       ],
       "answer": 2,
       "explain": "'ro' marks read-only operational data. Optional leaves carry a question mark, keys appear in brackets after the list name, and deprecation is shown differently."
      },
      {
       "q": "Why might a team use OpenConfig models for telemetry but native models for some configuration?",
       "options": [
        "OpenConfig gives consistent paths across platforms, while native models cover features OpenConfig lacks.",
        "OpenConfig models are read-only by design, so all configuration changes must use native models on every platform.",
        "Native models cannot stream telemetry, so OpenConfig is the only option for subscriptions.",
        "OpenConfig requires RESTCONF, while native models are limited to NETCONF on most platforms."
       ],
       "answer": 0,
       "explain": "Consistency versus coverage is the usual trade-off. OpenConfig includes configuration, native models can stream, and both work over several protocols."
      },
      {
       "q": "A NETCONF script edits the candidate on 50 routers, but 3 fail validation. What should a well-designed job do?",
       "options": [
        "Commit on the 47 that validated, then retry the 3 failures in a loop until each of them finally succeeds.",
        "Discard the candidate on the failed routers, report them, and stop or roll back according to the batch policy.",
        "Commit on all 50 using a forced commit, because validation errors are usually only warnings.",
        "Leave the candidate on the 3 routers unchanged, so the next engineer can commit it manually."
       ],
       "answer": 1,
       "explain": "Partial failure must be handled explicitly and safely. Blind retries, forced commits and leftover candidates create unpredictable state."
      }
     ]
    }
   ]
  },
  {
   "id": "m8-l2",
   "title": "Source of Truth, Templating and Verification as Code",
   "subtitle": "From structured intent to rendered configuration, and from show commands to assertions",
   "minutes": 45,
   "objectives": [
    "Design a source of truth that separates intent data from device configuration.",
    "Render configurations with Jinja2 templates that fail loudly on missing data.",
    "Write verification in Python and Ansible that asserts intended state rather than printing output."
   ],
   "blocks": [
    {
     "type": "text",
     "text": "Automation fails when data is scattered: addresses in a spreadsheet, VRFs in someone's notes, BGP peers only in running configs. A **source of truth (SoT)** holds intended state as structured data; **templates** turn that data into configuration; **verification code** proves the network matches the intent. Experts write verification first, because a change pipeline without automated checks merely breaks things faster."
    },
    {
     "type": "flow",
     "title": "From intent to proof",
     "items": [
      {
       "label": "Intent",
       "text": "Design decisions captured as data: sites, VRFs, peers, RTs, QoS classes"
      },
      {
       "label": "Source of truth",
       "text": "IPAM/DCIM tool (for example the open-source NetBox) plus version-controlled YAML"
      },
      {
       "label": "Render",
       "text": "Jinja2 templates produce full or partial configurations per device"
      },
      {
       "label": "Validate",
       "text": "Schema checks on data, static analysis on rendered configs"
      },
      {
       "label": "Deploy",
       "text": "Transactions with diffs and confirmed commits"
      },
      {
       "label": "Verify",
       "text": "Assertions on operational state compared with intent"
      }
     ]
    },
    {
     "type": "cli",
     "title": "Intent data for one PE",
     "device": "intent/pe1.yml (YAML)",
     "lines": [
      "hostname: PE1",
      "loopback: 10.255.0.1",
      "asn: 65000",
      "vrfs:",
      "  - name: BLUE",
      "    id: 101",
      "    export_rts: [\"65000:100\"]",
      "    import_rts: [\"65000:100\"]",
      "    ce_neighbors:",
      "      - {ip: 192.0.2.2, asn: 65010, as_override: true}",
      "  - name: GREEN",
      "    id: 102",
      "    export_rts: [\"65000:200\"]",
      "    import_rts: [\"65000:200\", \"65000:999\"]",
      "    ce_neighbors: []"
     ]
    },
    {
     "type": "cli",
     "title": "Jinja2 template for VRFs and PE-CE BGP",
     "device": "templates/l3vpn.j2 (Jinja2)",
     "lines": [
      "{% for vrf in vrfs %}",
      "vrf definition {{ vrf.name }}",
      " rd {{ loopback }}:{{ vrf.id }}",
      " address-family ipv4",
      "{% for rt in vrf.export_rts %}  route-target export {{ rt }}",
      "{% endfor %}{% for rt in vrf.import_rts %}  route-target import {{ rt }}",
      "{% endfor %}!",
      "{% endfor %}",
      "router bgp {{ asn }}",
      "{% for vrf in vrfs if vrf.ce_neighbors %}",
      " address-family ipv4 vrf {{ vrf.name }}",
      "{% for n in vrf.ce_neighbors %}  neighbor {{ n.ip }} remote-as {{ n.asn }}",
      "  neighbor {{ n.ip }} activate",
      "{% if n.as_override %}  neighbor {{ n.ip }} as-override",
      "{% endif %}{% endfor %}{% endfor %}"
     ],
     "note": "Render with StrictUndefined so a missing variable stops the build instead of producing a silent blank. The RD is derived from the loopback, giving every PE a unique RD per VRF, as recommended in the Label module."
    },
    {
     "type": "callout",
     "kind": "warning",
     "text": "Undefined variables that render as empty strings, whitespace control that glues two commands onto one line, defaults hidden in templates instead of the data, and logic so complex that nobody can review it. Keep templates simple, put decisions in data, enable strict undefined handling, and add a test that renders every device and compares the output with a known-good snapshot.",
     "title": "Template pitfalls that reach production"
    },
    {
     "type": "cli",
     "title": "Verification as tests (pytest)",
     "device": "tests/test_bgp.py (Python)",
     "lines": [
      "import pytest, yaml",
      "from collector import get_bgp_neighbors  # thin wrapper over RESTCONF or gNMI",
      "INTENT = yaml.safe_load(open(\"intent/bgp_expectations.yml\"))",
      "@pytest.mark.parametrize(\"dev\", INTENT[\"devices\"], ids=lambda d: d[\"name\"])",
      "def test_bgp_sessions(dev):",
      "    state = get_bgp_neighbors(dev[\"host\"])",
      "    for peer, minimum in dev[\"peers\"].items():",
      "        assert peer in state, f\"{dev['name']}: peer {peer} not configured\"",
      "        assert state[peer][\"session_state\"] == \"ESTABLISHED\", f\"{dev['name']}: {peer} down\"",
      "        assert state[peer][\"prefixes_received\"] >= minimum, f\"{dev['name']}: {peer} too few prefixes\""
     ],
     "note": "Each assertion encodes an expectation from intent. A failed test names the device and peer, which turns a wall of show output into an actionable finding."
    },
    {
     "type": "cli",
     "title": "Verification with Ansible",
     "device": "verify_ldp.yml (Ansible playbook)",
     "lines": [
      "- name: Verify LDP peers after change",
      "  hosts: pe_routers",
      "  gather_facts: false",
      "  tasks:",
      "    - name: Collect LDP neighbours",
      "      ansible.netcommon.cli_command:",
      "        command: show mpls ldp neighbor",
      "      register: ldp",
      "    - name: Every expected peer is present",
      "      ansible.builtin.assert:",
      "        that: \"('Peer LDP Ident: ' ~ item ~ ':0') in ldp.stdout\"",
      "        fail_msg: \"LDP peer {{ item }} missing on {{ inventory_hostname }}\"",
      "      loop: \"{{ expected_ldp_peers }}\""
     ],
     "note": "String matching on CLI output is fragile; prefer structured data from a model-driven interface or a parser. It is shown here because many brownfield networks start this way."
    },
    {
     "type": "table",
     "title": "Configuration versus verification tasks",
     "head": [
      "Area",
      "Configuration from SoT",
      "Verification assertion"
     ],
     "rows": [
      [
       "IGP",
       "Interfaces, metrics, authentication",
       "Expected adjacencies up; loopbacks reachable with expected ECMP"
      ],
      [
       "Label",
       "LDP or SR, VRFs, RTs",
       "Labels for every PE loopback; VPN prefixes per VRF within expected range"
      ],
      [
       "Fabric",
       "VLAN-to-VNI, ESIs, anycast gateway",
       "Type-3 peers per VNI; ES peers and DF state; no duplicate MACs"
      ],
      [
       "Stream",
       "PIM, RP, QoS policies",
       "PIM neighbours on RPF paths; zero priority-class drops in tests"
      ],
      [
       "Security",
       "AAA, ACLs, management plane",
       "Only approved sessions and services reachable"
      ]
     ]
    },
    {
     "type": "scenario",
     "title": "The emergency fix that disappeared",
     "situation": "During an outage an engineer hand-configured a static route on two PEs. The next night, the automated pipeline re-rendered configurations from the source of truth and removed the route, and the outage returned. What is the best process fix?",
     "options": [
      {
       "text": "Stop running the pipeline at night, so manual fixes have time to be reviewed by the engineering team.",
       "feedback": "This only delays the same conflict and leaves the SoT and network permanently out of sync.",
       "best": false
      },
      {
       "text": "Exclude static routes from automation, so engineers can always manage them by hand on the devices.",
       "feedback": "Carving out manual areas erodes the source of truth and multiplies future drift.",
       "best": false
      },
      {
       "text": "Require emergency changes to be added to the source of truth immediately afterward, and run drift detection that flags differences before each deployment.",
       "feedback": "Correct. The source of truth must remain authoritative; drift detection catches out-of-band changes before the pipeline overwrites them.",
       "best": true
      },
      {
       "text": "Give the pipeline a merge-only mode, so it never removes configuration that is not in the templates.",
       "feedback": "Merge-only deployment leaves stale and unauthorised configuration in place forever.",
       "best": false
      }
     ]
    },
    {
     "type": "checklist",
     "title": "Source-of-truth and verification checklist",
     "items": [
      "Every configurable decision has exactly one authoritative home",
      "Data is validated against a schema before rendering",
      "Templates use strict undefined handling and are snapshot-tested",
      "Rendered configurations are diffed against running before deployment",
      "Verification tests exist for every intent area changed",
      "Out-of-band changes are detected and reconciled before deployment",
      "Credentials come from a vault, never from repositories or scripts",
      "Test output names the device and expectation that failed"
     ]
    },
    {
     "type": "quiz",
     "items": [
      {
       "q": "Why render with strict undefined handling in Jinja2?",
       "options": [
        "It speeds up rendering by skipping any blocks whose variables have not been defined in the intent data.",
        "It encrypts variables during rendering so that credentials never appear in the output files.",
        "A missing variable stops the build instead of silently producing an incomplete configuration line.",
        "It converts undefined variables into vendor defaults so the configuration is always complete."
       ],
       "answer": 2,
       "explain": "Fail-fast rendering prevents commands such as 'neighbor  remote-as' reaching devices. It neither skips blocks, encrypts data nor invents defaults."
      },
      {
       "q": "What makes a verification check valuable in a pipeline?",
       "options": [
        "It asserts an expected state derived from intent and fails with a message naming device and expectation.",
        "It prints the complete show output from every device so engineers can read through the results later.",
        "It runs only after the change window closes so that it never delays the deployment of the change.",
        "It checks that the configuration was sent successfully, because acceptance proves the network works."
       ],
       "answer": 0,
       "explain": "Assertions turn data into pass or fail. Printed output needs human review, late checks miss the rollback window, and accepted configuration can still be wrong."
      },
      {
       "q": "Where should the decision 'PE1 imports RT 65000:999 into VRF GREEN' live?",
       "options": [
        "In the Jinja2 template, as a conditional block that adds the RT when the hostname is PE1.",
        "In the source-of-truth data for PE1, so the template renders it and tests can assert it.",
        "In the running configuration only, because the device is the final authority on its own state.",
        "In the change ticket, because tickets are where engineers look first for design decisions."
       ],
       "answer": 1,
       "explain": "Decisions belong in data. Hard-coding them in templates hides intent, and running configs and tickets are not structured, authoritative sources."
      },
      {
       "q": "A team scrapes CLI text in Ansible assertions. What is the main risk?",
       "options": [
        "Ansible cannot connect to network devices without an agent installed on every single router first.",
        "CLI commands cannot be run in check mode, so every assertion applies configuration.",
        "String assertions always pass because Ansible ignores the output of show commands.",
        "Output format changes between software releases can break or falsely pass string matches."
       ],
       "answer": 3,
       "explain": "Unstructured text is brittle. Ansible is agentless, show commands do not change configuration, and assertions do evaluate output."
      },
      {
       "q": "Which pairing of configuration and verification is correct for an EVPN fabric?",
       "options": [
        "Configure ESIs on every leaf; assert that the number of BGP sessions on the spines has increased.",
        "Configure the anycast gateway MAC; assert that every leaf has a unique gateway MAC address.",
        "Configure route targets; assert that each leaf advertises its own RD to the other leaves as a type-5 route.",
        "Configure VLAN-to-VNI and ingress replication; assert that every leaf sees the expected type-3 peers per VNI."
       ],
       "answer": 3,
       "explain": "Type-3 membership proves the flood list. Session counts do not prove ESI state, gateway MACs must be identical, and RDs are not advertised as type-5 routes."
      }
     ]
    }
   ]
  },
  {
   "id": "m8-l3",
   "title": "CI Pipelines, Closed-Loop Operations and AI-Assisted Operations",
   "subtitle": "Testing changes before production, acting on telemetry safely, and using AI assistance with guardrails",
   "minutes": 50,
   "objectives": [
    "Design a network CI pipeline with data validation, static analysis, virtual lab tests and staged deployment.",
    "Build telemetry-driven closed-loop automation with preconditions, blast-radius limits and verification.",
    "Define guardrails for AI-assisted operations so suggestions are useful and never unsafe."
   ],
   "blocks": [
    {
     "type": "text",
     "text": "A pipeline is the bridge between intent and production. It runs the same checks on every change, regardless of who wrote it or how urgent it is. Closed-loop operations extend the idea: telemetry detects a condition, automation acts and then verifies. AI-assisted tooling, now common in 2026 operations, belongs **inside** these guardrails, never around them."
    },
    {
     "type": "flow",
     "title": "A network CI/CD pipeline",
     "items": [
      {
       "label": "Lint and schema",
       "text": "YAML lint, schema validation of intent data, policy rules such as unique RDs"
      },
      {
       "label": "Render",
       "text": "Generate configurations for every affected device"
      },
      {
       "label": "Static analysis",
       "text": "Model the network offline (for example the open-source Batfish) and test reachability, ACLs and BGP policy"
      },
      {
       "label": "Virtual lab",
       "text": "Deploy to a container-based lab (for example containerlab) and run verification tests"
      },
      {
       "label": "Approve",
       "text": "Human review of the diff and test report"
      },
      {
       "label": "Canary and batches",
       "text": "Confirmed commits on a small group, verify, then expand"
      },
      {
       "label": "Post-checks",
       "text": "Automated verification; automatic rollback on failure"
      }
     ]
    },
    {
     "type": "cli",
     "title": "Pipeline definition",
     "device": ".ci/pipeline.yml (generic CI runner)",
     "lines": [
      "stages: [validate, render, analyse, lab, deploy, verify]",
      "validate-data:",
      "  stage: validate",
      "  script: [\"yamllint intent/\", \"python -m pytest tests/schema\"]",
      "render-configs:",
      "  stage: render",
      "  script: [\"python render.py --out build/\"]",
      "static-analysis:",
      "  stage: analyse",
      "  script: [\"python -m pytest tests/model --snapshot build/\"]",
      "lab-test:",
      "  stage: lab",
      "  script: [\"containerlab deploy -t lab/core.clab.yml\", \"python deploy.py --target lab\", \"python -m pytest tests/verify --target lab\"]",
      "deploy-canary:",
      "  stage: deploy",
      "  when: manual",
      "  script: [\"python deploy.py --target prod --scope canary --confirm-timeout 300\"]",
      "verify-canary:",
      "  stage: verify",
      "  script: [\"python -m pytest tests/verify --target prod --scope canary\"]"
     ],
     "note": "The manual gate sits after all automated evidence is available, so the approver reviews results, not intentions."
    },
    {
     "type": "table",
     "title": "What each test layer catches",
     "head": [
      "Layer",
      "Catches",
      "Misses"
     ],
     "rows": [
      [
       "Schema and policy checks",
       "Duplicate RDs, missing fields, forbidden values",
       "Behaviour of the routing protocols"
      ],
      [
       "Snapshot tests of rendered configs",
       "Unintended template changes",
       "Whether the config works"
      ],
      [
       "Static network analysis",
       "Reachability, ACL and route-policy errors, BGP and IGP outcomes",
       "Software bugs and timing behaviour"
      ],
      [
       "Virtual lab",
       "Real protocol behaviour, convergence, many integration errors",
       "Hardware-specific features and scale"
      ],
      [
       "Canary in production",
       "Real hardware and traffic",
       "Problems that appear only at full scale"
      ]
     ]
    },
    {
     "type": "layers",
     "title": "Telemetry-driven operations",
     "items": [
      {
       "label": "Action",
       "parts": [
        "Remediation runbooks, tickets, change requests"
       ]
      },
      {
       "label": "Decision",
       "parts": [
        "Rules and thresholds, anomaly detection, correlation"
       ]
      },
      {
       "label": "Storage and query",
       "parts": [
        "Time-series database (for example Prometheus or InfluxDB), logs, events"
       ]
      },
      {
       "label": "Collection",
       "parts": [
        "gNMI collectors (for example Telegraf or gnmic), syslog, flow records"
       ]
      },
      {
       "label": "Network",
       "parts": [
        "Devices streaming counters, state and events"
       ]
      }
     ]
    },
    {
     "type": "framework",
     "title": "Closed loop with guardrails",
     "items": [
      {
       "label": "SENS",
       "title": "Sense",
       "text": "Stream the metrics and states that define the condition, with timestamps."
      },
      {
       "label": "CORR",
       "title": "Correlate",
       "text": "Confirm the condition persists and is not explained by a change in progress."
      },
      {
       "label": "PRE",
       "title": "Preconditions",
       "text": "Act only if redundancy exists, no change freeze applies and the target is healthy enough."
      },
      {
       "label": "BLST",
       "title": "Blast-radius limit",
       "text": "At most one action per device and N per network per hour; never on both sides of a pair."
      },
      {
       "label": "ACT",
       "title": "Act reversibly",
       "text": "Prefer draining (cost out, overload bit) to shutting interfaces."
      },
      {
       "label": "VER",
       "title": "Verify and roll back",
       "text": "Confirm the expected effect within a deadline; undo and escalate if not."
      }
     ]
    },
    {
     "type": "cli",
     "title": "A remediation rule with preconditions",
     "device": "remediation/uplink-errors.yml (rule definition)",
     "lines": [
      "rule: drain-erroring-uplink",
      "trigger:",
      "  metric: interface_in_errors_per_second",
      "  condition: \"> 50 for 5m\"",
      "preconditions:",
      "  - peer_uplinks_up(device) >= 1",
      "  - change_freeze == false",
      "  - actions_last_hour(network) < 3",
      "  - actions_last_day(device) == 0",
      "action:",
      "  - set_isis_metric(interface, 16777214)",
      "  - open_ticket(severity: 3, attach: [metrics, lldp_neighbor])",
      "verify:",
      "  - traffic_on(interface) < 5% within 120s",
      "on_verify_fail: [restore_metric, page_on_call]"
     ],
     "note": "Draining with a near-maximum metric keeps the link up for diagnosis and is instantly reversible. The device and network rate limits stop a bad rule from cascading."
    },
    {
     "type": "compare",
     "title": "AI-assisted operations in 2026",
     "columns": [
      {
       "title": "Good uses",
       "items": [
        "Summarising incidents from logs, telemetry and tickets",
        "Drafting configurations or tests for human review",
        "Explaining unfamiliar output and suggesting next diagnostic steps",
        "Searching runbooks and past incidents"
       ]
      },
      {
       "title": "Required guardrails",
       "items": [
        "Read-only access by default; no direct writes to devices",
        "Every suggested change goes through the same pipeline and approval",
        "Outputs cite their sources; engineers verify syntax and facts",
        "Sensitive data minimised and governed; prompts and actions logged"
       ]
      }
     ]
    },
    {
     "type": "callout",
     "kind": "warning",
     "text": "Generated configurations can look perfect and still use a command that does not exist on your platform, an RT from another customer or a wrong mask. Treat any generated content like a change from a new team member: it must pass schema checks, static analysis, lab tests and peer review. Never paste credentials, customer data or full configurations into tools that are not approved for that data.",
     "title": "Plausible is not correct"
    },
    {
     "type": "case",
     "title": "A bank's automated change pipeline",
     "context": "A retail bank operates 1,200 branches over SD-WAN, two data centres with EVPN fabrics and an MPLS core. Change failure rate is 14%, mostly typos and inconsistent route maps, and change windows run long because every change needs manual pre- and post-checks. Regulators demand evidence of testing, segregation of duties and the ability to roll back. The operations team wants to pilot an AI assistant that drafts configurations from tickets.",
     "questions": [
      "What pipeline stages would you introduce first, and why in that order?",
      "How do you satisfy segregation of duties and evidence requirements?",
      "How should the AI assistant be integrated?",
      "Which metrics show the programme is working?"
     ],
     "answer": "Start with a **source of truth and verification tests**, because the biggest win is catching inconsistent data and proving outcomes: schema and policy checks (unique RDs, approved RT ranges, route-map naming), automated pre- and post-checks per change type, then rendering from templates to eliminate typos. Add **static analysis** to test route policy and ACL behaviour, and a **virtual lab** for the MPLS core and fabric templates. Deploy with confirmed commits, canaries and automatic rollback. Segregation of duties is enforced by the pipeline: authors cannot approve their own merge requests, production credentials live in a vault accessible only to the pipeline, and every stage's output is retained with the change record as evidence. The AI assistant should **draft** changes as merge requests into the same repository, with no device access; its output passes the same checks and human review, and its prompts and suggestions are logged. Measure change failure rate, mean change duration, rollback frequency, percentage of changes passing all automated checks first time and time to detect drift; a credible target is a failure rate under 3% within a year."
    },
    {
     "type": "scenario",
     "title": "Auto-remediation made it worse",
     "situation": "A closed-loop rule shuts any uplink whose CRC error rate exceeds a threshold. During a faulty optics batch, the rule shut both uplinks of three leaf switches within minutes, isolating dozens of servers. What is the most important change to the rule?",
     "options": [
      {
       "text": "Raise the CRC threshold so that the rule triggers less often during periods of optics problems.",
       "feedback": "A higher threshold reduces triggers but still allows the rule to remove the last path.",
       "best": false
      },
      {
       "text": "Replace the rule with an alert to the on-call engineer and remove all automated remediation.",
       "feedback": "This is safe but discards the benefit; well-guarded automation is better than none.",
       "best": false
      },
      {
       "text": "Make the rule re-enable interfaces automatically after ten minutes so outages are always short.",
       "feedback": "Re-enabling erroring links blindly causes flapping and still allows ten-minute outages.",
       "best": false
      },
      {
       "text": "Add preconditions and blast-radius limits: act only if a healthy redundant uplink remains, rate-limit actions, and drain rather than shut.",
       "feedback": "Correct. Guardrails ensure automation never removes the last path and that a widespread problem escalates to humans instead of cascading.",
       "best": true
      }
     ]
    },
    {
     "type": "reflection",
     "prompt": "If an AI assistant proposed a change to your production network tomorrow, which checks would it pass through today before reaching a device? List the gaps and decide which single guardrail you would add first."
    },
    {
     "type": "terms",
     "items": [
      {
       "term": "Source of truth",
       "def": "The authoritative, structured record of intended network state from which configurations are generated."
      },
      {
       "term": "Static network analysis",
       "def": "Offline modelling of configurations to predict routing, reachability and policy outcomes."
      },
      {
       "term": "Virtual lab",
       "def": "A software-based replica of part of the network used to test changes before production."
      },
      {
       "term": "Canary deployment",
       "def": "Applying a change to a small subset first and verifying before expanding."
      },
      {
       "term": "Drift",
       "def": "A difference between the source of truth and the running network."
      },
      {
       "term": "Closed-loop automation",
       "def": "Automation that detects a condition from telemetry, acts and verifies the result."
      },
      {
       "term": "Blast radius",
       "def": "The scope of impact if an automated action is wrong."
      },
      {
       "term": "Guardrail",
       "def": "A control that limits what automation or AI assistance can do, such as preconditions, approvals and rate limits."
      }
     ]
    },
    {
     "type": "quiz",
     "items": [
      {
       "q": "Which pipeline stage would catch a route map that accidentally denies a customer's default route, before any device is touched?",
       "options": [
        "Static network analysis of the rendered configurations, which evaluates route-policy outcomes offline.",
        "YAML linting of the intent data, which checks that every route map name follows the convention.",
        "Canary deployment, which applies the route map to a small set of production routers and watches the result.",
        "Snapshot testing, which shows that the rendered route map differs from the previous version."
       ],
       "answer": 0,
       "explain": "Policy evaluation needs a model of the network. Linting checks syntax, a canary touches devices, and snapshots show change, not correctness."
      },
      {
       "q": "Why is draining a link with a maximum metric often preferred to shutting it in closed-loop remediation?",
       "options": [
        "It removes the link from the routing table immediately, which converges faster than a shutdown.",
        "It moves traffic away while keeping the link up for diagnosis, and it is quickly reversible.",
        "It disables error counters on the link, which stops the remediation rule from triggering again.",
        "It prevents LDP from running on the link, which avoids label black holes during the incident."
       ],
       "answer": 1,
       "explain": "Draining is gentle, observable and reversible. It does not remove the link from the topology instantly, does not disable counters, and is unrelated to LDP."
      },
      {
       "q": "A closed-loop rule fires 40 times in an hour across the network. Which guardrail should have stopped it?",
       "options": [
        "A per-interface threshold that is unique for every link in the network design.",
        "A longer telemetry sampling interval so the rule sees fewer data points per hour.",
        "A network-wide action rate limit that halts automation and escalates to humans when exceeded.",
        "A dashboard that shows how many times each rule has fired during the last week."
       ],
       "answer": 2,
       "explain": "Widespread triggering suggests a systemic issue that needs humans. Thresholds and sampling reduce sensitivity but do not cap actions, and dashboards do not act."
      },
      {
       "q": "How should an AI assistant that drafts configurations be integrated into a regulated change process?",
       "options": [
        "It applies changes directly in a maintenance window, because it is faster than a human engineer.",
        "It submits drafts as merge requests that pass the same checks and human approval as any change.",
        "It bypasses static analysis, because its output is already validated by the model that produced it.",
        "It approves its own changes, because segregation of duties applies only to human engineers."
       ],
       "answer": 1,
       "explain": "AI output is treated like any other contribution. Direct device access, skipped checks and self-approval violate basic guardrails."
      },
      {
       "q": "What is the main limitation of a virtual lab compared with a production canary?",
       "options": [
        "It cannot run real routing protocols, so convergence behaviour cannot be observed at all.",
        "It cannot apply configuration through NETCONF, so pipelines must fall back to CLI screen-scraping in the lab.",
        "It cannot run tests automatically, so engineers must check results manually after deployment.",
        "It cannot reproduce hardware-specific behaviour or full scale, so some faults only show in production."
       ],
       "answer": 3,
       "explain": "Virtual labs run real protocol stacks and accept automation, but hardware ASIC features and scale differ. Canaries close that gap with limited risk."
      }
     ]
    }
   ]
  },
  {
   "id": "m8-l4",
   "title": "Mock Practical Lab: A Walk-Through of the Full Mastery Ring",
   "subtitle": "One integrated lab touching all eight ring segments, solved with expert method",
   "minutes": 60,
   "objectives": [
    "Read an integrated lab, map task dependencies and plan time boxes before configuring.",
    "Work through tasks across all eight ring segments with verification after each.",
    "Score your own attempt honestly with a structured scoring sheet."
   ],
   "blocks": [
    {
     "type": "text",
     "text": "This lesson walks through a complete mock practical lab built around the ZCIE Mastery Ring. The topology is a fictional company, **Kestrel Freight**: an MPLS core with two PEs and two P routers, a data-centre EVPN fabric with two leaves and a border leaf, three branch sites (one on SD-WAN), an IPTV-style training-video service and an automation host. The mock runs for six hours and is worth 100 points. Read the whole walk-through once, then attempt the lab yourself in a virtual environment."
    },
    {
     "type": "layers",
     "title": "Mock lab topology by ring segment",
     "items": [
      {
       "label": "Code",
       "parts": [
        "Automation host with NETCONF/RESTCONF access to PEs",
        "Verification scripts in a repository"
       ]
      },
      {
       "label": "Stream",
       "parts": [
        "SSM video from DC to branches",
        "WAN QoS policy at branch edges"
       ]
      },
      {
       "label": "Fabric",
       "parts": [
        "Two leaves + border leaf, VXLAN EVPN symmetric IRB",
        "One SD-WAN branch reaching the DC via a hub"
       ]
      },
      {
       "label": "Label",
       "parts": [
        "PE1, PE2, P1, P2 with SR-MPLS and TI-LFA",
        "VRFs CORP and GUEST, hub-and-spoke for GUEST"
       ]
      },
      {
       "label": "BGP and IGP",
       "parts": [
        "IS-IS level 2 core; OSPF at branches",
        "VPNv4 via route reflector; eBGP PE-CE"
       ]
      },
      {
       "label": "Layer2 and Method",
       "parts": [
        "Branch access switching with LACP and spanning tree",
        "Dependency map and verification plan"
       ]
      }
     ]
    },
    {
     "type": "table",
     "title": "Task list and points",
     "head": [
      "Task",
      "Ring segment",
      "Points",
      "Depends on",
      "Verification"
     ],
     "rows": [
      [
       "T1 Branch access bundles and STP root placement",
       "Layer2",
       "8",
       "-",
       "Bundle up, root as designed"
      ],
      [
       "T2 IS-IS core with SR and TI-LFA",
       "IGP / Label",
       "14",
       "-",
       "Prefix SIDs, backup paths present"
      ],
      [
       "T3 VPNv4 RR and PE-CE eBGP for CORP",
       "BGP / Label",
       "16",
       "T2",
       "Site routes in remote VRFs, two-label FIB"
      ],
      [
       "T4 GUEST hub-and-spoke via firewall",
       "Label",
       "10",
       "T3",
       "Spoke-to-spoke trace via hub"
      ],
      [
       "T5 EVPN fabric with type-5 to core",
       "Fabric",
       "16",
       "T3",
       "Type-2/3/5 present, host reachability"
      ],
      [
       "T6 SD-WAN branch via hub, app policy",
       "Fabric",
       "8",
       "T3",
       "Voice on preferred transport"
      ],
      [
       "T7 SSM video and branch QoS",
       "Stream",
       "14",
       "T3, T5",
       "(S,G) state, zero voice drops under load"
      ],
      [
       "T8 NETCONF change plus verification script",
       "Code",
       "14",
       "T3",
       "Confirmed commit, tests pass"
      ]
     ]
    },
    {
     "type": "steps",
     "title": "The walk-through",
     "items": [
      {
       "title": "First 25 minutes: read and map",
       "text": "Read every task. Draw the dependency map: T2 underpins T3, which underpins T4 to T8. Note every verification statement; they define 'done'. Flag ambiguous wording and the assumptions you will make."
      },
      {
       "title": "T1 and T2: foundations (60 minutes)",
       "text": "Configure bundles and root bridges, then IS-IS with SR. Verify adjacencies, prefix SIDs and TI-LFA backups before moving on, because every later task rides on them."
      },
      {
       "title": "T3: the core service (45 minutes)",
       "text": "VRF CORP with unique RDs per PE, VPNv4 to the RR, eBGP to CEs with as-override where sites share an AS. Verify routes in remote VRFs and the two-label stack in the FIB."
      },
      {
       "title": "T4 to T6: topologies and overlays (90 minutes)",
       "text": "Build the GUEST hub-and-spoke with two hub VRFs. Bring up the fabric and advertise DC prefixes as type 5 via the border leaf. Join the SD-WAN branch through the hub and set the voice SLA policy."
      },
      {
       "title": "T7: stream (40 minutes)",
       "text": "Enable PIM and SSM along the RPF path from the DC source, IGMPv3 at the branch. Apply the hierarchical QoS policy and prove it under a load test."
      },
      {
       "title": "T8: code (40 minutes)",
       "text": "Push the requested change through NETCONF with a confirmed commit, then run and fix the verification script until it passes."
      },
      {
       "title": "Final 20 minutes: re-verify everything",
       "text": "Re-run every verification from T1 to T8, because late tasks can break early ones. Save configurations."
      }
     ]
    },
    {
     "type": "cli",
     "title": "A quick re-verification sweep",
     "device": "PE1 · IOS-style CLI",
     "lines": [
      "PE1# show isis neighbors | count Up",
      "Number of lines which match regexp = 2",
      "PE1# show bgp vpnv4 unicast all summary | include 10.255.0.100",
      "10.255.0.100    4 65000   8812   8790   1442    0    0 2d01h        38",
      "PE1# show ip cef vrf CORP 172.16.30.0/24 | include label",
      "  recursive via 10.255.0.2 label 24210",
      "    nexthop 10.1.11.11 GigabitEthernet0/1 label 16002-(local:16002)",
      "PE1# show ip mroute 232.5.5.5 | include flags",
      "(10.60.0.10, 232.5.5.5), 00:21:14/00:02:44, flags: sT"
     ],
     "note": "Four commands confirm four layers: IGP adjacencies, the VPNv4 session and prefix count, the transport plus service label, and the SSM tree. Build your own sweep for every lab and run it twice: halfway and at the end."
    },
    {
     "type": "cli",
     "title": "Troubleshooting ticket inside the mock",
     "device": "PE2 · IOS-style CLI",
     "lines": [
      "! Ticket: Branch 3 (GUEST) cannot reach the guest portal behind the hub.",
      "PE2# show bgp vpnv4 unicast vrf GUEST-SPOKE 10.90.0.0/24",
      "% Network not in table",
      "PE2# show bgp vpnv4 unicast all | include 10.90.0.0",
      " *>i 10.255.0.1:202   10.90.0.0/24   10.255.0.1   0   100   0 65090 i",
      "PE2# show run vrf GUEST-SPOKE | include route-target",
      "  route-target export 65000:201",
      "  route-target import 65000:201"
     ],
     "note": "The hub route exists in BGP but is not imported: the spoke VRF imports its own spoke RT instead of the hub RT 65000:202. One line fixes it, and the spoke-to-spoke traffic must still be checked to traverse the hub."
    },
    {
     "type": "framework",
     "title": "Dependency-map rules",
     "items": [
      {
       "label": "ROOT",
       "title": "Find the roots",
       "text": "Tasks with no dependencies and many dependants (here T2) are done first and verified hardest."
      },
      {
       "label": "PATH",
       "title": "Critical path",
       "text": "The longest chain of dependent tasks sets the minimum time; protect it."
      },
      {
       "label": "LEAF",
       "title": "Leaves are optional",
       "text": "Tasks nothing depends on (T6, T8) can be deferred or dropped if time runs out."
      },
      {
       "label": "REGR",
       "title": "Regression risk",
       "text": "Note which later tasks touch earlier configuration (QoS on PE-CE links, NETCONF on PEs)."
      }
     ]
    },
    {
     "type": "template",
     "title": "Mock-lab scoring sheet",
     "purpose": "Score each task honestly against its verification statement, not against how much you configured.",
     "columns": [
      "Task",
      "Points available",
      "Time box (min)",
      "Time used (min)",
      "Status (full / partial / none)",
      "Verification evidence",
      "Lesson learned"
     ],
     "example": [
      [
       "T3 VPNv4 and PE-CE for CORP",
       "16",
       "45",
       "58",
       "Full",
       "Remote VRF routes; FIB shows 24210 over 16002",
       "Typed wrong RT once; verify RTs before BGP"
      ],
      [
       "T7 SSM and QoS",
       "14",
       "40",
       "35",
       "Partial",
       "(S,G) up; QoS test not run",
       "Leave time for load tests"
      ]
     ],
     "rows": 8
    },
    {
     "type": "scenario",
     "title": "Forty minutes left, two tasks open",
     "situation": "With 40 minutes left you have T6 (8 points, SD-WAN app policy, half done) and T8 (14 points, NETCONF change and verification script, not started). The final re-verification of earlier tasks has not been done. What is the best plan?",
     "options": [
      {
       "text": "Spend 15 minutes re-verifying T1 to T5 and T7, then use the remainder on T8, which is worth more and independent of T6.",
       "feedback": "Correct. Protecting points already earned comes first; then pursue the higher-value independent task within the remaining time.",
       "best": true
      },
      {
       "text": "Finish T6 first because it is half done, then start T8 if time remains, skipping the final verification sweep.",
       "feedback": "Sunk effort is not a reason; skipping re-verification risks losing many points from earlier tasks.",
       "best": false
      },
      {
       "text": "Start T8 immediately and use all 40 minutes on it, because it is the highest-value task still open.",
       "feedback": "Unverified earlier work may have been broken by later changes; a short sweep protects far more points.",
       "best": false
      },
      {
       "text": "Use the full 40 minutes to re-verify everything twice, because accuracy matters more than new tasks.",
       "feedback": "One sweep is enough; spending all remaining time on it gives up achievable points.",
       "best": false
      }
     ]
    },
    {
     "type": "checklist",
     "title": "Mock lab self-review",
     "items": [
      "I read every task before configuring anything",
      "I drew a dependency map and set time boxes",
      "I verified each task against its stated verification before moving on",
      "I recorded assumptions for ambiguous requirements",
      "I did not change defaults or configuration outside task scope",
      "I ran a full re-verification sweep at the end",
      "I scored myself against evidence, not effort",
      "I wrote down three lessons for the next attempt"
     ]
    },
    {
     "type": "quiz",
     "items": [
      {
       "q": "In the mock, why is T2 (IS-IS with SR) treated as the highest-priority task despite not being the highest-scoring?",
       "options": [
        "It is the fastest task to configure, so finishing it early builds confidence for the rest.",
        "It is the only task that can be verified with show commands rather than with test traffic.",
        "Most other tasks depend on it, so an error there silently destroys points across the lab.",
        "It must be configured last, so it can be checked against every other task at the end."
       ],
       "answer": 2,
       "explain": "Dependency, not score, sets priority. Speed and confidence are side benefits; verification methods and ordering claims are wrong."
      },
      {
       "q": "The GUEST spoke VRF shows the hub route in the VPNv4 table but not in the VRF. What is the fastest correct diagnosis?",
       "options": [
        "The spoke VRF's import RT does not match the RT the hub exports, so the route is never imported.",
        "The hub PE uses a different RD, so the spoke PE cannot import its routes into the spoke VRF.",
        "The route reflector is filtering the route, so it reaches the global table but not the VRF.",
        "The transport label to the hub PE is missing, so BGP refuses to import the route into any VRF."
       ],
       "answer": 0,
       "explain": "The route exists in BGP, so distribution works; import depends only on RT match. RDs do not control import, and a missing transport label affects forwarding, not import."
      },
      {
       "q": "What is the purpose of a re-verification sweep at the end of a practical lab?",
       "options": [
        "To reformat configurations so the grader can read them more easily.",
        "To catch earlier tasks broken by later changes before the lab ends.",
        "To reload devices so that every configuration is saved and active.",
        "To add optional features that might earn partial credit on tasks."
       ],
       "answer": 1,
       "explain": "Later changes, such as QoS on PE-CE links, can break earlier work. Reformatting, reloads and unrequested features add risk without protecting points."
      },
      {
       "q": "A task's verification statement says 'spoke-to-spoke traffic traverses the hub'. Which evidence best proves it?",
       "options": [
        "The spoke VRF route table showing the hub route as the only route for that prefix.",
        "The hub PE configuration showing two VRFs with different import and export RTs.",
        "The BGP summary on the spoke PE showing the session to the reflector established.",
        "A traceroute between two spokes that shows the hub firewall hop in the path."
       ],
       "answer": 3,
       "explain": "The statement is about the data path, so a data-path test is the evidence. Route tables and configurations suggest it; they do not prove it."
      },
      {
       "q": "How should you score a task where you configured everything but the verification test fails?",
       "options": [
        "As fully achieved, because the configuration effort clearly shows that you understand the topic.",
        "As fully achieved if the failure is caused by a task completed by someone else.",
        "As not achieved or partial at best, because tasks are scored against the stated verification.",
        "As not attempted, because a failed verification means the work did not happen."
       ],
       "answer": 2,
       "explain": "Results, not effort, earn points. Self-scoring should mirror that honestly; 'not attempted' misrepresents partial progress you may still salvage."
      }
     ]
    }
   ]
  },
  {
   "id": "m8-l5",
   "title": "Exam-Day Strategy and the ZCIE Capstone",
   "subtitle": "Time, triage, verification discipline and the final project that proves expert practice",
   "minutes": 35,
   "objectives": [
    "Apply a time and triage strategy to a long practical exam.",
    "Handle ambiguous requirements and troubleshooting tickets without collateral damage.",
    "Plan the ZCIE capstone deliverables and how they will be assessed."
   ],
   "blocks": [
    {
     "type": "text",
     "text": "Expert practical exams are as much about judgement under time pressure as about technical depth. Candidates who fail often know the material but lose points to unread requirements, unverified work, rabbit holes and changes that break earlier tasks. This lesson turns the Method segment of the Mastery Ring into an exam-day routine and then introduces the **ZCIE capstone**, the project that closes the programme."
    },
    {
     "type": "flow",
     "title": "Exam-day timeline",
     "items": [
      {
       "label": "Before",
       "text": "Sleep, logistics checked, keyboard and environment familiar"
      },
      {
       "label": "Read",
       "text": "Full read-through, dependency map, points per task, assumptions noted"
      },
      {
       "label": "Build",
       "text": "Foundations first, verify each task immediately"
      },
      {
       "label": "Checkpoints",
       "text": "At 50% and 80% of time: progress against plan, re-prioritise"
      },
      {
       "label": "Sweep",
       "text": "Final re-verification of everything, configurations saved"
      }
     ]
    },
    {
     "type": "formula",
     "title": "Time budget",
     "items": [
      {
       "name": "Minutes per point",
       "expr": "(total time − read time − sweep time) ÷ total points",
       "meaning": "(360 − 25 − 20) ÷ 100 = 3.15 minutes per point; a 14-point task gets about 44 minutes."
      },
      {
       "name": "Rabbit-hole limit",
       "expr": "time box × 1.5",
       "meaning": "When a task exceeds 150% of its box, park it, note where you are and move on."
      }
     ]
    },
    {
     "type": "framework",
     "title": "Rules that protect points",
     "items": [
      {
       "label": "READ",
       "title": "Read the whole task",
       "text": "Constraints often appear in the last sentence: 'without static routes', 'using only the provided loopbacks'."
      },
      {
       "label": "SCOP",
       "title": "Stay in scope",
       "text": "Never change defaults, timers or configuration not requested; graders and later tasks may depend on them."
      },
      {
       "label": "VERI",
       "title": "Verify immediately",
       "text": "Use the task's own verification statement as your test; save configuration after each success."
      },
      {
       "label": "PARK",
       "title": "Park, do not sink",
       "text": "Use the rabbit-hole limit; return later with fresh eyes."
      },
      {
       "label": "NOTE",
       "title": "Write assumptions",
       "text": "When wording is ambiguous, choose the minimal literal interpretation and record it."
      }
     ]
    },
    {
     "type": "cli",
     "title": "A personal verification sweep, one line per ring segment",
     "device": "Exam notes · IOS-style CLI",
     "lines": [
      "! Layer2: bundles, roots, blocked ports",
      "show etherchannel summary | include SU",
      "show spanning-tree root",
      "! IGP: adjacencies and loopback reachability",
      "show isis neighbors",
      "show ip route 10.255.0.0 255.255.0.0 longer-prefixes",
      "! BGP: sessions and prefix counts",
      "show bgp all summary",
      "! Label: labels for every PE loopback, VPN routes per VRF",
      "show mpls forwarding-table | include 10.255.0.",
      "show bgp vpnv4 unicast all summary",
      "! Fabric: EVPN peers and VNIs",
      "show nve peers",
      "! Stream: PIM neighbours, RP mapping, QoS drops",
      "show ip pim neighbor",
      "show ip pim rp mapping",
      "show policy-map interface | include Class-map|drops"
     ],
     "note": "Memorise a sweep like this and adapt it to the lab topology. Run it at the halfway checkpoint and again in the final minutes; differences between the two runs are the first place to look."
    },
    {
     "type": "steps",
     "title": "Troubleshooting tickets under exam conditions",
     "items": [
      {
       "title": "Reproduce",
       "text": "Confirm the symptom exactly as stated, from the stated source to the stated destination."
      },
      {
       "title": "Bound",
       "text": "Decide which ring segment the symptom lives in and which device holds the evidence."
      },
      {
       "title": "Narrow",
       "text": "Use the layered methods from this programme: underlay first, then labels, services, overlays, policies."
      },
      {
       "title": "Fix minimally",
       "text": "Change the smallest thing that restores the intended design; do not redesign."
      },
      {
       "title": "Prove and protect",
       "text": "Re-run the ticket's test and check that nothing else changed."
      }
     ]
    },
    {
     "type": "compare",
     "title": "Exam-day habits",
     "columns": [
      {
       "title": "Do",
       "items": [
        "Plan time boxes and keep them",
        "Verify every task against its statement",
        "Save configurations regularly",
        "Keep a running list of parked items and assumptions"
       ]
      },
      {
       "title": "Avoid",
       "items": [
        "Configuring while still reading",
        "Fixing unrelated 'improvements' you notice",
        "Reloading devices without need",
        "Spending an hour on a five-point task"
       ]
      }
     ]
    },
    {
     "type": "scenario",
     "title": "An ambiguous requirement",
     "situation": "A task says: 'Ensure branch 2 prefers the MPLS path for all traffic to the data centre.' It does not say how. Branch 2 runs eBGP to its PE and also has an SD-WAN tunnel via the hub. What is the best approach?",
     "options": [
      {
       "text": "Shut down the SD-WAN tunnel on branch 2, because then MPLS is the only path and is preferred automatically.",
       "feedback": "That removes redundancy, which the task did not ask for, and may break other tasks that use the tunnel.",
       "best": false
      },
      {
       "text": "Use the least invasive standard tool on branch 2, such as local preference on routes from the MPLS PE, verify with a trace, and note the assumption.",
       "feedback": "Correct. A minimal, standard change that satisfies the literal requirement and is verified and documented protects points and avoids side effects.",
       "best": true
      },
      {
       "text": "Change IS-IS metrics in the provider core, so the MPLS path toward the data centre looks shorter everywhere.",
       "feedback": "Core metrics do not influence branch path choice between MPLS and SD-WAN, and they affect every other task.",
       "best": false
      },
      {
       "text": "Ask the proctor which method to use and wait for an answer before doing anything else on the task.",
       "feedback": "Proctors rarely clarify technical approach; waiting wastes time when a reasonable interpretation exists.",
       "best": false
      }
     ]
    },
    {
     "type": "text",
     "text": "**The ZCIE capstone** is an expert mock lab across the whole Mastery Ring. You build and document a lab of fifteen or more nodes for a fictional national carrier and its enterprise customers, then break and fix it under time pressure. It is assessed against a rubric with one criterion per ring segment, rising from trial and error, through structured and correct, to fast, evidence-based and proven. Volume of configuration earns nothing on its own; verified behaviour and clear reasoning do."
    },
    {
     "type": "framework",
     "title": "Capstone deliverables",
     "items": [
      {
       "label": "D1",
       "title": "Topology and core design",
       "text": "Lab topology and addressing for 15+ nodes, and an IGP design with fast convergence (BFD, LFA or TI-LFA) proven by measurement."
      },
      {
       "label": "D2",
       "title": "Routing and services",
       "text": "A BGP route-reflection and community policy framework, plus an MPLS L3VPN or SR-MPLS service for three customers."
      },
      {
       "label": "D3",
       "title": "Fabric and streams",
       "text": "A VXLAN EVPN fabric with anycast gateway, a PIM-SM or SSM service with RP redundancy, and an end-to-end QoS policy with validation."
      },
      {
       "label": "D4",
       "title": "Automation",
       "text": "An automated verification suite built with Python, Ansible and templating, run before and after every change."
      },
      {
       "label": "D5",
       "title": "Pressure test and summary",
       "text": "A timed troubleshooting log of eight faults found and fixed, and an executive summary with lessons learned."
      }
     ]
    },
    {
     "type": "checklist",
     "title": "Exam-day kit",
     "items": [
      "Personal verification sweep per ring segment memorised",
      "Time budget calculated for the published total time and points",
      "Rabbit-hole rule agreed with yourself in advance",
      "Assumptions log ready (paper or notes file)",
      "Habit of saving configuration after each verified task",
      "Plan for the 50% and 80% checkpoints",
      "Rest, food and water planned for a long day"
     ]
    },
    {
     "type": "reflection",
     "prompt": "Look back over all eight segments of the ZCIE Mastery Ring. Which segment would cost you the most points if the exam were tomorrow? Write a two-week plan that closes that gap, including one full mock lab under timed conditions."
    },
    {
     "type": "quiz",
     "items": [
      {
       "q": "With 360 minutes, 25 for reading, 20 for the final sweep and 100 points, how long should a 10-point task take?",
       "options": [
        "About 32 minutes, using roughly 3.15 minutes per point.",
        "About 36 minutes, using 3.6 minutes per point over the full exam time.",
        "About 45 minutes, using a fixed 1.5 multiplier on every single task.",
        "About 20 minutes, using two minutes per point for any core task."
       ],
       "answer": 0,
       "explain": "(360 − 25 − 20) ÷ 100 = 3.15 minutes per point, so 10 points ≈ 32 minutes. Using full time ignores reading and sweep; the 1.5 multiplier is the rabbit-hole limit, not the budget."
      },
      {
       "q": "During a task you notice an unrelated OSPF timer that you would normally tune. What should you do?",
       "options": [
        "Tune it, because experts are expected to improve every configuration they touch.",
        "Tune it only on one router, so that the change has a smaller effect if it is wrong.",
        "Leave it, because changes outside task scope can break other tasks or grading checks.",
        "Remove it, because non-default timers are always a sign of an intended fault."
       ],
       "answer": 2,
       "explain": "Scope discipline protects points. Non-default values may be intentional and other tasks may depend on them."
      },
      {
       "q": "A troubleshooting ticket is fixed by redesigning the routing between two sites. What is the risk?",
       "options": [
        "The redesign will be graded higher, because it shows more effort and skill than a minimal fix would.",
        "The redesign cannot be verified because ticket tests check only the configuration lines.",
        "The redesign will always be reverted automatically when the lab reaches its end time.",
        "The redesign may restore the symptom but violate the intended design and break other tasks."
       ],
       "answer": 3,
       "explain": "Tickets expect the minimal fix that restores intended behaviour. Larger changes add risk without extra credit."
      },
      {
       "q": "Which capstone deliverable shows that you can restore the network under time pressure, not only build it?",
       "options": [
        "The timed troubleshooting log of eight faults found and fixed.",
        "The lab topology and addressing plan for more than fifteen nodes.",
        "The BGP route-reflection and community policy framework document.",
        "The executive summary with the lessons learned from the build."
       ],
       "answer": 0,
       "explain": "The troubleshooting log is the evidence of finding and fixing faults against the clock. Topology, policy framework and summary document the build but do not test recovery under pressure."
      },
      {
       "q": "At the 50% checkpoint you have earned fewer points than planned. What is the best response?",
       "options": [
        "Skip the final verification sweep, so the time can be spent on configuring more tasks.",
        "Re-prioritise remaining tasks by value and dependency, and drop or defer low-value leaf tasks.",
        "Work faster on every remaining task without verifying, then verify all at the very end.",
        "Return to the first task and redo it, because early mistakes are probably the cause."
       ],
       "answer": 1,
       "explain": "Re-planning by value and dependency recovers the most points. Skipping verification risks losing earned points, and redoing work without evidence wastes time."
      }
     ]
    }
   ]
  }
 ]
});
TRACK.exam.push([
 {
  "module": "m5",
  "q": "An LSP trace from PE3 to PE1's loopback 10.255.1.1/32 shows 'L' at P1 and 'U' at P2. P2's configuration contains: `ip access-list standard LDP-FEC permit 10.255.0.0 0.0.0.255` and `mpls ldp advertise-labels for LDP-FEC`. What is the root cause and best fix?",
  "options": [
   "P2 has no LDP session toward P1, so labels learned from PE1 cannot be passed upstream; restart LDP on P2 to rebuild the session.",
   "PE1 advertises implicit null for its loopback, so P2 pops the label too early; configure explicit null on PE1 to keep the label.",
   "The LDP label filter covers only 10.255.0.0/24, so no label is advertised for 10.255.1.1; widen the ACL to every PE loopback range.",
   "The IS-IS metric toward PE1 changed, so P2 uses a path without LDP; restore the old metric so traffic returns to the labelled path."
  ],
  "answer": 2,
  "explain": "The filter permits only 10.255.0.x, so P2 never advertises (or uses) a label for 10.255.1.1 and forwards unlabelled. A down session would affect all prefixes, PHP is normal behaviour that appears as implicit null at the penultimate hop rather than unlabelled output mid-path, and nothing in the output points to a metric change."
 },
 {
  "module": "m5",
  "q": "A customer site is dual-homed to PE1 and PE2. Both PEs use RD 65000:50 for the VRF. When the PE1-CE link fails, remote PEs take about 40 seconds to move traffic to PE2. Reflectors show only one path for the site prefixes. What change most directly improves convergence?",
  "options": [
   "Give each PE a unique RD for the VRF so the reflectors keep and reflect both paths, enabling fast failover at remote PEs.",
   "Lower the BGP keepalive and hold timers on the VPNv4 sessions between the PEs and the route reflectors in the core.",
   "Enable LDP session protection on the core so that the transport labels survive the PE-CE link failure without relearning.",
   "Configure as-override toward the CE on both PEs so the site accepts routes that pass through the other PE as well."
  ],
  "answer": 0,
  "explain": "With identical RDs the reflector selects one best VPN path and hides the other, so remote PEs must wait for a withdrawal and new best path. Unique RDs expose both paths. BGP timers do not detect a PE-CE link failure, the core transport is unaffected, and as-override addresses AS-path loops."
 },
 {
  "module": "m5",
  "q": "PE1's forwarding table shows local label 16004 but outgoing label 900004 toward P2 for the SR prefix with index 4. All traffic to the prefix is delivered correctly. What is the correct interpretation?",
  "options": [
   "P2 has an index collision for prefix SID 4, so PE1 uses a fallback label; renumber the index on the destination router.",
   "P2's SRGB starts at 900000, so PE1 correctly sends P2's label for index 4; aligned SRGBs would simplify operations.",
   "PE1 has fallen back to an LDP label for the prefix, so SR is not in use; enable SR preference on PE1 to fix the label.",
   "PE1 is applying a TI-LFA repair label, so the primary path has failed; check for a down link between PE1 and P2 now."
  ],
  "answer": 1,
  "explain": "The outgoing label equals the next hop's SRGB base plus index, so different SRGBs yield different labels per hop and are valid. A collision would cause conflict errors, LDP labels would not follow the SRGB arithmetic, and TI-LFA repair would push additional labels on a backup interface."
 },
 {
  "module": "m5",
  "q": "Inside VRF ORANGE, `ping vrf ORANGE 172.16.30.1 size 1500 df-bit` fails while size 1488 succeeds. Traffic crosses a core using a transport label, a service label and one additional TE label. What is the root cause?",
  "options": [
   "The CE router has an IP MTU of 1488 on its PE-facing interface, which was configured to match the provider's link.",
   "The PE fragments labelled packets at 1488 bytes because the DF bit is ignored for traffic carried in a VRF table.",
   "The service label is 12 bytes long for VPN routes, so the core must reserve 12 bytes for every VPN packet sent.",
   "A core link has an MPLS MTU of 1500, which leaves room for only 1488 bytes of IP once three labels are added."
  ],
  "answer": 3,
  "explain": "Three labels add 12 bytes: 1488 + 12 = 1500, exactly the core MPLS MTU. If the CE limited the size, the ping from the PE would not be affected that way; labelled packets are not fragmented when DF is set; and each label is 4 bytes."
 },
 {
  "module": "m5",
  "q": "Customer routes from OSPF site A arrive at OSPF site B as type-5 external routes instead of inter-area routes, so a backup static default at site B wins. PE1 runs `router ospf 10 vrf BLUE` and PE2 runs `router ospf 20 vrf BLUE`. What is the most likely cause?",
  "options": [
   "The PEs use different route distinguishers for VRF BLUE, so the routes are marked as external during import.",
   "The down bit is not being set on PE1, so PE2 treats the routes as having originated outside the VPN backbone.",
   "A sham-link is missing between the PEs, so OSPF can only advertise VPN routes into the site as external routes.",
   "The PEs derive different OSPF domain IDs from their process IDs, so routes are treated as external."
  ],
  "answer": 3,
  "explain": "When domain IDs differ, VPN routes are redistributed as externals. Setting the same domain ID (or process ID) restores inter-area routes. RDs do not influence OSPF route type, the down bit prevents loops, and sham-links are for intra-area preference, not for avoiding externals."
 },
 {
  "module": "m5",
  "q": "On PE1, `show segment-routing traffic-eng policy color 100` shows the only candidate path invalid with the reason 'segment-list first SID 16099 unresolved'. Coloured VPN routes are following the IGP path. What is the best fix?",
  "options": [
   "Correct the explicit segment list so it references a node SID that exists, or add a dynamic candidate path as fallback.",
   "Increase the SRGB on PE1 so that label 16099 falls inside the range and can be resolved by the headend router.",
   "Remove the colour community from the VPN routes, because coloured routes cannot use an explicit segment list.",
   "Enable LDP on all core links, because explicit segment lists need LDP labels to resolve their first segment."
  ],
  "answer": 0,
  "explain": "No node advertises the SID behind 16099, so the explicit path is invalid and steering falls back. Fix the list, ideally with a dynamic fallback path. 16099 is already inside a 16000-23999 SRGB; removing colours abandons the intent; SR does not need LDP."
 },
 {
  "module": "m5",
  "q": "In a hub-and-spoke VPN, traceroutes show spoke-to-spoke traffic going directly between spoke PEs instead of through the hub firewall. Spoke VRFs import RTs 65000:202 (hub) and 65000:201 (spoke) and export 65000:201. What is the best fix?",
  "options": [
   "Change the spoke RDs to a single shared value so all spoke routes collapse into one path pointing at the hub PE.",
   "Add a static default route in each spoke VRF pointing to the hub PE's loopback address in the global table.",
   "Remove the 65000:201 import from the spoke VRFs so spokes learn only hub routes and must route via the hub.",
   "Disable route reflection for the spoke PEs so they no longer receive each other's routes from the reflector."
  ],
  "answer": 2,
  "explain": "Importing the spoke RT gives spokes each other's specific routes, which beat the hub path. Removing it enforces the topology. RDs do not filter imports, a default route loses to more specific spoke routes, and disabling reflection breaks the whole VPN."
 },
 {
  "module": "m5",
  "q": "In an inter-AS option C design, PE1 in AS 65000 has VPNv4 routes from PE9 in AS 65100 with next hop 10.200.0.9, but `show ip cef vrf RED` shows the route unusable with no label for 10.200.0.9. What should be checked first?",
  "options": [
   "Whether the route reflectors in the two ASes are exchanging VPNv4 routes over a multihop eBGP session with each other.",
   "Whether 10.200.0.9/32 is advertised with a label via BGP labelled unicast across the ASBRs into AS 65000.",
   "Whether the ASBRs have the VRF RED configured with matching route targets for the customer's routes.",
   "Whether the PE9 loopback is redistributed into the IS-IS of AS 65000 as a plain route without any label."
  ],
  "answer": 1,
  "explain": "Option C needs a labelled path to remote PE loopbacks; the VPN routes already arrived, so the multihop session works. ASBRs hold no VRFs in option C, and a plain unlabelled IGP route still leaves the next hop without a label."
 },
 {
  "module": "m6",
  "q": "Leaves use eBGP with one AS per leaf and `route-target import auto` for VNI 10010. Leaf1 (AS 65101) shows type-2 routes from Leaf4 (AS 65104) in the BGP table but does not install them in the MAC table. What is the most likely cause?",
  "options": [
   "Leaf1 and Leaf4 use different route distinguishers for VNI 10010, so the routes are treated as separate entries.",
   "The spines are rewriting the next hop to themselves, so Leaf1 cannot build a VXLAN tunnel toward Leaf4's VTEP.",
   "ARP suppression is enabled on Leaf1, so it ignores type-2 routes that carry both a MAC and an IP address together.",
   "Auto-derived RTs include each leaf's own AS, so Leaf4 exports 65104:10010 while Leaf1 imports only 65101:10010."
  ],
  "answer": 3,
  "explain": "Auto RT derivation uses the local AS; with per-leaf ASes the values differ and nothing matches. Use explicit RTs or an import option that ignores the AS. Different RDs are normal, a next-hop rewrite would break forwarding rather than import, and ARP suppression uses type-2 routes."
 },
 {
  "module": "m6",
  "q": "In an eBGP EVPN fabric, every leaf shows its EVPN sessions to the spines established, but no leaf receives EVPN routes from any other leaf. The spines have no VRFs or VNIs configured. What is the most likely cause?",
  "options": [
   "The leaves are missing an underlay route to the spine loopbacks, so the EVPN updates are dropped in transit.",
   "The spines discard EVPN routes through route-target filtering, because they import no RTs and retain none.",
   "The spines have ARP suppression enabled, so they cannot forward type-2 routes that contain host IP addresses.",
   "The leaves use the same L3 VNI for every tenant VRF, so the spines merge all routes and then discard them."
  ],
  "answer": 1,
  "explain": "Without VRFs a spine's default RT filtering drops every EVPN route; it must retain all route targets. Established multihop sessions prove underlay reachability, ARP suppression is a leaf feature, and L3 VNI choices do not affect spine propagation."
 },
 {
  "module": "m6",
  "q": "After a new fabric goes live, pings and small transactions between VMs on different leaves succeed, but VM live migrations and large file copies fail. Underlay interfaces are configured with MTU 1500. What is the root cause?",
  "options": [
   "The VXLAN UDP source port changes per flow, which causes reordering that breaks large transfers on the underlay.",
   "The anycast gateway MAC differs between leaves, so long-lived flows break when they move between the leaves.",
   "The underlay cannot carry 1500-byte tenant frames plus 50 bytes of VXLAN overhead, so large packets are dropped.",
   "The type-3 routes are missing for the VNI, so only unknown unicast fails while small packets are still delivered."
  ],
  "answer": 2,
  "explain": "VXLAN adds 50 bytes; full-size tenant frames exceed a 1500-byte underlay. Per-flow ports keep packets of one flow on one path, gateway MAC problems would break routing for all sizes, and missing type-3 routes break BUM rather than large packets."
 },
 {
  "module": "m6",
  "q": "In a symmetric IRB fabric, hosts in the same subnet on different leaves communicate, but routed traffic to hosts behind Leaf6 fails. Type-2 routes from Leaf6 show 'Received label 10020' only and no Router MAC community. What is the best fix?",
  "options": [
   "Configure the tenant L3 VNI on Leaf6 and bind it to the NVE interface so routes carry label 2 and router MAC.",
   "Enable ARP suppression on Leaf6 so that it advertises the IP part of each type-2 route to the other leaves in the fabric.",
   "Configure a unique anycast gateway MAC on Leaf6 so that remote leaves can address routed traffic to it directly.",
   "Advertise every host on Leaf6 as a type-5 route so the remote leaves can reach them without any L3 VNI at all."
  ],
  "answer": 0,
  "explain": "Without an L3 VNI the leaf cannot participate in symmetric routing: its routes lack label 2 and the router MAC. ARP suppression does not add labels, anycast gateway MACs must be identical, and type-5 routes also require the L3 VNI and router MAC."
 },
 {
  "module": "m6",
  "q": "A legacy switch connects to Leaf2 and Leaf5 with two separate, unbundled trunks. Hosts behind it are repeatedly flagged as duplicate MACs and lose connectivity. What is the best fix?",
  "options": [
   "Disable MAC mobility on Leaf2 and Leaf5 so the leaves stop counting moves and keep advertising the host MACs.",
   "Increase the duplicate-detection threshold so that more MAC moves are tolerated before the advertisement is frozen.",
   "Assign the two trunks to different VLANs so that each leaf learns a different subset of the hosts behind the switch.",
   "Bundle the two links into one LACP port channel configured as an all-active Ethernet segment with a shared ESI on both leaves."
  ],
  "answer": 3,
  "explain": "Two unbundled links create a Layer 2 loop or constant MAC moves between leaves; an ES with LACP makes them one logical attachment with DF election. Disabling mobility or raising thresholds hides the loop, and splitting VLANs breaks the hosts' design."
 },
 {
  "module": "m6",
  "q": "Two border leaves advertise a default route as type 5 into the tenant VRF. When Border1's WAN link fails, half of all outbound flows black-hole. Border1 originates the default with an 'always' option. What is the best fix?",
  "options": [
   "Originate the default only while it is learned from the external peer, so Border1 withdraws it when the WAN link fails.",
   "Lower the BGP hold timers between the leaves and the spines so the failure is detected faster by every leaf in the fabric.",
   "Configure Border1 and Border2 with the same VTEP address so remote leaves cannot distinguish the two border paths.",
   "Add a static default route on each leaf pointing at Border2 with a higher administrative distance than the BGP default."
  ],
  "answer": 0,
  "explain": "The 'always' default keeps attracting traffic after Border1 lost its exit. Conditional origination ties advertisement to real reachability. Faster timers do not help because the EVPN sessions stay up, a shared VTEP does not fix the advertisement, and a floating static never wins while BGP still offers the route."
 },
 {
  "module": "m6",
  "q": "An SD-WAN application-aware routing policy steers traffic matching DSCP EF onto MPLS. Phones mark voice EF, but captures at the edge's LAN interface show voice arriving with DSCP 0, and voice is using the internet path. What is the root cause?",
  "options": [
   "The MPLS transport currently fails the VOICE SLA class, so the edge correctly falls back to the internet transport.",
   "The branch access switch does not trust the phones and re-marks their traffic, so the edge policy never matches EF.",
   "The edge copies DSCP to the tunnel header, which hides the original marking from the application-aware policy.",
   "The controller has not distributed the MPLS transport locator, so the edge cannot build tunnels on MPLS at all."
  ],
  "answer": 1,
  "explain": "The packets arrive at the edge already re-marked to 0, so the EF match fails before any SLA check. SLA fallback would show EF traffic arriving correctly, DSCP copy affects the outer header only, and a missing locator would affect all traffic on MPLS."
 },
 {
  "module": "m6",
  "q": "During a data-centre migration, the fabric's anycast gateway was enabled for VLAN 140 while the legacy FHRP gateway remained active. Firewall logs show asymmetric-flow drops for VLAN 140 hosts. What should have been done?",
  "options": [
   "Give the anycast gateway a different IP address from the legacy gateway, so hosts can use both gateways in parallel.",
   "Enable ARP suppression for the VLAN, so hosts only ever learn the fabric gateway's MAC and ignore the legacy one.",
   "Disable the legacy FHRP for the VLAN in the same change that enables the anycast gateway, so one gateway is active.",
   "Extend additional VLANs to the legacy core, so the firewall sees traffic from both gateways on the same interfaces."
  ],
  "answer": 2,
  "explain": "Two active gateways split return paths across firewalls or interfaces, causing asymmetric drops. One gateway per VLAN, switched in a single change, avoids this. Different gateway IPs require host changes, ARP suppression does not stop the legacy gateway answering, and extending VLANs increases the problem."
 },
 {
  "module": "m7",
  "q": "Receivers behind R7 have (*,G) state for 239.30.1.1 pointing at RP 10.255.0.100, but the first-hop router of the source shows RP 10.255.0.200 for the same group and registers there. No traffic reaches the receivers. What is the root cause?",
  "options": [
   "The source uses a TTL of 1, so the first-hop router cannot register the packets with any rendezvous point.",
   "Routers disagree on the RP for the group, so sources register with one RP while receivers join another.",
   "The receivers are using IGMPv2, so their (*,G) joins cannot reach an RP that is configured with BSR.",
   "The RP at 10.255.0.100 fails the RPF check for the source, so it drops all register messages it receives."
  ],
  "answer": 1,
  "explain": "Sources and receivers meet only if they agree on the RP. The output shows two different RPs for one group. A TTL of 1 would prevent registering at all, IGMP version does not affect RP choice, and register messages are unicast and not subject to the multicast RPF check."
 },
 {
  "module": "m7",
  "q": "A new IPTV service uses SSM groups in 232.0.0.0/8. The last-hop router shows IGMP membership for the groups but no (S,G) state, and set-top boxes report IGMPv2. What is the best fix?",
  "options": [
   "Configure a static RP for 232.0.0.0/8 so that the last-hop router can build a (*,G) shared tree for the SSM groups.",
   "Enable MSDP between the head-end routers so that the last-hop router can learn which sources are active.",
   "Disable IGMP snooping on the access switches so that the IGMPv2 reports reach the last-hop router unchanged.",
   "Use IGMPv3 on the boxes, or SSM mapping on the last-hop router to turn group-only reports into (S,G) joins."
  ],
  "answer": 3,
  "explain": "SSM needs source-specific joins. IGMPv2 cannot carry the source, so either upgrade or map. SSM ranges do not use an RP, MSDP is for ASM between RPs, and the reports already reach the router."
 },
 {
  "module": "m7",
  "q": "Branch receivers can join 239.192.10.1 (regional training video) but not 239.1.1.1 (company-wide broadcast). Both groups use the same RP. The branch WAN interface has `ip multicast boundary MCAST-SCOPE`, which permits 239.192.0.0/16 only. What is the best fix?",
  "options": [
   "Add the company-wide group range to the boundary ACL, which is blocking 239.1.1.1 at the WAN edge.",
   "Move 239.1.1.1 to a different RP, because the shared RP cannot serve two groups from different scopes at once.",
   "Convert the regional group to SSM, because ASM groups in 239.192.0.0/16 take precedence over other ranges.",
   "Raise the source TTL for 239.1.1.1, because company-wide groups need a larger TTL to cross the WAN boundary."
  ],
  "answer": 0,
  "explain": "The boundary ACL defines which groups may cross the interface; 239.1.1.1 is not permitted. RPs can serve any number of groups, scope ranges have no precedence over each other, and TTL is not the filtering mechanism here."
 },
 {
  "module": "m7",
  "q": "`show policy-map interface` on a WAN edge shows the VOICE priority class with offered rate 24 Mbit/s against a 20 Mbit/s priority limit and many exceed drops. Call volume has not changed, but a desktop video client was rolled out last week. What is the most likely cause and fix?",
  "options": [
   "The voice codec changed to a higher bit rate; raise the priority limit to 40% of the link to accommodate it.",
   "The shaper is too slow for voice; remove the parent shaper so voice can use the full physical interface rate.",
   "The video client marks its traffic EF and is trusted; re-mark it at the access trust boundary to its proper video class.",
   "The WRED thresholds are too low in the priority class; disable random-detect so voice is no longer dropped."
  ],
  "answer": 2,
  "explain": "New EF traffic appeared with the video rollout, so the priority class is overloaded by traffic that does not belong there. Raising the limit risks starving other classes, removing the shaper exposes the provider policer, and priority classes do not use WRED."
 },
 {
  "module": "m7",
  "q": "Voice at a branch shows 40 ms of jitter whenever backups run. The WAN policy is a parent shaper at 50 Mbit/s with a child LLQ policy. The shaper shows `bc 6250000` (Tc = 125 ms). What is the best change?",
  "options": [
   "Reduce the shaper's committed burst so Tc is 10 ms or less, releasing traffic in short, smooth intervals.",
   "Move voice out of the priority queue into a bandwidth class, so it is no longer released in bursts by the shaper.",
   "Replace the parent shaper with a policer at 50 Mbit/s, because policers never add any delay to voice traffic.",
   "Increase the child policy's queue limits, so backup traffic no longer fills the queue that voice shares with it."
  ],
  "answer": 0,
  "explain": "A long Tc lets the shaper send large bursts then stall, adding jitter for voice behind it. A short Tc smooths output. A bandwidth class gives voice worse treatment, a policer loses class protection, and voice does not share a queue with backups."
 },
 {
  "module": "m7",
  "q": "A business application gets only 30 Mbit/s through a 100 Mbit/s ingress policer configured with a 1,500-byte committed burst, even though the link is otherwise idle. Packet captures show regular TCP retransmissions. What is the best fix?",
  "options": [
   "Lower the policer's rate to 30 Mbit/s so it matches the throughput the application can actually reach in practice.",
   "Apply WRED to the policer, so drops become random and TCP flows back off more gradually than they do with tail drops.",
   "Mark the application traffic EF so that it bypasses the policer and is forwarded through the priority queue instead.",
   "Increase the policer's committed burst to absorb normal TCP bursts, or shape upstream to the contract rate."
  ],
  "answer": 3,
  "explain": "A burst of one packet drops normal TCP bursts and triggers repeated backoff. A realistic Bc, or smoothing with a shaper upstream, restores throughput. Lowering the rate formalises the problem, WRED does not apply to policers, and EF marking does not bypass a policer."
 },
 {
  "module": "m7",
  "q": "A VPN customer reports that DSCP values change after crossing the provider: AF21 traffic arrives as DF whenever their traffic exceeds its contracted class rate. The provider re-marks excess traffic to TC 0 at ingress. Which provider change prevents this?",
  "options": [
   "Use explicit null on the egress PEs, so the customer DSCP is restored from the explicit null label at the last hop.",
   "Use the pipe or short-pipe DiffServ model, so provider TC changes are not copied back into customer DSCP.",
   "Use per-VRF label allocation, so the egress PE performs an IP lookup and resets DSCP to the original value.",
   "Use penultimate hop popping, so the label carrying the re-marked TC is removed before reaching the egress PE."
  ],
  "answer": 1,
  "explain": "In the uniform model, TC changes are propagated into the IP header. Pipe and short-pipe preserve customer DSCP. Explicit null keeps TC visible but does not restore DSCP, label allocation mode does not affect marking, and PHP does not undo a copy."
 },
 {
  "module": "m8",
  "q": "A pipeline job fails on PE4 with the NETCONF error `lock-denied` and an error-info session-id of 4127. Another automation job is scheduled for the same device. What is the best response?",
  "options": [
   "Kill session 4127 immediately, because a NETCONF lock always means a stuck session that is blocking changes.",
   "Retry without locking, editing the running datastore directly so the job completes inside the change window.",
   "Treat it as a concurrency conflict: let the holding session finish, and enforce per-device job serialisation in the pipeline.",
   "Commit the candidate anyway with a forced commit, because the lock only protects against accidental edits."
  ],
  "answer": 2,
  "explain": "lock-denied means another session legitimately holds the lock; serialising jobs per device prevents collisions. Killing sessions or bypassing locks risks corrupting another change, and NETCONF has no forced commit that overrides locks."
 },
 {
  "module": "m8",
  "q": "Rendered configurations for three PEs contain the line `neighbor  remote-as 65010` with two spaces. Devices rejected the line during deployment. Which pipeline improvement prevents this class of error earliest?",
  "options": [
   "Add a canary stage so that the rejected line is detected on fewer devices before the full deployment begins.",
   "Use strict undefined rendering and validate intent against a schema, so missing fields fail the build.",
   "Add a post-deployment check that counts BGP neighbours, so the missing peer is reported after the change.",
   "Add a human review of the rendered configuration diff, so engineers can spot blank values before approval."
  ],
  "answer": 1,
  "explain": "The blank came from a missing variable; strict rendering and schema checks stop it at build time. Canaries and post-checks detect it later, and human review is valuable but less reliable than an automated fail-fast check."
 },
 {
  "module": "m8",
  "q": "A change passed schema checks and static analysis but failed on the production canary because a feature behaves differently on the router's software release. Which additional pipeline stage would most likely have caught it?",
  "options": [
   "A virtual lab test on the same software release as production, running the verification suite on real stacks.",
   "A stricter YAML lint stage that rejects any intent data not formatted to the team's indentation and style rules.",
   "A snapshot test that compares the rendered configurations with the previous approved version in the repository.",
   "A second static analysis run with a different snapshot of the network taken from the previous night's backups."
  ],
  "answer": 0,
  "explain": "Behavioural differences in software are found only by running that software. Linting and snapshots check form, and static analysis models behaviour generically rather than release-specifically."
 },
 {
  "module": "m8",
  "q": "A closed-loop rule drains a link when its error rate exceeds a threshold and restores it when the rate falls. On a marginal optic, the link has been drained and restored 26 times today. What is the best improvement?",
  "options": [
   "Lower the threshold so the link is drained earlier, which keeps traffic off the marginal optic for longer each time.",
   "Remove the verification step after draining, so the rule completes faster and generates fewer events per action.",
   "Increase the telemetry sample interval, so the rule sees fewer error spikes and triggers less often overall.",
   "Add hysteresis and hold-downs before restoring, cap actions per device per day, and escalate at the cap."
  ],
  "answer": 3,
  "explain": "Flapping automation needs hysteresis, limits and escalation; a marginal optic needs a human and a replacement. A lower threshold increases triggers, removing verification removes safety, and slower sampling hides data without solving the oscillation."
 },
 {
  "module": "m8",
  "q": "The pipeline's dry-run diff for PE5 shows it will remove 40 lines that exist on the device but not in the source of truth, including a static route added during last week's incident. What is the best action?",
  "options": [
   "Deploy as planned, because the source of truth is authoritative and anything outside it is unauthorised by definition.",
   "Switch the pipeline to merge-only mode for PE5, so the extra lines stay in place and the deployment can continue.",
   "Pause PE5, investigate the drift, and either add the needed lines to the source of truth or confirm removal.",
   "Copy the device's running configuration into the source of truth wholesale, so the diff for PE5 becomes empty."
  ],
  "answer": 2,
  "explain": "Drift must be reconciled deliberately: some lines may be required fixes, others stale. Blind deployment re-creates outages, merge-only leaves drift permanently, and wholesale import pollutes the source of truth."
 },
 {
  "module": "m8",
  "q": "An AI assistant drafted a VRF change that included a route target belonging to a different customer. A reviewer caught it by chance. Which control most directly prevents this from reaching production in future?",
  "options": [
   "A rule that only senior engineers may review changes drafted by the AI assistant before they reach the pipeline.",
   "A requirement that the AI assistant explains its reasoning in the merge request description for every change.",
   "A pipeline policy check that every RT in a change belongs to the range allocated to that customer in the source of truth.",
   "A canary deployment that applies AI-drafted changes to one PE first and watches for customer complaints."
  ],
  "answer": 2,
  "explain": "An automated policy check against authoritative allocations catches the error every time. Senior reviewers and explanations help but rely on attention, and a canary would expose the wrong customer's routes in production."
 },
 {
  "module": "m8",
  "q": "A NETCONF deployment script commits with `<confirmed/>` and a 300-second timeout, runs post-checks that pass, and exits. Five minutes later every change is reverted. What is the root cause?",
  "options": [
   "The device's candidate datastore is locked by another session, so the committed change is overwritten automatically.",
   "The script never sends the confirming commit after post-checks pass, so devices roll back at the timeout.",
   "The post-checks run against the candidate datastore, so the devices treat the change as untested and discard it.",
   "The confirm timeout is too short for the post-checks to complete, so the device rolls back before checks finish."
  ],
  "answer": 1,
  "explain": "A confirmed commit must be followed by a confirming commit; otherwise rollback is the designed behaviour. Locks do not overwrite committed changes, post-checks do not influence commit state, and here the checks finished well before the timeout."
 }
]);
