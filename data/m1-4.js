window.TRACK = window.TRACK || { modules: [], exam: [] };
TRACK.modules.push({
 "id": "m1",
 "order": 1,
 "code": "Method",
 "title": "Expert Methodology",
 "subtitle": "Requirement parsing, packet-walk reasoning, verification discipline and lab strategy",
 "outcomes": [
  "Parse complex tasks into explicit requirements, implicit prerequisites and prohibitions",
  "Reason about any fault with a hop-by-hop packet walk across control and data planes",
  "Prove every change with the strongest available evidence",
  "Troubleshoot unfamiliar faults quickly with a structured, hypothesis-driven model",
  "Build repeatable labs and manage time and documentation in practical exams"
 ],
 "lessons": [
  {
   "id": "m1-l1",
   "title": "Thinking Like an Expert: The Mastery Ring and Requirement Parsing",
   "subtitle": "Read every task as a set of constraints, predict the outcome, then build",
   "minutes": 30,
   "objectives": [
    "Explain the eight domains of the ZCIE Mastery Ring and how faults cross between them",
    "Decompose a lab task into explicit requirements, implicit requirements and prohibitions",
    "Define the verification evidence for a requirement before configuring anything"
   ],
   "blocks": [
    {
     "type": "text",
     "text": "Expert-level practical work is not won by knowing more commands than everybody else. It is won by **deterministic reasoning**: you can predict what a network will do before you touch it, you change only what the requirement demands, and you can prove the result with evidence another engineer would accept. This module builds that method; every later module assumes it."
    },
    {
     "type": "framework",
     "title": "The ZCIE Mastery Ring",
     "items": [
      {
       "label": "MTH",
       "title": "Method",
       "text": "Requirement parsing, packet-walk reasoning, verification discipline, structured troubleshooting, lab and time management."
      },
      {
       "label": "L2",
       "title": "Layer2",
       "text": "Spanning tree at scale, first-hop security, multi-chassis aggregation, gateway redundancy, provider bridging and loop forensics."
      },
      {
       "label": "IGP",
       "title": "IGP",
       "text": "Link-state databases, flooding, area and level design, fast convergence, summarisation and safe redistribution."
      },
      {
       "label": "BGP",
       "title": "BGP",
       "text": "Scaling iBGP, policy with communities, best-path mastery, advanced advertisement, convergence and routing security."
      },
      {
       "label": "LBL",
       "title": "Label",
       "text": "Label switching, layer 3 VPNs, segment routing and traffic engineering built on the IGP and BGP layers."
      },
      {
       "label": "FAB",
       "title": "Fabric",
       "text": "Overlay fabrics with VXLAN and EVPN, and software-defined WAN edges."
      },
      {
       "label": "STR",
       "title": "Stream",
       "text": "Multicast distribution and quality of service from edge to core."
      },
      {
       "label": "CODE",
       "title": "Code",
       "text": "Automation, programmatic verification, lab strategy and the capstone."
      }
     ]
    },
    {
     "type": "callout",
     "kind": "insight",
     "text": "Real faults rarely respect domain boundaries. A BGP next hop becomes unreachable because an IGP summary hid the loopback; a VPN breaks because an MTU change in the underlay drops labelled frames; a multicast stream dies because a spanning-tree change moved the querier. Expert reasoning constantly asks **which neighbouring ring could be causing what I see in this one**.",
     "title": "The ring is a loop, not a ladder"
    },
    {
     "type": "text",
     "text": "Practical exam tasks and real change requests are written as **constraints**, not instructions. The words that matter are small: *only*, *without*, *must*, *prefer*, *must not*, *at all times*. An engineer who reads quickly and starts typing solves the problem they imagined, not the one that was asked. Requirement parsing is the deliberate act of turning prose into a precise list of outcomes, limits and proofs."
    },
    {
     "type": "steps",
     "title": "Requirement parsing in five passes",
     "items": [
      {
       "title": "Read for outcome",
       "text": "Read the whole task once without a keyboard. Write one sentence describing the end state in observable terms: who reaches what, over which path, under which failure."
      },
      {
       "title": "Mark the constraints",
       "text": "Underline every restricting word: only, without, do not, minimum, must survive, prefer. Each becomes a line in your task notes."
      },
      {
       "title": "Find the implicit requirements",
       "text": "List what must already be true for the task to work: reachability of next hops, adjacencies, MTU, a route in the RIB for a network statement to match."
      },
      {
       "title": "Define the proof",
       "text": "Before configuring, write the exact command and the exact output that will prove success, including the failure case if one is mentioned."
      },
      {
       "title": "Map interactions",
       "text": "Note which other tasks touch the same devices or protocols. Changes in one task can silently break the proof of another."
      }
     ]
    },
    {
     "type": "table",
     "title": "Constraint language decoder",
     "head": [
      "Phrase in the task",
      "What it really constrains",
      "Typical trap"
     ],
     "rows": [
      [
       "\"using a single command\"",
       "The solution must be one line, so it is usually a feature, not a combination",
       "Building a route-map plus prefix-list when one aggregate or summary keyword was intended"
      ],
      [
       "\"without modifying R3\"",
       "Every change happens on neighbours or via protocol signalling",
       "Fixing it on R3 anyway because it is faster"
      ],
      [
       "\"traffic must prefer\"",
       "Data-plane path, not just the RIB entry",
       "Proving it with the routing table while CEF load-shares or policy-routes elsewhere"
      ],
      [
       "\"must survive the failure of\"",
       "A backup path must exist and converge without manual action",
       "Not testing the failure, or testing a different failure"
      ],
      [
       "\"reachable from\"",
       "Both directions, from the stated source address",
       "Pinging from the egress interface instead of the stated loopback"
      ],
      [
       "\"do not use static routes\"",
       "Includes floating statics and static discard routes you add yourself",
       "A summary that creates a protocol discard route is fine; a manual one is not"
      ]
     ]
    },
    {
     "type": "compare",
     "title": "Novice reading versus expert reading",
     "columns": [
      {
       "title": "Novice",
       "items": [
        "Starts configuring after the first sentence",
        "Assumes the default behaviour of the platform they know",
        "Proves success with a single ping",
        "Treats each task in isolation"
       ]
      },
      {
       "title": "Expert",
       "items": [
        "Reads every task before changing anything",
        "Lists implicit prerequisites and checks them first",
        "Writes the proof before the configuration",
        "Tracks how each change affects earlier tasks"
       ]
      }
     ]
    },
    {
     "type": "cli",
     "title": "Baseline snapshot before touching anything",
     "device": "R1 · IOS-style CLI",
     "lines": [
      "R1# show ip interface brief | exclude unassigned",
      "Interface              IP-Address      OK? Method Status                Protocol",
      "GigabitEthernet0/0     10.1.12.1       YES manual up                    up",
      "GigabitEthernet0/1     10.1.13.1       YES manual up                    down",
      "Loopback0              10.0.0.1        YES manual up                    up",
      "R1# show ip protocols | include Routing Protocol|Router ID",
      "Routing Protocol is \"ospf 1\"",
      "  Router ID 10.0.0.1",
      "Routing Protocol is \"bgp 65000\"",
      "R1# show ip route summary | include Total|ospf|bgp",
      "ospf 1          4           9           1144        2808",
      "bgp 65000       0           0           0           0",
      "Total           12          11          1880        4108"
     ],
     "note": "Ninety seconds of baseline capture reveals two facts before any task is attempted: Gi0/1 is up/down (a layer 1 or 2 issue that will affect later tasks), and BGP is configured but has installed nothing. Record both in your notes."
    },
    {
     "type": "scenario",
     "title": "Parsing an aggregation task",
     "situation": "Task text: \"Advertise the branch networks 10.40.0.0/16 to the provider as a single prefix. Do not suppress any of the more specific routes inside your own AS.\" The branch /24s are in BGP on the edge router, which has iBGP sessions to two route reflectors and one eBGP session to the provider.",
     "options": [
      {
       "text": "Configure the aggregate with the keyword that suppresses all more-specific routes.",
       "feedback": "This meets the first constraint but breaks the second: suppression applies to every neighbour, including the route reflectors, so the specifics disappear inside the AS.",
       "best": false
      },
      {
       "text": "Summarise 10.40.0.0/16 in the IGP at the area border so BGP only sees the summary.",
       "feedback": "Wrong layer. The IGP summary does not change what BGP advertises to the provider and removes specifics from the IGP, which the task did not ask for.",
       "best": false
      },
      {
       "text": "Aggregate without suppression, and filter the specifics outbound on the provider session only.",
       "feedback": "Correct. Both constraints are met: the provider sees one prefix, and the internal AS keeps the specifics because suppression happens per neighbour, not globally.",
       "best": true
      },
      {
       "text": "Create a static route to a discard interface for the /16 and advertise it with a network statement.",
       "feedback": "It can produce the aggregate, but the specifics still leak to the provider unless filtered, and it adds configuration the task did not need.",
       "best": false
      }
     ]
    },
    {
     "type": "checklist",
     "title": "Before you configure any task",
     "items": [
      "I have read every task in the section, not just this one",
      "I have written the end state in observable terms",
      "Every restricting word is captured as a constraint",
      "Implicit prerequisites (adjacency, next hop, MTU, RIB entry) are listed and checked",
      "The proof command and expected output are written down",
      "I know which earlier tasks share devices or protocols with this one"
     ]
    },
    {
     "type": "terms",
     "items": [
      {
       "term": "Mastery Ring",
       "def": "The eight-domain ZCIE framework: Method, Layer2, IGP, BGP, Label, Fabric, Stream and Code, treated as interdependent rather than sequential."
      },
      {
       "term": "Explicit requirement",
       "def": "An outcome stated directly in the task text, such as a preferred path or a single advertised prefix."
      },
      {
       "term": "Implicit requirement",
       "def": "A condition the task depends on without stating it, such as next-hop reachability or a matching RIB entry."
      },
      {
       "term": "Prohibition constraint",
       "def": "A limit on how a task may be solved, for example no static routes or no changes on a named device."
      },
      {
       "term": "Verification evidence",
       "def": "The specific command output that proves a requirement is met, defined before configuring."
      },
      {
       "term": "Baseline snapshot",
       "def": "A short capture of interface, protocol and routing state taken before any change, used to separate pre-existing faults from new ones."
      },
      {
       "term": "Blast radius",
       "def": "The set of devices, prefixes and tasks that a change can affect beyond its intended target."
      },
      {
       "term": "Task interaction map",
       "def": "A note of which tasks share devices or protocols, used to re-verify earlier work after later changes."
      }
     ]
    },
    {
     "type": "reflection",
     "prompt": "Think of the last change you made that had an unexpected side effect. Which implicit requirement or interaction did you miss, and which of the five parsing passes would have caught it?"
    },
    {
     "type": "quiz",
     "items": [
      {
       "q": "A task says traffic from the branch \"must prefer\" link A. Which evidence proves the requirement?",
       "options": [
        "The routing table shows a route through link A with the lowest metric among the candidates",
        "The configuration on the branch router contains a higher bandwidth value on link A",
        "A ping across link A succeeds with zero loss from the branch router to the hub",
        "A forwarding-plane check, such as an exact-route lookup or a trace from the source"
       ],
       "answer": 3,
       "explain": "Prefer describes the data plane. The RIB can show one path while load sharing or policy forwarding sends packets elsewhere, so the proof must come from forwarding state or a sourced trace."
      },
      {
       "q": "Which item is an implicit requirement for an iBGP-learned prefix to be installed?",
       "options": [
        "The prefix must be advertised with a community that the receiving router recognises",
        "The receiving router must have a network statement that covers the prefix",
        "The next hop of the prefix must be resolvable through the local routing table",
        "The prefix must carry a local preference higher than the platform default of 100"
       ],
       "answer": 2,
       "explain": "An unreachable next hop makes the path invalid. The other items are either unrelated to installation or describe origination rather than reception."
      },
      {
       "q": "A task forbids static routes. Which approach still respects the constraint?",
       "options": [
        "A floating static route with a high distance that is only used on failure",
        "A protocol summary that installs its own automatic discard route",
        "A static route to a discard interface that anchors a BGP aggregate",
        "A static default route that is redistributed into the IGP with a tag"
       ],
       "answer": 1,
       "explain": "Automatic discard routes created by a summarisation feature are not static routes you configured. Every other option is a static route, however it is used."
      },
      {
       "q": "Why should you read every task in a section before starting the first one?",
       "options": [
        "Later tasks often depend on choices that you would otherwise make too early",
        "It allows you to memorise the device names and IP plan before typing anything",
        "Practical exams usually grade tasks in reverse order of their appearance",
        "It prevents the lab environment from timing out during long configurations"
       ],
       "answer": 0,
       "explain": "Dependencies and conflicts between tasks are the main reason experts read ahead. Early choices such as area design or tagging can make later tasks easy or impossible."
      },
      {
       "q": "What is the main purpose of a baseline snapshot?",
       "options": [
        "To create a configuration backup that can be restored with a single command",
        "To measure device CPU before applying any debug commands to the router",
        "To document the topology for graders who review the lab after it ends",
        "To separate pre-existing faults from faults your changes introduce"
       ],
       "answer": 3,
       "explain": "Knowing the starting state stops you from chasing problems you did not cause, and reveals pre-seeded faults early."
      }
     ]
    }
   ]
  },
  {
   "id": "m1-l2",
   "title": "Packet-Walk Reasoning and Verification Discipline",
   "subtitle": "Follow one packet hop by hop and prove every claim with the strongest evidence available",
   "minutes": 35,
   "objectives": [
    "Walk a packet through ingress, lookup, resolution, rewrite, egress and return",
    "Distinguish control-plane evidence from data-plane evidence",
    "Apply a predict-change-observe loop to every configuration change"
   ],
   "blocks": [
    {
     "type": "text",
     "text": "A packet walk is the expert's most reliable reasoning tool. Instead of asking \"why is it broken?\", you pick **one packet** with a precise source, destination, protocol and ingress point, then ask the same questions at every hop until the answer changes. The point where your prediction and reality diverge is where the fault lives."
    },
    {
     "type": "flow",
     "title": "The hop-by-hop packet walk",
     "items": [
      {
       "label": "Ingress",
       "text": "Is the frame accepted? Physical state, VLAN membership, MAC destination, inbound ACL or filter."
      },
      {
       "label": "Lookup",
       "text": "Which table is consulted (VRF, policy route, FIB) and which entry wins by longest match?"
      },
      {
       "label": "Resolve",
       "text": "Is the next hop resolved to an adjacency: ARP or neighbour entry, label, tunnel?"
      },
      {
       "label": "Rewrite",
       "text": "What changes: MAC addresses, TTL, labels, encapsulation, DSCP?"
      },
      {
       "label": "Egress",
       "text": "Outbound policy, queueing, MTU and fragmentation decisions."
      },
      {
       "label": "Return",
       "text": "Does the reply have a valid path back to the original source address?"
      }
     ]
    },
    {
     "type": "layers",
     "title": "Where the evidence lives",
     "items": [
      {
       "label": "Intent",
       "parts": [
        "task requirements",
        "design documents",
        "policy statements"
       ]
      },
      {
       "label": "Control plane",
       "parts": [
        "neighbour state",
        "link-state database",
        "BGP table with attributes"
       ]
      },
      {
       "label": "Routing table",
       "parts": [
        "selected routes",
        "administrative distance",
        "recursive next hops"
       ]
      },
      {
       "label": "Forwarding table",
       "parts": [
        "FIB entries",
        "adjacencies",
        "load-sharing buckets"
       ]
      },
      {
       "label": "Wire",
       "parts": [
        "interface counters",
        "captures",
        "sourced traces and pings"
       ]
      }
     ]
    },
    {
     "type": "text",
     "text": "**Verification discipline** means every change has a predicted, observable effect, and you look for that effect at the layer the requirement names. If the requirement is about forwarding, a routing-table entry is only circumstantial evidence. If it is about a protocol attribute, the received and advertised attributes per neighbour are the proof, not the presence of a route-map in the configuration."
    },
    {
     "type": "table",
     "title": "The evidence ladder",
     "head": [
      "Claim",
      "Weak evidence",
      "Strong evidence"
     ],
     "rows": [
      [
       "Adjacency is working",
       "Configuration present on both sides",
       "Neighbour state FULL or Up and the peer's database entries present"
      ],
      [
       "Route is preferred",
       "Route visible in the routing table",
       "FIB exact-route lookup and a trace sourced from the stated address"
      ],
      [
       "Policy is applied",
       "Route-map exists and is attached",
       "Per-prefix attributes shown as received and as advertised to that neighbour"
      ],
      [
       "Failover works",
       "A backup route exists in the table",
       "Primary failed on purpose and traffic observed on the backup within the target time"
      ],
      [
       "Filter blocks traffic",
       "ACL entry configured",
       "Match counters increasing while the source sends test traffic"
      ]
     ]
    },
    {
     "type": "cli",
     "title": "Proving the forwarding decision",
     "device": "R1 · IOS-style CLI",
     "lines": [
      "R1# show ip route 10.20.0.10",
      "Routing entry for 10.20.0.0/16",
      "  Known via \"ospf 1\", distance 110, metric 30, type inter area",
      "  * 10.1.12.2, from 10.0.0.2, via GigabitEthernet0/0",
      "    10.1.13.3, from 10.0.0.3, via GigabitEthernet0/1",
      "R1# show ip cef exact-route 10.0.0.1 10.20.0.10",
      "10.0.0.1 -> 10.20.0.10 =>IP adj out of GigabitEthernet0/1, addr 10.1.13.3",
      "R1# traceroute 10.20.0.10 source Loopback0 numeric",
      "  1 10.1.13.3 2 msec 1 msec 1 msec",
      "  2 10.3.30.4 3 msec 2 msec 3 msec",
      "  3 10.20.0.10 4 msec 3 msec 4 msec"
     ],
     "note": "The routing table lists two equal-cost paths and marks Gi0/0 with an asterisk, which only shows the next path to be used for process-switched traffic. The FIB hash for this source and destination pair actually selects Gi0/1, confirmed by the sourced trace. A task asking for traffic to use R2 is not satisfied."
    },
    {
     "type": "callout",
     "kind": "warning",
     "text": "A router ping uses the egress interface address as its source unless told otherwise, follows whatever hash bucket that source pair lands in, and proves only one direction of one flow. Always source tests from the address named in the task and confirm the path, not just the reply.",
     "title": "A successful ping is not proof"
    },
    {
     "type": "cli",
     "title": "Walking the last hop at layer 2",
     "device": "SW3 · IOS-style CLI",
     "lines": [
      "R4# show ip arp 10.20.0.10",
      "Internet  10.20.0.10     3   0050.56aa.0102  ARPA   Vlan20",
      "SW3# show mac address-table address 0050.56aa.0102",
      "Vlan    Mac Address       Type        Ports",
      "  20    0050.56aa.0102    DYNAMIC     Gi1/0/12",
      "SW3# show interfaces Gi1/0/12 | include line protocol|drops|output errors",
      "GigabitEthernet1/0/12 is up, line protocol is up (connected)",
      "  Input queue: 0/2000/0/0 (size/max/drops/flushes); Total output drops: 48211",
      "     0 output errors, 0 collisions, 1 interface resets"
     ],
     "note": "The router has resolved the host, the switch knows exactly which port the MAC lives on, and the port is up. The walk continues to the next question: 48,211 output drops suggest congestion or a speed mismatch on the access port, not a routing fault."
    },
    {
     "type": "steps",
     "title": "The verification loop",
     "items": [
      {
       "title": "Predict",
       "text": "State what will change and where it will be visible: which table, which neighbour, which counter."
      },
      {
       "title": "Change",
       "text": "Apply the smallest change that can produce the predicted effect."
      },
      {
       "title": "Observe",
       "text": "Collect the strongest evidence available for the claim, not the most convenient."
      },
      {
       "title": "Compare",
       "text": "If observation and prediction differ, stop and explain the difference before changing anything else."
      },
      {
       "title": "Record",
       "text": "Note the change, the proof and any side effect seen on other tasks."
      }
     ]
    },
    {
     "type": "scenario",
     "title": "The trace that stops at hop three",
     "situation": "A sourced traceroute from R1 Loopback0 to 10.60.1.1 shows replies from hops 1 and 2, then asterisks from hop 3 onward. Every router on the path has a route to 10.60.0.0/16 and the destination host can ping its own gateway.",
     "options": [
      {
       "text": "Check that the hop-3 router has a route back to R1's loopback, the trace source.",
       "feedback": "Correct. Time-exceeded messages and the final reply must be routed back to 10.0.0.1. A missing return route, filtered loopback range or uRPF drop at hop 3 produces exactly this pattern even though forward routing is complete.",
       "best": true
      },
      {
       "text": "Clear the routing process on every router on the path so the tables are rebuilt cleanly.",
       "feedback": "Disruptive and untargeted. The forward routes are already present; resetting protocols destroys evidence without testing a hypothesis.",
       "best": false
      },
      {
       "text": "Repeat the trace with a higher maximum TTL so the later hops have more time to respond.",
       "feedback": "The trace already fails at hop 3, well inside the default TTL. More hops do not change why replies from hop 3 are missing.",
       "best": false
      },
      {
       "text": "Increase the trace timeout because hop 3 may be rate-limiting its control-plane replies.",
       "feedback": "Rate limiting usually causes partial loss, not total silence from every later hop. Return-path failure explains the evidence better.",
       "best": false
      }
     ]
    },
    {
     "type": "checklist",
     "title": "Verification discipline",
     "items": [
      "Every test is sourced from the address the requirement names",
      "Forwarding claims are proven with FIB lookups or traces, not only the RIB",
      "Policy claims are proven per neighbour, received and advertised",
      "Failover claims are proven by actually failing the primary",
      "Every unexpected observation is explained before the next change"
     ]
    },
    {
     "type": "terms",
     "items": [
      {
       "term": "Packet walk",
       "def": "A hop-by-hop analysis of one specific flow that asks the same ingress, lookup, resolve, rewrite, egress and return questions at every device."
      },
      {
       "term": "FIB",
       "def": "Forwarding information base: the data-plane table derived from the routing table and used for actual packet forwarding."
      },
      {
       "term": "Adjacency",
       "def": "The resolved layer 2 rewrite information for a next hop, built from ARP, neighbour discovery or label bindings."
      },
      {
       "term": "Recursive lookup",
       "def": "Resolving a next hop that is not directly connected by looking it up again in the routing table until a connected interface is found."
      },
      {
       "term": "Return path",
       "def": "The route the reply takes back to the source address; it can differ from the forward path and fail independently."
      },
      {
       "term": "uRPF",
       "def": "Unicast reverse path forwarding: a check that drops packets whose source address is not reachable back through the arrival interface."
      },
      {
       "term": "Exact-route lookup",
       "def": "A query that shows which load-sharing path the FIB selects for a given source and destination pair."
      },
      {
       "term": "Evidence ladder",
       "def": "A ranking of proof from weak (configuration present) to strong (forwarding state and observed traffic)."
      }
     ]
    },
    {
     "type": "reflection",
     "prompt": "Pick a recent incident. Write the packet walk for the failing flow and mark the first hop where your prediction would have differed from reality. How long would it have taken to reach that point with this method?"
    },
    {
     "type": "quiz",
     "items": [
      {
       "q": "A router shows two equal-cost routes for a prefix. How do you prove which one carries traffic for a specific flow?",
       "options": [
        "Look for the asterisk that marks the active path in the routing table",
        "Compare interface bandwidth values and assume the faster link wins",
        "Use a FIB exact-route lookup for the flow's exact source and destination pair",
        "Shut one interface and check whether the ping still succeeds afterwards"
       ],
       "answer": 2,
       "explain": "Per-flow load sharing is decided by the forwarding table hash. The routing-table marker and bandwidth do not reveal it, and shutting links changes the system under test."
      },
      {
       "q": "A trace from R1's loopback dies after hop 2 although forward routes exist everywhere. What is the strongest first hypothesis?",
       "options": [
        "The third hop cannot route replies back to the loopback source",
        "The destination host has a firewall that blocks all ICMP echo requests",
        "The default maximum TTL is too small for a path of this length",
        "Hop 2 is load-sharing the traffic onto a path with no route at all"
       ],
       "answer": 0,
       "explain": "Silence from hop 3 onward with complete forward routing points to the return path for the source address."
      },
      {
       "q": "Which evidence most strongly proves that an outbound route policy is working?",
       "options": [
        "The route-map is attached to the neighbour in the running configuration",
        "The prefix's attributes as they are advertised to that specific neighbour",
        "The route-map match counters have increased since the last policy change",
        "The local BGP table shows the attribute set on the best path for the prefix"
       ],
       "answer": 1,
       "explain": "Advertised-route output per neighbour shows the result of outbound policy. Local tables show pre-policy state and counters prove a match, not the resulting attributes."
      },
      {
       "q": "In the verification loop, what should you do when the observation differs from your prediction?",
       "options": [
        "Apply the next planned change because it may resolve the difference",
        "Stop and explain the difference before making any further change",
        "Revert the change immediately and move on to a different task",
        "Clear the relevant protocol sessions to force a fresh calculation"
       ],
       "answer": 1,
       "explain": "Unexplained differences are the most valuable evidence you have. Stacking more changes on top makes the system harder to reason about."
      },
      {
       "q": "Why is the return step part of every packet walk?",
       "options": [
        "Routers always forward replies over the same interface the request used",
        "Return traffic is the only direction that inbound access lists inspect",
        "Replies follow their own lookup and can fail on their own",
        "Traceroute only measures the return direction of a network path"
       ],
       "answer": 2,
       "explain": "Forward and reverse paths are computed independently. Asymmetry, uRPF and stateful devices make return-path failures common."
      }
     ]
    }
   ]
  },
  {
   "id": "m1-l3",
   "title": "Structured Troubleshooting at Speed",
   "subtitle": "Hypothesis-driven fault isolation that stays fast under pressure",
   "minutes": 35,
   "objectives": [
    "Apply a six-stage troubleshooting model to unfamiliar faults",
    "Choose the fastest isolation method for a given symptom",
    "Use debugs safely and record evidence in a troubleshooting log"
   ],
   "blocks": [
    {
     "type": "text",
     "text": "Speed in troubleshooting does not come from typing faster. It comes from **never running a command without a hypothesis** and from cutting the search space in half with every test. Engineers who look slow under pressure are usually re-reading output they did not need, or switching hypotheses before the current one is disproved."
    },
    {
     "type": "framework",
     "title": "The SCOPE-PATH troubleshooting model",
     "items": [
      {
       "label": "S1",
       "title": "Scope",
       "text": "Define the failing flow precisely: source, destination, protocol, since when, who else is affected."
      },
      {
       "label": "S2",
       "title": "Path",
       "text": "Draw the expected path and the control-plane dependencies that build it."
      },
      {
       "label": "S3",
       "title": "Layer",
       "text": "Pick the layer most consistent with the symptom pattern; partial loss and total loss point to different layers."
      },
      {
       "label": "S4",
       "title": "Hypothesis",
       "text": "State one falsifiable cause and the single test that would disprove it."
      },
      {
       "label": "S5",
       "title": "Test",
       "text": "Run the test, read only the fields that decide the hypothesis, and record the result."
      },
      {
       "label": "S6",
       "title": "Close",
       "text": "Fix, verify with the original failing flow, and check for side effects on other flows."
      }
     ]
    },
    {
     "type": "table",
     "title": "Choosing an isolation method",
     "head": [
      "Method",
      "Fastest when",
      "Risk"
     ],
     "rows": [
      [
       "Follow the path",
       "The failing flow is known and the path is short",
       "Slow on large meshes with many equal-cost branches"
      ],
      [
       "Divide and conquer",
       "The path is long; test the middle first",
       "Needs a good test point in the middle of the path"
      ],
      [
       "Compare working and broken",
       "A similar flow, site or device still works",
       "Differences that do not matter can distract you"
      ],
      [
       "Bottom-up",
       "Physical or layer 2 symptoms: errors, flaps, partial loss",
       "Wastes time when the fault is clearly in policy"
      ],
      [
       "Top-down",
       "One application fails while others on the same path work",
       "Misses lower-layer faults that affect only large packets"
      ]
     ]
    },
    {
     "type": "table",
     "title": "Symptom to first suspects",
     "head": [
      "Symptom",
      "First suspects",
      "Deciding test"
     ],
     "rows": [
      [
       "OSPF neighbour stuck in EXSTART or EXCHANGE",
       "Interface MTU mismatch, duplicate router ID",
       "Compare interface MTU and router IDs on both ends"
      ],
      [
       "OSPF neighbour stuck in INIT",
       "One direction of hellos lost: filter, unidirectional link, multicast drop",
       "Check whether our router ID appears in the peer's hello"
      ],
      [
       "BGP neighbour in Active",
       "No route to the peer address, wrong update source, TCP 179 filtered",
       "Route lookup for the peer address and a ping sourced from the update source"
      ],
      [
       "BGP route marked RIB-failure",
       "A route with lower administrative distance already installed",
       "Look up the prefix in the routing table and compare the source protocol"
      ],
      [
       "Prefix not advertised by network statement",
       "No exact match (prefix and mask) in the routing table",
       "Exact routing-table lookup for the prefix and mask"
      ],
      [
       "Small packets pass, large packets fail",
       "MTU or fragmentation mismatch on the path",
       "Sourced ping with don't-fragment set and increasing size"
      ]
     ]
    },
    {
     "type": "cli",
     "title": "Debugging a stuck adjacency safely",
     "device": "R2 · IOS-style CLI",
     "lines": [
      "R2# show ip ospf neighbor",
      "Neighbor ID     Pri   State           Dead Time   Address         Interface",
      "10.0.0.3          1   EXSTART/DR      00:00:36    10.1.23.3       GigabitEthernet0/2",
      "R2# show logging | include buffer",
      "    Buffer logging: level debugging, 1200000 messages logged",
      "R2# debug condition interface GigabitEthernet0/2",
      "R2# debug ip ospf adj",
      "OSPF-1 ADJ   Gi0/2: Rcv DBD from 10.0.0.3 seq 0x1F4A opt 0x52 flag 0x7 len 32  mtu 9000 state EXSTART",
      "OSPF-1 ADJ   Gi0/2: Nbr 10.0.0.3 has larger interface MTU",
      "R2# undebug all",
      "R2# show interfaces GigabitEthernet0/2 | include MTU",
      "  MTU 1500 bytes, BW 1000000 Kbit/sec, DLY 10 usec,"
     ],
     "note": "The debug is limited to one interface and written to the buffer, not the console. One debug line decides the hypothesis: the neighbour advertises 9000 bytes in its database description packets while R2 uses 1500. Align the MTU; do not disable the MTU check unless the task explicitly requires it."
    },
    {
     "type": "callout",
     "kind": "warning",
     "text": "On a busy router an unconditioned debug can saturate the control plane and cause the outage you were investigating. Condition debugs to an interface or neighbour, log to the buffer, turn them off immediately after the deciding line appears, and never leave them running when you move to the next task.",
     "title": "Debugs are a scalpel"
    },
    {
     "type": "cli",
     "title": "A BGP session that never leaves Active",
     "device": "R5 · IOS-style CLI",
     "lines": [
      "R5# show ip bgp summary | begin Neighbor",
      "Neighbor        V    AS MsgRcvd MsgSent   TblVer  InQ OutQ Up/Down  State/PfxRcd",
      "10.0.0.9        4 65000       0       0        1    0    0 never    Active",
      "R5# show ip route 10.0.0.9",
      "% Subnet not in table",
      "R5# show ip ospf database router 10.0.0.9 | include Link ID|Advertising",
      "R5#"
     ],
     "note": "The session cannot form because there is no route to the peer's loopback, and R9 has no router LSA in R5's database at all. The fault is in the IGP, not in BGP. Moving to the IGP ring immediately saves the time otherwise spent checking BGP configuration."
    },
    {
     "type": "flow",
     "title": "The hypothesis cycle",
     "items": [
      {
       "label": "Observe",
       "text": "Collect the symptom precisely"
      },
      {
       "label": "Hypothesise",
       "text": "One cause, one deciding test"
      },
      {
       "label": "Test",
       "text": "Read only the deciding fields"
      },
      {
       "label": "Decide",
       "text": "Confirmed, refuted, or inconclusive"
      },
      {
       "label": "Narrow",
       "text": "Halve the search space and repeat"
      }
     ]
    },
    {
     "type": "scenario",
     "title": "Ten minutes and no root cause",
     "situation": "During a timed practical lab you have spent ten minutes on a fault worth three points. You have checked the IGP and BGP configuration on two routers and found nothing. Six other tasks are still open.",
     "options": [
      {
       "text": "Keep going on this task, because the root cause is probably close after ten minutes of searching.",
       "feedback": "This is the sunk-cost trap. Without a current hypothesis, further time has no expected return while other points remain untouched.",
       "best": false
      },
      {
       "text": "Record the evidence so far, park the task with a note, and return after the independent tasks.",
       "feedback": "Correct. Time-boxing protects the overall score. The written notes mean you restart from evidence, not from scratch, and later tasks often reveal the fault indirectly.",
       "best": true
      },
      {
       "text": "Remove the configuration on both routers and rebuild it from scratch to eliminate hidden errors.",
       "feedback": "Rebuilding loses evidence, risks breaking dependent tasks and may reproduce the same mistake if the fault is elsewhere.",
       "best": false
      },
      {
       "text": "Enable broad debugging on both routers and wait for an error message to identify the fault.",
       "feedback": "Unconditioned debugs without a hypothesis produce noise and can destabilise the devices you depend on for other tasks.",
       "best": false
      }
     ]
    },
    {
     "type": "case",
     "title": "The forty-minute outage that took nine hours",
     "context": "A regional payments processor added a new 10 Gb/s link between two data-centre routers during a change window. After the change, card authorisations from one data centre began timing out intermittently. The on-call team saw BGP sessions between the sites flapping every few minutes and spent six hours tuning BGP timers, replacing route reflectors in the design and rolling back unrelated firewall rules. A senior engineer joining late ran a sourced ping with the don't-fragment bit at 1500 bytes across the new link and saw it fail at 1476. The new link was a provider service with GRE-based transport, and the interface MTU had been left at 1500.",
     "questions": [
      "Which symptom should have pointed to MTU from the start?",
      "Which step of the SCOPE-PATH model did the team skip?",
      "Why did BGP timer tuning appear to help at times?",
      "What evidence would you capture for the post-incident review?"
     ],
     "answer": "BGP sessions establishing and then failing during large update transfers, combined with intermittent failures of larger application packets, is a classic MTU signature: small keepalives pass, full-size segments are dropped. The team skipped Scope and Layer: they never defined which packets failed and jumped straight to the protocol they could see flapping. Timer tuning appeared to help only because longer hold times delayed the reset while retransmissions occasionally got smaller segments through. For the review: the DF-bit ping series showing the exact maximum size, interface MTU on both ends, TCP retransmission counters for the BGP sessions, and the provider's documented service MTU. The fix was to set the interface and IP MTU correctly, then verify with the original failing flow."
    },
    {
     "type": "template",
     "title": "Troubleshooting log",
     "purpose": "Record each hypothesis and test so you never repeat work, and can hand over or resume a parked task instantly.",
     "columns": [
      "Time",
      "Observation",
      "Hypothesis",
      "Deciding test",
      "Result",
      "Next action"
     ],
     "example": [
      [
       "10:42",
       "R5 to R9 iBGP stuck Active",
       "No route to 10.0.0.9",
       "show ip route 10.0.0.9",
       "Not in table; no R9 router LSA",
       "Check R9 OSPF adjacency on Gi0/3"
      ],
      [
       "10:46",
       "R9 Gi0/3 neighbour EXSTART",
       "MTU mismatch",
       "Compare interface MTU both ends",
       "9000 vs 1500",
       "Align MTU, re-verify BGP"
      ]
     ],
     "rows": 8
    },
    {
     "type": "checklist",
     "title": "Troubleshooting at speed",
     "items": [
      "The failing flow is defined with source, destination and protocol",
      "Every command I run is tied to a written hypothesis",
      "I read only the fields that decide the current hypothesis",
      "Debugs are conditioned, buffered and removed when done",
      "Parked tasks have a written evidence summary",
      "The fix is verified with the original failing flow"
     ]
    },
    {
     "type": "terms",
     "items": [
      {
       "term": "Hypothesis-driven troubleshooting",
       "def": "An approach in which each test is chosen to confirm or refute one stated cause."
      },
      {
       "term": "Divide and conquer",
       "def": "Testing at the midpoint of a path or layer stack to halve the search space with each test."
      },
      {
       "term": "Conditional debug",
       "def": "A debug limited to a specific interface, neighbour or prefix to reduce load and noise."
      },
      {
       "term": "EXSTART",
       "def": "An OSPF neighbour state in which the routers negotiate the master and slave roles for database exchange; being stuck here often indicates MTU mismatch."
      },
      {
       "term": "Active state",
       "def": "A BGP state in which the router is trying to open a TCP connection to a peer that it cannot reach or that refuses the connection."
      },
      {
       "term": "RIB-failure",
       "def": "A BGP path that is valid and best but not installed because the routing table holds a route from a source with lower administrative distance."
      },
      {
       "term": "Time-boxing",
       "def": "Allocating a fixed time budget to a task and parking it with notes when the budget runs out."
      },
      {
       "term": "Sunk-cost trap",
       "def": "Continuing an unproductive effort because of the time already invested rather than the expected return."
      }
     ]
    },
    {
     "type": "reflection",
     "prompt": "Which isolation method do you default to? Describe a fault where a different method would have been faster, and what signal should have triggered the switch."
    },
    {
     "type": "quiz",
     "items": [
      {
       "q": "An OSPF neighbour is stuck in INIT. Which test decides the most likely hypothesis?",
       "options": [
        "Compare the configured interface MTU values on both ends of the link",
        "Compare router IDs across the area to find any duplicate values",
        "Check whether the neighbour is listed in the database summary list",
        "Check whether our router ID appears in the peer's hellos"
       ],
       "answer": 3,
       "explain": "INIT means hellos are received but the peer does not list us, so hellos are lost in one direction. MTU and duplicate IDs cause later-state problems."
      },
      {
       "q": "A BGP prefix is shown as RIB-failure. What is the most likely reason?",
       "options": [
        "A lower-distance route from another source is already installed",
        "The next hop of the prefix is not resolvable through the routing table",
        "The prefix was rejected by the inbound route-map applied to the peer",
        "The peer has exceeded the configured maximum number of prefixes"
       ],
       "answer": 0,
       "explain": "RIB-failure means the path was selected but could not be installed. An unresolvable next hop makes the path invalid, and policy or prefix limits stop it from appearing at all."
      },
      {
       "q": "Which practice makes debugging on a production router safer?",
       "options": [
        "Enabling debugs on all interfaces so no relevant message is missed",
        "Conditioning the debug to one interface and logging to the buffer",
        "Sending debug output to the console where it is displayed immediately",
        "Leaving debugs running until the next maintenance window closes"
       ],
       "answer": 1,
       "explain": "Conditioned, buffered and short-lived debugs limit control-plane load and noise."
      },
      {
       "q": "Small pings succeed across a new link but file transfers stall. Which first test is most decisive?",
       "options": [
        "A sourced ping with don't-fragment set and stepwise larger sizes",
        "A traceroute between the two hosts to check the hop count and latency",
        "A comparison of the routing metrics on both sides of the new link",
        "A check of the interface duplex settings and speed on both ends"
       ],
       "answer": 0,
       "explain": "Size-dependent failure points to MTU. A DF-bit size sweep finds the exact maximum that passes."
      },
      {
       "q": "When is comparing a working and a broken system the fastest isolation method?",
       "options": [
        "When the failing path is short and every hop is easy to inspect directly",
        "When the symptoms point clearly to a physical layer fault on one link",
        "When the fault affects every flow across the entire network at once",
        "When a similar flow, site or device is still working under similar load"
       ],
       "answer": 3,
       "explain": "Comparison needs a working reference. Without one, following the path or divide and conquer is faster."
      }
     ]
    }
   ]
  },
  {
   "id": "m1-l4",
   "title": "Labs, Time and Documentation",
   "subtitle": "Build a lab you can trust, budget exam time, and document like an expert",
   "minutes": 30,
   "objectives": [
    "Design a reusable virtual lab with topology-as-code and snapshots",
    "Plan time in a practical exam using point budgets and dependency order",
    "Keep topology notes and change records that make verification fast"
   ],
   "blocks": [
    {
     "type": "text",
     "text": "A lab is an instrument. If it is slow to rebuild, inconsistent between runs or poorly documented, every experiment costs more than it should and you will avoid running the experiments that build expert intuition. Treat your lab like production: version-controlled topology, repeatable startup configurations, snapshots and notes."
    },
    {
     "type": "compare",
     "title": "Lab platform options",
     "columns": [
      {
       "title": "Container-based network OS",
       "items": [
        "Fast boot and low memory per node",
        "Topology defined in a text file",
        "Some data-plane features may be simplified"
       ]
      },
      {
       "title": "VM-based network OS",
       "items": [
        "Closest to the real control plane",
        "Heavier on CPU and memory",
        "Good for platform-specific behaviour"
       ]
      },
      {
       "title": "Physical or remote rack",
       "items": [
        "Real hardware forwarding and timers",
        "Slow to rewire and reset",
        "Best for hardware-dependent topics such as QoS queues"
       ]
      }
     ]
    },
    {
     "type": "layers",
     "title": "A reusable lab stack",
     "items": [
      {
       "label": "Scenarios",
       "parts": [
        "task files",
        "expected outcomes",
        "fault-injection scripts"
       ]
      },
      {
       "label": "Topology as code",
       "parts": [
        "node list",
        "link list",
        "management addressing"
       ]
      },
      {
       "label": "Node configuration",
       "parts": [
        "startup configs",
        "baseline templates",
        "per-scenario overlays"
       ]
      },
      {
       "label": "Automation",
       "parts": [
        "deploy and destroy",
        "config snapshot and restore",
        "verification scripts"
       ]
      },
      {
       "label": "Host",
       "parts": [
        "CPU and memory budget",
        "hypervisor or container runtime",
        "storage for images"
       ]
      }
     ]
    },
    {
     "type": "cli",
     "title": "Topology as code for a practice pod",
     "device": "Linux host",
     "lines": [
      "# topology.yml - ZCIE core practice pod",
      "name: zcie-core",
      "mgmt: { network: 172.30.0.0/24 }",
      "nodes:",
      "  R1: { kind: router, startup: cfg/R1.cfg }",
      "  R2: { kind: router, startup: cfg/R2.cfg }",
      "  R3: { kind: router, startup: cfg/R3.cfg }",
      "  SW1: { kind: switch, startup: cfg/SW1.cfg }",
      "links:",
      "  - [R1:eth1, R2:eth1]",
      "  - [R1:eth2, R3:eth1]",
      "  - [R2:eth2, SW1:eth1]",
      "  - [R3:eth2, SW1:eth2]",
      "# keep this file and cfg/ under version control"
     ],
     "note": "The exact syntax depends on the lab tool you use, but the principle is constant: nodes, links and startup configurations live in text files under version control, so any scenario can be rebuilt identically in minutes."
    },
    {
     "type": "callout",
     "kind": "pro",
     "text": "Before any practical lab, draw one sheet with every device, link address, router ID, AS number, area or level boundary, VRF and redistribution point. Mark tasks on the drawing as you complete them. Under pressure, a glance at the sheet replaces dozens of show commands.",
     "title": "Topology notes on one sheet"
    },
    {
     "type": "steps",
     "title": "Time management for a practical lab",
     "items": [
      {
       "title": "Read everything first",
       "text": "Spend the first 15 to 20 minutes reading every task and drawing the dependency map. No configuration yet."
      },
      {
       "title": "Foundations before features",
       "text": "Layer 2, addressing and the IGP come first, because most later tasks depend on them."
      },
      {
       "title": "Budget by points",
       "text": "Give each task a time budget proportional to its points, and note the budget next to the task."
      },
      {
       "title": "Park, do not sink",
       "text": "When a task reaches twice its budget without a live hypothesis, park it with written evidence."
      },
      {
       "title": "Save regularly",
       "text": "Save configurations after every completed task so a reload never costs completed work."
      },
      {
       "title": "Reserve the final sweep",
       "text": "Keep the last 30 to 45 minutes for re-verifying every task, because later changes break earlier proofs."
      }
     ]
    },
    {
     "type": "formula",
     "title": "Time budget arithmetic",
     "items": [
      {
       "name": "Minutes per point",
       "expr": "(total minutes − reading time − final sweep) ÷ total points",
       "meaning": "The working budget for each point; a 4-point task gets four times this value."
      },
      {
       "name": "Park threshold",
       "expr": "time spent > 2 × task budget and no live hypothesis",
       "meaning": "The moment to stop and move on, recording evidence first."
      },
      {
       "name": "Dependency weight",
       "expr": "own points + points of tasks that depend on it",
       "meaning": "Use this, not raw points, to order foundational work."
      }
     ]
    },
    {
     "type": "template",
     "title": "Lab and exam task planner",
     "purpose": "Plan the order, budget and proof of every task before configuring, and track status during the session.",
     "columns": [
      "Task",
      "Points",
      "Depends on",
      "Devices",
      "Budget (min)",
      "Proof command",
      "Status"
     ],
     "example": [
      [
       "2.3 OSPF area 10 NSSA",
       "3",
       "2.1 adjacencies",
       "R3, R6, R7",
       "12",
       "show ip ospf database nssa-external",
       "Done 11:20"
      ],
      [
       "4.1 BGP inbound policy",
       "4",
       "2.x IGP, 3.1 iBGP",
       "R1, R2",
       "16",
       "show ip bgp neighbors x received-routes",
       "Parked: R2 policy order"
      ]
     ],
     "rows": 10
    },
    {
     "type": "scenario",
     "title": "Ninety minutes left",
     "situation": "With 90 minutes remaining you have three unfinished tasks: a 4-point IGP redistribution task that currently leaves two remote loopbacks unreachable, a 2-point syslog formatting task, and a 3-point BGP policy task on routers whose loopbacks are among the unreachable ones.",
     "options": [
      {
       "text": "Do the syslog task first to bank easy points, then attempt the larger tasks in point order.",
       "feedback": "Banking easy points is sensible only when it does not delay dependencies. Here the BGP task cannot be proven until reachability is fixed.",
       "best": false
      },
      {
       "text": "Start with the BGP policy task because it is configuration-heavy and benefits from the most time.",
       "feedback": "The BGP sessions depend on unreachable loopbacks, so the policy cannot be verified until the IGP task is solved.",
       "best": false
      },
      {
       "text": "Skip the final verification sweep so that all three tasks can be attempted with more time.",
       "feedback": "The sweep usually recovers more points than it costs, because late changes frequently break earlier tasks.",
       "best": false
      },
      {
       "text": "Fix the redistribution task first, then BGP, then syslog, keeping 30 minutes for the sweep.",
       "feedback": "Correct. The redistribution task has a dependency weight of 7 points. Solving it first also unlocks the BGP task, and the cheap syslog task fits in remaining time.",
       "best": true
      }
     ]
    },
    {
     "type": "checklist",
     "title": "Final verification sweep",
     "items": [
      "Every task re-verified with its recorded proof command",
      "No interfaces left administratively down from testing",
      "All debugs and temporary filters removed",
      "Configurations saved on every device",
      "Earlier tasks re-checked after later redistribution or policy changes",
      "Notes reconcile with the final state of the lab"
     ]
    },
    {
     "type": "terms",
     "items": [
      {
       "term": "Topology as code",
       "def": "Describing nodes, links and startup configuration in version-controlled text files so a lab can be rebuilt identically."
      },
      {
       "term": "Snapshot",
       "def": "A saved state of all node configurations that can be restored to reset a scenario quickly."
      },
      {
       "term": "Fault injection",
       "def": "Deliberately introducing a failure or misconfiguration in a lab to practise detection and recovery."
      },
      {
       "term": "Dependency map",
       "def": "A sketch of which tasks depend on others, used to order work in a practical lab."
      },
      {
       "term": "Point budget",
       "def": "The time allocated to a task in proportion to its score."
      },
      {
       "term": "Final sweep",
       "def": "The reserved period at the end of a lab for re-verifying every task in order."
      },
      {
       "term": "Topology sheet",
       "def": "A single annotated drawing of devices, addressing, protocol boundaries and redistribution points."
      },
      {
       "term": "Change record",
       "def": "A short written entry for each change: what, where, why, proof and side effects."
      }
     ]
    },
    {
     "type": "reflection",
     "prompt": "Design the lab you will use for the rest of this course. Which topologies do you need, how will you reset them, and how will you record what you learned from each experiment?"
    },
    {
     "type": "quiz",
     "items": [
      {
       "q": "Why should foundational tasks such as the IGP usually be completed first in a practical lab?",
       "options": [
        "Foundational tasks are always worth more points than the feature tasks",
        "Graders review the configuration in the order the tasks are printed",
        "Many later tasks cannot be configured or proven without reachability",
        "Foundational tasks cannot be changed again once others are configured"
       ],
       "answer": 2,
       "explain": "Dependency, not points or print order, drives the sequence. Reachability underpins BGP, VPN and policy proofs."
      },
      {
       "q": "A lab has 480 minutes, 100 points, 20 minutes of reading and a 40-minute final sweep. What is the budget for a 3-point task?",
       "options": [
        "About 14.4 minutes",
        "About 9.8 minutes",
        "About 12.6 minutes",
        "About 16.0 minutes"
       ],
       "answer": 2,
       "explain": "(480 − 20 − 40) ÷ 100 = 4.2 minutes per point, so 3 points gets about 12.6 minutes."
      },
      {
       "q": "What is the main advantage of topology-as-code for expert practice?",
       "options": [
        "Scenarios can be rebuilt identically, so experiments are repeatable",
        "It makes container-based nodes forward traffic exactly like hardware does",
        "It removes the need for any startup configuration on the lab nodes",
        "It allows the lab to run without a management network for access"
       ],
       "answer": 0,
       "explain": "Repeatability is the value. Data-plane fidelity and configuration needs are unchanged."
      },
      {
       "q": "When should a task be parked?",
       "options": [
        "As soon as the first test result disagrees with your initial prediction",
        "Only when every other task in the lab has been fully completed",
        "Whenever the task involves more than two devices or protocols",
        "When it exceeds about twice its budget and no live hypothesis remains"
       ],
       "answer": 3,
       "explain": "Parking is triggered by time and the absence of a hypothesis, not by the first surprise or by task size."
      },
      {
       "q": "Why is a final verification sweep valuable even when every task was proven during the lab?",
       "options": [
        "Graders only accept proofs that were captured in the last thirty minutes",
        "Later changes, such as redistribution or policy, can silently break earlier proofs",
        "Configurations are not saved until the sweep commands are executed",
        "Protocol timers reset during the lab and must be checked again"
       ],
       "answer": 1,
       "explain": "Interactions between tasks are the reason for the sweep; nothing about the grading clock requires it."
      }
     ]
    }
   ]
  }
 ]
});
TRACK.modules.push({
 "id": "m2",
 "order": 2,
 "code": "Layer2",
 "title": "Layer 2 at Scale",
 "subtitle": "MST, spanning tree protection, first-hop security, multi-chassis aggregation, gateway redundancy and loop forensics",
 "outcomes": [
  "Design and verify MST regions without pruning blackholes or accidental boundaries",
  "Harden spanning tree with the right guard at every trust boundary",
  "Deploy DHCP snooping, ARP inspection, source guard and storm control as one system",
  "Engineer multi-chassis aggregation and gateway redundancy that survive failures cleanly",
  "Deploy QinQ services and run a structured layer 2 loop investigation"
 ],
 "lessons": [
  {
   "id": "m2-l1",
   "title": "MST Deep Dive: Regions, CIST and Boundaries",
   "subtitle": "How multiple spanning tree really builds its topologies and where it breaks",
   "minutes": 40,
   "objectives": [
    "Explain how an MST region is defined and why a single mismatch splits it",
    "Identify the CIST root, CIST regional root and boundary ports from show output",
    "Design VLAN-to-instance mappings and trunk pruning that cannot blackhole traffic"
   ],
   "blocks": [
    {
     "type": "text",
     "text": "Per-VLAN spanning tree gives one topology per VLAN, which is flexible but expensive: one BPDU stream and one state machine per VLAN per port. Multiple Spanning Tree (IEEE 802.1s, now part of 802.1Q) maps many VLANs to a small number of **instances**, so a switch runs a handful of topologies regardless of how many VLANs exist. The price is a stricter model that punishes inconsistent configuration."
    },
    {
     "type": "callout",
     "kind": "definition",
     "text": "A set of interconnected bridges that share exactly the same **region name**, **revision number** and **VLAN-to-instance mapping**. The mapping is compared as a digest carried in every MST BPDU. Any difference in any of the three places a bridge in a different region.",
     "title": "MST region"
    },
    {
     "type": "layers",
     "title": "The MST hierarchy",
     "items": [
      {
       "label": "CIST",
       "parts": [
        "spans the whole bridged network",
        "each region appears as one virtual bridge",
        "interoperates with RSTP and legacy STP"
       ]
      },
      {
       "label": "IST (MSTI 0)",
       "parts": [
        "the CIST inside a region",
        "carries the region's link to the outside",
        "all unmapped VLANs belong here"
       ]
      },
      {
       "label": "MSTI 1..n",
       "parts": [
        "exist only inside the region",
        "carried as records inside the single MST BPDU",
        "independent root and port roles per instance"
       ]
      },
      {
       "label": "Ports",
       "parts": [
        "role and state per instance",
        "boundary ports follow the CIST role for all instances",
        "hop count limits instance diameter"
       ]
      }
     ]
    },
    {
     "type": "table",
     "title": "Roles you must recognise",
     "head": [
      "Role or bridge",
      "Scope",
      "How it is determined"
     ],
     "rows": [
      [
       "CIST root",
       "Entire network",
       "Lowest bridge ID among all bridges in all regions and any RSTP or legacy STP bridges"
      ],
      [
       "CIST regional root",
       "One region",
       "The bridge in the region with the lowest external path cost to the CIST root; the CIST root itself if it is inside the region"
      ],
      [
       "MSTI regional root",
       "One instance in one region",
       "Lowest bridge ID for that instance, using the per-instance priority"
      ],
      [
       "Boundary port",
       "Region edge",
       "A port connected to a bridge in a different region or to an RSTP or legacy STP bridge"
      ],
      [
       "Master port",
       "Regional root of the CIST",
       "The boundary port toward the CIST root; for every MSTI its role is master and it follows the CIST state"
      ]
     ]
    },
    {
     "type": "cli",
     "title": "Building a consistent region",
     "device": "SW1 · IOS-style CLI",
     "lines": [
      "spanning-tree mode mst",
      "spanning-tree mst configuration",
      " name DC-CORE",
      " revision 7",
      " instance 1 vlan 100-199",
      " instance 2 vlan 200-299",
      " exit",
      "spanning-tree mst 0-1 priority 4096",
      "spanning-tree mst 2 priority 8192",
      "spanning-tree mst max-hops 20",
      "!",
      "! on SW2: same name, revision and mapping;",
      "! priorities reversed for instance 2 so each core switch roots one instance",
      "spanning-tree mst 0-1 priority 8192",
      "spanning-tree mst 2 priority 4096"
     ],
     "note": "Changes in the MST configuration sub-mode only take effect when you leave it. Generate the region block from one source of truth and apply it identically everywhere, because a single typo creates a new region."
    },
    {
     "type": "cli",
     "title": "Spotting a region split",
     "device": "SW7 · IOS-style CLI",
     "lines": [
      "SW7# show spanning-tree mst configuration",
      "Name      [DC-C0RE]",
      "Revision  7     Instances configured 3",
      "Instance  Vlans mapped",
      "--------  ---------------------------------------------",
      "0         1-99,300-4094",
      "1         100-199",
      "2         200-299",
      "SW7# show spanning-tree mst 0 | begin Interface",
      "Interface        Role Sts Cost      Prio.Nbr Type",
      "Gi1/0/49         Root FWD 20000     128.49   P2p Bound",
      "Gi1/0/50         Altn BLK 20000     128.50   P2p Bound"
     ],
     "note": "The region name uses a zero instead of the letter O. SW7 is its own region, both uplinks are boundary ports, and at a boundary every instance follows the CIST role. Gi1/0/50 therefore blocks all VLANs, including those that the design intended to forward on it for instance 2."
    },
    {
     "type": "callout",
     "kind": "warning",
     "text": "MST computes each instance topology without looking at which VLANs a trunk actually carries. If VLAN 210 is mapped to instance 2 but is allowed only on a link that instance 2 blocks, VLAN 210 is cut off even though spanning tree reports a healthy, loop-free topology. Inside a region, allow every VLAN of an instance on every trunk that participates in that instance, or prune only in ways that match the instance topology exactly.",
     "title": "The pruning blackhole"
    },
    {
     "type": "compare",
     "title": "Choosing a spanning tree model",
     "columns": [
      {
       "title": "Per-VLAN rapid STP",
       "items": [
        "One topology per VLAN",
        "Simple to load-share per VLAN",
        "Control-plane cost grows with VLAN count"
       ]
      },
      {
       "title": "MST",
       "items": [
        "Few instances, many VLANs",
        "Strict region consistency required",
        "Scales to thousands of VLANs"
       ]
      },
      {
       "title": "Single RSTP instance",
       "items": [
        "One topology for everything",
        "Simplest to operate",
        "No per-VLAN load sharing"
       ]
      }
     ]
    },
    {
     "type": "steps",
     "title": "Migrating safely to MST",
     "items": [
      {
       "title": "Design the mapping once",
       "text": "Group VLANs by intended forwarding path and leave spare instances for growth; avoid remapping later because every change splits the region during rollout."
      },
      {
       "title": "Place the roots",
       "text": "Make the core switches the CIST root and the regional roots for every instance, so boundary behaviour stays predictable during migration."
      },
      {
       "title": "Pre-stage the region block",
       "text": "Configure the identical name, revision and mapping on every switch before changing the spanning tree mode."
      },
      {
       "title": "Convert from the core outward",
       "text": "Switch the core first, then distribution, then access, verifying root and port roles at each stage."
      },
      {
       "title": "Audit trunks",
       "text": "Compare allowed VLAN lists against instance topologies to remove pruning blackholes."
      }
     ]
    },
    {
     "type": "formula",
     "title": "MST arithmetic",
     "items": [
      {
       "name": "Remaining hops",
       "expr": "max_hops − bridges traversed inside the region",
       "meaning": "BPDUs inside a region are discarded when the hop count reaches zero; the default limit is 20."
      },
      {
       "name": "BPDU load, per-VLAN STP",
       "expr": "VLANs × trunk ports × 1 BPDU per hello",
       "meaning": "Grows linearly with VLAN count."
      },
      {
       "name": "BPDU load, MST",
       "expr": "trunk ports × 1 BPDU per hello (all instances inside)",
       "meaning": "Independent of VLAN count; instance records ride in the same BPDU."
      }
     ]
    },
    {
     "type": "scenario",
     "title": "Building B loses VLAN 210",
     "situation": "After a new access switch is installed in building B, users in VLAN 210 there lose connectivity while VLAN 110 users on the same switch work normally. On the new switch both uplinks show the Bound type in the instance 0 output and the second uplink is blocking. VLAN 210 is allowed only on the second uplink by design.",
     "options": [
      {
       "text": "Fix the new switch's region name, revision or mapping, then audit trunk allowed lists.",
       "feedback": "Correct. The boundary makes every instance follow the CIST role, so the second uplink blocks VLAN 210. Joining the region restores per-instance roles; the trunk audit removes the fragile dependency on pruning.",
       "best": true
      },
      {
       "text": "Lower the instance 2 priority on the new switch so it becomes the regional root for instance 2.",
       "feedback": "The switch is in its own region, so its instance 2 is unrelated to the core's instance 2. It changes nothing at the boundary.",
       "best": false
      },
      {
       "text": "Disable spanning tree on the second uplink so it forwards all VLANs regardless of role.",
       "feedback": "This creates a layer 2 loop for every VLAN carried on both uplinks, turning a single-VLAN outage into a network-wide storm.",
       "best": false
      },
      {
       "text": "Configure the second uplink as an edge port so it moves to forwarding immediately.",
       "feedback": "Edge status does not override a blocking role on a link that receives BPDUs, and misusing it on an inter-switch link risks loops.",
       "best": false
      }
     ]
    },
    {
     "type": "checklist",
     "title": "MST health check",
     "items": [
      "Region name, revision and digest identical on every switch in the region",
      "CIST root and every MSTI regional root on intended core switches",
      "No unexpected Bound ports inside the region",
      "Trunk allowed lists consistent with each instance topology",
      "Spare instances reserved to avoid remapping later",
      "Max hops sufficient for the region diameter"
     ]
    },
    {
     "type": "terms",
     "items": [
      {
       "term": "MST region",
       "def": "Bridges with identical region name, revision number and VLAN-to-instance mapping."
      },
      {
       "term": "CIST",
       "def": "Common and internal spanning tree: the single tree that spans all regions and non-MST bridges."
      },
      {
       "term": "IST",
       "def": "Internal spanning tree: instance 0, the portion of the CIST inside a region."
      },
      {
       "term": "MSTI",
       "def": "A multiple spanning tree instance that exists only inside its region and carries a group of VLANs."
      },
      {
       "term": "CIST regional root",
       "def": "The bridge in a region with the lowest external path cost to the CIST root."
      },
      {
       "term": "Boundary port",
       "def": "A port that connects to another region or to an RSTP or legacy STP bridge; all instances follow the CIST role on it."
      },
      {
       "term": "Master port",
       "def": "The boundary port on the CIST regional root that leads toward the CIST root."
      },
      {
       "term": "Configuration digest",
       "def": "A hash of the VLAN-to-instance table carried in MST BPDUs to detect mapping mismatches."
      },
      {
       "term": "Max hops",
       "def": "The hop count limit for BPDUs inside an MST region, replacing message age within the region."
      }
     ]
    },
    {
     "type": "reflection",
     "prompt": "Draw your current or a familiar campus as MST regions. Where are the boundaries, where is the CIST root, and which VLANs would be at risk from a pruning blackhole?"
    },
    {
     "type": "quiz",
     "items": [
      {
       "q": "Two switches have the same region name and revision but different VLAN-to-instance mappings. What happens?",
       "options": [
        "They form different regions because the configuration digests differ",
        "They form one region, and the switch with the lower bridge ID wins the mapping",
        "They form one region and only the VLANs mapped identically are protected",
        "They stop exchanging BPDUs and both treat the link as an edge port"
       ],
       "answer": 0,
       "explain": "The digest of the mapping is part of region identity; any mismatch places the switches in different regions."
      },
      {
       "q": "On a boundary port, how are MST instances handled?",
       "options": [
        "Each instance keeps its own role, computed from the external neighbour",
        "Only instance 0 is blocked while other instances forward normally",
        "Every instance follows the port role and the forwarding state of the CIST",
        "All instances forward because boundary ports cannot create loops"
       ],
       "answer": 2,
       "explain": "Outside its region an MSTI has no meaning, so at the boundary all instances inherit the CIST role."
      },
      {
       "q": "VLAN 210 is mapped to instance 2 and allowed only on trunk T2, which instance 2 blocks. What is the effect?",
       "options": [
        "Spanning tree unblocks T2 for VLAN 210 because it is the only path",
        "VLAN 210 is isolated even though spanning tree reports no problem",
        "VLAN 210 automatically moves to instance 0 for the affected trunk",
        "Instance 2 recalculates a new topology based on the allowed list"
       ],
       "answer": 1,
       "explain": "MST ignores allowed VLAN lists when computing topology, so pruning inconsistent with the instance topology silently blackholes traffic."
      },
      {
       "q": "Which bridge is the CIST regional root when the CIST root is outside the region?",
       "options": [
        "The bridge in the region with the lowest instance 0 priority value",
        "The bridge in the region with the highest number of boundary ports",
        "The bridge that holds the regional root role for most of the instances",
        "The bridge with the lowest external path cost to the CIST root"
       ],
       "answer": 3,
       "explain": "The CIST regional root is chosen by external root path cost first, which is why it sits at the region's best exit toward the CIST root."
      },
      {
       "q": "What replaces message age as the diameter control inside an MST region?",
       "options": [
        "A per-instance timer that doubles every time a BPDU is relayed",
        "The forward delay timer applied separately to each instance",
        "A sequence number carried in each of the instance records",
        "A hop count that is decremented by each bridge in the region"
       ],
       "answer": 3,
       "explain": "Inside a region BPDUs carry remaining hops (default 20); message age is used for the CIST outside."
      }
     ]
    }
   ]
  },
  {
   "id": "m2-l2",
   "title": "STP Tuning, Protection and Failure Modes",
   "subtitle": "Rapid convergence mechanics, guard features and how spanning tree really fails",
   "minutes": 40,
   "objectives": [
    "Explain rapid spanning tree proposal and agreement and topology change handling",
    "Place BPDU guard, root guard, loop guard and unidirectional link detection correctly",
    "Diagnose the classic spanning tree failure modes from logs and counters"
   ],
   "blocks": [
    {
     "type": "text",
     "text": "Rapid spanning tree converges in milliseconds on point-to-point links because it does not wait for timers. A designated port sends a **proposal**; the downstream bridge **syncs** by blocking its non-edge designated ports, then returns an **agreement**, and the designated port forwards immediately. The sync then ripples downstream. Timers matter only on shared segments, toward legacy bridges, and to detect lost BPDUs."
    },
    {
     "type": "flow",
     "title": "Proposal and agreement on one link",
     "items": [
      {
       "label": "Proposal",
       "text": "Upstream designated port sends a BPDU with the proposal flag"
      },
      {
       "label": "Sync",
       "text": "Downstream bridge blocks its non-edge designated ports"
      },
      {
       "label": "Agreement",
       "text": "Downstream root port replies with the agreement flag"
      },
      {
       "label": "Forward",
       "text": "Upstream port moves to forwarding without timers"
      },
      {
       "label": "Ripple",
       "text": "Downstream designated ports repeat the handshake"
      }
     ]
    },
    {
     "type": "callout",
     "kind": "insight",
     "text": "In rapid spanning tree only a non-edge port moving to forwarding generates a topology change. The bridge flushes MAC addresses learned on its other non-edge ports and floods the change. In large layer 2 domains, a single access port without edge configuration that flaps every minute causes network-wide MAC flushing and bursts of unknown unicast flooding.",
     "title": "Topology changes are a flush, not a recalculation"
    },
    {
     "type": "table",
     "title": "Protection features and where they belong",
     "head": [
      "Feature",
      "Apply on",
      "Triggers on",
      "Action"
     ],
     "rows": [
      [
       "BPDU guard",
       "Edge ports to hosts",
       "Any BPDU received",
       "Error-disable the port"
      ],
      [
       "BPDU filter",
       "Rarely, edge ports only",
       "Suppresses sending and receiving BPDUs",
       "No protection; can create silent loops"
      ],
      [
       "Root guard",
       "Designated ports toward switches that must never be root",
       "A superior BPDU",
       "Root-inconsistent blocking until superior BPDUs stop"
      ],
      [
       "Loop guard",
       "Root and alternate ports on point-to-point links",
       "BPDUs stop arriving",
       "Loop-inconsistent blocking instead of becoming designated"
      ],
      [
       "Unidirectional link detection",
       "Fibre and long inter-switch links",
       "Peer stops seeing our echoes",
       "Error-disable the link"
      ],
      [
       "Storm control",
       "Access ports and selected trunks",
       "Broadcast, multicast or unknown unicast above threshold",
       "Drop excess, trap or shut down"
      ]
     ]
    },
    {
     "type": "cli",
     "title": "Hardening access and distribution",
     "device": "DSW1 · IOS-style CLI",
     "lines": [
      "spanning-tree loopguard default",
      "errdisable recovery cause bpduguard",
      "errdisable recovery interval 300",
      "!",
      "interface range GigabitEthernet1/0/1 - 44",
      " description ACCESS-HOSTS",
      " switchport mode access",
      " spanning-tree portfast edge",
      " spanning-tree bpduguard enable",
      "!",
      "interface range TenGigabitEthernet1/1/1 - 4",
      " description DOWNLINKS-TO-ACCESS",
      " spanning-tree guard root"
     ],
     "note": "Root guard sits on the distribution side of links toward access switches, so no access device can ever take over the root. Loop guard is enabled globally but only acts on non-designated point-to-point ports."
    },
    {
     "type": "cli",
     "title": "Reading inconsistent ports",
     "device": "DSW1 · IOS-style CLI",
     "lines": [
      "DSW1# show spanning-tree inconsistentports",
      "Name                 Interface                Inconsistency",
      "-------------------- ------------------------ ------------------",
      "MST0000              TenGigabitEthernet1/1/3  Root Inconsistent",
      "MST0002              TenGigabitEthernet1/2/1  Loop Inconsistent",
      "Number of inconsistent ports (segments) in the system : 2",
      "DSW1# show logging | include GUARD",
      "%STP-2-ROOTGUARD_BLOCK: Root guard blocking port Te1/1/3 on MST0000",
      "%STP-2-LOOPGUARD_BLOCK: Loop guard blocking port Te1/2/1 on MST0002"
     ],
     "note": "Te1/1/3 is receiving superior BPDUs from an access switch, so somebody raised its priority or connected a rogue bridge. Te1/2/1 stopped receiving BPDUs on a non-designated port, which strongly suggests a unidirectional fault. Both ports block only the affected instance and recover automatically when the condition clears."
    },
    {
     "type": "flow",
     "title": "How a unidirectional fibre creates a loop",
     "items": [
      {
       "label": "Fault",
       "text": "The fibre from A to B fails in one direction"
      },
      {
       "label": "Silence",
       "text": "B's alternate port stops receiving A's BPDUs"
      },
      {
       "label": "Expiry",
       "text": "After three missed hellos B ages out A's information"
      },
      {
       "label": "Promotion",
       "text": "B makes the port designated and forwarding"
      },
      {
       "label": "Loop",
       "text": "A still forwards toward B, so a loop forms"
      }
     ]
    },
    {
     "type": "formula",
     "title": "Timer relationships",
     "items": [
      {
       "name": "Legacy worst-case convergence",
       "expr": "max age + 2 × forward delay = 20 + 2 × 15 = 50 s",
       "meaning": "Why legacy timers are unacceptable and why rapid spanning tree relies on handshakes instead."
      },
      {
       "name": "Rapid BPDU-loss detection",
       "expr": "3 × hello = 3 × 2 s = 6 s",
       "meaning": "Information is aged out after three missed hellos on a rapid spanning tree port."
      },
      {
       "name": "Legacy timer constraints",
       "expr": "2 × (forward delay − 1) ≥ max age ≥ 2 × (hello + 1)",
       "meaning": "Keep tuned timers inside these limits or the protocol may converge before BPDUs have propagated."
      }
     ]
    },
    {
     "type": "compare",
     "title": "Tune or do not tune",
     "columns": [
      {
       "title": "Worth tuning",
       "items": [
        "Root and backup root priorities",
        "Port cost on links that must be preferred",
        "Edge configuration on every host port",
        "Guard features at every trust boundary"
       ]
      },
      {
       "title": "Usually leave alone",
       "items": [
        "Hello, forward delay and max age in rapid domains",
        "Max hops, unless the region is very large",
        "Port priority, except to break deliberate ties"
       ]
      }
     ]
    },
    {
     "type": "scenario",
     "title": "A contractor's switch becomes root",
     "situation": "A contractor connected a small switch with bridge priority 0 to an access port in a meeting room. It became the root bridge, and traffic between two distribution switches started hairpinning through a 1 Gb/s access uplink, saturating it. You must prevent a recurrence.",
     "options": [
      {
       "text": "Set the core switches to priority 0 so they always win the root election.",
       "feedback": "A rogue bridge with priority 0 then ties on priority and wins on a lower MAC address half the time. Priority alone is not protection.",
       "best": false
      },
      {
       "text": "Enable BPDU filter on all access ports so foreign BPDUs are ignored.",
       "feedback": "Filtering hides BPDUs instead of acting on them. A looped cable on a filtered port creates a loop that spanning tree cannot see.",
       "best": false
      },
      {
       "text": "Enable loop guard on all access ports so they block when anomalies occur.",
       "feedback": "Loop guard acts when BPDUs stop on non-designated ports. It does not react to a superior BPDU arriving on a designated port.",
       "best": false
      },
      {
       "text": "Enable BPDU guard on all host-facing edge ports and root guard on distribution ports facing access switches.",
       "feedback": "Correct. BPDU guard stops any bridge on host ports, and root guard ensures no access-layer device can win the root even if BPDU guard is missing somewhere.",
       "best": true
      }
     ]
    },
    {
     "type": "checklist",
     "title": "Spanning tree hardening",
     "items": [
      "Every host port configured as edge with BPDU guard",
      "Root guard on distribution ports facing access switches",
      "Loop guard or equivalent on point-to-point non-designated ports",
      "Unidirectional link detection on fibre inter-switch links",
      "BPDU filter absent, or justified and documented",
      "Root and backup root priorities set explicitly",
      "Topology change counters baselined and monitored"
     ]
    },
    {
     "type": "terms",
     "items": [
      {
       "term": "Proposal and agreement",
       "def": "The rapid spanning tree handshake that lets a designated port forward immediately on a point-to-point link."
      },
      {
       "term": "Sync",
       "def": "Blocking all non-edge designated ports before agreeing to a proposal, so no temporary loop can form."
      },
      {
       "term": "Edge port",
       "def": "A port declared to connect only to end hosts; it forwards immediately and does not generate topology changes."
      },
      {
       "term": "BPDU guard",
       "def": "Error-disables an edge port that receives any BPDU."
      },
      {
       "term": "Root guard",
       "def": "Blocks a port that receives a superior BPDU, protecting the root placement."
      },
      {
       "term": "Loop guard",
       "def": "Prevents a non-designated port from becoming designated when BPDUs stop arriving."
      },
      {
       "term": "Unidirectional link",
       "def": "A link that passes traffic in only one direction, which can defeat spanning tree's loop prevention."
      },
      {
       "term": "Topology change",
       "def": "A notification that triggers MAC flushing; in rapid spanning tree it is caused by a non-edge port moving to forwarding."
      },
      {
       "term": "Root-inconsistent",
       "def": "The blocking state applied by root guard while superior BPDUs are received."
      }
     ]
    },
    {
     "type": "reflection",
     "prompt": "Where in your network would a single misbehaving port cause topology changes across the whole layer 2 domain? What would you configure there first?"
    },
    {
     "type": "quiz",
     "items": [
      {
       "q": "Which event generates a topology change in rapid spanning tree?",
       "options": [
        "Any port transitioning from forwarding to the blocking state",
        "An edge port moving to forwarding after its link comes up",
        "A non-edge port transitioning to the forwarding state",
        "A BPDU arriving with a lower root path cost than before"
       ],
       "answer": 2,
       "explain": "Only non-edge ports becoming forwarding signal a topology change; edge ports and transitions to blocking do not."
      },
      {
       "q": "Where should root guard be configured?",
       "options": [
        "On designated ports facing switches that must never become root",
        "On the root ports of access switches that face the distribution layer",
        "On every edge port that connects directly to an end host",
        "On alternate ports of switches that sit in the core layer"
       ],
       "answer": 0,
       "explain": "Root guard protects the root placement by blocking superior BPDUs arriving on designated ports toward downstream switches."
      },
      {
       "q": "A point-to-point uplink is reported as loop-inconsistent. What does it indicate?",
       "options": [
        "A superior BPDU arrived from a switch with a better priority",
        "BPDUs stopped arriving on a port that was root or alternate",
        "The port received a BPDU while configured as an edge port",
        "Two ports on the same switch received the same BPDU"
       ],
       "answer": 1,
       "explain": "Loop guard triggers on BPDU loss on non-designated ports, a typical sign of a unidirectional fault."
      },
      {
       "q": "Why is BPDU filter considered dangerous on host ports?",
       "options": [
        "A looped cable or bridge on that port is invisible to spanning tree",
        "It increases the BPDU rate on the port and loads the switch CPU",
        "It forces the port into blocking whenever a host first connects",
        "It disables the edge behaviour so every link-up becomes a topology change"
       ],
       "answer": 0,
       "explain": "Filtering suppresses BPDUs entirely, so spanning tree cannot detect a loop through that port."
      },
      {
       "q": "What is the worst-case convergence with legacy default timers?",
       "options": [
        "About 30 seconds",
        "About 20 seconds",
        "About 50 seconds",
        "About 6 seconds"
       ],
       "answer": 2,
       "explain": "Max age 20 s plus two forward delay periods of 15 s gives 50 s."
      }
     ]
    }
   ]
  },
  {
   "id": "m2-l3",
   "title": "First-Hop Security at Scale",
   "subtitle": "DHCP snooping, dynamic ARP inspection, IP source guard and storm control as one system",
   "minutes": 40,
   "objectives": [
    "Explain how DHCP snooping bindings feed ARP inspection and source guard",
    "Deploy first-hop security without breaking static hosts, relays or reloads",
    "Calculate and apply storm-control thresholds from line rate and frame size"
   ],
   "blocks": [
    {
     "type": "text",
     "text": "The access edge is where most layer 2 attacks start: rogue DHCP servers, ARP spoofing, source address spoofing and floods. The defences are designed as a **chain**: DHCP snooping learns who legitimately owns which address, and every later feature trusts that table. Get the first link wrong and every later feature either fails open or drops legitimate traffic."
    },
    {
     "type": "flow",
     "title": "The first-hop security chain",
     "items": [
      {
       "label": "DHCP snooping",
       "text": "Blocks server replies on untrusted ports and builds the binding table"
      },
      {
       "label": "Binding table",
       "text": "MAC, IP, VLAN, port and lease for every client"
      },
      {
       "label": "ARP inspection",
       "text": "Drops ARP whose sender MAC and IP do not match a binding"
      },
      {
       "label": "IP source guard",
       "text": "Filters data-plane packets per port by source IP and optionally MAC"
      },
      {
       "label": "Storm control",
       "text": "Caps broadcast, multicast and unknown unicast rates"
      }
     ]
    },
    {
     "type": "table",
     "title": "What each feature validates",
     "head": [
      "Feature",
      "Validates",
      "Data source",
      "Typical failure when misconfigured"
     ],
     "rows": [
      [
       "DHCP snooping",
       "Server messages arrive only on trusted ports",
       "Trust configuration",
       "Clients get no lease when the uplink is not trusted"
      ],
      [
       "Option 82 insertion",
       "Port and switch identity in client requests",
       "Snooping switch",
       "Upstream relay discards requests with option 82 and a zero gateway address"
      ],
      [
       "ARP inspection",
       "Sender MAC and IP in ARP match a binding",
       "Binding table or ARP ACL",
       "Static-address hosts and gateways lose connectivity"
      ],
      [
       "IP source guard",
       "Source IP (and MAC) per port",
       "Binding table",
       "All client traffic dropped after a reload until leases renew"
      ],
      [
       "Storm control",
       "Traffic class rate per second",
       "Configured threshold",
       "Legitimate bursts dropped, or a port shut down"
      ]
     ]
    },
    {
     "type": "cli",
     "title": "Access switch first-hop security",
     "device": "ASW4 · IOS-style CLI",
     "lines": [
      "ip dhcp snooping",
      "ip dhcp snooping vlan 10,20",
      "no ip dhcp snooping information option",
      "ip dhcp snooping database flash:dhcp-bindings.db",
      "ip arp inspection vlan 10,20",
      "ip arp inspection validate src-mac dst-mac ip",
      "!",
      "interface TenGigabitEthernet1/1/1",
      " description UPLINK-TO-DSW1",
      " ip dhcp snooping trust",
      " ip arp inspection trust",
      "!",
      "interface range GigabitEthernet1/0/1 - 40",
      " ip dhcp snooping limit rate 15",
      " ip verify source",
      " storm-control broadcast level 1.00",
      " storm-control action trap"
     ],
     "note": "Option 82 insertion is disabled here because the distribution layer is the relay and does not trust option 82 with a zero gateway address. The binding database is stored persistently so source guard does not drop every client after a reload."
    },
    {
     "type": "cli",
     "title": "Reading bindings and drops",
     "device": "ASW4 · IOS-style CLI",
     "lines": [
      "ASW4# show ip dhcp snooping binding",
      "MacAddress          IpAddress        Lease(sec)  Type           VLAN  Interface",
      "------------------  ---------------  ----------  -------------  ----  ---------------",
      "00:50:56:AA:01:07   10.1.10.57       85912       dhcp-snooping   10   Gi1/0/7",
      "00:50:56:AA:01:12   10.1.20.33       86104       dhcp-snooping   20   Gi1/0/12",
      "ASW4# show ip arp inspection statistics vlan 10",
      " Vlan      Forwarded        Dropped     DHCP Drops      ACL Drops",
      " ----      ---------        -------     ----------      ---------",
      "   10          48211           3302           3302              0",
      "%ARP-4-DAI_DROP: Invalid ARP (Res) on Gi1/0/31, vlan 10 ([0050.56aa.0144/10.1.10.200]"
     ],
     "note": "All drops are DHCP drops: ARP from senders with no matching binding. Gi1/0/31 hosts a printer with a static address 10.1.10.200, which never appears in the binding table. That is a deployment gap, not an attack."
    },
    {
     "type": "callout",
     "kind": "warning",
     "text": "A snooping switch that is not itself the relay can insert option 82 into client requests while leaving the relay gateway address at zero. Some relay agents treat that combination as untrusted and silently discard it. Either disable insertion on the access switch, or configure the relay to trust option 82 on the interfaces facing your snooping switches.",
     "title": "Option 82 and the zero gateway address"
    },
    {
     "type": "callout",
     "kind": "pro",
     "text": "Give statically addressed hosts static bindings or ARP ACL entries before enabling inspection, and store the binding table persistently. Without persistence, a switch reload empties the table and source guard drops every client until each renews its lease, which can take hours.",
     "title": "Static hosts and reloads"
    },
    {
     "type": "formula",
     "title": "Storm-control arithmetic",
     "items": [
      {
       "name": "Threshold bandwidth",
       "expr": "level % × line rate",
       "meaning": "1.00% of 1 Gb/s is 10 Mb/s of the controlled traffic class."
      },
      {
       "name": "Threshold in packets",
       "expr": "threshold bandwidth ÷ ((frame bytes + 20) × 8)",
       "meaning": "For minimum 64-byte frames plus 20 bytes of preamble and gap: 10 Mb/s ÷ 672 bits ≈ 14,880 pps."
      },
      {
       "name": "Measurement window",
       "expr": "rate averaged per 1 s interval",
       "meaning": "Short bursts above the level inside one interval are not distinguished from sustained floods."
      }
     ]
    },
    {
     "type": "template",
     "title": "First-hop security rollout matrix",
     "purpose": "Plan trust, inspection and exceptions per VLAN and port class before enabling enforcement.",
     "columns": [
      "VLAN",
      "Port class",
      "Snooping trust",
      "ARP inspection",
      "Source guard",
      "Storm level",
      "Exceptions"
     ],
     "example": [
      [
       "10 Users",
       "Access host",
       "Untrusted",
       "On",
       "On",
       "Broadcast 1%",
       "None"
      ],
      [
       "40 Printers",
       "Access host",
       "Untrusted",
       "On + ARP ACL",
       "Off",
       "Broadcast 1%",
       "Static IPs 10.1.40.0/26"
      ]
     ],
     "rows": 8
    },
    {
     "type": "scenario",
     "title": "Printers vanish after enforcement",
     "situation": "After enabling ARP inspection on VLAN 40, all DHCP clients work but every statically addressed printer in the VLAN becomes unreachable. Statistics show only DHCP drops, and the logs show invalid ARP replies from the printers' own addresses.",
     "options": [
      {
       "text": "Configure all access ports in VLAN 40 as trusted for ARP inspection.",
       "feedback": "This makes the drops stop but disables inspection on exactly the ports where spoofing would come from.",
       "best": false
      },
      {
       "text": "Disable the source MAC validation check so the printers' replies are no longer rejected.",
       "feedback": "The drops are caused by missing bindings, not by MAC mismatch checks, so this changes nothing useful.",
       "best": false
      },
      {
       "text": "Add ARP ACL entries or static bindings for the printers' MAC and IP pairs.",
       "feedback": "Correct. The printers have no snooping bindings because they never used DHCP. Explicit entries let inspection validate them without weakening protection for other hosts.",
       "best": true
      },
      {
       "text": "Raise the ARP inspection rate limit on the printer ports to accept more ARP traffic.",
       "feedback": "The printers are not exceeding a rate; their ARP is invalid against the binding table. Rate limits are unrelated.",
       "best": false
      }
     ]
    },
    {
     "type": "checklist",
     "title": "First-hop security deployment",
     "items": [
      "Uplinks and legitimate DHCP server ports trusted for snooping",
      "Option 82 behaviour agreed between access switch and relay",
      "Binding table stored persistently",
      "Static hosts covered by static bindings or ARP ACLs",
      "Inspection run in monitor or logging mode before enforcement where available",
      "Storm-control levels derived from measured baseline traffic",
      "Error-disable recovery and alerting configured"
     ]
    },
    {
     "type": "terms",
     "items": [
      {
       "term": "DHCP snooping",
       "def": "A switch function that permits DHCP server messages only on trusted ports and records client leases."
      },
      {
       "term": "Binding table",
       "def": "The snooping database of client MAC, IP, VLAN, port and lease."
      },
      {
       "term": "Option 82",
       "def": "The DHCP relay agent information option that identifies the switch and port a request came from."
      },
      {
       "term": "Dynamic ARP inspection",
       "def": "Validation of ARP packets on untrusted ports against bindings or ARP ACLs."
      },
      {
       "term": "ARP ACL",
       "def": "A static list of permitted MAC and IP pairs used by ARP inspection for hosts without DHCP leases."
      },
      {
       "term": "IP source guard",
       "def": "A per-port data-plane filter that permits only source addresses found in the binding table."
      },
      {
       "term": "Storm control",
       "def": "Rate limiting of broadcast, multicast or unknown unicast traffic per port."
      },
      {
       "term": "Trusted port",
       "def": "A port exempt from snooping and inspection checks, normally an uplink toward infrastructure."
      }
     ]
    },
    {
     "type": "reflection",
     "prompt": "List the statically addressed devices in one of your access VLANs. How would you discover the ones you do not know about before enabling ARP inspection?"
    },
    {
     "type": "quiz",
     "items": [
      {
       "q": "After a switch reload, all clients on ports with IP source guard lose connectivity until they renew. What prevents this?",
       "options": [
        "Trusting every access port for DHCP snooping during the boot period",
        "Raising the DHCP snooping rate limit on all of the access ports",
        "Enabling option 82 insertion on the access switch for all VLANs",
        "Storing the snooping binding table persistently across reloads"
       ],
       "answer": 3,
       "explain": "Source guard relies on bindings; persistence restores them after a reload."
      },
      {
       "q": "Clients get no address after snooping is enabled. The server is reached through the uplink. What is the first thing to check?",
       "options": [
        "Whether ARP inspection is enabled on the same VLANs as snooping",
        "Whether the uplink toward the server or relay is trusted for DHCP snooping",
        "Whether storm control is dropping broadcast DHCP discover messages",
        "Whether IP source guard is configured on the uplink interface"
       ],
       "answer": 1,
       "explain": "Server replies arriving on an untrusted port are dropped, so no client receives an offer."
      },
      {
       "q": "What is 1% of a 1 Gb/s port expressed in minimum-size frames per second, including preamble and gap?",
       "options": [
        "About 14,900 packets per second",
        "About 19,500 packets per second",
        "About 10,000 packets per second",
        "About 1,488 packets per second"
       ],
       "answer": 0,
       "explain": "10 Mb/s divided by 84 bytes × 8 bits = 672 bits per frame gives roughly 14,880 pps."
      },
      {
       "q": "ARP inspection drops replies from a statically addressed gateway on an access port. What is the best fix?",
       "options": [
        "Disable the IP validation option of ARP inspection for the whole VLAN",
        "Disable DHCP snooping on the VLAN that contains the gateway",
        "Enable IP source guard on the port that connects the gateway",
        "Add an ARP ACL or static binding for the gateway's MAC and IP pair"
       ],
       "answer": 3,
       "explain": "A static device needs an explicit entry; disabling validation or snooping weakens the whole VLAN."
      },
      {
       "q": "Why might an upstream relay discard DHCP requests from a snooping switch?",
       "options": [
        "They arrive with a source MAC address that is already in the binding table",
        "They exceed the per-port DHCP snooping rate limit on the uplink",
        "They carry option 82 while the relay gateway address field is zero",
        "They arrive on a VLAN in which ARP inspection is also enabled"
       ],
       "answer": 2,
       "explain": "Some relays treat option 82 with a zero gateway address as untrusted and discard it."
      }
     ]
    }
   ]
  },
  {
   "id": "m2-l4",
   "title": "Multi-Chassis Aggregation and First-Hop Redundancy",
   "subtitle": "Active-active uplinks, split-brain behaviour and gateway redundancy that converges cleanly",
   "minutes": 45,
   "objectives": [
    "Explain multi-chassis link aggregation components and failure handling",
    "Configure VRRP with tracking, preemption delay and load sharing",
    "Align gateway redundancy with spanning tree and multi-chassis designs"
   ],
   "blocks": [
    {
     "type": "text",
     "text": "Multi-chassis link aggregation lets a downstream device bundle links to two separate switches as if they were one. Both uplinks forward, spanning tree sees a single logical link, and a switch failure costs only bandwidth. The two peers must behave as one LACP partner and must never let a frame loop between them. Implementations differ in names and details, but the architecture is common."
    },
    {
     "type": "layers",
     "title": "Multi-chassis aggregation components",
     "items": [
      {
       "label": "Downstream device",
       "parts": [
        "standard LACP bundle",
        "sees one partner system ID",
        "hashes flows across member links"
       ]
      },
      {
       "label": "Member ports",
       "parts": [
        "one or more on each peer",
        "same bundle ID on both peers",
        "configuration must match"
       ]
      },
      {
       "label": "Peer link",
       "parts": [
        "synchronises MAC and ARP state",
        "carries traffic for single-attached hosts",
        "carries flooded traffic between peers"
       ]
      },
      {
       "label": "Peer keepalive",
       "parts": [
        "separate path, often out of band",
        "detects whether the peer is alive",
        "decides split-brain behaviour"
       ]
      },
      {
       "label": "Control roles",
       "parts": [
        "primary and secondary",
        "shared LACP system ID and priority",
        "consistency checks between peers"
       ]
      }
     ]
    },
    {
     "type": "callout",
     "kind": "insight",
     "text": "A frame that arrives over the peer link is not forwarded out of a multi-chassis member port while the peer's member port in the same bundle is up. The peer has already delivered it locally. That single rule is what allows both sides to forward without spanning tree blocking anything.",
     "title": "The loop-prevention rule"
    },
    {
     "type": "table",
     "title": "Failure handling",
     "head": [
      "Failure",
      "Typical behaviour",
      "Design guard"
     ],
     "rows": [
      [
       "Peer link down, keepalive up",
       "Secondary suspends its member ports and often its gateway interfaces",
       "Dual-home every device; treat single-attached ports as at risk"
      ],
      [
       "Keepalive down, peer link up",
       "No traffic impact; alarm raised",
       "Monitor keepalive; never run it over the peer link"
      ],
      [
       "Both down",
       "Dual-active: both peers act alone with the same system ID",
       "Separate physical paths and modules for peer link and keepalive"
      ],
      [
       "Primary reloads and returns",
       "Member ports come up before routing converges",
       "Restore delay keeps ports down until the control plane is ready"
      ],
      [
       "Single-attached host on secondary",
       "Isolated when the secondary suspends its ports",
       "Avoid single attachment or move such hosts to the primary"
      ]
     ]
    },
    {
     "type": "compare",
     "title": "Gateway redundancy options",
     "columns": [
      {
       "title": "VRRP (RFC 5798)",
       "items": [
        "One master forwards, backups listen",
        "Preemption enabled by default",
        "Owner of the address uses priority 255",
        "Virtual MAC 00-00-5E-00-01-xx for IPv4",
        "Advertisements to 224.0.0.18, IP protocol 112"
       ]
      },
      {
       "title": "Hot-standby style FHRPs",
       "items": [
        "Active and standby with separate hello and hold timers",
        "Preemption often disabled by default",
        "Separate virtual MAC ranges per implementation",
        "Similar tracking and priority logic"
       ]
      },
      {
       "title": "Distributed anycast gateway",
       "items": [
        "Every switch is an active gateway",
        "Same virtual IP and MAC everywhere",
        "No election and no hairpinning",
        "Requires a fabric that distributes host routes"
       ]
      }
     ]
    },
    {
     "type": "cli",
     "title": "VRRP with tracking and preemption delay",
     "device": "DSW1 · IOS-style CLI",
     "lines": [
      "track 10 interface TenGigabitEthernet1/1/8 line-protocol",
      "track 20 ip route 0.0.0.0 0.0.0.0 reachability",
      "track 30 list boolean and",
      " object 10",
      " object 20",
      "!",
      "interface Vlan10",
      " ip address 10.10.10.2 255.255.255.0",
      " vrrp 10 ip 10.10.10.1",
      " vrrp 10 priority 120",
      " vrrp 10 preempt delay minimum 60",
      " vrrp 10 track 30 decrement 30"
     ],
     "note": "Object 30 is up only while both the core uplink and the default route are present. When either fails, object 30 goes down and the decrement drops the priority from 120 to 90, below the peer's default 100. The preemption delay keeps the switch from reclaiming the master role until 60 seconds after it becomes eligible, giving routing time to converge after a reload."
    },
    {
     "type": "cli",
     "title": "Reading VRRP state",
     "device": "DSW1 · IOS-style CLI",
     "lines": [
      "DSW1# show vrrp brief",
      "Interface   Grp Pri Time  Own Pre State   Master addr     Group addr",
      "Vl10         10  90 3648       Y  Backup  10.10.10.3      10.10.10.1",
      "Vl20         20 120 3531       Y  Master  10.10.20.2      10.10.20.1",
      "DSW1# show track 30 brief",
      "Track Type        Instance                   Parameter        State Last Change",
      "30    list        boolean                    and              Down  00:02:14"
     ],
     "note": "Priority 90 on VLAN 10 shows the tracking decrement is active; the Time column is the master down interval in milliseconds, which depends on priority. VLAN 20 is still master because its group does not track object 30, so traffic for VLAN 20 is drawn to a switch with a failed uplink. That is a design gap, not a VRRP fault."
    },
    {
     "type": "formula",
     "title": "VRRP timing (version 3)",
     "items": [
      {
       "name": "Skew time",
       "expr": "((256 − priority) × advertisement interval) ÷ 256",
       "meaning": "Lower-priority backups wait slightly longer, so the best backup takes over first."
      },
      {
       "name": "Master down interval",
       "expr": "3 × advertisement interval + skew time",
       "meaning": "With a 1 s interval and priority 90: 3 + 0.648 = 3.648 s."
      },
      {
       "name": "Effective priority",
       "expr": "configured priority − sum of active decrements",
       "meaning": "Must fall below the peer's priority for failover to happen; check it, do not assume it."
      }
     ]
    },
    {
     "type": "steps",
     "title": "Load sharing gateways",
     "items": [
      {
       "title": "Split by VLAN",
       "text": "Make each distribution switch master for half the VLANs, using priority per group."
      },
      {
       "title": "Align with spanning tree",
       "text": "Without multi-chassis aggregation, make the master for a VLAN also the root for its instance, so traffic does not cross the inter-switch link."
      },
      {
       "title": "Track per group",
       "text": "Apply tracking to every group, so a failed uplink moves all of that switch's masters."
      },
      {
       "title": "Delay preemption",
       "text": "Use a preemption delay longer than routing convergence after a reload."
      },
      {
       "title": "Prefer active-active where available",
       "text": "With multi-chassis aggregation, implementations can let both peers forward for the virtual MAC, removing the hairpin entirely."
      }
     ]
    },
    {
     "type": "scenario",
     "title": "Forty seconds of loss after a reboot",
     "situation": "The primary distribution switch is reloaded during maintenance. Failover to the backup gateway is fast. When the primary returns, users lose connectivity for about 40 seconds even though no further fault occurs.",
     "options": [
      {
       "text": "Disable tracking on the primary switch so its priority stays stable after the reload.",
       "feedback": "Tracking is not what made it preempt early. Removing it also stops failover when an uplink fails.",
       "best": false
      },
      {
       "text": "Configure a preemption delay longer than the switch's routing and uplink convergence time.",
       "feedback": "Correct. VRRP preempts by default, so the returning switch reclaimed the master role as soon as its interface came up, before its routing protocols had converged, and blackholed traffic until they did.",
       "best": true
      },
      {
       "text": "Shorten the advertisement interval so the backup detects the new master more quickly.",
       "feedback": "Detection speed is not the problem. The new master is reachable at layer 2 but cannot yet route traffic.",
       "best": false
      },
      {
       "text": "Raise the backup switch's priority above the primary to stop preemption entirely.",
       "feedback": "This prevents the blackhole but permanently reverses the design and its alignment with spanning tree or routing.",
       "best": false
      }
     ]
    },
    {
     "type": "checklist",
     "title": "Gateway redundancy review",
     "items": [
      "Master per VLAN aligned with spanning tree root or multi-chassis design",
      "Tracking applied to every group, not only some",
      "Effective priority after decrement falls below the peer",
      "Preemption delay exceeds routing convergence after reload",
      "Peer link and keepalive on separate physical paths",
      "No critical single-attached devices on the secondary peer",
      "Restore delay configured for multi-chassis member ports"
     ]
    },
    {
     "type": "terms",
     "items": [
      {
       "term": "Multi-chassis link aggregation",
       "def": "Bundling links from one device to two switches that present a single LACP partner identity."
      },
      {
       "term": "Peer link",
       "def": "The inter-switch link that synchronises state and carries traffic between multi-chassis peers."
      },
      {
       "term": "Peer keepalive",
       "def": "A separate heartbeat path used to tell a dead peer from a failed peer link."
      },
      {
       "term": "Dual-active",
       "def": "A split-brain condition in which both multi-chassis peers act independently."
      },
      {
       "term": "Orphan port",
       "def": "A port attached to only one multi-chassis peer."
      },
      {
       "term": "VRRP",
       "def": "Virtual Router Redundancy Protocol, a standard first-hop redundancy protocol defined in RFC 5798."
      },
      {
       "term": "Preemption delay",
       "def": "The time a higher-priority router waits before reclaiming the master role."
      },
      {
       "term": "Object tracking",
       "def": "Monitoring an interface, route or other condition and adjusting priority when it changes."
      },
      {
       "term": "Master down interval",
       "def": "The time a VRRP backup waits without advertisements before declaring itself master."
      }
     ]
    },
    {
     "type": "reflection",
     "prompt": "In your environment, which devices are attached to only one switch of a redundant pair? What would they experience during a peer-link failure?"
    },
    {
     "type": "quiz",
     "items": [
      {
       "q": "The peer link of a multi-chassis pair fails while the keepalive is healthy. What is the typical behaviour?",
       "options": [
        "Both peers keep forwarding independently with the same LACP system ID",
        "The secondary suspends its member ports to avoid dual-active",
        "The primary peer suspends its member ports and hands over its role",
        "Spanning tree blocks one of the member links in every bundle"
       ],
       "answer": 1,
       "explain": "With the peer alive but unsynchronised, the secondary steps back to avoid inconsistent forwarding."
      },
      {
       "q": "A VRRP backup with priority 90 and a 1 s advertisement interval waits how long before taking over?",
       "options": [
        "About 3.00 seconds",
        "About 3.65 seconds",
        "About 3.35 seconds",
        "About 4.00 seconds"
       ],
       "answer": 1,
       "explain": "3 × 1 s + (256 − 90) ÷ 256 s = 3.648 s."
      },
      {
       "q": "Why should the keepalive never run over the peer link?",
       "options": [
        "The keepalive needs more bandwidth than the peer link can reserve",
        "LACP packets would be mistaken for keepalive messages on that link",
        "A peer-link failure would then also cut the keepalive",
        "The peer link is blocked by spanning tree during normal operation"
       ],
       "answer": 2,
       "explain": "The keepalive exists to distinguish a dead peer from a dead peer link, which is impossible if they share a path."
      },
      {
       "q": "Tracking lowers a VRRP master's priority from 110 to 100, equal to the backup. What happens?",
       "options": [
        "No failover occurs, because a backup does not preempt a master of equal priority",
        "The backup becomes master, because the higher primary IP address always wins the tie",
        "Both routers become master and share traffic by virtual MAC",
        "Failover occurs because any tracked object failure forces a change"
       ],
       "answer": 0,
       "explain": "A backup only preempts when its priority is strictly higher than the master's advertised priority. The address tie-break applies when two routers both claim mastership, not here, so decrements must drop the master clearly below the peer."
      },
      {
       "q": "Without multi-chassis aggregation, why should the VRRP master for a VLAN also be the spanning tree root for it?",
       "options": [
        "VRRP advertisements are dropped on ports that spanning tree blocks",
        "The virtual MAC address can only be learned on the root bridge",
        "Preemption only works when the master is also the root bridge",
        "Otherwise host traffic to the gateway crosses an extra inter-switch hop"
       ],
       "answer": 3,
       "explain": "Misalignment forces host traffic across the inter-switch link to reach the master, wasting bandwidth and adding latency."
      }
     ]
    }
   ]
  },
  {
   "id": "m2-l5",
   "title": "Provider Bridging (QinQ) and Layer 2 Loop Forensics",
   "subtitle": "Stacked VLANs over a provider core, and how to find and stop a loop under pressure",
   "minutes": 45,
   "objectives": [
    "Explain IEEE 802.1ad tagging, MTU impact and control-protocol tunnelling",
    "Avoid native VLAN and MTU traps in QinQ deployments",
    "Run a structured loop forensic process from symptom to root cause"
   ],
   "blocks": [
    {
     "type": "text",
     "text": "Provider bridging (IEEE 802.1ad, commonly called QinQ) lets a provider carry a customer's entire VLAN space across its network inside a single service VLAN. The provider edge pushes an outer **S-tag** onto every customer frame, whether or not the frame already has a customer **C-tag**. Customers keep their own VLAN numbering, and the provider needs only one VLAN per customer service."
    },
    {
     "type": "layers",
     "title": "A double-tagged frame, outer header first",
     "items": [
      {
       "label": "Ethernet header",
       "parts": [
        "destination MAC",
        "source MAC"
       ]
      },
      {
       "label": "S-tag",
       "parts": [
        "TPID 0x88A8 (some implementations default to 0x8100)",
        "priority and drop-eligible bits",
        "service VLAN ID"
       ]
      },
      {
       "label": "C-tag",
       "parts": [
        "TPID 0x8100",
        "priority bits",
        "customer VLAN ID"
       ]
      },
      {
       "label": "Payload",
       "parts": [
        "EtherType",
        "customer data"
       ]
      },
      {
       "label": "Trailer",
       "parts": [
        "frame check sequence"
       ]
      }
     ]
    },
    {
     "type": "cli",
     "title": "Provider edge tunnel port",
     "device": "PE-SW1 · IOS-style CLI",
     "lines": [
      "vlan dot1q tag native",
      "system mtu 1504",
      "!",
      "vlan 500",
      " name CUST-ACME-SVLAN",
      "!",
      "interface GigabitEthernet1/0/10",
      " description ACME-HANDOFF",
      " switchport access vlan 500",
      " switchport mode dot1q-tunnel",
      " l2protocol-tunnel stp",
      " l2protocol-tunnel point-to-point lacp",
      "!",
      "interface TenGigabitEthernet1/1/1",
      " description PROVIDER-CORE",
      " switchport mode trunk",
      " switchport trunk allowed vlan 500-599"
     ],
     "note": "The access VLAN on the tunnel port is the S-VLAN. Native VLAN tagging stops the outer tag being stripped on core trunks, and the extra 4 bytes of MTU make room for the added tag. Tunnelling of spanning tree and LACP must match what the customer expects across the service."
    },
    {
     "type": "table",
     "title": "QinQ traps",
     "head": [
      "Trap",
      "Symptom",
      "Fix"
     ],
     "rows": [
      [
       "MTU not raised for the extra tag",
       "Large customer frames dropped silently; small ones pass",
       "Raise MTU on every provider port by at least 4 bytes per added tag"
      ],
      [
       "S-VLAN equals the native VLAN of a core trunk",
       "Outer tag stripped, inner tag misread as the service VLAN",
       "Tag the native VLAN, or never use the native VLAN as an S-VLAN"
      ],
      [
       "TPID mismatch between providers",
       "Frames dropped or treated as untagged at the interconnect",
       "Agree the outer TPID per interconnect"
      ],
      [
       "Customer control frames consumed by the provider",
       "Customer spanning tree or LACP behaves as if links were disconnected",
       "Tunnel the needed protocols or agree they are not carried"
      ],
      [
       "Customer loop across the service",
       "Provider core flooded by a customer's looped traffic",
       "Storm control and MAC limits on tunnel ports"
      ]
     ]
    },
    {
     "type": "text",
     "text": "Loop forensics is what happens when every protection in the previous lessons has failed or been bypassed. A layer 2 loop has no time-to-live, so broadcast frames multiply until links and CPUs saturate. Routing adjacencies drop, gateways flap, management becomes unreachable, and the instinct to restart things destroys the evidence you need. A fixed procedure keeps you effective."
    },
    {
     "type": "flow",
     "title": "Loop forensic procedure",
     "items": [
      {
       "label": "Recognise",
       "text": "MAC flaps, saturated links, high CPU, gateway and adjacency flaps at the same time"
      },
      {
       "label": "Contain",
       "text": "Break the loop: shut a known redundant link or let storm control shut ports"
      },
      {
       "label": "Locate",
       "text": "Follow ports with the highest broadcast rate and the MAC flap pairs"
      },
      {
       "label": "Prove",
       "text": "Find why spanning tree did not block: filter, unidirectional link, rogue bridge"
      },
      {
       "label": "Harden",
       "text": "Fix the cause and add the missing protection"
      }
     ]
    },
    {
     "type": "cli",
     "title": "Evidence from the core during a storm",
     "device": "CORE1 · IOS-style CLI",
     "lines": [
      "CORE1# show logging | include MACFLAP",
      "%L2-4-MACFLAP: Host 0011.2233.4455 in vlan 30 flapping between port Te1/1/1 and port Te1/1/2",
      "%L2-4-MACFLAP: Host 001a.2b3c.4d5e in vlan 30 flapping between port Te1/1/1 and port Te1/1/2",
      "CORE1# show interfaces Te1/1/2 | include rate|broadcasts",
      "  5 minute input rate 7812345000 bits/sec, 11250000 packets/sec",
      "     Received 98234567812 broadcasts (412 IP multicasts)",
      "CORE1# show spanning-tree vlan 30 detail | include occurred|from",
      "  Number of topology changes 4812 last change occurred 00:00:03 ago",
      "          from TenGigabitEthernet1/1/2"
     ],
     "note": "Two different hosts flap between the same pair of ports, Te1/1/2 is near line rate with mostly broadcasts, and topology changes keep arriving from the same port. The loop is reachable through Te1/1/2; follow it downstream and check spanning tree state and BPDU counters there."
    },
    {
     "type": "case",
     "title": "The trading-floor meltdown",
     "context": "A regional stock exchange ran its matching engines and market-data distribution on a pair of data-centre switches using multi-chassis aggregation. During a planned line-card replacement, an engineer removed the card that carried both the peer link and the peer keepalive. Both peers went dual-active with the same LACP system ID. A legacy market-data switch attached to both peers kept its bundle up and started receiving duplicate floods. That legacy switch had BPDU filter enabled on its uplinks years earlier to stop log noise. Broadcast and multicast traffic looped, CPUs on both core switches reached 100%, routing adjacencies dropped and trading was halted for 47 minutes.",
     "questions": [
      "Which design decisions turned one maintenance action into a loop?",
      "What should the first containment action have been?",
      "Which evidence would prove the sequence afterwards?",
      "Which changes would you make so that the same maintenance is safe?"
     ],
     "answer": "Three decisions combined: the peer link and keepalive shared one line card, so a single removal caused dual-active; the legacy switch was dual-homed while dual-active could occur; and BPDU filter on its uplinks hid the loop from spanning tree. The fastest containment is to shut one of the legacy switch's uplinks (or the member ports on one peer), which breaks the loop immediately; restarting the cores would have destroyed evidence and lengthened the outage. Evidence: multi-chassis role and keepalive logs with timestamps, MAC flap logs between the two peers' member ports, interface broadcast counters, and the legacy switch configuration showing the filter. Remediation: separate the peer link and keepalive across modules and paths, remove BPDU filter, enable storm control on all ports facing legacy devices, add a maintenance procedure that verifies the keepalive path before touching line cards, and rehearse the containment step."
    },
    {
     "type": "template",
     "title": "Loop forensics worksheet",
     "purpose": "Capture evidence while containing a loop so root cause can be proven afterwards.",
     "columns": [
      "Time",
      "Device and port",
      "Indicator",
      "STP role and state",
      "Action taken",
      "Result"
     ],
     "example": [
      [
       "14:02",
       "CORE1 Te1/1/2",
       "11.2 Mpps input, mostly broadcast",
       "Desg FWD",
       "None, following downstream",
       "Loop path toward DSW3"
      ],
      [
       "14:05",
       "DSW3 Gi1/0/48",
       "BPDU in 0, out 0; filter configured",
       "Desg FWD",
       "Shut Gi1/0/48",
       "Broadcast rate falls to baseline"
      ]
     ],
     "rows": 8
    },
    {
     "type": "scenario",
     "title": "The storm is still running",
     "situation": "Five minutes into a broadcast storm, management access to the core is slow but working. You have identified two candidate downstream switches by broadcast rate. A colleague proposes rebooting both core switches to stop the storm.",
     "options": [
      {
       "text": "Reboot both core switches so that all MAC tables and spanning tree state are rebuilt.",
       "feedback": "Rebooting drops all traffic, destroys logs and counters, and the loop returns as soon as the cores come back if the cause is downstream.",
       "best": false
      },
      {
       "text": "Enable debug output for spanning tree events on the core to see which port causes the loop.",
       "feedback": "Debugs on a control plane already at 100% CPU make management worse and are unlikely to complete.",
       "best": false
      },
      {
       "text": "Shut the uplink toward the highest-rate switch and watch whether core broadcast rates fall.",
       "feedback": "Correct. A targeted shutdown is reversible, contains the loop, and confirms the location by the immediate effect on counters, while preserving evidence.",
       "best": true
      },
      {
       "text": "Lower the core spanning tree priority further so the root election is forced to repeat.",
       "feedback": "A forced reconvergence does not fix a loop caused by filtering or a unidirectional link and adds more topology changes.",
       "best": false
      }
     ]
    },
    {
     "type": "checklist",
     "title": "Loop readiness",
     "items": [
      "Containment steps documented per site with the link to shut first",
      "Out-of-band management reachable when in-band management is saturated",
      "Storm control on all access ports and ports to legacy or third-party switches",
      "MAC flap logging enabled and sent off-box",
      "Topology change counters baselined",
      "BPDU filter use inventoried and justified"
     ]
    },
    {
     "type": "terms",
     "items": [
      {
       "term": "QinQ",
       "def": "Common name for IEEE 802.1ad provider bridging, which adds an outer service tag to customer frames."
      },
      {
       "term": "S-tag",
       "def": "The outer service VLAN tag added by the provider edge."
      },
      {
       "term": "C-tag",
       "def": "The inner customer VLAN tag carried transparently through the provider network."
      },
      {
       "term": "TPID",
       "def": "Tag protocol identifier, the EtherType value that marks a VLAN tag (0x8100 or 0x88A8)."
      },
      {
       "term": "Layer 2 protocol tunnelling",
       "def": "Carrying customer control frames such as spanning tree or LACP across a provider service instead of consuming them."
      },
      {
       "term": "MAC flap",
       "def": "A MAC address repeatedly learned on alternating ports, a strong indicator of a loop."
      },
      {
       "term": "Containment",
       "def": "The first response step that stops impact quickly, such as shutting one redundant link."
      },
      {
       "term": "Broadcast storm",
       "def": "Uncontrolled multiplication of broadcast frames caused by a layer 2 loop."
      }
     ]
    },
    {
     "type": "reflection",
     "prompt": "If a loop started in your core right now, which single link would you shut first, and how would you reach the switch to do it if in-band management failed?"
    },
    {
     "type": "quiz",
     "items": [
      {
       "q": "A provider core carries QinQ services with a 1500-byte MTU. Customers report that large frames are lost. Why?",
       "options": [
        "The customer tag is removed in the core and the frame becomes malformed",
        "Provider switches fragment tagged frames and customers drop the fragments",
        "The outer tag changes the frame check sequence to an invalid value",
        "The extra 4-byte service tag pushes full-size tagged frames beyond the core MTU"
       ],
       "answer": 3,
       "explain": "Each added tag adds 4 bytes; ethernet does not fragment, so oversize frames are dropped."
      },
      {
       "q": "Why is the native VLAN dangerous on provider trunks carrying QinQ services?",
       "options": [
        "The native VLAN cannot carry any traffic marked with the 0x88A8 TPID",
        "Native traffic loses its outer tag and the inner tag is misread",
        "Spanning tree blocks the native VLAN on every provider trunk port",
        "The native VLAN always uses a lower MTU than tagged VLANs"
       ],
       "answer": 1,
       "explain": "If the S-VLAN is native, the outer tag is stripped and the customer tag is then interpreted as a provider VLAN."
      },
      {
       "q": "Two hosts flap between the same pair of core ports while one port runs near line rate with broadcasts. What does this show?",
       "options": [
        "The two hosts have duplicate MAC addresses and should be renumbered",
        "The link aggregation hash is unbalanced between the two core ports",
        "A loop is reachable through those ports; follow it downstream",
        "The spanning tree root has moved to a switch behind one of the ports"
       ],
       "answer": 2,
       "explain": "Multiple unrelated hosts flapping on the same port pair plus broadcast saturation is the signature of a loop."
      },
      {
       "q": "What is the best first action during an active loop?",
       "options": [
        "Shut a known redundant link toward the suspected source of the loop",
        "Reboot the core switches to clear MAC tables and spanning tree state",
        "Enable spanning tree debugs on all switches to locate the loop",
        "Raise the storm-control level so that legitimate traffic is not dropped"
       ],
       "answer": 0,
       "explain": "Targeted shutdown contains impact reversibly and confirms the location."
      },
      {
       "q": "A customer's spanning tree behaves as if the provider service were disconnected. What is the likely cause?",
       "options": [
        "The provider has set the S-tag TPID to 0x8100 instead of 0x88A8",
        "The provider edge is not tunnelling the customer's BPDUs",
        "The customer's C-tag uses the same VLAN ID as the provider S-tag",
        "The provider core runs MST while the customer runs per-VLAN STP"
       ],
       "answer": 1,
       "explain": "Without layer 2 protocol tunnelling, customer BPDUs are processed or dropped by the provider edge and never reach the far site."
      }
     ]
    }
   ]
  }
 ]
});
TRACK.modules.push({
 "id": "m3",
 "order": 3,
 "code": "IGP",
 "title": "IGP Mastery",
 "subtitle": "OSPF and IS-IS databases, area and level design, fast convergence and safe redistribution",
 "outcomes": [
  "Read OSPF and IS-IS databases to diagnose missing, unstable or unexpected routes",
  "Design areas, levels, virtual links, summaries and filters that behave predictably",
  "Tune detection, throttling and fast reroute for sub-second convergence",
  "Build mutual redistribution that is loop-free and path-optimal at multiple points"
 ],
 "lessons": [
  {
   "id": "m3-l1",
   "title": "OSPF Database and Flooding Deep Dive",
   "subtitle": "Read the link-state database like a forensic record, not a list of routes",
   "minutes": 45,
   "objectives": [
    "Identify every common LSA type by originator, scope and content",
    "Decide which of two LSA instances is newer and explain flooding on broadcast segments",
    "Diagnose missing or unstable routes directly from database output"
   ],
   "blocks": [
    {
     "type": "text",
     "text": "Every OSPF router in an area holds an identical copy of the area's link-state database and runs the same shortest-path calculation over it. Routes are only the output. When something is wrong, the database tells you **who said what, when, and how often**, which is far more than any routing table can. Expert troubleshooting in OSPF starts with the database."
    },
    {
     "type": "table",
     "title": "LSA types at expert depth",
     "head": [
      "Type",
      "Name",
      "Originated by",
      "Flooding scope",
      "Key content"
     ],
     "rows": [
      [
       "1",
       "Router",
       "Every router",
       "Area",
       "Links, neighbours, stub networks, ABR and ASBR flags"
      ],
      [
       "2",
       "Network",
       "DR on a transit segment",
       "Area",
       "Segment mask and all attached router IDs"
      ],
      [
       "3",
       "Summary (network)",
       "ABR",
       "Area",
       "Inter-area prefix and cost from the ABR"
      ],
      [
       "4",
       "Summary (ASBR)",
       "ABR",
       "Area",
       "Cost from the ABR to an ASBR in another area"
      ],
      [
       "5",
       "AS external",
       "ASBR",
       "AS, except stub and NSSA areas",
       "Prefix, metric type, forwarding address, route tag"
      ],
      [
       "7",
       "NSSA external",
       "ASBR inside an NSSA",
       "NSSA only",
       "As type 5 plus the propagate bit; translated to type 5 by an ABR"
      ],
      [
       "9, 10, 11",
       "Opaque",
       "Any router",
       "Link, area or AS",
       "Extensions such as traffic engineering, segment routing and graceful restart"
      ]
     ]
    },
    {
     "type": "table",
     "title": "Fields in every LSA header",
     "head": [
      "Field",
      "Why it matters"
     ],
     "rows": [
      [
       "LS age",
       "Seconds since origination; reaching MaxAge (3600 s) withdraws the LSA"
      ],
      [
       "Options",
       "Capabilities such as external routing, NSSA propagate and demand circuits"
      ],
      [
       "LS type, link state ID, advertising router",
       "Together they identify the LSA uniquely"
      ],
      [
       "LS sequence number",
       "Increments with every new instance; starts at 0x80000001"
      ],
      [
       "Checksum",
       "Integrity check; also used as a tie-breaker between instances"
      ],
      [
       "Length",
       "Total size; sudden growth can indicate added links or prefixes"
      ]
     ]
    },
    {
     "type": "steps",
     "title": "Which instance is newer?",
     "items": [
      {
       "title": "Sequence number",
       "text": "The instance with the higher sequence number is newer."
      },
      {
       "title": "Checksum",
       "text": "If sequence numbers match, the instance with the larger checksum is newer."
      },
      {
       "title": "MaxAge",
       "text": "If both still match, an instance at MaxAge is considered newer, so withdrawals always win."
      },
      {
       "title": "Age difference",
       "text": "If the ages differ by more than 15 minutes (MaxAgeDiff), the younger instance is newer."
      },
      {
       "title": "Identical",
       "text": "Otherwise the instances are treated as the same and no flooding is needed."
      }
     ]
    },
    {
     "type": "flow",
     "title": "Flooding on a broadcast segment",
     "items": [
      {
       "label": "Change",
       "text": "A DROther originates or receives a new LSA"
      },
      {
       "label": "To the DR",
       "text": "It sends the update to 224.0.0.6 (DR and BDR only)"
      },
      {
       "label": "Re-flood",
       "text": "The DR floods the update to 224.0.0.5 (all OSPF routers)"
      },
      {
       "label": "Acknowledge",
       "text": "Routers acknowledge, explicitly or by delayed acknowledgement"
      },
      {
       "label": "Onward",
       "text": "Each router floods the LSA out of its other interfaces in the area"
      }
     ]
    },
    {
     "type": "formula",
     "title": "OSPF architectural constants",
     "items": [
      {
       "name": "Refresh",
       "expr": "LSRefreshTime = 1800 s",
       "meaning": "An originator re-floods each of its LSAs every 30 minutes even without change."
      },
      {
       "name": "Withdrawal",
       "expr": "MaxAge = 3600 s",
       "meaning": "An LSA at MaxAge is flushed from every database."
      },
      {
       "name": "Origination pacing",
       "expr": "MinLSInterval = 5 s",
       "meaning": "Minimum gap between new instances of the same LSA (many implementations replace this with tunable throttling)."
      },
      {
       "name": "Acceptance pacing",
       "expr": "MinLSArrival = 1 s",
       "meaning": "New instances of the same LSA arriving faster than this are discarded."
      },
      {
       "name": "Expected sequence growth",
       "expr": "uptime ÷ 1800 s",
       "meaning": "A stable LSA should have a sequence number close to this; far higher means the LSA keeps changing."
      }
     ]
    },
    {
     "type": "cli",
     "title": "Reading a router LSA",
     "device": "R1 · IOS-style CLI",
     "lines": [
      "R1# show ip ospf database router 10.0.0.2",
      "            OSPF Router with ID (10.0.0.1) (Process ID 1)",
      "                Router Link States (Area 0)",
      "  LS age: 412",
      "  Options: (No TOS-capability, DC)",
      "  Link State ID: 10.0.0.2",
      "  Advertising Router: 10.0.0.2",
      "  LS Seq Number: 80000A3C",
      "  Checksum: 0x5B1E",
      "  Area Border Router",
      "  AS Boundary Router",
      "   Number of Links: 3",
      "    Link connected to: another Router (point-to-point)",
      "     (Link ID) Neighboring Router ID: 10.0.0.3",
      "     (Link Data) Router Interface address: 10.1.23.2",
      "       TOS 0 Metrics: 10"
     ],
     "note": "R2 has been up for about six weeks, which would explain roughly 2,000 refreshes, but the sequence number 0x80000A3C means over 2,600 instances. Combined with an LS age of only 412 seconds, it suggests R2's links have been changing. Compare the sequence number again in a few minutes: if it climbs, find the flapping link."
    },
    {
     "type": "cli",
     "title": "An external route that never installs",
     "device": "R5 · IOS-style CLI",
     "lines": [
      "R5# show ip ospf database external 172.16.50.0",
      "  LS Type: AS External Link",
      "  Link State ID: 172.16.50.0 (External Network Number )",
      "  Advertising Router: 10.0.0.7",
      "  Network Mask: /24",
      "        Metric Type: 2 (Larger than any link state path)",
      "        Metric: 20",
      "        Forward Address: 10.7.7.9",
      "        External Route Tag: 65010",
      "R5# show ip route 10.7.7.9",
      "% Subnet not in table",
      "R5# show ip route 172.16.50.0",
      "% Subnet not in table"
     ],
     "note": "The LSA is present but the route is not. With a non-zero forwarding address, the external route is only usable if that address is reachable through an intra-area or inter-area OSPF route. 10.7.7.9 is not, so every router ignores the LSA. Advertise the forwarding address subnet into OSPF, or remove the condition that sets it."
    },
    {
     "type": "scenario",
     "title": "A route that is in the database but not the table",
     "situation": "On R5 the type 5 LSA for 172.16.50.0/24 is present and current, the ASBR's router LSA shows the E bit, and the ASBR is reachable. Yet the route is absent from R5's routing table and from every other router's table.",
     "options": [
      {
       "text": "Clear the OSPF process on the ASBR so it originates the LSA again with a new sequence number.",
       "feedback": "The LSA is already present and current. Re-originating it changes nothing about how other routers evaluate it.",
       "best": false
      },
      {
       "text": "Check whether the external metric type is 2, because type 2 routes are not installed while type 1 routes exist.",
       "feedback": "Type 1 is preferred over type 2 for the same prefix, but only another route for the same prefix could block it. No such route exists.",
       "best": false
      },
      {
       "text": "Check whether the area is configured as a stub, because stub areas reject type 5 LSAs.",
       "feedback": "If the area were a stub, the type 5 LSA would not be in R5's database at all.",
       "best": false
      },
      {
       "text": "Check the forwarding address in the LSA and whether it is reachable through an internal OSPF route.",
       "feedback": "Correct. A non-zero forwarding address must resolve through an intra-area or inter-area route; if it does not, the external LSA is not used, which matches every router ignoring it.",
       "best": true
      }
     ]
    },
    {
     "type": "checklist",
     "title": "Database-first OSPF investigation",
     "items": [
      "Compare database summaries across routers in the area for consistency",
      "Check sequence numbers against uptime for unstable LSAs",
      "For missing externals, verify the forwarding address and the ASBR reachability",
      "For missing inter-area routes, verify the type 3 and the ABR's own reachability",
      "Look for MaxAge LSAs that linger, which point to a vanished originator",
      "Confirm that the expected router and network LSAs exist before blaming SPF"
     ]
    },
    {
     "type": "terms",
     "items": [
      {
       "term": "Link-state database",
       "def": "The synchronised collection of LSAs in an area from which every router computes its shortest-path tree."
      },
      {
       "term": "Router LSA",
       "def": "Type 1 LSA describing a router's links in an area, with ABR, ASBR and virtual-link flags."
      },
      {
       "term": "Network LSA",
       "def": "Type 2 LSA originated by the DR describing a transit segment and its attached routers."
      },
      {
       "term": "Summary LSA",
       "def": "Type 3 or 4 LSA originated by an ABR to describe inter-area prefixes or ASBR reachability."
      },
      {
       "term": "Forwarding address",
       "def": "A field in external LSAs that, when non-zero, names the address traffic should be sent to instead of the ASBR."
      },
      {
       "term": "MaxAge",
       "def": "The LSA age (3600 s) at which an LSA is flushed from all databases."
      },
      {
       "term": "LS sequence number",
       "def": "A counter in each LSA that increases with every new instance."
      },
      {
       "term": "AllDRouters",
       "def": "The multicast group 224.0.0.6 used to send updates to the DR and BDR."
      },
      {
       "term": "Opaque LSA",
       "def": "Types 9, 10 and 11, used to carry application-specific information such as traffic engineering."
      }
     ]
    },
    {
     "type": "reflection",
     "prompt": "Pick an OSPF router you operate. What would you expect its router LSA's sequence number to be, given its uptime? Check it, and explain any difference."
    },
    {
     "type": "quiz",
     "items": [
      {
       "q": "Two instances of the same LSA have equal sequence numbers and checksums. One is at MaxAge. Which is newer?",
       "options": [
        "The instance with the smaller age, because it was refreshed more recently",
        "Neither, because equal sequence numbers mean the instances are the same",
        "The instance at MaxAge, so that withdrawals always propagate",
        "The instance received first, because flooding order decides ties"
       ],
       "answer": 2,
       "explain": "After sequence number and checksum, an instance at MaxAge is considered newer, ensuring flushes win."
      },
      {
       "q": "A type 5 LSA is present on every router but no router installs the route. What is the most likely cause?",
       "options": [
        "Its forwarding address has no intra-area or inter-area route",
        "The LSA uses external metric type 2 instead of type 1 for the prefix",
        "The advertising router is not a designated router on any segment",
        "The LSA's age is above the 1800-second refresh interval"
       ],
       "answer": 0,
       "explain": "A non-zero forwarding address that does not resolve through an intra-area or inter-area route disqualifies the LSA."
      },
      {
       "q": "On a broadcast segment, where does a DROther send a new LSA first?",
       "options": [
        "To 224.0.0.5, so every OSPF router receives it",
        "To the DR's unicast interface address only",
        "To the ABR of the area by unicast",
        "To 224.0.0.6, so the DR and BDR receive it"
       ],
       "answer": 3,
       "explain": "DROthers send updates to AllDRouters; the DR then floods to AllSPFRouters."
      },
      {
       "q": "A router has been up for 10 days. Its router LSA sequence number is 0x80000600. What does that suggest?",
       "options": [
        "The router has been refreshing its LSAs normally every thirty minutes",
        "The router's sequence number wrapped and restarted recently",
        "The LSA has changed far more often than the 30-minute refresh interval explains",
        "The LSA was received from a neighbour with a newer software release"
       ],
       "answer": 2,
       "explain": "10 days ÷ 30 minutes ≈ 480 refreshes; 0x600 is 1536 instances, so the router's links have been changing."
      },
      {
       "q": "Which LSA type tells routers in another area how to reach an ASBR?",
       "options": [
        "Type 3, the network summary originated by the ABR",
        "Type 4, the ASBR summary originated by the ABR",
        "Type 7, the NSSA external originated by the ASBR",
        "Type 2, the network LSA originated by the DR"
       ],
       "answer": 1,
       "explain": "Type 4 carries the cost from the ABR to the ASBR so external routes can be resolved across areas."
      }
     ]
    }
   ]
  },
  {
   "id": "m3-l2",
   "title": "OSPF Area Design Edge Cases and Virtual Links",
   "subtitle": "Stub variants, NSSA translation, virtual links, summarisation and filtering that behave as intended",
   "minutes": 45,
   "objectives": [
    "Predict which LSA types exist in each area type and where defaults come from",
    "Explain NSSA translation and forwarding address behaviour",
    "Configure and verify virtual links and inter-area filtering without blackholes"
   ],
   "blocks": [
    {
     "type": "text",
     "text": "Area design decides what each router knows. Every stub variant trades knowledge for stability: fewer LSAs, smaller databases, but less precise exit selection. At expert level the interesting behaviour is at the edges: which ABR translates NSSA routes, where default routes come from, why a filter removes a route from one router but not its neighbours, and when a virtual link is the least bad option."
    },
    {
     "type": "table",
     "title": "What each area type contains",
     "head": [
      "Area type",
      "Type 3",
      "Type 4 and 5",
      "Type 7",
      "Default route"
     ],
     "rows": [
      [
       "Normal",
       "Yes",
       "Yes",
       "No",
       "Only if originated deliberately"
      ],
      [
       "Stub",
       "Yes",
       "No",
       "No",
       "Type 3 default injected by the ABR"
      ],
      [
       "Totally stubby",
       "Default only",
       "No",
       "No",
       "Type 3 default injected by the ABR"
      ],
      [
       "NSSA",
       "Yes",
       "No",
       "Yes",
       "Not automatic; configure a type 7 default on the ABR"
      ],
      [
       "Totally NSSA",
       "Default only",
       "No",
       "Yes",
       "Type 3 default injected by the ABR"
      ]
     ]
    },
    {
     "type": "callout",
     "kind": "insight",
     "text": "Type 7 LSAs never leave the NSSA. An ABR translates them into type 5 LSAs for the rest of the domain, but only if the propagate bit is set. When several NSSA ABRs exist, the one with the highest router ID is elected translator unless one is configured to always translate. The forwarding address from the type 7 is normally kept in the type 5, so every router in the domain needs an internal route to it.",
     "title": "NSSA translation"
    },
    {
     "type": "text",
     "text": "A **virtual link** connects an ABR to the backbone through a non-backbone transit area. It belongs to area 0 and runs as a point-to-point, demand-style adjacency across the transit area, using the transit area's intra-area path. It is used to attach an area that has no physical connection to area 0, or to heal a partitioned backbone. The transit area cannot be any type of stub, and area 0 authentication applies to the virtual link."
    },
    {
     "type": "cli",
     "title": "Building and verifying a virtual link",
     "device": "R4 · IOS-style CLI",
     "lines": [
      "R2(config)# router ospf 1",
      "R2(config-router)# area 12 virtual-link 10.0.0.4",
      "R4(config)# router ospf 1",
      "R4(config-router)# area 12 virtual-link 10.0.0.2",
      "R4# show ip ospf virtual-links",
      "Virtual Link OSPF_VL0 to router 10.0.0.2 is up",
      "  Run as demand circuit",
      "  DoNotAge LSA allowed.",
      "  Transit area 12, via interface GigabitEthernet0/1",
      "  Topology-MTID    Cost    Disabled     Shutdown      Topology Name",
      "        0           20         no          no            Base",
      "  Transmit Delay is 1 sec, State POINT_TO_POINT,",
      "  Timer intervals configured, Hello 10, Dead 40, Wait 40, Retransmit 5",
      "    Adjacency State FULL (Hello suppressed)"
     ],
     "note": "Each end names the other end's router ID, not an interface address, and both are ABRs in area 12. The cost is the intra-area cost across area 12. Because the link runs as a demand circuit, LSAs learned over it carry the DoNotAge bit and periodic hellos are suppressed once the adjacency is full."
    },
    {
     "type": "cli",
     "title": "Summarisation and inter-area filtering",
     "device": "ABR1 · IOS-style CLI",
     "lines": [
      "router ospf 1",
      " area 10 range 10.10.0.0 255.255.0.0 cost 50",
      " area 20 filter-list prefix PL-NO-LAB in",
      " summary-address 172.16.0.0 255.255.240.0",
      "!",
      "ip prefix-list PL-NO-LAB seq 5 deny 10.99.0.0/16 le 32",
      "ip prefix-list PL-NO-LAB seq 10 permit 0.0.0.0/0 le 32",
      "!",
      "ABR1# show ip route 10.10.0.0 255.255.0.0 | include via|Null",
      "  * directly connected, via Null0"
     ],
     "note": "The area range replaces area 10's prefixes with one type 3 summary at cost 50 and installs a discard route on the ABR to prevent loops toward missing components. The filter-list stops type 3 LSAs for the lab range from being generated into area 20. The summary-address command applies only to external routes this router redistributes as an ASBR."
    },
    {
     "type": "compare",
     "title": "Two very different filters",
     "columns": [
      {
       "title": "ABR type 3 filtering",
       "items": [
        "Prevents the type 3 LSA from being originated into an area",
        "Every router in that area loses the route consistently",
        "Changes the database, so it is a design decision"
       ]
      },
      {
       "title": "Inbound distribute-list",
       "items": [
        "Removes the route from the local routing table only",
        "The database and flooding are unchanged",
        "Neighbours may still route through this router and be dropped"
       ]
      }
     ]
    },
    {
     "type": "callout",
     "kind": "warning",
     "text": "Filtering a route from one router's table with an inbound distribute-list does not stop other routers computing paths through it, because their databases still show the prefix reachable via that router. Packets arrive and are dropped or follow a default route. Filter at the ABR, or design the filter so no other router's shortest path crosses the filtering router.",
     "title": "The distribute-list blackhole"
    },
    {
     "type": "formula",
     "title": "Inter-area cost",
     "items": [
      {
       "name": "Inter-area route cost",
       "expr": "cost to the ABR + cost in the ABR's type 3 LSA",
       "meaning": "Routers choose between ABRs using this sum."
      },
      {
       "name": "Virtual link cost",
       "expr": "intra-area cost between the two ABRs across the transit area",
       "meaning": "Not configurable directly; change transit area link costs instead."
      },
      {
       "name": "Fixed summary cost",
       "expr": "area range … cost N",
       "meaning": "Freezes the type 3 cost so summary metrics do not change when components change."
      }
     ]
    },
    {
     "type": "scenario",
     "title": "Traffic dies at R3",
     "situation": "Area 30 contains R3 and R4 in a line toward the ABR. An engineer added an inbound distribute-list on R3 to keep 10.50.0.0/16 out of R3's table. Since then, hosts behind R4 cannot reach 10.50.0.0/16; their traces stop at R3.",
     "options": [
      {
       "text": "Remove the distribute-list; if area 30 must not use the prefix, filter it at the ABR.",
       "feedback": "Correct. R4 still sees the prefix in the database and computes its path through R3, which has no route. Filtering at the ABR removes the prefix consistently from the whole area.",
       "best": true
      },
      {
       "text": "Add the same distribute-list on R4 so both routers agree that the prefix is unreachable.",
       "feedback": "This hides the symptom on R4 but leaves the database inconsistent with the routing tables and repeats the design error.",
       "best": false
      },
      {
       "text": "Increase the cost of the R3 to R4 link so R4 prefers another path toward the prefix.",
       "feedback": "R4 has no other path in a linear topology, so traffic still enters R3.",
       "best": false
      },
      {
       "text": "Configure a default route on R3 so packets for the filtered prefix follow it instead.",
       "feedback": "This may move the problem elsewhere or create a loop back toward R4, and still contradicts the intent of the filter.",
       "best": false
      }
     ]
    },
    {
     "type": "checklist",
     "title": "Area design review",
     "items": [
      "Each area type chosen deliberately, with its default route source known",
      "NSSA translator identified and forwarding addresses reachable domain-wide",
      "Virtual links documented, authenticated and justified",
      "Summaries have discard routes and fixed costs where stability matters",
      "Inter-area filtering done at ABRs, not with local distribute-lists",
      "No area relies on a single ABR without an explicit decision"
     ]
    },
    {
     "type": "terms",
     "items": [
      {
       "term": "Stub area",
       "def": "An area that receives no type 4 or type 5 LSAs and uses a default route from the ABR."
      },
      {
       "term": "Totally stubby area",
       "def": "A stub area that also receives no type 3 LSAs except a default route."
      },
      {
       "term": "NSSA",
       "def": "Not-so-stubby area: blocks type 5 LSAs but allows local external routes as type 7 LSAs."
      },
      {
       "term": "NSSA translator",
       "def": "The ABR that converts type 7 LSAs into type 5 LSAs for the rest of the domain."
      },
      {
       "term": "Propagate bit",
       "def": "The flag in a type 7 LSA that permits translation into a type 5 LSA."
      },
      {
       "term": "Virtual link",
       "def": "A logical area 0 adjacency between two ABRs across a non-stub transit area."
      },
      {
       "term": "Transit area",
       "def": "The area whose intra-area path a virtual link uses."
      },
      {
       "term": "Area range",
       "def": "ABR summarisation of an area's prefixes into one type 3 LSA."
      },
      {
       "term": "Discard route",
       "def": "A route to a null interface installed with a summary to drop traffic for missing components."
      }
     ]
    },
    {
     "type": "reflection",
     "prompt": "Find one place in a network you know where a filter is applied with a local distribute-list. Which routers could still compute paths through that router?"
    },
    {
     "type": "quiz",
     "items": [
      {
       "q": "Which area type needs a manually configured default route on the ABR?",
       "options": [
        "A plain NSSA that still receives type 3 LSAs",
        "A stub area that receives type 3 LSAs from the ABR",
        "A totally stubby area with no external routes",
        "A totally NSSA area with local external routes"
       ],
       "answer": 0,
       "explain": "Stub, totally stubby and totally NSSA areas get an automatic type 3 default; a plain NSSA does not."
      },
      {
       "q": "Two ABRs connect an NSSA to area 0. Neither is configured to always translate. Which one translates?",
       "options": [
        "The ABR with the lowest router ID",
        "Both ABRs translate every type 7 LSA",
        "The ABR nearest the originating ASBR",
        "The ABR with the highest router ID"
       ],
       "answer": 3,
       "explain": "Translator election picks the highest router ID among eligible NSSA ABRs unless one is forced."
      },
      {
       "q": "Which statement about virtual links is correct?",
       "options": [
        "They belong to area 0 and cannot use any kind of stub area for transit",
        "They belong to the transit area and use that area's authentication",
        "They are configured with the neighbour's interface address on each end",
        "They can be built across any area type, including totally stubby areas"
       ],
       "answer": 0,
       "explain": "Virtual links are area 0 links configured with router IDs and require a non-stub transit area."
      },
      {
       "q": "An inbound distribute-list on R3 removes a prefix from R3's table. What happens to routers behind R3?",
       "options": [
        "They remove the prefix too because R3 stops flooding the LSA",
        "They may still send that traffic to R3, which then drops it",
        "They receive a new type 3 LSA withdrawing the prefix from R3",
        "They mark R3 as unreachable and recompute every route"
       ],
       "answer": 1,
       "explain": "The database is unchanged, so downstream routers still compute paths through R3."
      },
      {
       "q": "What protects against loops when an ABR advertises an area range and some components disappear?",
       "options": [
        "The type 4 LSA that the ABR generates for the summary range",
        "The forwarding address placed in the summary",
        "The discard route the ABR installs for the summary",
        "The propagate bit set on the summary LSA"
       ],
       "answer": 2,
       "explain": "Traffic to missing components inside the range is dropped at the ABR instead of following a default route."
      }
     ]
    }
   ]
  },
  {
   "id": "m3-l3",
   "title": "IS-IS Deep Dive: TLVs, Levels and Route Leaking",
   "subtitle": "The extensible link-state protocol that underpins most large provider cores",
   "minutes": 45,
   "objectives": [
    "Describe IS-IS levels, the attached bit and how level 1 routers exit an area",
    "Read LSPs and identify key TLVs and flags",
    "Configure level 2 to level 1 route leaking safely using the up/down bit"
   ],
   "blocks": [
    {
     "type": "text",
     "text": "IS-IS runs directly over layer 2, not over IP, and carries everything in **type-length-value** (TLV) records. New capabilities such as IPv6, multi-topology, traffic engineering and segment routing were added as new TLVs and sub-TLVs without changing the protocol's core. That extensibility, plus a simple two-level hierarchy, is why large service-provider cores favour it."
    },
    {
     "type": "compare",
     "title": "IS-IS and OSPF structure",
     "columns": [
      {
       "title": "IS-IS",
       "items": [
        "Runs over layer 2; immune to IP addressing errors on adjacencies",
        "A router belongs to one area; area borders lie on links",
        "Two levels: level 1 inside areas, level 2 backbone",
        "Extended with new TLVs"
       ]
      },
      {
       "title": "OSPF",
       "items": [
        "Runs over IP",
        "Area borders lie on routers (ABRs)",
        "Area 0 backbone plus non-backbone areas",
        "Extended with new LSA types and opaque LSAs"
       ]
      }
     ]
    },
    {
     "type": "layers",
     "title": "The IS-IS hierarchy",
     "items": [
      {
       "label": "Level 2 backbone",
       "parts": [
        "contiguous chain of level 2 capable routers",
        "can cross several areas",
        "carries all inter-area prefixes"
       ]
      },
      {
       "label": "Level 1/2 routers",
       "parts": [
        "one adjacency set per level",
        "set the attached bit in level 1 LSPs",
        "can leak level 2 prefixes into level 1"
       ]
      },
      {
       "label": "Level 1 routers",
       "parts": [
        "know only their own area",
        "install a default toward the nearest attached router",
        "exit choice is by distance to the attached router"
       ]
      },
      {
       "label": "Areas",
       "parts": [
        "identified by area address in the NET",
        "a router can carry several area addresses during migrations"
       ]
      }
     ]
    },
    {
     "type": "table",
     "title": "TLVs you should recognise",
     "head": [
      "TLV",
      "Name",
      "Purpose"
     ],
     "rows": [
      [
       "1",
       "Area addresses",
       "Areas the router belongs to"
      ],
      [
       "10",
       "Authentication",
       "Authentication for hellos and LSPs"
      ],
      [
       "22",
       "Extended IS reachability",
       "Neighbours with wide metrics and traffic engineering sub-TLVs"
      ],
      [
       "128 / 130",
       "IP internal / external reachability",
       "Legacy narrow-metric prefixes"
      ],
      [
       "135",
       "Extended IP reachability",
       "Prefixes with wide metrics, up/down bit and sub-TLVs such as tags"
      ],
      [
       "137",
       "Dynamic hostname",
       "Maps system IDs to names in show output"
      ],
      [
       "229",
       "Multi-topology",
       "Topologies the router participates in"
      ],
      [
       "232 / 236",
       "IPv6 interface address / IPv6 reachability",
       "IPv6 support in a single topology"
      ],
      [
       "242",
       "Router capability",
       "Advertises capabilities such as segment routing support"
      ]
     ]
    },
    {
     "type": "callout",
     "kind": "definition",
     "text": "When a level 1/2 router leaks a level 2 prefix into level 1, it sets the **up/down bit** in the extended IP reachability TLV. A prefix with the bit set must never be advertised back into level 2, which prevents a leaked route from looping between levels. Route tags carried in sub-TLVs require wide metrics.",
     "title": "The up/down bit"
    },
    {
     "type": "cli",
     "title": "Level 1/2 router with controlled leaking",
     "device": "R3 · IOS-style CLI",
     "lines": [
      "router isis CORE",
      " net 49.0010.0100.0000.0003.00",
      " is-type level-1-2",
      " metric-style wide",
      " set-overload-bit on-startup 300",
      " log-adjacency-changes",
      " passive-interface Loopback0",
      " redistribute isis ip level-2 into level-1 route-map RM-L2-LEAK",
      "!",
      "route-map RM-L2-LEAK permit 10",
      " match ip address prefix-list PL-DC-LOOPBACKS",
      "!",
      "interface GigabitEthernet0/0",
      " ip router isis CORE",
      " isis network point-to-point",
      " isis circuit-type level-2-only",
      " isis metric 100 level-2"
     ],
     "note": "The system ID 0100.0000.0003 encodes the loopback 10.0.0.3. The overload bit is set for 300 seconds after boot so transit traffic avoids this router until BGP and the FIB are ready. Only data-centre loopbacks are leaked into level 1, so level 1 routers can choose the best exit for them while everything else follows the default."
    },
    {
     "type": "cli",
     "title": "Reading a level 1 LSP",
     "device": "R5 · IOS-style CLI",
     "lines": [
      "R5# show isis database detail R3.00-00 level-1",
      "IS-IS Level-1 LSP R3.00-00",
      "LSPID                 LSP Seq Num  LSP Checksum  LSP Holdtime/Rcvd  ATT/P/OL",
      "R3.00-00              0x0000041A   0x8C2D        1032/1200          1/0/0",
      "  Area Address: 49.0010",
      "  NLPID:        0xCC",
      "  Hostname: R3",
      "  IP Address:   10.0.0.3",
      "  Metric: 10         IS-Extended R5.00",
      "  Metric: 10         IP 10.0.0.3/32",
      "  Metric: 20         IP 10.20.0.0/16",
      "  Metric: 130        IP-Interarea 10.0.0.9/32"
     ],
     "note": "ATT is 1, so level 1 routers in area 49.0010 install a default route toward R3. The overload bit is clear. The last prefix is marked as inter-area, which is how this output shows a leaked level 2 route with the up/down bit set: it will never be re-advertised into level 2."
    },
    {
     "type": "table",
     "title": "Timers and election details",
     "head": [
      "Item",
      "Typical default",
      "Expert note"
     ],
     "rows": [
      [
       "LSP maximum lifetime",
       "1200 s",
       "Raise toward 65535 s in large networks to reduce refresh flooding"
      ],
      [
       "LSP refresh interval",
       "900 s",
       "Must stay below the lifetime"
      ],
      [
       "Hello interval",
       "10 s (DIS: about 3.3 s)",
       "The DIS sends hellos three times as often to detect its failure quickly"
      ],
      [
       "CSNP interval",
       "10 s on broadcast",
       "The DIS periodically lists all LSPs to repair any missed flooding"
      ],
      [
       "DIS election",
       "Highest priority, then highest MAC address",
       "Preemptive and with no backup; use point-to-point mode on two-router links"
      ]
     ]
    },
    {
     "type": "scenario",
     "title": "Level 1 routers take the long way out",
     "situation": "Area 49.0020 has two level 1/2 routers, R21 and R22. Level 1 router R25 is two hops from R21 and three hops from R22. Traffic from R25 to a data centre that sits much closer to R22 in the level 2 backbone always exits through R21, adding 20 ms of latency.",
     "options": [
      {
       "text": "Clear the attached bit on R21 so that R25 only uses R22 for every destination.",
       "feedback": "This forces all traffic through R22, including traffic for which R21 is better, and removes redundancy for the default route.",
       "best": false
      },
      {
       "text": "Leak the data-centre prefixes from level 2 into level 1 on both R21 and R22.",
       "feedback": "Correct. Without leaking, R25 only knows the default route toward the nearest attached router. Leaked prefixes carry the end-to-end metric, so R25 can choose R22 when its total cost is lower.",
       "best": true
      },
      {
       "text": "Convert R25 into a level 1/2 router so that it participates in the level 2 backbone.",
       "feedback": "This changes the hierarchy and flooding scope for a routing-policy problem that leaking solves directly.",
       "best": false
      },
      {
       "text": "Increase the metric of R25's link toward R21 so that R22 becomes the nearest attached router.",
       "feedback": "This moves all traffic to R22 regardless of destination and creates a new suboptimal case for other prefixes.",
       "best": false
      }
     ]
    },
    {
     "type": "checklist",
     "title": "IS-IS design review",
     "items": [
      "Wide metrics everywhere, so tags and large metrics work",
      "Level boundaries and the level 2 backbone are contiguous",
      "Point-to-point mode on two-router broadcast links",
      "Overload bit on startup where BGP or the FIB must settle",
      "Route leaking controlled by an explicit policy",
      "LSP lifetime and refresh tuned for network size",
      "Authentication configured for hellos and LSPs"
     ]
    },
    {
     "type": "terms",
     "items": [
      {
       "term": "TLV",
       "def": "Type-length-value: the record format that carries all IS-IS information and makes the protocol extensible."
      },
      {
       "term": "NET",
       "def": "Network entity title: the area address, system ID and selector that identify an IS-IS router."
      },
      {
       "term": "Attached bit",
       "def": "Set by a level 1/2 router in its level 1 LSP when it has level 2 connectivity to other areas."
      },
      {
       "term": "Up/down bit",
       "def": "Marks a prefix leaked from level 2 into level 1 so it is never advertised back into level 2."
      },
      {
       "term": "Overload bit",
       "def": "Tells other routers not to use this router for transit traffic."
      },
      {
       "term": "DIS",
       "def": "Designated intermediate system: the router that represents a broadcast segment with a pseudonode LSP."
      },
      {
       "term": "Pseudonode",
       "def": "The virtual node created by the DIS to represent a broadcast segment in the topology."
      },
      {
       "term": "CSNP",
       "def": "Complete sequence number PDU: a periodic list of all LSPs used to synchronise databases."
      },
      {
       "term": "Wide metrics",
       "def": "32-bit link and 32-bit prefix metrics carried in extended TLVs 22 and 135."
      }
     ]
    },
    {
     "type": "reflection",
     "prompt": "Where in your network would leaking a small set of level 2 prefixes into level 1 improve exit selection, and what would you tag them with?"
    },
    {
     "type": "quiz",
     "items": [
      {
       "q": "A level 1 router has no leaked routes. How does it reach a prefix in another area?",
       "options": [
        "It sends traffic to the DIS, which forwards it to the level 2 backbone",
        "It queries a level 1/2 router for the exact prefix before forwarding",
        "It drops the traffic because level 1 routers cannot leave their area",
        "It uses a default route toward the nearest attached level 1/2 router"
       ],
       "answer": 3,
       "explain": "Level 1 routers install a default toward the closest attached level 1/2 router."
      },
      {
       "q": "Why is the up/down bit set on prefixes leaked from level 2 into level 1?",
       "options": [
        "To raise the prefix metric so that level 1 prefixes are preferred",
        "To tell level 1 routers to ignore the prefix during SPF",
        "To mark the prefix as originated by an external protocol",
        "To stop the prefix being advertised back into level 2"
       ],
       "answer": 3,
       "explain": "The up/down bit prevents leaked routes from looping between levels."
      },
      {
       "q": "Which TLV carries IPv4 prefixes with wide metrics and route tags?",
       "options": [
        "TLV 22, extended IS reachability",
        "TLV 128, IP internal reachability",
        "TLV 135, extended IP reachability",
        "TLV 137, dynamic hostname"
       ],
       "answer": 2,
       "explain": "TLV 135 carries wide-metric prefixes with flags and sub-TLVs such as tags."
      },
      {
       "q": "Why is the overload bit commonly set for a few minutes after boot?",
       "options": [
        "So transit traffic avoids it until BGP and FIB are ready",
        "So the router can elect itself DIS before its neighbours do",
        "So the router's LSPs are flooded with a longer lifetime",
        "So the attached bit is set before level 1 adjacencies form"
       ],
       "answer": 0,
       "explain": "The overload bit keeps the router out of transit paths while it converges, preventing blackholes."
      },
      {
       "q": "How is the DIS on a broadcast segment chosen?",
       "options": [
        "Lowest system ID, with a backup DIS elected at the same time",
        "Highest priority, then highest MAC, with preemption",
        "First router to come up, and it keeps the role until it fails",
        "Highest priority, then lowest system ID, with no preemption"
       ],
       "answer": 1,
       "explain": "IS-IS DIS election is preemptive with no backup and uses priority, then MAC address."
      }
     ]
    }
   ]
  },
  {
   "id": "m3-l4",
   "title": "Fast Convergence: Throttling, BFD and Fast Reroute",
   "subtitle": "From failure to forwarding in tens of milliseconds without destabilising the network",
   "minutes": 50,
   "objectives": [
    "Break convergence into detection, propagation, computation and installation",
    "Tune SPF and LSA throttling and BFD with an understanding of the trade-offs",
    "Explain LFA, remote LFA and TI-LFA protection and their coverage limits"
   ],
   "blocks": [
    {
     "type": "text",
     "text": "Convergence is the sum of four phases: **detecting** the failure, **propagating** the news, **computing** new paths and **installing** them in the forwarding plane. Expert tuning attacks each phase separately, and fast reroute removes most of them from the critical path by pre-installing a backup that the forwarding plane can use immediately."
    },
    {
     "type": "flow",
     "title": "Where the time goes",
     "items": [
      {
       "label": "Detect",
       "text": "Loss of light, BFD or hello timeout"
      },
      {
       "label": "Originate",
       "text": "New LSA or LSP after the throttle delay"
      },
      {
       "label": "Flood",
       "text": "Propagation across the area or level"
      },
      {
       "label": "Compute",
       "text": "SPF after its own throttle delay"
      },
      {
       "label": "Install",
       "text": "Routing and forwarding table updates, prefix by prefix"
      },
      {
       "label": "Protect",
       "text": "Fast reroute switches to a pre-computed backup during all of the above"
      }
     ]
    },
    {
     "type": "formula",
     "title": "Convergence formulas",
     "items": [
      {
       "name": "BFD detection time",
       "expr": "remote detect multiplier × max(local required min RX, remote desired min TX)",
       "meaning": "Detection is governed by the slower side's agreed interval; 3 × 50 ms gives 150 ms."
      },
      {
       "name": "Exponential throttle",
       "expr": "wait₁ = initial; wait₂ = hold; waitₙ = min(2 × waitₙ₋₁, maximum)",
       "meaning": "Fast reaction to the first event and growing back-off during instability."
      },
      {
       "name": "Basic LFA condition",
       "expr": "D(N,D) < D(N,S) + D(S,D)",
       "meaning": "Neighbour N will not send traffic for D back through source S."
      },
      {
       "name": "Node-protecting LFA",
       "expr": "D(N,D) < D(N,E) + D(E,D)",
       "meaning": "N's path to D does not pass through the protected next hop E."
      },
      {
       "name": "Downstream path",
       "expr": "D(N,D) < D(S,D)",
       "meaning": "N is strictly closer to D than S, which also prevents micro-loops between them."
      }
     ]
    },
    {
     "type": "cli",
     "title": "Tuning detection and computation",
     "device": "R1 · IOS-style CLI",
     "lines": [
      "interface GigabitEthernet0/0",
      " bfd interval 50 min_rx 50 multiplier 3",
      " ip ospf bfd",
      "!",
      "router ospf 1",
      " timers throttle spf 50 200 5000",
      " timers throttle lsa all 0 20 5000",
      " timers lsa arrival 15",
      "! prioritise loopback prefixes for installation and",
      "! enable fast reroute; both commands differ between platforms:",
      "! enable per-prefix LFA, then remote LFA or TI-LFA where supported"
     ],
     "note": "SPF runs 50 ms after the first change, then waits 200 ms, 400 ms and so on up to 5 s while changes continue. The LSA arrival timer must be lower than the LSA hold value or neighbours discard legitimate rapid updates. Prioritising loopbacks makes BGP next hops converge before bulk prefixes."
    },
    {
     "type": "cli",
     "title": "A BFD session slower than configured",
     "device": "R1 · IOS-style CLI",
     "lines": [
      "R1# show bfd neighbors detail",
      "Neighbor 10.1.12.2  Interface Gi0/0  State Up  Uptime 3d02h",
      " Local discr 7, Remote discr 12, Diag 0 (No Diagnostic)",
      " Local:  Desired min TX 50 ms, Required min RX 50 ms, Detect mult 3",
      " Remote: Desired min TX 300 ms, Required min RX 300 ms, Detect mult 3",
      " Negotiated TX 300 ms, Detection time 900 ms",
      " Clients: OSPF"
     ],
     "note": "The local side asked for 50 ms, but the neighbour will only send every 300 ms and will not accept faster than 300 ms. Detection on R1 is therefore 3 × 300 ms = 900 ms. BFD always settles on the slower requirement; fix the remote configuration or accept the longer detection time."
    },
    {
     "type": "compare",
     "title": "Fast reroute families",
     "columns": [
      {
       "title": "LFA",
       "items": [
        "Backup is a directly connected neighbour",
        "No tunnels needed",
        "Coverage depends heavily on topology; rings are poor",
        "Can use a path that is not the post-convergence path"
       ]
      },
      {
       "title": "Remote LFA",
       "items": [
        "Tunnels traffic to a PQ node beyond the failure",
        "Needs a label or tunnel to the PQ node",
        "Much better coverage in rings",
        "Extra state for tunnels to PQ nodes"
       ]
      },
      {
       "title": "TI-LFA",
       "items": [
        "Uses segment routing to encode the post-convergence path",
        "Full link and node protection coverage in any topology",
        "Backup equals the path used after convergence",
        "Requires segment routing in the network"
       ]
      }
     ]
    },
    {
     "type": "callout",
     "kind": "warning",
     "text": "Even with perfect detection, routers install new paths at slightly different times. For a few hundred milliseconds two routers can point at each other for the same prefix. Fast reroute protects the failure itself, but micro-loops can occur on unaffected paths during reconvergence; ordered updates or segment-routing-based avoidance address them. Very aggressive SPF and LSA timers in large or unstable networks can also multiply CPU load and flooding.",
     "title": "Micro-loops and aggressive timers"
    },
    {
     "type": "steps",
     "title": "A safe tuning sequence",
     "items": [
      {
       "title": "Measure first",
       "text": "Record the current failure-to-recovery time for representative failures."
      },
      {
       "title": "Detection",
       "text": "Use loss of light where possible and BFD where links hide failures; choose intervals the platform can sustain in hardware."
      },
      {
       "title": "Propagation",
       "text": "Use a zero or near-zero initial LSA delay with exponential back-off."
      },
      {
       "title": "Computation",
       "text": "Set a short initial SPF delay with exponential back-off, and prioritise loopbacks."
      },
      {
       "title": "Protection",
       "text": "Deploy LFA, then remote LFA or TI-LFA for coverage gaps; check coverage reports."
      },
      {
       "title": "Validate",
       "text": "Repeat the same failures and compare against the baseline."
      }
     ]
    },
    {
     "type": "scenario",
     "title": "Coverage gaps in the ring",
     "situation": "A metro network is built as a ring of eight routers. After enabling per-prefix LFA, coverage reports show only about half of destinations protected. The business requires sub-50 ms recovery for all destinations after any single link failure.",
     "options": [
      {
       "text": "Reduce the BFD interval to 10 ms so failures are detected before traffic is lost.",
       "feedback": "Faster detection helps the protected destinations switch sooner but does nothing for destinations with no backup path.",
       "best": false
      },
      {
       "text": "Add remote LFA, or TI-LFA where available, for the unprotected destinations.",
       "feedback": "Correct. Rings are the classic topology where a neighbour's shortest path loops back through the failed link. Tunnelling to a PQ node or encoding the post-convergence path closes the gap.",
       "best": true
      },
      {
       "text": "Lower the initial SPF delay to zero so the routers compute new paths immediately.",
       "feedback": "Computation and installation still take far longer than 50 ms across all prefixes, and unprotected destinations remain exposed.",
       "best": false
      },
      {
       "text": "Add equal-cost paths by setting all ring link costs equal across the ring.",
       "feedback": "In a ring, equal costs create equal-cost paths only for diametrically opposite nodes, leaving most destinations unprotected.",
       "best": false
      }
     ]
    },
    {
     "type": "checklist",
     "title": "Fast convergence readiness",
     "items": [
      "Baseline convergence measured for representative failures",
      "BFD intervals sustainable by the platform and matched on both ends",
      "LSA and SPF throttles use exponential back-off",
      "LSA arrival timer lower than the LSA hold value",
      "Loopbacks and next hops prioritised for installation",
      "Fast reroute coverage reported and gaps addressed",
      "Micro-loop exposure understood for critical flows"
     ]
    },
    {
     "type": "terms",
     "items": [
      {
       "term": "BFD",
       "def": "Bidirectional Forwarding Detection (RFC 5880): a lightweight hello protocol that detects forwarding failures in milliseconds."
      },
      {
       "term": "Detect multiplier",
       "def": "The number of missed BFD packets that declares a session down."
      },
      {
       "term": "SPF throttling",
       "def": "Exponential back-off that delays SPF runs during repeated changes."
      },
      {
       "term": "LSA throttling",
       "def": "Exponential back-off on originating new instances of the same LSA."
      },
      {
       "term": "LFA",
       "def": "Loop-free alternate: a pre-computed backup neighbour that will not loop traffic back."
      },
      {
       "term": "PQ node",
       "def": "A node reachable from the source without the failed link and able to reach the destination without it; the target of remote LFA tunnels."
      },
      {
       "term": "TI-LFA",
       "def": "Topology-independent LFA: a segment-routing-based backup that follows the post-convergence path."
      },
      {
       "term": "Micro-loop",
       "def": "A transient loop caused by routers updating their forwarding tables at different times."
      },
      {
       "term": "Prefix prioritisation",
       "def": "Installing important prefixes such as loopbacks before others during convergence."
      }
     ]
    },
    {
     "type": "reflection",
     "prompt": "Measure, or estimate, each convergence phase in a network you know. Which phase dominates, and which tool from this lesson attacks it?"
    },
    {
     "type": "quiz",
     "items": [
      {
       "q": "Local BFD is 50 ms × 3. The neighbour requires min RX 300 ms and sends at 300 ms with multiplier 3. What is the detection time on the local router?",
       "options": [
        "150 milliseconds",
        "450 milliseconds",
        "900 milliseconds",
        "300 milliseconds"
       ],
       "answer": 2,
       "explain": "Detection = remote multiplier 3 × max(local required RX 50, remote desired TX 300) = 900 ms."
      },
      {
       "q": "Which inequality defines a basic loop-free alternate N for destination D from source S?",
       "options": [
        "D(N,D) < D(S,D)",
        "D(N,D) < D(N,S) + D(S,D)",
        "D(N,D) < D(N,E) + D(E,D)",
        "D(S,N) < D(S,D)"
       ],
       "answer": 1,
       "explain": "The basic LFA condition ensures N's shortest path to D does not go back through S."
      },
      {
       "q": "Why are rings difficult for basic LFA?",
       "options": [
        "Neighbours often reach destinations back through the failed link",
        "Ring links cannot carry BFD sessions at the short intervals that LFA requires",
        "SPF throttling behaves differently on ring topologies",
        "Ring routers cannot exchange the required LSA types"
       ],
       "answer": 0,
       "explain": "In rings, the neighbour on the other side usually reaches the destination back through the source."
      },
      {
       "q": "What does an SPF throttle of 50/200/5000 ms do during a burst of changes?",
       "options": [
        "Runs SPF every 50 ms for as long as the network keeps changing, then waits 5 s",
        "Waits 5 s after the first change, then runs every 200 ms",
        "Runs SPF exactly three times, at 50, 200 and 5000 ms",
        "Runs 50 ms after the first change, then backs off from 200 ms up to 5 s"
       ],
       "answer": 3,
       "explain": "Exponential back-off reacts fast to the first event and slows down under instability."
      },
      {
       "q": "What advantage does TI-LFA have over basic LFA?",
       "options": [
        "It needs no forwarding plane support beyond plain IP routing",
        "It removes the need for BFD or any other failure detection",
        "Its backup is the post-convergence path, in any topology",
        "It prevents every micro-loop during network reconvergence"
       ],
       "answer": 2,
       "explain": "TI-LFA uses segment routing to encode the post-convergence path with full coverage; it still needs detection and does not eliminate all micro-loops."
      }
     ]
    }
   ]
  },
  {
   "id": "m3-l5",
   "title": "Mutual Redistribution, Loop Prevention and Database Troubleshooting",
   "subtitle": "Two-way redistribution at multiple points without loops or suboptimal paths",
   "minutes": 50,
   "objectives": [
    "Explain how redistribution feedback loops and suboptimal routing form",
    "Prevent them with route tags, administrative distance and filtering",
    "Troubleshoot redistribution issues from database and routing table evidence"
   ],
   "blocks": [
    {
     "type": "text",
     "text": "Redistribution loses information. A prefix that crosses from one protocol to another arrives with a new metric, a new origin and, by default, no memory of where it came from. With two-way redistribution at a single point this is manageable. With two or more points, a prefix can travel out of its home domain and back in, where it may beat the original route on administrative distance. The results are suboptimal paths, routes that persist after their source is gone, and loops."
    },
    {
     "type": "flow",
     "title": "How a feedback loop forms",
     "items": [
      {
       "label": "Origin",
       "text": "Prefix P lives in the IS-IS domain"
      },
      {
       "label": "Out",
       "text": "R1 redistributes P into OSPF as an external route"
      },
      {
       "label": "Preference",
       "text": "R2 learns P via OSPF (distance 110) and IS-IS (115) and prefers OSPF"
      },
      {
       "label": "Back in",
       "text": "R2 redistributes its OSPF route for P back into IS-IS"
      },
      {
       "label": "Persistence",
       "text": "If P's origin fails, the copies keep each other alive and traffic loops"
      }
     ]
    },
    {
     "type": "compare",
     "title": "Prevention tools",
     "columns": [
      {
       "title": "Route tags",
       "items": [
        "Mark routes with their source domain on the way out",
        "Deny that tag on the way back in",
        "Works at any number of redistribution points",
        "IS-IS tags need wide metrics"
       ]
      },
      {
       "title": "Administrative distance",
       "items": [
        "Make each protocol's external routes less preferred than the other's internal routes",
        "Fixes suboptimal path selection at the redistribution routers",
        "Must be consistent on every redistribution router"
       ]
      },
      {
       "title": "Prefix filtering",
       "items": [
        "Explicit lists of prefixes allowed in each direction",
        "Very precise, high maintenance",
        "Good for small, static sets"
       ]
      }
     ]
    },
    {
     "type": "cli",
     "title": "Tag-based loop prevention on R1 and R2",
     "device": "R1 · IOS-style CLI",
     "lines": [
      "route-map RM-ISIS-TO-OSPF deny 10",
      " match tag 110",
      "route-map RM-ISIS-TO-OSPF permit 20",
      " set tag 115",
      "!",
      "route-map RM-OSPF-TO-ISIS deny 10",
      " match tag 115",
      "route-map RM-OSPF-TO-ISIS permit 20",
      " set tag 110",
      "!",
      "router ospf 1",
      " redistribute isis CORE level-2 subnets route-map RM-ISIS-TO-OSPF",
      " distance ospf external 170",
      "router isis CORE",
      " metric-style wide",
      " redistribute ospf 1 route-map RM-OSPF-TO-ISIS"
     ],
     "note": "Routes leaving IS-IS carry tag 115 and are refused on the way back into IS-IS; routes leaving OSPF carry tag 110 and are refused on the way back into OSPF. Raising OSPF external distance to 170 makes both redistribution routers prefer the native IS-IS path for IS-IS-originated prefixes, fixing suboptimal routing as well."
    },
    {
     "type": "cli",
     "title": "Evidence of a suboptimal path",
     "device": "R2 · IOS-style CLI",
     "lines": [
      "R2# show ip route 10.20.5.0",
      "Routing entry for 10.20.5.0/24",
      "  Known via \"ospf 1\", distance 110, metric 20, type extern 2, forward metric 30",
      "  Tag 115, type extern 2",
      "  Last update from 10.0.12.1 on GigabitEthernet0/1, 00:00:41 ago",
      "  Routing Descriptor Blocks:",
      "  * 10.0.12.1, from 10.0.0.1, 00:00:41 ago, via GigabitEthernet0/1",
      "      Route metric is 20, traffic share count is 1",
      "      Route tag 115",
      "R2# show isis database detail | include 10.20.5.0",
      "  Metric: 30         IP 10.20.5.0/24"
     ],
     "note": "The prefix is native to IS-IS (it appears in the IS-IS database) but R2 uses an OSPF external copy redistributed by R1, recognisable by tag 115, because distance 110 beats IS-IS 115. Traffic takes a detour through R1. The tags already stop the loop; the distance change is what removes the detour."
    },
    {
     "type": "table",
     "title": "Database clues and what they mean",
     "head": [
      "Clue",
      "Likely meaning",
      "Next step"
     ],
     "rows": [
      [
       "External LSA or LSP from an unexpected advertising router",
       "A second redistribution point exists or leaked",
       "Check redistribution and tags on that router"
      ],
      [
       "External route with the other domain's tag inside its home domain",
       "Feedback through a redistribution point",
       "Confirm the deny-by-tag entries on every redistribution router"
      ],
      [
       "Rapidly increasing sequence numbers on external LSAs",
       "Redistributed routes flapping, often due to a loop between points",
       "Compare timestamps across both redistribution routers"
      ],
      [
       "MaxAge LSAs lingering for one prefix",
       "Originator withdrew the route; another router may re-originate it",
       "Look for re-origination from another redistribution point"
      ],
      [
       "Prefix present in the database, absent from the table",
       "Lower-distance source, unreachable forwarding address or filter",
       "Compare the routing entry's source and distance"
      ],
      [
       "IS-IS LSP with the overload bit set",
       "Router intentionally avoided for transit",
       "Check startup timers or overload configuration"
      ]
     ]
    },
    {
     "type": "case",
     "title": "The merger that kept a dead data centre alive",
     "context": "Two utilities merged. Company A ran OSPF, company B ran IS-IS, and the integration team connected them at two sites with two-way redistribution and no tags. Months later, company B decommissioned a small data centre. Its prefixes were removed from IS-IS, yet they stayed reachable in the routing tables for hours, and traffic sent to them looped between the two redistribution routers until TTL expired, saturating an inter-site link. The issue cleared only when one redistribution point was disabled.",
     "questions": [
      "Explain the exact mechanism that kept the prefixes alive.",
      "Why did the problem not appear while the data centre existed?",
      "What would you configure at both redistribution points, and why both?",
      "How would you prove the fix in a maintenance window?"
     ],
     "answer": "Each redistribution router learned the prefixes from the other protocol as externals and redistributed them back, so each copy was supported by the other. While the data centre existed, the native IS-IS routes were present, and depending on distances the loop was hidden or caused only suboptimal paths. When the origin disappeared, the two external copies kept refreshing each other, and traffic followed them in a loop. The fix is tag-based filtering on both routers in both directions (a single router can still create the loop) plus distance settings so each domain's native routes win, and redistribution limited to the intended prefix ranges. Prove it by withdrawing a test prefix from IS-IS and confirming it disappears from both domains within normal convergence time, with no externals carrying the wrong tag in either database."
    },
    {
     "type": "template",
     "title": "LSDB analysis sheet",
     "purpose": "Record what each database entry says and whether it matches design intent, so anomalies stand out.",
     "columns": [
      "LSA or LSP",
      "Type or level",
      "Advertising router",
      "Seq and age",
      "Key fields",
      "Expected?",
      "Finding"
     ],
     "example": [
      [
       "172.16.50.0/24",
       "Type 5",
       "10.0.0.7",
       "0x80000002 / 120 s",
       "E2 metric 20, FA 10.7.7.9, tag 65010",
       "No",
       "FA unreachable; LSA unusable"
      ],
      [
       "10.20.5.0/24",
       "Type 5",
       "10.0.0.1",
       "0x800000A1 / 41 s",
       "E2 metric 20, tag 115",
       "Partly",
       "IS-IS prefix preferred via OSPF at R2"
      ]
     ],
     "rows": 8
    },
    {
     "type": "scenario",
     "title": "Choosing the fix at two redistribution points",
     "situation": "A network redistributes both ways between OSPF and IS-IS on R1 and R2. Tags are already set and denied correctly, so no loops occur. However, R2 sends traffic for several IS-IS prefixes through R1 using OSPF external routes, adding latency.",
     "options": [
      {
       "text": "Raise the distance of OSPF external routes above the IS-IS distance on both redistribution routers.",
       "feedback": "Correct. Tags stop feedback, but distance still makes the OSPF copy win at R2. Making OSPF externals less preferred than native IS-IS routes restores the direct path, and doing it on both routers keeps behaviour symmetric.",
       "best": true
      },
      {
       "text": "Remove the tags and rely on distance alone to prevent loops at both routers.",
       "feedback": "Distance can fix preference but does not stop routes from being redistributed back into their home domain under every failure combination.",
       "best": false
      },
      {
       "text": "Stop redistributing IS-IS into OSPF on R1 so only R2 provides the OSPF domain's routes.",
       "feedback": "This removes redundancy for the OSPF domain to save a configuration change that fixes the actual cause.",
       "best": false
      },
      {
       "text": "Lower the IS-IS metric of the affected prefixes so their IS-IS path looks shorter.",
       "feedback": "Metrics are only compared within one protocol; the choice between OSPF and IS-IS is made by distance.",
       "best": false
      }
     ]
    },
    {
     "type": "checklist",
     "title": "Mutual redistribution checklist",
     "items": [
      "Every redistribution point tags routes by source domain",
      "Every redistribution point denies the other domain's tag on the way back",
      "Distances make native routes win over redistributed copies",
      "Redistribution limited to intended prefix ranges",
      "Wide metrics enabled where IS-IS tags are used",
      "Failure of each redistribution point tested in turn",
      "Withdrawal of a test prefix verified to clear both domains"
     ]
    },
    {
     "type": "terms",
     "items": [
      {
       "term": "Mutual redistribution",
       "def": "Redistributing routes in both directions between two routing domains."
      },
      {
       "term": "Feedback loop",
       "def": "A route redistributed out of its home domain and back in, where it can persist or loop."
      },
      {
       "term": "Route tag",
       "def": "A numeric label attached to a route, used to recognise its origin during later redistribution."
      },
      {
       "term": "Administrative distance",
       "def": "A per-source preference value used to choose between routes from different protocols."
      },
      {
       "term": "Suboptimal routing",
       "def": "Forwarding along a longer path because a redistributed copy wins on distance."
      },
      {
       "term": "Redistribution point",
       "def": "A router that redistributes between two routing domains."
      },
      {
       "term": "Seed metric",
       "def": "The metric assigned to routes when they are redistributed into a protocol."
      },
      {
       "term": "External route",
       "def": "A route injected into a link-state protocol from outside it, such as an OSPF type 5 LSA."
      }
     ]
    },
    {
     "type": "reflection",
     "prompt": "Draw a network with three redistribution points between two domains. Which routers need tags, which need distance changes, and which failure combinations would you test?"
    },
    {
     "type": "quiz",
     "items": [
      {
       "q": "Tags are set and denied correctly at both redistribution points, but one router still prefers redistributed copies of the other domain's routes. What fixes the preference?",
       "options": [
        "Raising the external distance so native routes win at that router",
        "Adding a second tag so the routes carry both domain values",
        "Lowering the seed metric for all routes redistributed at that router",
        "Removing the deny entries so routes can be compared by metric"
       ],
       "answer": 0,
       "explain": "Choice between protocols is by distance; tags only prevent feedback."
      },
      {
       "q": "A prefix withdrawn from IS-IS persists in both domains and traffic loops. What is the most likely cause?",
       "options": [
        "An IS-IS LSP stuck at MaxAge in the database of one level 1 router",
        "An OSPF summary range that still covers the withdrawn prefix",
        "A BFD session that did not detect the failure of the prefix",
        "Two untagged redistribution points feeding each other's copies"
       ],
       "answer": 3,
       "explain": "Without tags, each redistributed copy supports the other after the origin disappears."
      },
      {
       "q": "Why must IS-IS use wide metrics in a tag-based redistribution design?",
       "options": [
        "Narrow metrics cannot represent the distance values used by OSPF",
        "Tags are sub-TLVs of the extended IP reachability TLV",
        "Wide metrics are required for any redistribution into IS-IS at all",
        "Narrow metrics disable the up/down bit used to stop loops"
       ],
       "answer": 1,
       "explain": "Tags are sub-TLVs of TLV 135, which requires wide metrics."
      },
      {
       "q": "R2 shows a prefix as OSPF external with tag 115, while the IS-IS database also contains it. What does that indicate?",
       "options": [
        "R2 prefers an OSPF external copy redistributed from IS-IS by another router",
        "R2 itself redistributed the prefix from OSPF into IS-IS earlier",
        "The prefix originated in OSPF and was leaked into IS-IS by mistake",
        "The IS-IS copy has a lower metric and should be preferred by R2"
       ],
       "answer": 0,
       "explain": "Tag 115 marks routes redistributed from IS-IS; R2 prefers that copy because OSPF distance is lower."
      },
      {
       "q": "Why should tag filtering be configured on every redistribution point, not just one?",
       "options": [
        "Tags are only attached when every router agrees on the same value",
        "Any unfiltered point can carry routes back to their home domain",
        "Routers ignore tags unless they are configured on both protocols",
        "OSPF discards external routes that carry an unknown tag value"
       ],
       "answer": 1,
       "explain": "Feedback can occur through any unprotected redistribution point."
      }
     ]
    }
   ]
  }
 ]
});
TRACK.modules.push({
 "id": "m4",
 "order": 4,
 "code": "BGP",
 "title": "BGP Mastery",
 "subtitle": "Reflection and confederations, community policy, best-path depth, advanced advertisement, convergence and security",
 "outcomes": [
  "Scale iBGP with reflectors and confederations while preserving path diversity",
  "Build community-driven policy frameworks that prevent leaks by design",
  "Predict best-path outcomes, including MED subtleties, from raw show output",
  "Engineer conditional advertisement, add-path and fast BGP convergence",
  "Secure BGP sessions and routes, and diagnose complex BGP incidents"
 ],
 "lessons": [
  {
   "id": "m4-l1",
   "title": "Scaling iBGP: Route Reflectors and Confederations",
   "subtitle": "Reflection rules, loop prevention, path hiding and when to choose confederations",
   "minutes": 45,
   "objectives": [
    "Apply route reflection rules and explain ORIGINATOR_ID and CLUSTER_LIST",
    "Design redundant reflector clusters and recognise path hiding",
    "Configure and verify a confederation and explain how attributes cross sub-AS borders"
   ],
   "blocks": [
    {
     "type": "text",
     "text": "iBGP does not re-advertise iBGP-learned routes to other iBGP peers, so a plain design needs a full mesh: every router peers with every other. That does not scale. **Route reflection** (RFC 4456) relaxes the rule for designated reflectors, and **confederations** (RFC 5065) split the AS into sub-ASes that exchange routes using eBGP-like sessions. Both trade some path visibility for scale."
    },
    {
     "type": "formula",
     "title": "Session arithmetic",
     "items": [
      {
       "name": "Full mesh",
       "expr": "n × (n − 1) ÷ 2",
       "meaning": "100 routers need 4,950 sessions; every new router adds n − 1 sessions."
      },
      {
       "name": "Two reflectors, all others clients",
       "expr": "2 × (n − 2) + 1",
       "meaning": "100 routers need 197 sessions; a new client adds two."
      },
      {
       "name": "Paths a client sees per prefix",
       "expr": "one per reflector it peers with (without add-path)",
       "meaning": "Reflectors advertise only their own best path."
      }
     ]
    },
    {
     "type": "table",
     "title": "Reflection rules",
     "head": [
      "Route learned from",
      "Reflector sends it to"
     ],
     "rows": [
      [
       "An eBGP peer",
       "All clients and all non-clients"
      ],
      [
       "A client",
       "All other clients and all non-clients (and eBGP peers)"
      ],
      [
       "A non-client iBGP peer",
       "Clients only (and eBGP peers)"
      ]
     ]
    },
    {
     "type": "callout",
     "kind": "definition",
     "text": "A reflector adds **ORIGINATOR_ID**, the router ID of the iBGP speaker that injected the route, if it is not already present; a router that receives a route carrying its own router ID as originator drops it. The reflector also prepends its **cluster ID** to **CLUSTER_LIST**; a reflector that receives a route with its own cluster ID drops it. Neither attribute is sent to eBGP peers.",
     "title": "Loop prevention attributes"
    },
    {
     "type": "compare",
     "title": "Cluster ID choices for a redundant pair",
     "columns": [
      {
       "title": "Same cluster ID on both reflectors",
       "items": [
        "Each reflector drops routes reflected by its partner",
        "Less memory on the reflectors",
        "Every client must peer with both reflectors for redundancy"
       ]
      },
      {
       "title": "Unique cluster IDs",
       "items": [
        "Each reflector keeps its partner's reflected copy",
        "More paths stored, more memory",
        "Survives a client losing one of its sessions more gracefully"
       ]
      }
     ]
    },
    {
     "type": "cli",
     "title": "Route reflector configuration",
     "device": "RR1 · IOS-style CLI",
     "lines": [
      "router bgp 65000",
      " bgp router-id 10.0.0.1",
      " bgp cluster-id 10.0.0.100",
      " neighbor RR-CLIENTS peer-group",
      " neighbor RR-CLIENTS remote-as 65000",
      " neighbor RR-CLIENTS update-source Loopback0",
      " neighbor 10.0.0.11 peer-group RR-CLIENTS",
      " neighbor 10.0.0.12 peer-group RR-CLIENTS",
      " neighbor 10.0.0.2 remote-as 65000",
      " neighbor 10.0.0.2 update-source Loopback0",
      " !",
      " address-family ipv4",
      "  neighbor RR-CLIENTS activate",
      "  neighbor RR-CLIENTS route-reflector-client",
      "  neighbor RR-CLIENTS send-community both",
      "  neighbor 10.0.0.2 activate",
      "  neighbor 10.0.0.2 send-community both"
     ],
     "note": "10.0.0.2 is the second reflector, peered as a non-client. Only the reflectors need reflection configuration; clients are ordinary iBGP speakers. Reflectors do not change the next hop, so every client still needs an IGP route to every edge router's next hop."
    },
    {
     "type": "cli",
     "title": "A client sees one exit through two reflectors",
     "device": "PE5 · IOS-style CLI",
     "lines": [
      "PE5# show ip bgp 203.0.113.0/24",
      "BGP routing table entry for 203.0.113.0/24, version 8812",
      "Paths: (2 available, best #1, table default)",
      "  64600",
      "    10.0.0.21 (metric 30) from 10.0.0.1 (10.0.0.1)",
      "      Origin IGP, metric 0, localpref 200, valid, internal, best",
      "      Originator: 10.0.0.21, Cluster list: 10.0.0.100",
      "  64600",
      "    10.0.0.21 (metric 30) from 10.0.0.2 (10.0.0.2)",
      "      Origin IGP, metric 0, localpref 200, valid, internal",
      "      Originator: 10.0.0.21, Cluster list: 10.0.0.200"
     ],
     "note": "Both reflectors (unique cluster IDs) reflect the same path through edge router 10.0.0.21. Edge router 10.0.0.22 also learns 203.0.113.0/24 from AS 64600, but neither reflector selected it, so PE5 never sees it. That is path hiding: no load sharing, no pre-computed backup, and slower convergence if 10.0.0.21 fails."
    },
    {
     "type": "text",
     "text": "A **confederation** divides an AS into sub-ASes, usually with private AS numbers. Inside a sub-AS, normal iBGP rules apply (full mesh or reflectors). Between sub-ASes, sessions behave like eBGP for loop prevention, using AS_CONFED_SEQUENCE segments, but NEXT_HOP, LOCAL_PREF and MED are preserved as if the session were iBGP. Confederation segments are not counted in AS-path length during best-path selection and are removed when routes leave the confederation, so outsiders see a single AS."
    },
    {
     "type": "cli",
     "title": "Confederation member",
     "device": "R31 · IOS-style CLI",
     "lines": [
      "router bgp 65101",
      " bgp confederation identifier 64500",
      " bgp confederation peers 65102 65103",
      " neighbor 10.0.0.41 remote-as 65102",
      " neighbor 10.0.0.41 update-source Loopback0",
      " neighbor 10.0.0.41 ebgp-multihop 2",
      " neighbor 10.0.0.32 remote-as 65101",
      " neighbor 10.0.0.32 update-source Loopback0",
      " neighbor 192.0.2.1 remote-as 64999"
     ],
     "note": "The router lives in sub-AS 65101; the outside world sees AS 64500. 10.0.0.41 is a confederation peer in sub-AS 65102 and, like any eBGP session between loopbacks, needs multihop. 10.0.0.32 is an iBGP peer inside the same sub-AS, and 192.0.2.1 is a true external peer."
    },
    {
     "type": "scenario",
     "title": "Hot-potato routing breaks after adding reflectors",
     "situation": "A national network moved from full mesh to two centralised route reflectors in the capital. Since then, edge routers in the south send traffic for many destinations to exits in the north, even though equally good exits exist in the south. Policy and local preference are identical at all exits.",
     "options": [
      {
       "text": "Lower the IGP metric on all southern links so the reflectors see southern exits as closer.",
       "feedback": "This distorts the IGP for every other purpose and still leaves northern clients with the wrong choice.",
       "best": false
      },
      {
       "text": "Set the same cluster ID on both reflectors so they stop exchanging paths with each other.",
       "feedback": "The cluster ID affects which reflected paths are kept, not the IGP-based selection that hides the southern exits.",
       "best": false
      },
      {
       "text": "Use add-path or regional reflectors so each client can pick its nearest exit.",
       "feedback": "Correct. Each reflector selects one best path using its own IGP distance to the exits, which favours exits near the capital. Clients inherit that choice. More paths to clients, or reflectors placed per region, restore true hot-potato behaviour.",
       "best": true
      },
      {
       "text": "Configure next-hop-self on the reflectors so that all traffic is drawn toward the capital.",
       "feedback": "That would pull traffic through the reflectors and make the path even longer, as well as changing the forwarding design.",
       "best": false
      }
     ]
    },
    {
     "type": "checklist",
     "title": "iBGP scaling review",
     "items": [
      "Reflectors redundant, with a deliberate cluster ID choice",
      "Every client peers with at least two reflectors",
      "Reflector placement considered for hot-potato exit selection",
      "Path diversity strategy defined (add-path, best-external or regional reflectors)",
      "Next hops resolvable by every client through the IGP",
      "send-community enabled on every iBGP session",
      "Confederation sub-AS sessions use multihop where peering via loopbacks"
     ]
    },
    {
     "type": "terms",
     "items": [
      {
       "term": "Route reflector",
       "def": "An iBGP speaker allowed to re-advertise iBGP-learned routes to its clients and non-clients according to fixed rules."
      },
      {
       "term": "Client",
       "def": "An iBGP peer of a reflector that receives reflected routes; it needs no special configuration."
      },
      {
       "term": "ORIGINATOR_ID",
       "def": "An optional attribute holding the router ID of the route's originator inside the AS, used to drop looping routes."
      },
      {
       "term": "CLUSTER_LIST",
       "def": "An optional attribute listing the cluster IDs a route has been reflected through."
      },
      {
       "term": "Cluster ID",
       "def": "The identifier of a reflection cluster, by default the reflector's router ID."
      },
      {
       "term": "Path hiding",
       "def": "Loss of alternative paths because a reflector advertises only its own best path."
      },
      {
       "term": "Confederation",
       "def": "An AS split into sub-ASes that exchange routes over eBGP-like sessions while appearing as one AS externally."
      },
      {
       "term": "AS_CONFED_SEQUENCE",
       "def": "The AS-path segment listing the sub-ASes a route has crossed inside a confederation."
      },
      {
       "term": "Hot-potato routing",
       "def": "Sending traffic to the nearest exit by IGP metric when other attributes are equal."
      }
     ]
    },
    {
     "type": "reflection",
     "prompt": "In an iBGP design you know, which exits are hidden from which routers today? What would you change first to expose them?"
    },
    {
     "type": "quiz",
     "items": [
      {
       "q": "A reflector learns a route from a non-client iBGP peer. Where does it reflect it?",
       "options": [
        "To all clients and all other non-client iBGP peers",
        "To non-client iBGP peers only, plus any eBGP peers",
        "Nowhere, because non-client routes are never reflected",
        "To its own clients only, plus any of its eBGP peers"
       ],
       "answer": 3,
       "explain": "Routes from non-clients are reflected to clients only; non-clients are expected to be meshed with each other."
      },
      {
       "q": "A reflector receives a route whose CLUSTER_LIST contains its own cluster ID. What happens?",
       "options": [
        "It reflects the route only to its non-client iBGP peers",
        "It accepts the route and replaces the originator ID",
        "It discards the route as a reflection loop in its cluster",
        "It accepts the route but marks it as not eligible for best path"
       ],
       "answer": 2,
       "explain": "The cluster ID in CLUSTER_LIST indicates the route already passed through this cluster."
      },
      {
       "q": "Two reflectors share a cluster ID. A client loses its session to RR1. What is the effect?",
       "options": [
        "RR1 still learns the client's routes, reflected to it by RR2 as usual",
        "The client's routes are withdrawn from every router in the AS",
        "RR1 loses the client's routes, as it drops RR2's reflected copies",
        "RR2 stops reflecting the client's routes to avoid a duplicate"
       ],
       "answer": 2,
       "explain": "With a shared cluster ID, RR1 drops RR2's reflected copies, but other clients still learn the routes through RR2."
      },
      {
       "q": "How is AS_CONFED_SEQUENCE treated during best-path selection?",
       "options": [
        "Each sub-AS counts as one hop like any normal AS",
        "It is excluded entirely from the AS-path length comparison",
        "The whole confederation segment counts as a single hop",
        "It is compared only after the router ID tie-breaker"
       ],
       "answer": 1,
       "explain": "Confederation segments are excluded from AS-path length comparison."
      },
      {
       "q": "Why can centralised reflectors break hot-potato routing?",
       "options": [
        "Clients inherit best paths chosen from the reflector's IGP position",
        "They change the next hop of every route to their own loopback address",
        "They remove the MED attribute from routes reflected to clients",
        "They set a lower local preference on routes from distant clients"
       ],
       "answer": 0,
       "explain": "Reflectors advertise their own best path, chosen from their position in the IGP, not the client's."
      }
     ]
    }
   ]
  },
  {
   "id": "m4-l2",
   "title": "Communities and Policy Frameworks",
   "subtitle": "Standard, extended and large communities as the language of scalable routing policy",
   "minutes": 50,
   "objectives": [
    "Distinguish standard, extended and large communities and the well-known values",
    "Design a classify-act-export policy framework driven by communities",
    "Verify community propagation and policy outcomes per neighbour"
   ],
   "blocks": [
    {
     "type": "text",
     "text": "Per-neighbour route-maps written by hand do not scale beyond a handful of peers: every new policy must be replicated, and nobody can say what the policy is without reading every line. Mature networks **classify** routes once, at ingress, by attaching communities, and then make every later decision by matching those communities. The policy becomes a small, readable vocabulary."
    },
    {
     "type": "table",
     "title": "Community types",
     "head": [
      "Type",
      "Defined in",
      "Size and format",
      "Typical use"
     ],
     "rows": [
      [
       "Standard",
       "RFC 1997",
       "32 bits, written ASN:value with 16-bit halves",
       "Classification and action signals in 16-bit ASN networks"
      ],
      [
       "Extended",
       "RFC 4360",
       "64 bits with a type field",
       "Route targets, route origin, transitive and non-transitive types"
      ],
      [
       "Large",
       "RFC 8092",
       "96 bits: global administrator:local data 1:local data 2",
       "Policy signalling for networks with 32-bit ASNs"
      ],
      [
       "Well-known",
       "RFC 1997 and later",
       "Reserved standard values",
       "NO_EXPORT, NO_ADVERTISE, NO_EXPORT_SUBCONFED, BLACKHOLE (65535:666), GRACEFUL_SHUTDOWN (65535:0)"
      ]
     ]
    },
    {
     "type": "framework",
     "title": "The ZyeemZia policy framework",
     "items": [
      {
       "label": "P1",
       "title": "Sanitise",
       "text": "At ingress, drop bogons, overly specific prefixes, RPKI-invalid routes and anything outside the neighbour's expected prefix set; strip communities in your own namespace that the neighbour may not set."
      },
      {
       "label": "P2",
       "title": "Classify",
       "text": "Tag every route with its relationship (customer, peer, transit, internal), region and point of entry."
      },
      {
       "label": "P3",
       "title": "Prefer",
       "text": "Set local preference from the class: customer above peer above transit."
      },
      {
       "label": "P4",
       "title": "Act",
       "text": "Honour documented action communities from customers, such as prepend toward a region or do not announce to a named peer."
      },
      {
       "label": "P5",
       "title": "Export",
       "text": "Advertise by class: customer routes to everyone, peer and transit routes only to customers."
      },
      {
       "label": "P6",
       "title": "Scrub",
       "text": "Remove internal-only communities at the edge and send only what neighbours are documented to receive."
      }
     ]
    },
    {
     "type": "table",
     "title": "Example community plan (AS 64500, large communities)",
     "head": [
      "Community",
      "Meaning",
      "Set by"
     ],
     "rows": [
      [
       "64500:1:100",
       "Learned from a customer",
       "Ingress policy"
      ],
      [
       "64500:1:200",
       "Learned from a settlement-free peer",
       "Ingress policy"
      ],
      [
       "64500:1:300",
       "Learned from a transit provider",
       "Ingress policy"
      ],
      [
       "64500:2:44",
       "Entered in region 44",
       "Ingress policy"
      ],
      [
       "64500:10:64511",
       "Do not announce to AS 64511",
       "Customer action"
      ],
      [
       "64500:11:2",
       "Prepend twice toward peers",
       "Customer action"
      ]
     ]
    },
    {
     "type": "callout",
     "kind": "insight",
     "text": "The rule that peer and transit routes are exported only to customers is the valley-free model in practice. If every route is classified at ingress and every export policy matches on class, a misconfigured neighbour cannot turn your network into a transit path between two providers.",
     "title": "Export by class is route-leak prevention"
    },
    {
     "type": "cli",
     "title": "Classification and export with standard communities",
     "device": "EDGE1 · IOS-style CLI",
     "lines": [
      "ip prefix-list PL-CUST-ACME seq 5 permit 198.51.100.0/24",
      "ip community-list standard CL-CUSTOMER permit 64500:100",
      "ip community-list standard CL-NO-PEERS permit 64500:990",
      "ip community-list standard CL-INTERNAL permit 64500:100",
      "ip community-list standard CL-INTERNAL permit 64500:990",
      "!",
      "route-map RM-IN-CUST-ACME permit 10",
      " match ip address prefix-list PL-CUST-ACME",
      " set local-preference 200",
      " set community 64500:100 additive",
      "!",
      "route-map RM-OUT-PEER deny 5",
      " match community CL-NO-PEERS",
      "route-map RM-OUT-PEER permit 10",
      " match community CL-CUSTOMER",
      " set comm-list CL-INTERNAL delete",
      "route-map RM-OUT-PEER deny 100"
     ],
     "note": "Inbound, the customer's routes are filtered by prefix, preferred and tagged as customer. Outbound to peers, routes the customer marked with 64500:990 are suppressed, only customer-class routes are permitted, and internal tags are removed before advertisement. Everything else, including peer and transit routes, is denied."
    },
    {
     "type": "cli",
     "title": "Proving that a community survived",
     "device": "EDGE2 · IOS-style CLI",
     "lines": [
      "EDGE2# show ip bgp 198.51.100.0/24",
      "BGP routing table entry for 198.51.100.0/24, version 5521",
      "Paths: (1 available, best #1, table default)",
      "  64511",
      "    10.0.0.11 (metric 20) from 10.0.0.1 (10.0.0.1)",
      "      Origin IGP, metric 0, localpref 200, valid, internal, best",
      "      Originator: 10.0.0.11, Cluster list: 10.0.0.100",
      "EDGE2# show ip bgp neighbors 192.0.2.77 advertised-routes | include 198.51.100",
      " *>i 198.51.100.0/24  10.0.0.11       0    200      0 64511 i"
     ],
     "note": "The route reached EDGE2 with local preference 200 but no Community line at all, so the customer's do-not-announce-to-peers signal and the customer class were lost on the way. EDGE2 advertises it to peer 192.0.2.77 because a looser legacy policy still applies there. Check send-community on the sessions from EDGE1 and the reflectors."
    },
    {
     "type": "callout",
     "kind": "warning",
     "text": "Many implementations do not send communities to a neighbour unless told to. A single iBGP session without community sending, often on a reflector, silently strips classification for every router behind it. Make community sending part of the session template, and verify it per session.",
     "title": "Communities are not sent by default everywhere"
    },
    {
     "type": "scenario",
     "title": "A customer's signal is ignored",
     "situation": "A customer tags its prefix with 64500:990, the documented do-not-announce-to-peers community. The route still appears at an internet exchange peer. On the egress router the prefix has no communities at all, while on the ingress edge router it shows 64500:100 and 64500:990.",
     "options": [
      {
       "text": "Add an explicit prefix-list deny for the customer's prefix on the peer-facing export policy.",
       "feedback": "This hides one symptom while every other customer's signals and classes remain broken across the same session.",
       "best": false
      },
      {
       "text": "Ask the customer to use the large-community version of the signal instead of the standard one.",
       "feedback": "Large communities are stripped by the same missing setting unless it covers them, so the cause is unchanged.",
       "best": false
      },
      {
       "text": "Raise the local preference on the ingress router so the customer route is preferred everywhere.",
       "feedback": "Preference does not affect whether a route is exported to peers; the egress policy needs the community to decide.",
       "best": false
      },
      {
       "text": "Find the iBGP session, possibly on a reflector, that is not sending communities, and fix it.",
       "feedback": "Correct. The communities exist at ingress and are missing at egress, so they were stripped in transit. Without them the egress policy cannot recognise the signal or the class.",
       "best": true
      }
     ]
    },
    {
     "type": "case",
     "title": "Redesigning a multinational's BGP policy",
     "context": "A multinational retailer runs its own AS with six transit providers and two internet exchanges across three regions. Over ten years, engineers added per-neighbour route-maps; the largest is over 400 lines. Local preference values differ by region, so traffic for the same destination exits in different continents depending on where it enters. Two incidents in a year leaked routes from one transit provider to another, and nobody can predict the effect of a change without lab testing.",
     "questions": [
      "Which framework stages are missing today?",
      "How would you define the community plan?",
      "How would you migrate without an outage?",
      "What would you measure to prove the redesign worked?"
     ],
     "answer": "Classification and export by class are missing: decisions are made per neighbour on raw prefixes, so local preference is inconsistent and nothing stops a transit route from being exported to another transit. Define a large-community plan in the organisation's own ASN namespace: relationship class, region, point of entry, and a small set of action communities, documented in one place and generated from a source of truth. Migrate by first adding classification at every ingress without changing decisions, verifying that every route carries a class; then switch export policies one neighbour at a time to class-based matching, comparing advertised routes before and after; finally replace local preference rules with class-based values and remove the legacy route-maps. Measure the number of policy lines, consistency of exit selection for test prefixes from each region, zero transit-to-transit advertisements in daily audits, and change lead time."
    },
    {
     "type": "template",
     "title": "BGP policy matrix",
     "purpose": "Define, per neighbour class, everything that ingress and egress policy must do, and how to prove it.",
     "columns": [
      "Neighbour class",
      "Ingress filters",
      "Tags set",
      "Local preference",
      "Exported classes",
      "Actions honoured",
      "Proof command"
     ],
     "example": [
      [
       "Customer",
       "Prefix list from registry, max-prefix, RPKI invalid drop",
       "64500:1:100, region, entry",
       "200",
       "All classes",
       "Prepend, no-export to named peer",
       "advertised-routes per peer, community per prefix"
      ],
      [
       "Transit",
       "Bogons, too-specific, RPKI invalid drop",
       "64500:1:300, region, entry",
       "100",
       "Customer only",
       "None",
       "advertised-routes shows customer routes only"
      ]
     ],
     "rows": 6
    },
    {
     "type": "checklist",
     "title": "Community policy hygiene",
     "items": [
      "Community plan documented in one place and generated from a source of truth",
      "Every ingress session classifies every accepted route",
      "Customers cannot set internal classification communities",
      "Export policies match on class, never on raw prefixes alone",
      "Community sending enabled and verified on every session",
      "Internal communities scrubbed before external advertisement",
      "Well-known communities honoured as documented"
     ]
    },
    {
     "type": "terms",
     "items": [
      {
       "term": "Standard community",
       "def": "A 32-bit BGP attribute value defined in RFC 1997, written as two 16-bit numbers."
      },
      {
       "term": "Extended community",
       "def": "A 64-bit attribute value with a type field, defined in RFC 4360, used for route targets and similar."
      },
      {
       "term": "Large community",
       "def": "A 96-bit attribute value defined in RFC 8092 that fits 32-bit ASNs in the global administrator field."
      },
      {
       "term": "NO_EXPORT",
       "def": "A well-known community that keeps a route inside the local AS or confederation."
      },
      {
       "term": "NO_ADVERTISE",
       "def": "A well-known community that prevents a route from being advertised to any peer."
      },
      {
       "term": "Action community",
       "def": "A community a neighbour sets to request specific treatment, such as prepending or suppression."
      },
      {
       "term": "Classification community",
       "def": "A community attached at ingress to record a route's relationship, region or entry point."
      },
      {
       "term": "Valley-free export",
       "def": "The rule that routes from peers and transit providers are exported only to customers."
      },
      {
       "term": "Scrubbing",
       "def": "Removing communities that should not leave the network or that a neighbour should not have set."
      }
     ]
    },
    {
     "type": "reflection",
     "prompt": "If you had to describe your organisation's routing policy in ten communities, what would they be? Which current per-neighbour rules would they replace?"
    },
    {
     "type": "quiz",
     "items": [
      {
       "q": "Which community type suits a network with a 32-bit ASN that wants its own ASN in the community?",
       "options": [
        "Standard communities, using only the low 16 bits of the 32-bit ASN",
        "Extended communities of the route-target type",
        "Well-known communities from the reserved range",
        "Large communities, with the ASN as global administrator"
       ],
       "answer": 3,
       "explain": "Large communities were defined so 32-bit ASNs can be expressed directly."
      },
      {
       "q": "A route carries NO_EXPORT. A router in the same AS receives it from an iBGP peer. What may it do?",
       "options": [
        "Advertise it to other iBGP peers but not to external neighbours",
        "Advertise it to external neighbours with the community removed",
        "Keep it locally and advertise it to no neighbour at all",
        "Advertise it only to neighbours in the same confederation sub-AS"
       ],
       "answer": 0,
       "explain": "NO_EXPORT keeps the route inside the AS (or confederation); iBGP propagation is allowed."
      },
      {
       "q": "Communities are present at the ingress router but missing at the egress router. What is the most likely cause?",
       "options": [
        "The egress router's inbound policy does not match on communities",
        "Communities expire after crossing more than two iBGP hops",
        "An iBGP session in between is not configured to send any communities",
        "The reflector replaces communities with its own cluster ID"
       ],
       "answer": 2,
       "explain": "Communities are only lost in transit when a session does not send them or a policy deletes them."
      },
      {
       "q": "Why does exporting peer and transit routes only to customers prevent route leaks?",
       "options": [
        "It ensures every route you export is valid according to RPKI",
        "It limits the number of prefixes you advertise to each neighbour",
        "It forces customers to set action communities on their routes",
        "You can never become a transit path between two non-customers"
       ],
       "answer": 3,
       "explain": "Valley-free export stops you carrying traffic between providers and peers on their behalf."
      },
      {
       "q": "Where should classification communities be attached?",
       "options": [
        "At egress, just before the route is advertised to neighbours",
        "At ingress, on the edge router where the route first enters the network",
        "On the reflectors, as routes are reflected to clients",
        "On every router, so each one can confirm the class"
       ],
       "answer": 1,
       "explain": "Classifying once at ingress lets every later policy rely on the tag."
      }
     ]
    }
   ]
  },
  {
   "id": "m4-l3",
   "title": "Best-Path Selection in Depth",
   "subtitle": "Every tie-breaker, the traps around MED, and reading the BGP table like an expert",
   "minutes": 45,
   "objectives": [
    "Apply the complete best-path sequence to multi-path show output",
    "Explain MED comparison rules, deterministic MED and missing-MED handling",
    "Predict how inbound and outbound policies interact with provider policies"
   ],
   "blocks": [
    {
     "type": "text",
     "text": "Best-path selection is deterministic once you know the order and the exceptions. Most surprises come from three places: attributes you did not expect to be compared (or not compared), the order in which paths are compared when MED is involved, and policies applied by neighbours that override anything you send."
    },
    {
     "type": "table",
     "title": "The decision sequence",
     "head": [
      "Step",
      "Prefer",
      "Notes"
     ],
     "rows": [
      [
       "0",
       "Valid paths only",
       "Next hop resolvable, no AS-path loop, accepted by policy; many implementations can also exclude RPKI-invalid paths"
      ],
      [
       "1",
       "Highest weight",
       "Local to the router, not a protocol attribute; implementation-specific"
      ],
      [
       "2",
       "Highest LOCAL_PREF",
       "Default 100; carried across iBGP only"
      ],
      [
       "3",
       "Locally originated",
       "Network, aggregate or redistribution on this router"
      ],
      [
       "4",
       "Shortest AS_PATH",
       "AS_SET counts as one; confederation segments are not counted"
      ],
      [
       "5",
       "Lowest ORIGIN",
       "IGP, then EGP, then incomplete"
      ],
      [
       "6",
       "Lowest MED",
       "Compared only between paths from the same neighbouring AS unless configured otherwise"
      ],
      [
       "7",
       "eBGP over iBGP",
       "Confederation-external paths count as internal"
      ],
      [
       "8",
       "Lowest IGP metric to next hop",
       "Hot-potato step"
      ],
      [
       "9",
       "Multipath",
       "If enabled, equal paths up to here may be installed together"
      ],
      [
       "10",
       "Oldest eBGP path",
       "Stability tie-breaker; often skippable by configuration"
      ],
      [
       "11",
       "Lowest router ID",
       "ORIGINATOR_ID replaces router ID for reflected paths"
      ],
      [
       "12",
       "Shortest CLUSTER_LIST",
       "Fewer reflection hops"
      ],
      [
       "13",
       "Lowest neighbour address",
       "Final tie-breaker"
      ]
     ]
    },
    {
     "type": "formula",
     "title": "Counting AS-path length",
     "items": [
      {
       "name": "Length",
       "expr": "count of ASNs in AS_SEQUENCE segments + 1 for each AS_SET segment",
       "meaning": "Prepending adds to the sequence count; an aggregate's AS_SET counts once however many ASNs it holds."
      },
      {
       "name": "Confederation segments",
       "expr": "AS_CONFED_SEQUENCE and AS_CONFED_SET count as 0",
       "meaning": "Routing inside a confederation does not lengthen the path."
      }
     ]
    },
    {
     "type": "callout",
     "kind": "warning",
     "text": "MED is only compared between paths from the same neighbouring AS by default, so the result can depend on the order in which paths are compared. Path A may beat B on IGP metric, B may beat C, and C may beat A on MED: there is no single correct winner without a fixed comparison order. **Deterministic MED** groups paths by neighbouring AS, picks the best in each group, and only then compares the group winners, which makes the outcome independent of arrival order.",
     "title": "MED is compared in a surprising way"
    },
    {
     "type": "cli",
     "title": "Why the lowest MED is not best",
     "device": "R5 · IOS-style CLI",
     "lines": [
      "R5# show ip bgp 192.0.2.0/24",
      "BGP routing table entry for 192.0.2.0/24, version 3311",
      "Paths: (3 available, best #2, table default)",
      "  64510 64999",
      "    10.0.0.7 (metric 20) from 10.0.0.7 (10.0.0.7)",
      "      Origin IGP, metric 50, localpref 100, valid, internal",
      "  64520 64999",
      "    10.0.0.8 (metric 40) from 10.0.0.8 (10.0.0.8)",
      "      Origin IGP, metric 10, localpref 100, valid, internal, best",
      "  64510 64999",
      "    10.0.0.9 (metric 50) from 10.0.0.9 (10.0.0.9)",
      "      Origin IGP, metric 0, localpref 100, valid, internal",
      "R5# show running-config | include deterministic",
      " bgp deterministic-med"
     ],
     "note": "In parentheses is the IGP metric to the next hop; after Origin IGP is the MED. With deterministic MED, the two AS 64510 paths are grouped and the MED 0 path via 10.0.0.9 wins the group. It is then compared with the AS 64520 path: different neighbouring AS, so MED is skipped and the IGP metric decides (40 beats 50). Without deterministic MED, comparing pairwise in the listed order would pick 10.0.0.9 instead."
    },
    {
     "type": "compare",
     "title": "Handling a missing MED",
     "columns": [
      {
       "title": "Treat missing as best (protocol default)",
       "items": [
        "A path without MED is treated as MED 0",
        "Routes from neighbours that never set MED win MED comparisons",
        "Matches the base specification"
       ]
      },
      {
       "title": "Treat missing as worst (option)",
       "items": [
        "A path without MED is treated as the maximum value",
        "Neighbours must set MED to be preferred",
        "Useful when MED is a deliberate signal from a provider"
       ]
      }
     ]
    },
    {
     "type": "steps",
     "title": "Reading a multi-path entry quickly",
     "items": [
      {
       "title": "Discard the invalid",
       "text": "Look for inaccessible next hops, RIB-failure and policy flags first."
      },
      {
       "title": "Find the first difference",
       "text": "Walk the attributes in order: local preference, origination, AS-path length, origin, MED and so on, stopping at the first that differs."
      },
      {
       "title": "Check MED eligibility",
       "text": "Before comparing MED, check whether the paths came from the same neighbouring AS and whether deterministic or always-compare MED is on."
      },
      {
       "title": "Check for hidden paths",
       "text": "If you expected a path that is not listed, the reason is upstream: reflector selection or neighbour policy."
      },
      {
       "title": "Confirm in forwarding",
       "text": "Verify the next hop's IGP path and the FIB, not just the BGP marker."
      }
     ]
    },
    {
     "type": "scenario",
     "title": "Inbound traffic ignores your MED",
     "situation": "Your network has two links to the same provider, in different cities. You send MED 10 on link A and MED 100 on link B so the provider sends traffic over link A. Most inbound traffic still arrives on link B. The provider confirms it receives both MED values.",
     "options": [
      {
       "text": "Prepend your AS several times on link B so the AS path through it is longer.",
       "feedback": "Prepending can work, but it acts after local preference too. If the provider prefers link B by local preference, AS-path length is never reached either.",
       "best": false
      },
      {
       "text": "Lower MED on link A to zero so the difference between the links is larger.",
       "feedback": "The size of the MED difference is irrelevant when MED is never compared because an earlier step decides.",
       "best": false
      },
      {
       "text": "Advertise more-specific prefixes on link B so the provider must prefer it for those prefixes.",
       "feedback": "This moves traffic toward link B, the opposite of the goal, and adds global table entries.",
       "best": false
      },
      {
       "text": "Use the provider's documented community to lower its local preference for your routes on link B.",
       "feedback": "Correct. Local preference is evaluated before MED. If the provider's own policy sets a higher local preference on link B, for example because of regional exit policy, your MED never gets compared. Provider communities act on that earlier step.",
       "best": true
      }
     ]
    },
    {
     "type": "checklist",
     "title": "Best-path troubleshooting",
     "items": [
      "Every candidate path is visible, or the reason it is hidden is known",
      "Invalid and RIB-failure paths ruled out first",
      "MED comparisons checked against neighbouring AS and configuration",
      "Deterministic MED consistent across the AS",
      "Neighbours' policies that override your attributes understood",
      "Forwarding path confirmed after the BGP decision"
     ]
    },
    {
     "type": "terms",
     "items": [
      {
       "term": "LOCAL_PREF",
       "def": "A well-known attribute carried within an AS that expresses exit preference; higher wins."
      },
      {
       "term": "Weight",
       "def": "A router-local preference value used by some implementations before any protocol attribute."
      },
      {
       "term": "AS_PATH",
       "def": "The list of ASes a route has crossed, used for loop prevention and path length comparison."
      },
      {
       "term": "ORIGIN",
       "def": "An attribute indicating how a route entered BGP: IGP, EGP or incomplete."
      },
      {
       "term": "MED",
       "def": "Multi-exit discriminator: a hint to a neighbouring AS about which entry point to prefer; lower wins."
      },
      {
       "term": "Deterministic MED",
       "def": "Grouping paths by neighbouring AS before comparing, so results do not depend on arrival order."
      },
      {
       "term": "Always-compare MED",
       "def": "Comparing MED between paths from different neighbouring ASes."
      },
      {
       "term": "AS_SET",
       "def": "An unordered AS-path segment created by aggregation, counted as one AS in length."
      },
      {
       "term": "Multipath",
       "def": "Installing several equal BGP paths for load sharing after the multipath comparison step."
      }
     ]
    },
    {
     "type": "reflection",
     "prompt": "Pick a prefix with several paths in a BGP table you can access. Walk the decision sequence and write down the step that decided it. Did it match what you expected?"
    },
    {
     "type": "quiz",
     "items": [
      {
       "q": "Two paths differ only in MED (10 and 50) and come from different neighbouring ASes, without always-compare MED. What decides?",
       "options": [
        "The path with MED 10, because a lower MED always wins",
        "The next steps, starting with eBGP over iBGP and then the IGP metric",
        "The path with MED 50, because MED is compared in reverse",
        "The router ID of the advertising peer, ignoring every other step"
       ],
       "answer": 1,
       "explain": "MED is skipped between different neighbouring ASes by default, so the following steps decide."
      },
      {
       "q": "How long is an AS path of 64510 64510 64520 {64530 64540}?",
       "options": [
        "4",
        "5",
        "3",
        "6"
       ],
       "answer": 0,
       "explain": "Three ASNs in the sequence plus one for the AS_SET equals 4."
      },
      {
       "q": "Why can MED comparisons give different winners on identical routers without deterministic MED?",
       "options": [
        "MED values are rewritten by route reflectors in an unpredictable order",
        "Routers round MED values differently depending on load",
        "Pairwise comparison order decides which paths meet on MED",
        "Older paths lose their MED attribute after a refresh"
       ],
       "answer": 2,
       "explain": "Without grouping, the result depends on the order in which paths are compared."
      },
      {
       "q": "Which step chooses the exit closest to the router when everything before it is equal?",
       "options": [
        "Oldest eBGP path among the candidates",
        "Lowest router ID of the advertising peer",
        "Shortest CLUSTER_LIST among reflected paths",
        "Lowest IGP metric toward the BGP next hop"
       ],
       "answer": 3,
       "explain": "The IGP metric step implements hot-potato routing."
      },
      {
       "q": "Inbound traffic ignores your MED on two links to the same provider. What is the most likely reason?",
       "options": [
        "MED is never carried across eBGP sessions to a neighbouring AS",
        "The provider compares MED only for paths learned from different ASes",
        "MED only affects outbound traffic from your own network",
        "The provider's local preference decides before MED is compared"
       ],
       "answer": 3,
       "explain": "Local preference in the provider's AS is evaluated before MED."
      }
     ]
    }
   ]
  },
  {
   "id": "m4-l4",
   "title": "Advanced Advertisement and Convergence Tuning",
   "subtitle": "Conditional advertisement, add-path, next-hop tracking, BFD and prefix-independent convergence",
   "minutes": 50,
   "objectives": [
    "Configure and verify conditional advertisement for backup announcements",
    "Use add-path and best-external to restore path diversity",
    "Tune BGP convergence with BFD, next-hop tracking and backup path installation"
   ],
   "blocks": [
    {
     "type": "text",
     "text": "Two problems dominate at expert level once policy is correct: advertising the right thing only when the right condition holds, and converging quickly when something fails. BGP was designed for stability rather than speed, so fast convergence depends on detecting failures outside BGP, reacting to next-hop changes immediately, and keeping backup paths ready in the forwarding plane."
    },
    {
     "type": "callout",
     "kind": "definition",
     "text": "An **advertise-map** names the routes to announce; an **exist-map** or **non-exist-map** names a condition route in the local BGP table. The advertise-map routes are announced only while the condition route exists (exist-map) or does not exist (non-exist-map). Implementations evaluate the condition periodically, often every 60 seconds by default, so failover is not instantaneous.",
     "title": "Conditional advertisement"
    },
    {
     "type": "cli",
     "title": "Backup announcement to a second provider",
     "device": "EDGE2 · IOS-style CLI",
     "lines": [
      "ip prefix-list PL-OUR-BLOCK seq 5 permit 198.51.100.0/24",
      "ip prefix-list PL-ISP1-DEFAULT seq 5 permit 0.0.0.0/0",
      "!",
      "route-map RM-ADVERTISE permit 10",
      " match ip address prefix-list PL-OUR-BLOCK",
      "route-map RM-ISP1-ALIVE permit 10",
      " match ip address prefix-list PL-ISP1-DEFAULT",
      "!",
      "router bgp 64500",
      " neighbor 203.0.113.9 remote-as 64602",
      " address-family ipv4",
      "  neighbor 203.0.113.9 advertise-map RM-ADVERTISE non-exist-map RM-ISP1-ALIVE",
      "!",
      "EDGE2# show ip bgp neighbors 203.0.113.9 | include Condition",
      " Condition-map RM-ISP1-ALIVE, Advertise-map RM-ADVERTISE, status: Withdraw"
     ],
     "note": "Only the primary provider sends a default route, so its presence in the BGP table is a reliable health signal. While it exists, the block is withdrawn from the backup provider. If the condition matched something both providers send, the backup would never be announced."
    },
    {
     "type": "text",
     "text": "**Add-path** (RFC 7911) lets a speaker advertise several paths for the same prefix, each with a path identifier, after both sides negotiate the capability. It restores the diversity that reflection hides, enabling multipath and pre-computed backups on clients. **Best-external** is a lighter alternative: an edge router advertises its best external path to iBGP even when its overall best is an internal path, so the alternative exit stays visible."
    },
    {
     "type": "cli",
     "title": "Add-path from a reflector",
     "device": "RR1 · IOS-style CLI",
     "lines": [
      "router bgp 65000",
      " address-family ipv4",
      "  bgp additional-paths select best 2",
      "  bgp additional-paths send receive",
      "  neighbor RR-CLIENTS advertise additional-paths best 2",
      "!",
      "PE5(config-router-af)# bgp additional-paths receive",
      "PE5(config-router-af)# bgp additional-paths install"
     ],
     "note": "The reflector selects the two best paths and sends both to clients that negotiate the capability. On the client, installing the additional path places a pre-computed backup in the forwarding table so a failed exit can be bypassed without waiting for best-path recalculation."
    },
    {
     "type": "compare",
     "title": "Path diversity options",
     "columns": [
      {
       "title": "Best-external",
       "items": [
        "Configured on edge routers",
        "Advertises the best external path in addition to the overall best",
        "No capability negotiation needed"
       ]
      },
      {
       "title": "Add-path",
       "items": [
        "Several paths per prefix with path identifiers",
        "Must be negotiated on each session",
        "Memory and update cost grow with the number of paths"
       ]
      },
      {
       "title": "Regional reflectors",
       "items": [
        "Reflectors placed close to clients",
        "Each region's best path reflects local exits",
        "No protocol extension needed"
       ]
      }
     ]
    },
    {
     "type": "flow",
     "title": "BGP convergence after an exit failure",
     "items": [
      {
       "label": "Detect",
       "text": "Interface down or BFD declares the eBGP neighbour dead"
      },
      {
       "label": "Invalidate",
       "text": "Next-hop tracking marks the exit's next hop unreachable"
      },
      {
       "label": "Switch",
       "text": "The forwarding plane moves to the pre-installed backup path"
      },
      {
       "label": "Recompute",
       "text": "Best path is recalculated for affected prefixes"
      },
      {
       "label": "Propagate",
       "text": "Updates and withdrawals sent, paced by advertisement intervals"
      }
     ]
    },
    {
     "type": "formula",
     "title": "Convergence arithmetic",
     "items": [
      {
       "name": "Negotiated hold time",
       "expr": "min(local hold time, remote hold time)",
       "meaning": "Without BFD, a silent neighbour failure takes up to this long to detect (default often 180 s)."
      },
      {
       "name": "BFD detection",
       "expr": "multiplier × agreed interval",
       "meaning": "300 ms × 3 = 900 ms replaces a hold time of 180 s."
      },
      {
       "name": "FIB work without shared path lists",
       "expr": "proportional to affected prefixes",
       "meaning": "One million prefixes behind a failed exit means one million updates."
      },
      {
       "name": "FIB work with shared path lists",
       "expr": "one pointer change per shared path list",
       "meaning": "Prefix-independent convergence: the switch time does not grow with table size."
      }
     ]
    },
    {
     "type": "cli",
     "title": "Convergence-oriented session settings",
     "device": "EDGE1 · IOS-style CLI",
     "lines": [
      "router bgp 64500",
      " bgp nexthop trigger delay 0",
      " neighbor 203.0.113.1 remote-as 64601",
      " neighbor 203.0.113.1 fall-over bfd",
      " neighbor 203.0.113.1 timers 10 30",
      "!",
      "interface GigabitEthernet0/0/1",
      " bfd interval 300 min_rx 300 multiplier 3",
      "!",
      "EDGE1# show ip bgp neighbors 203.0.113.1 | include hold|BFD",
      "  Last read 00:00:02, last write 00:00:04, hold time is 30, keepalive interval is 10 seconds",
      "  Neighbor is registered with BFD (interval 300 ms, multiplier 3)"
     ],
     "note": "BFD detects a dead neighbour in under a second and tears the session down; next-hop tracking reacts to IGP changes for internal next hops without delay. The shorter hold time is a safety net for cases BFD cannot see, such as a hung BGP process."
    },
    {
     "type": "callout",
     "kind": "warning",
     "text": "Graceful restart keeps forwarding while a neighbour's control plane restarts. If BFD runs in the control plane, the restart also stops BFD, which then declares the neighbour down and defeats graceful restart. Check whether BFD is independent of the control plane on both sides before combining them, and agree the behaviour with the neighbour.",
     "title": "BFD and graceful restart"
    },
    {
     "type": "scenario",
     "title": "Sessions flap during provider maintenance",
     "situation": "After enabling BFD at 50 ms × 3 on eBGP sessions carried over a provider's layer 2 service, sessions drop several times a month, each for a few seconds, always during the provider's maintenance windows. The provider reports protection switching events of about 200 ms in its network.",
     "options": [
      {
       "text": "Disable BFD and rely on BGP keepalives and the hold timer for failure detection.",
       "feedback": "This removes the flaps but returns detection to tens of seconds for real failures.",
       "best": false
      },
      {
       "text": "Set BFD detection above the provider's switching time, for example 100 ms × 3.",
       "feedback": "Correct. A 150 ms detection time is shorter than the 200 ms the provider needs to switch, so BFD declares failure for an event the transport would recover from. Detection must be slower than the layer below's own protection.",
       "best": true
      },
      {
       "text": "Enable graceful restart so the sessions survive the short BFD-triggered resets.",
       "feedback": "Graceful restart protects against control-plane restarts, not against BFD declaring the path down.",
       "best": false
      },
      {
       "text": "Lower the BGP hold time to 3 seconds so that sessions recover faster after each flap.",
       "feedback": "A shorter hold time adds another fast-failing mechanism without addressing the mismatch with transport protection.",
       "best": false
      }
     ]
    },
    {
     "type": "checklist",
     "title": "Convergence and advertisement review",
     "items": [
      "Conditional advertisement conditions match only the intended signal",
      "Condition evaluation interval known and acceptable",
      "Path diversity strategy deployed where reflection hides exits",
      "BFD detection slower than underlying transport protection",
      "BFD and graceful restart interaction agreed with neighbours",
      "Next-hop tracking enabled and loopbacks prioritised in the IGP",
      "Backup paths installed in the forwarding plane where supported"
     ]
    },
    {
     "type": "terms",
     "items": [
      {
       "term": "Advertise-map",
       "def": "A route-map naming routes whose advertisement depends on a condition."
      },
      {
       "term": "Non-exist-map",
       "def": "A condition that allows advertisement only while the named route is absent."
      },
      {
       "term": "Add-path",
       "def": "A BGP extension (RFC 7911) that advertises several paths per prefix with path identifiers."
      },
      {
       "term": "Best-external",
       "def": "Advertising an edge router's best external path to iBGP even when its overall best path is internal."
      },
      {
       "term": "Next-hop tracking",
       "def": "Event-driven reaction to IGP changes that affect BGP next hops."
      },
      {
       "term": "Prefix-independent convergence",
       "def": "A forwarding design in which prefixes share path lists, so one change repairs all of them."
      },
      {
       "term": "Hold time",
       "def": "The negotiated time after which a silent BGP neighbour is declared down."
      },
      {
       "term": "Graceful restart",
       "def": "A mechanism that preserves forwarding while a neighbour's control plane restarts."
      }
     ]
    },
    {
     "type": "reflection",
     "prompt": "For an exit failure in your network, estimate each phase of BGP convergence today. Which single change would shorten it the most?"
    },
    {
     "type": "quiz",
     "items": [
      {
       "q": "A non-exist-map matches a default route that both providers send. What happens to the backup announcement?",
       "options": [
        "It is always sent, because the condition is evaluated per provider",
        "It is never sent, because the condition route always exists",
        "It is sent only when both providers withdraw the default",
        "It alternates between sent and withdrawn every scan interval"
       ],
       "answer": 1,
       "explain": "With both providers sending the default, the route stays present unless both fail, which defeats the design. The condition must match a signal only the primary sends."
      },
      {
       "q": "What must happen before add-path can be used on a session?",
       "options": [
        "The reflector must use the same cluster ID as all of its clients",
        "Every path must carry a unique route distinguisher value",
        "Both peers must negotiate the add-path capability for the address family",
        "The session must use BFD with the same interval on both sides"
       ],
       "answer": 2,
       "explain": "Add-path is a negotiated capability; without it the extra paths are not sent."
      },
      {
       "q": "Without BFD, how long can it take to detect a silent eBGP neighbour failure with timers 60/180?",
       "options": [
        "Up to 180 seconds",
        "Up to 60 seconds",
        "Up to 30 seconds",
        "Up to 3 seconds"
       ],
       "answer": 0,
       "explain": "Detection relies on the hold time when no faster mechanism exists."
      },
      {
       "q": "What makes convergence independent of the number of prefixes behind a failed exit?",
       "options": [
        "A shorter minimum advertisement interval on every iBGP session",
        "Lower hold timers on every eBGP session at the network edge",
        "Larger update packets that carry more prefixes per message",
        "Shared forwarding path lists with pre-installed backup paths"
       ],
       "answer": 3,
       "explain": "Prefix-independent convergence changes one shared pointer instead of each prefix."
      },
      {
       "q": "BFD at 50 ms × 3 flaps sessions when the transport switches paths in 200 ms. What is the correct fix?",
       "options": [
        "Make BFD detection slower than the transport's switching",
        "Enable graceful restart on both sides of every affected session",
        "Shorten the BGP hold time to match the BFD detection time",
        "Disable next-hop tracking so that failures are processed later"
       ],
       "answer": 0,
       "explain": "Detection above the layer below's protection time avoids false failures."
      }
     ]
    }
   ]
  },
  {
   "id": "m4-l5",
   "title": "BGP Security and Complex Troubleshooting",
   "subtitle": "Session protection, origin validation, route-leak defences and hard cases from real networks",
   "minutes": 50,
   "objectives": [
    "Apply session protections: prefix limits, TTL security and authentication",
    "Deploy RPKI route origin validation safely and interpret validation states",
    "Diagnose complex BGP failures such as MTU-related flaps and route leaks"
   ],
   "blocks": [
    {
     "type": "text",
     "text": "BGP trusts its neighbours by default. Any session can announce any prefix with any path, and the protocol itself cannot tell a legitimate announcement from a mistake or a hijack. Defence is layered: protect the session, constrain what each neighbour may announce, validate origins cryptographically where possible, and mark relationships so leaks are caught."
    },
    {
     "type": "table",
     "title": "Layered BGP protections",
     "head": [
      "Control",
      "Protects against",
      "Mechanism",
      "Caveat"
     ],
     "rows": [
      [
       "Maximum prefix",
       "Full-table leaks, misconfiguration",
       "Limit, warning threshold, optional automatic restart",
       "Too low causes outages during legitimate growth"
      ],
      [
       "TTL security (RFC 5082)",
       "Spoofed packets from distant attackers",
       "Sender uses TTL 255; receiver requires a minimum TTL",
       "Both sides must enable it"
      ],
      [
       "Session authentication",
       "Session hijack and reset attacks",
       "TCP-AO (RFC 5925), or the legacy TCP MD5 option",
       "Key rotation must be planned"
      ],
      [
       "Prefix filtering",
       "Announcements outside a neighbour's address space",
       "Prefix lists built from registry data",
       "Lists must be regenerated as customers change"
      ],
      [
       "Route origin validation (RFC 6811)",
       "Wrong origin AS, many hijacks",
       "Signed ROAs, validated cache, router checks origin and length",
       "Does not validate the rest of the path"
      ],
      [
       "BGP roles and OTC (RFC 9234)",
       "Route leaks between relationships",
       "Roles negotiated in OPEN; Only-to-Customer attribute marks routes",
       "Both sides must support it"
      ]
     ]
    },
    {
     "type": "flow",
     "title": "Route origin validation pipeline",
     "items": [
      {
       "label": "Publish",
       "text": "Resource holders sign ROAs: prefix, maximum length, origin AS"
      },
      {
       "label": "Validate",
       "text": "Relying-party software fetches and validates the RPKI repositories"
      },
      {
       "label": "Distribute",
       "text": "Validated payloads are sent to routers over the RPKI-to-router protocol"
      },
      {
       "label": "Classify",
       "text": "Each route is marked Valid, Invalid or NotFound"
      },
      {
       "label": "Act",
       "text": "Policy drops Invalid and may prefer Valid"
      }
     ]
    },
    {
     "type": "formula",
     "title": "Origin validation logic",
     "items": [
      {
       "name": "Covered",
       "expr": "some validated payload's prefix contains the route's prefix",
       "meaning": "If nothing covers the route, its state is NotFound."
      },
      {
       "name": "Valid",
       "expr": "covered and ∃ payload with origin AS = route origin and route length ≤ maxLength",
       "meaning": "At least one matching authorisation exists."
      },
      {
       "name": "Invalid",
       "expr": "covered but no payload matches both origin AS and length",
       "meaning": "Wrong origin, or too specific for the authorised maximum length."
      }
     ]
    },
    {
     "type": "cli",
     "title": "Session protection and origin validation",
     "device": "EDGE1 · IOS-style CLI",
     "lines": [
      "router bgp 64500",
      " bgp rpki server tcp 192.0.2.50 port 3323 refresh 600",
      " neighbor 203.0.113.1 remote-as 64601",
      " neighbor 203.0.113.1 ttl-security hops 1",
      " ! session authentication configured from a key chain",
      " address-family ipv4",
      "  neighbor 203.0.113.1 activate",
      "  neighbor 203.0.113.1 maximum-prefix 1200 85 restart 15",
      "  neighbor 203.0.113.1 route-map RM-IN-PEER-64601 in",
      "!",
      "route-map RM-IN-PEER-64601 deny 5",
      " match rpki invalid",
      "route-map RM-IN-PEER-64601 permit 10",
      " match ip address prefix-list PL-PEER-64601"
     ],
     "note": "Invalid routes are dropped explicitly instead of relying on a platform default, which differs between implementations. The prefix limit warns at 85% of 1,200 and tears the session down above the limit, retrying after 15 minutes. TTL security means only packets from a directly connected sender are accepted."
    },
    {
     "type": "cli",
     "title": "Monitor-mode validation results",
     "device": "EDGE1 · IOS-style CLI",
     "lines": [
      "EDGE1# show ip bgp 198.51.100.0/24",
      "BGP routing table entry for 198.51.100.0/24, version 991",
      "Paths: (2 available, best #2, table default)",
      "  64601 64777",
      "    203.0.113.1 from 203.0.113.1 (192.0.2.1)",
      "      Origin IGP, localpref 100, valid, external",
      "      RPKI State invalid",
      "  64602 64496",
      "    203.0.113.5 from 203.0.113.5 (192.0.2.5)",
      "      Origin IGP, localpref 100, valid, external, best",
      "      RPKI State valid"
     ],
     "note": "Captured during a monitor-only phase, before invalid routes were dropped. The ROA authorises AS 64496 to originate this prefix, so the path ending in 64777 is invalid: a probable hijack or misconfiguration. Monitoring first shows how much traffic would move and which legitimate routes are invalid because of stale ROAs."
    },
    {
     "type": "table",
     "title": "Complex symptoms and their causes",
     "head": [
      "Symptom",
      "Likely root cause",
      "Proof"
     ],
     "rows": [
      [
       "Session establishes, then drops on hold timer a few minutes later, repeatedly",
       "Path MTU blackhole: keepalives pass, full-size update segments are lost",
       "High TCP retransmissions on the session; DF-bit ping fails at full size"
      ],
      [
       "Routes received but not used by iBGP peers",
       "Next hop of external routes not reachable inside the AS",
       "Peers show the next hop as inaccessible; fix with next-hop-self or IGP"
      ],
      [
       "Network statement does not originate the prefix",
       "No exact prefix and mask match in the routing table",
       "Exact routing-table lookup for the prefix and mask"
      ],
      [
       "Session down after a neighbour's growth",
       "Maximum prefix exceeded",
       "Neighbour log and state showing the prefix limit reason"
      ],
      [
       "Traffic for a major destination enters through a small customer",
       "Customer leaking provider routes, preferred as customer routes",
       "AS path with a provider behind the customer; customer class on the route"
      ]
     ]
    },
    {
     "type": "cli",
     "title": "Session that dies after the initial transfer",
     "device": "R7 · IOS-style CLI",
     "lines": [
      "R7# show ip bgp neighbors 10.0.0.9 | include state|Last reset|segment|Rcvd|Sent",
      "  BGP state = Established, up for 00:02:51",
      "  Last reset 00:03:02, due to BGP Notification sent, hold time expired",
      "Datagrams (max data segment is 1460 bytes):",
      "Rcvd: 812 (out of order: 0), with data: 3, total data bytes: 287",
      "Sent: 24411 (retransmit: 3912, fastretransmit: 0), with data: 24398, total data bytes: 35112934",
      "R7# ping 10.0.0.9 source Loopback0 size 1500 df-bit",
      ".....",
      "Success rate is 0 percent (0/5)"
     ],
     "note": "The peer has acknowledged only a small fraction of the data R7 sent, with thousands of retransmissions of 1460-byte segments, and the session resets on the hold timer every few minutes. Full-size packets do not pass. Fix the path MTU or reduce the maximum segment size, then confirm the session stays up after a full table transfer."
    },
    {
     "type": "case",
     "title": "A national ISP and a leaked full table",
     "context": "A small regional ISP buys transit from a national ISP and from an international carrier. During a router replacement, an engineer applied a template that exported every route to every eBGP neighbour. The regional ISP announced the international carrier's full table to the national ISP. The national ISP classified everything from that session as customer routes with local preference 200, above its peer and transit routes, and propagated them across its network. For about an hour, a large share of the national ISP's traffic to major content networks was drawn through the regional ISP's 10 Gb/s links, which saturated. Some leaked routes were more specific than the originals, because the international carrier carried de-aggregated prefixes from a traffic optimiser.",
     "questions": [
      "Which controls at the national ISP should have stopped the leak?",
      "Which control at the regional ISP failed, and how should export policy be built instead?",
      "Why did the more-specific routes make the incident worse?",
      "What would you do in the first ten minutes if you were on call at the national ISP?"
     ],
     "answer": "At the national ISP: a prefix list built from registry data for the customer cone would have rejected almost all leaked routes; a maximum-prefix limit sized to the customer's real announcement count would have shut the session within seconds; an AS-path filter rejecting known large transit networks behind a small customer, or BGP roles with the Only-to-Customer attribute where supported, would also have caught it. At the regional ISP, export policy was not class-based: routes learned from transit must carry a transit class at ingress and never match an export policy toward another transit. More-specific routes win by longest match regardless of local preference, so they attracted traffic even in networks that would have preferred the original paths. First ten minutes: confirm the leak from AS paths and the customer class, shut or filter the leaking session (a prefix limit or inbound deny to the customer's registered prefixes), verify traffic returns to normal paths, and contact the customer before re-enabling with corrected filters."
    },
    {
     "type": "scenario",
     "title": "A peer starts announcing a full table",
     "situation": "Monitoring shows the prefix count from a small settlement-free peer rising from 300 toward 900,000 within minutes. Your maximum-prefix limit for that peer is 5,000 with a warning at 80%, and the session has just been torn down by the limit. The peer's operations team is not answering.",
     "options": [
      {
       "text": "Keep the session down until the peer confirms the fix, then verify the prefix count.",
       "feedback": "Correct. The limit did its job. Bringing the session back without confirmation risks repeating the leak, and verification afterwards proves the peer's export policy is fixed.",
       "best": true
      },
      {
       "text": "Raise the maximum-prefix limit to one million so the session can come back up immediately.",
       "feedback": "This removes the protection that just prevented a leak and invites the full table into your network.",
       "best": false
      },
      {
       "text": "Configure automatic restart every five minutes so the session recovers on its own when the leak ends.",
       "feedback": "Each restart re-imports the leaked table until the limit trips again, causing repeated churn across your network.",
       "best": false
      },
      {
       "text": "Remove the inbound prefix list so the peer's legitimate routes are accepted faster when it returns.",
       "feedback": "Loosening filters during an active leak increases exposure; the prefix list is part of the defence.",
       "best": false
      }
     ]
    },
    {
     "type": "template",
     "title": "BGP incident triage log",
     "purpose": "Record session and route evidence during a BGP incident so decisions can be reviewed and repeated.",
     "columns": [
      "Time",
      "Session or prefix",
      "Observation",
      "Evidence command",
      "Decision",
      "Owner"
     ],
     "example": [
      [
       "09:14",
       "Peer 192.0.2.77",
       "Prefix count 300 to 4,000 in 3 min",
       "show ip bgp summary",
       "Limit reached; keep down",
       "On-call core"
      ],
      [
       "09:20",
       "198.51.100.0/24",
       "Origin AS 64777, RPKI invalid",
       "show ip bgp 198.51.100.0/24",
       "Already dropped by policy; notify origin owner",
       "Security"
      ]
     ],
     "rows": 8
    },
    {
     "type": "checklist",
     "title": "BGP security baseline",
     "items": [
      "Maximum-prefix limits on every eBGP session, sized from real counts",
      "TTL security on directly connected eBGP sessions",
      "Session authentication with a key rotation plan",
      "Customer prefix lists generated from registry data",
      "Route origin validation deployed, Invalid dropped explicitly",
      "Class-based export preventing transit-to-transit leaks",
      "Roles or equivalent leak detection on supported sessions",
      "Bogon and too-specific filtering on all external sessions"
     ]
    },
    {
     "type": "terms",
     "items": [
      {
       "term": "Maximum prefix",
       "def": "A per-neighbour limit on accepted prefixes that warns or tears down the session when exceeded."
      },
      {
       "term": "TTL security",
       "def": "Generalised TTL Security Mechanism (RFC 5082): accepting only packets with a TTL that proves a nearby sender."
      },
      {
       "term": "TCP-AO",
       "def": "TCP Authentication Option (RFC 5925), the successor to the TCP MD5 signature option for BGP sessions."
      },
      {
       "term": "ROA",
       "def": "Route origin authorisation: a signed statement that an AS may originate a prefix up to a maximum length."
      },
      {
       "term": "Route origin validation",
       "def": "Classifying routes as Valid, Invalid or NotFound against validated ROA data (RFC 6811)."
      },
      {
       "term": "maxLength",
       "def": "The longest prefix length a ROA authorises; more specific announcements are Invalid."
      },
      {
       "term": "Route leak",
       "def": "Propagation of routes beyond their intended scope, such as from one provider to another."
      },
      {
       "term": "Only-to-Customer",
       "def": "An attribute defined with BGP roles (RFC 9234) that marks routes which may only be sent to customers."
      },
      {
       "term": "Path MTU blackhole",
       "def": "Silent loss of full-size packets on a path whose MTU is smaller than expected, with no usable feedback."
      }
     ]
    },
    {
     "type": "reflection",
     "prompt": "Which of the layered BGP protections are missing on the external sessions you know? Rank the gaps by the damage a single misconfigured neighbour could cause today."
    },
    {
     "type": "quiz",
     "items": [
      {
       "q": "A ROA authorises AS 64496 for 198.51.100.0/22 with maxLength 23. A route for 198.51.100.0/24 originated by AS 64496 arrives. What is its state?",
       "options": [
        "Valid, because the origin AS matches the AS in the authorisation",
        "NotFound, because no ROA exists for the exact /24 prefix",
        "Invalid, because it exceeds the authorised maximum length",
        "Valid, because the /24 is fully covered by the authorised /22"
       ],
       "answer": 2,
       "explain": "The route is covered but exceeds maxLength, so no payload matches both origin and length."
      },
      {
       "q": "A session comes up, then drops on hold timer expiry every few minutes, with thousands of retransmissions. What is the most likely cause?",
       "options": [
        "The neighbour's maximum-prefix limit is too low for your table",
        "Full-size TCP segments are lost on a path with a smaller MTU",
        "The neighbours have configured mismatched keepalive intervals",
        "The neighbour rejects your routes because they are RPKI invalid"
       ],
       "answer": 1,
       "explain": "Small keepalives pass while large update segments are dropped, so the hold timer expires."
      },
      {
       "q": "What does TTL security require of a directly connected eBGP neighbour?",
       "options": [
        "It must send BGP packets with TTL 1 so that they cannot leave the link",
        "It must set the IP options field to record the route of each packet",
        "It must send packets with TTL 255, so the arrival TTL proves it is adjacent",
        "It must authenticate every packet with a key derived from the TTL"
       ],
       "answer": 2,
       "explain": "Remote attackers cannot deliver packets with a TTL that high, so they are rejected."
      },
      {
       "q": "Which control would have stopped a small customer leaking a full transit table to you within seconds?",
       "options": [
        "Route origin validation that drops every route marked as NotFound",
        "A maximum-prefix limit sized to the customer's real count",
        "TTL security configured on the customer's eBGP session",
        "Session authentication using TCP-AO on the customer session"
       ],
       "answer": 1,
       "explain": "Leaked routes usually have valid origins and arrive over a legitimate session, so only volume and content controls catch them."
      },
      {
       "q": "Why should Invalid routes be dropped by explicit policy rather than relying on default behaviour?",
       "options": [
        "Default handling of Invalid differs between implementations",
        "Routers always install Invalid routes unless a ROA is published",
        "Explicit policy makes RPKI validation run faster on the router",
        "Invalid routes are dropped automatically only for iBGP sessions"
       ],
       "answer": 0,
       "explain": "Making the action explicit removes ambiguity across platforms and versions."
      }
     ]
    }
   ]
  }
 ]
});
TRACK.exam.push([
 {
  "module": "m1",
  "q": "A task reads: \"R7 must reach 10.80.0.0/16 from its Loopback0 through R3, and the path must survive the loss of the R3–R4 link.\" You configured a cost change and a ping from R7 succeeds. What is the best proof that the task is complete?",
  "options": [
   "A trace from Loopback0 via R3, repeated with the R3–R4 link shut",
   "A ping from R7 to 10.80.0.1 with a repeat count of 1000 and zero loss",
   "The routing table on R7 showing 10.80.0.0/16 with R3 as the next hop",
   "The running configuration on R3 showing the new cost on the right link"
  ],
  "answer": 0,
  "explain": "The task names a source, a path and a failure condition. Only a sourced trace in both the normal and failed state proves all three; the other options prove reachability or intent only."
 },
 {
  "module": "m1",
  "q": "`show ip route 10.20.0.0` on R1 lists two equal-cost next hops, R2 and R3. The task requires traffic from Loopback0 to 10.20.0.10 to use R2. `show ip cef exact-route 10.0.0.1 10.20.0.10` returns `adj out of Gi0/1, addr 10.1.13.3`. What is the correct conclusion?",
  "options": [
   "The task is met because R2 is one of the two installed equal-cost paths",
   "The task is not met because the forwarding hash for that flow selects R3",
   "The task is met because CEF load-shares every flow evenly across both paths",
   "The output is inconclusive until a debug of packet switching is enabled"
  ],
  "answer": 1,
  "explain": "The exact-route lookup shows the forwarding decision for that specific flow, which uses R3. Being one of the installed paths is not the same as carrying the traffic."
 },
 {
  "module": "m1",
  "q": "An iBGP session from R5 to 10.0.0.9 stays in Active. `show ip route 10.0.0.9` returns `% Subnet not in table`, and R5's OSPF database has no router LSA from 10.0.0.9. Where should you look next?",
  "options": [
   "At the BGP update-source configuration on both R5 and R9",
   "At the BGP authentication passwords configured on both of the peers",
   "At the OSPF adjacencies of R9, because its loopback is not reachable",
   "At an access list that may be blocking TCP port 179 on R5"
  ],
  "answer": 2,
  "explain": "No route and no router LSA means the IGP has no knowledge of R9, so BGP cannot even open TCP. The other checks matter only once the peer address is reachable."
 },
 {
  "module": "m1",
  "q": "`debug ip ospf adj` on R2 shows `Nbr 10.0.0.3 has larger interface MTU` and the neighbour is stuck in EXSTART. The task says \"do not change OSPF settings\". What is the best fix?",
  "options": [
   "Configure the router to ignore the MTU in database descriptions",
   "Change the OSPF network type on both ends to point-to-point",
   "Clear the OSPF process on R2 and R3 to restart the exchange",
   "Align the interface MTU on both routers so that they match"
  ],
  "answer": 3,
  "explain": "Ignoring the MTU check is an OSPF setting and hides a real mismatch that can drop large updates. Aligning the MTU fixes the cause without touching OSPF."
 },
 {
  "module": "m1",
  "q": "During a practical lab you have 70 minutes left. Open tasks: a 3-point IGP fault that blocks two BGP tasks worth 6 points in total, and an independent 4-point QoS task. What should you do first?",
  "options": [
   "Fix the IGP fault first; its dependency weight is 9 points",
   "Do the 4-point QoS task, because it is the largest single task left",
   "Do the BGP tasks first, as they are worth more combined than the IGP",
   "Spend the time on a full verification sweep of the completed tasks"
  ],
  "answer": 0,
  "explain": "Dependency weight (3 + 6) exceeds the 4 independent points, and the BGP tasks cannot be proven until the IGP fault is fixed."
 },
 {
  "module": "m1",
  "q": "A traceroute sourced from R1's Loopback0 replies from hops 1 and 2 and then times out at every later hop. All routers on the path have a route to the destination. What is the most likely cause?",
  "options": [
   "The destination network has an MTU smaller than the trace probes",
   "The trace's maximum TTL value is too low for the path length",
   "The third hop has no route back to R1's loopback address",
   "Hop 2 is load-sharing the probes across two separate paths"
  ],
  "answer": 2,
  "explain": "Complete silence from hop 3 onward with intact forward routing indicates the return path to the source is missing at hop 3."
 },
 {
  "module": "m1",
  "q": "A colleague proposes tuning BGP timers to stop sessions that reset a few minutes after establishing. The sessions show thousands of TCP retransmissions and `max data segment is 1460 bytes`. What should you do first?",
  "options": [
   "Lower the keepalive and hold timers so failures are detected sooner",
   "Test the path with a sourced don't-fragment ping at full size",
   "Raise the hold timer so that the sessions survive the slow transfer",
   "Replace the route reflector that serves the affected routers"
  ],
  "answer": 1,
  "explain": "Retransmissions of full-size segments with resets on the hold timer are an MTU signature; the DF-bit test decides it in seconds."
 },
 {
  "module": "m2",
  "q": "`show spanning-tree mst configuration` on a new switch shows `Name [DC-C0RE]` while every other switch uses `DC-CORE`. Its uplinks show the Bound type and one uplink blocks. VLAN 210, allowed only on that uplink, is down. What is the root cause?",
  "options": [
   "The switch's instance 2 priority is lower than the core's priority for that instance",
   "VLAN 210 is not mapped to any instance on the switch and falls back to instance 0",
   "The uplinks are configured as edge ports and therefore ignore received BPDUs",
   "It is in its own region, so all instances follow the CIST role at the boundary"
  ],
  "answer": 3,
  "explain": "A name mismatch creates a separate region. At a region boundary all instances share the CIST port role, so the blocked uplink blocks VLAN 210."
 },
 {
  "module": "m2",
  "q": "`show spanning-tree inconsistentports` on a distribution switch lists `Te1/2/1 Loop Inconsistent` on a fibre uplink that was previously an alternate port. What is the most likely cause?",
  "options": [
   "A downstream switch began sending BPDUs with a superior bridge priority",
   "A host connected to the port while it was configured as an edge port",
   "The port's VLAN allowed list no longer matches the instance mapping",
   "BPDUs stopped arriving, typically because of a unidirectional fault"
  ],
  "answer": 3,
  "explain": "Loop guard blocks a non-designated port when BPDUs stop arriving, which is the classic symptom of one-way fibre failure."
 },
 {
  "module": "m2",
  "q": "After enabling ARP inspection on VLAN 40, `show ip arp inspection statistics vlan 40` shows all drops under DHCP Drops, and logs show invalid ARP from 10.1.40.20, a statically addressed printer. What is the best fix?",
  "options": [
   "Configure the printer's access port as trusted for ARP inspection to stop the drops",
   "Add an ARP ACL or static binding for the printer's MAC and IP address pair",
   "Disable the IP validation check of ARP inspection on VLAN 40 for all ports",
   "Raise the ARP inspection rate limit on the printer's port to a higher value"
  ],
  "answer": 1,
  "explain": "The printer has no DHCP binding. An explicit entry validates it; trusting the port or disabling checks weakens protection for everyone."
 },
 {
  "module": "m2",
  "q": "Clients on an access switch stopped receiving DHCP leases after DHCP snooping was enabled. The uplink is trusted. Packet captures on the distribution relay show requests arriving with option 82 and a gateway address of 0.0.0.0, and no relayed requests leaving. What is the most likely cause?",
  "options": [
   "The relay discards option 82 requests with a zero gateway address",
   "The DHCP snooping rate limit on access ports is dropping the requests",
   "IP source guard on access ports is blocking clients with no address",
   "ARP inspection is dropping the DHCP traffic on the trusted uplink"
  ],
  "answer": 0,
  "explain": "The relay sees option 82 inserted by a non-relay switch and treats the request as untrusted. Disable insertion on the switch or trust option 82 on the relay."
 },
 {
  "module": "m2",
  "q": "`show vrrp brief` on DSW1 shows `Vl10 10 100 ... Master`, and on DSW2 `Vl10 10 100 ... Backup`. DSW1's configured priority is 110 with `track 30 decrement 10`, and its uplink has failed. Traffic still uses DSW1. Why?",
  "options": [
   "Preemption is disabled by default in VRRP, so the backup never takes over",
   "Object tracking only lowers priority after the preemption delay timer expires",
   "The decrement only creates a tie, and a tie does not cause preemption",
   "The backup cannot become master while DSW1 is still sending advertisements"
  ],
  "answer": 2,
  "explain": "A backup preempts only with a strictly higher priority. The decrement must take the master below 100. VRRP preempts by default, so that option is wrong."
 },
 {
  "module": "m2",
  "q": "A multi-chassis pair's peer link and keepalive both ran over the same line card. The card failed, and a downstream switch began seeing MAC flaps and duplicate frames. What state did the pair enter?",
  "options": [
   "Dual-active, with both peers forwarding independently under one LACP identity",
   "Secondary suspended, with all member ports on the secondary peer disabled",
   "Primary isolated, with the secondary taking over all forwarding duties",
   "Normal operation, with the downstream switch failing its LACP hashing"
  ],
  "answer": 0,
  "explain": "With both peer link and keepalive lost, neither peer can tell whether the other is alive, so both act alone with the same system ID."
 },
 {
  "module": "m2",
  "q": "A provider core carries QinQ customers. The core trunk's native VLAN is 500, which is also customer ACME's S-VLAN. ACME reports that traffic arrives in the wrong VLAN at the far site. What is the cause?",
  "options": [
   "The core MTU is too small for the added service tag, so frames are dropped",
   "The TPID of the service tag is 0x8100 rather than 0x88A8 on the core trunk",
   "Layer 2 protocol tunnelling is rewriting the destination MAC of data frames",
   "The outer tag is stripped as native, so the customer tag is misread"
  ],
  "answer": 3,
  "explain": "Native VLAN traffic leaves untagged, so the customer's C-tag becomes the outermost tag and is misread. Tag the native VLAN or avoid it as an S-VLAN."
 },
 {
  "module": "m2",
  "q": "During a storm, `show logging` shows several unrelated hosts flapping between Te1/1/1 and Te1/1/2, and Te1/1/2 receives 11 million packets per second, mostly broadcast. What is the best next action?",
  "options": [
   "Reboot the core switch to rebuild the MAC table and spanning tree state",
   "Shut the link toward the switch behind Te1/1/2 and watch the counters",
   "Enable a debug of spanning tree events to find the looping switch",
   "Raise the storm-control level on Te1/1/2 to protect legitimate traffic"
  ],
  "answer": 1,
  "explain": "A targeted, reversible shutdown contains the loop and confirms its location. Rebooting destroys evidence and debugging a saturated CPU makes things worse."
 },
 {
  "module": "m3",
  "q": "`show ip ospf database external 172.16.50.0` shows the LSA with `Forward Address: 10.7.7.9`. `show ip route 10.7.7.9` returns `% Subnet not in table`. No router installs 172.16.50.0/24. What is the fix?",
  "options": [
   "Change the external metric type of the LSA from type 2 to type 1",
   "Convert the area containing the ASBR into a not-so-stubby area",
   "Make the forwarding address reachable through internal OSPF",
   "Clear the OSPF process on the ASBR to reoriginate the LSA"
  ],
  "answer": 2,
  "explain": "A non-zero forwarding address must resolve through an internal OSPF route; otherwise the LSA is ignored everywhere."
 },
 {
  "module": "m3",
  "q": "A router LSA from R2 shows `LS Seq Number: 80000A3C` and `LS age: 37`. R2 has been up for 20 days. What does this indicate?",
  "options": [
   "R2 has been refreshing its LSA normally every thirty minutes",
   "R2's links have changed far more often than normal refreshing would explain",
   "R2's LSA was flushed recently and then reached MaxAge again",
   "R2 originates its LSA in a different area from the reader"
  ],
  "answer": 1,
  "explain": "20 days of normal refreshing is about 960 instances; over 2,600 means repeated changes. The low age shows a recent new instance."
 },
 {
  "module": "m3",
  "q": "R3 has an inbound distribute-list that removes 10.50.0.0/16 from its routing table. R4, behind R3 in the same area, cannot reach 10.50.0.0/16 and its traces stop at R3. What is the best design fix?",
  "options": [
   "Add the same distribute-list on R4 so that both routers agree on reachability",
   "Increase the cost of the R3 to R4 link so R4 chooses a different exit path",
   "Configure a static default route on R3 toward the backbone for the prefix",
   "Filter the type 3 LSA for the prefix at the area border router instead"
  ],
  "answer": 3,
  "explain": "The distribute-list changes only R3's table, while R4 still computes its path through R3. Filtering at the ABR removes the prefix consistently from the database."
 },
 {
  "module": "m3",
  "q": "`show isis database detail R3.00-00 level-1` shows `ATT/P/OL 1/0/0` and one prefix listed as `IP-Interarea 10.0.0.9/32`. What do these show?",
  "options": [
   "R3 has level 2 connectivity, and 10.0.0.9/32 was leaked from level 2 with the up/down bit set",
   "R3 is overloaded, and 10.0.0.9/32 is an external route redistributed from another protocol",
   "R3 is the DIS for the segment, and 10.0.0.9/32 is the loopback of its pseudonode",
   "R3 uses narrow metrics, and 10.0.0.9/32 is carried in the legacy reachability TLV"
  ],
  "answer": 0,
  "explain": "ATT = 1 means attached to level 2; the inter-area marking shows a leaked prefix with the up/down bit, which is never re-advertised into level 2."
 },
 {
  "module": "m3",
  "q": "`show bfd neighbors detail` on R1 shows: local desired TX 50 ms, required RX 50 ms, multiplier 3; remote desired TX 300 ms, required RX 300 ms, multiplier 3. What is R1's detection time?",
  "options": [
   "150 ms, because the local interval and multiplier are used for detection",
   "450 ms, because the two configured intervals are averaged together",
   "900 ms, because the remote side's 300 ms interval governs detection",
   "300 ms, because detection equals the slower of the two intervals"
  ],
  "answer": 2,
  "explain": "Detection = remote multiplier × max(local required RX, remote desired TX) = 3 × 300 ms."
 },
 {
  "module": "m3",
  "q": "A ring of eight routers runs per-prefix LFA. Coverage reports show about half of the destinations unprotected, and sub-50 ms recovery is required for all of them. What is the best action?",
  "options": [
   "Reduce the BFD interval so failures are detected before traffic is lost",
   "Set the initial SPF delay to zero so new paths are computed immediately",
   "Set every ring link to an equal cost so that more equal-cost paths appear",
   "Deploy remote LFA or TI-LFA for the destinations basic LFA cannot cover"
  ],
  "answer": 3,
  "explain": "Rings defeat basic LFA. Tunnelling to a PQ node or encoding the post-convergence path closes the coverage gap; faster detection or SPF does not create backups."
 },
 {
  "module": "m3",
  "q": "R2 shows 10.20.5.0/24 as `Known via \"ospf 1\", distance 110, type extern 2, Tag 115`, while the prefix also exists natively in IS-IS. Tags are denied correctly on both redistribution routers. What causes the suboptimal path?",
  "options": [
   "The tag value 115 makes R2 prefer the OSPF route by policy over IS-IS",
   "OSPF external distance 110 beats the native IS-IS distance of 115",
   "The OSPF external route has a lower metric than the IS-IS route",
   "R2 is redistributing the prefix back into IS-IS from OSPF"
  ],
  "answer": 1,
  "explain": "Protocols are compared by administrative distance. Raising OSPF external distance above 115 lets the native IS-IS route win."
 },
 {
  "module": "m3",
  "q": "After a merger, a data-centre prefix was removed from IS-IS but stayed reachable for hours in both OSPF and IS-IS, while traffic looped between the two redistribution routers. What would have prevented it?",
  "options": [
   "Raising the OSPF external distance on one of the two redistribution routers only",
   "Setting a higher seed metric for the routes that are redistributed into OSPF",
   "Tags by source domain, with the other domain's tag denied at every point",
   "Enabling BFD on the links between the two redistribution routers"
  ],
  "answer": 2,
  "explain": "The redistributed copies kept each other alive. Tag-based filtering on every redistribution point stops routes returning to their home domain."
 },
 {
  "module": "m4",
  "q": "A route reflector receives a route whose CLUSTER_LIST contains its own cluster ID. Two reflectors serve the same clients with the same cluster ID. What is the consequence for the reflectors?",
  "options": [
   "Each drops the other's reflected copies, so clients must peer with both",
   "Each reflector accepts the other's copies and stores two paths per prefix",
   "Both reflectors stop reflecting routes learned from shared clients",
   "The reflectors replace each other's ORIGINATOR_ID with their own router ID"
  ],
  "answer": 0,
  "explain": "A shared cluster ID makes partner reflections look like loops. That saves memory but makes each client's dual peering essential."
 },
 {
  "module": "m4",
  "q": "`show ip bgp 192.0.2.0/24` shows three iBGP paths with LOCAL_PREF 100 and equal AS-path length: via 10.0.0.7 (AS 64510, MED 50, IGP 20), via 10.0.0.8 (AS 64520, MED 10, IGP 40) and via 10.0.0.9 (AS 64510, MED 0, IGP 50). Deterministic MED is enabled. Which path is best?",
  "options": [
   "Via 10.0.0.9, because it has the lowest MED of all three paths",
   "Via 10.0.0.8, because it beats the AS 64510 winner on IGP metric",
   "Via 10.0.0.7, because it has the lowest IGP metric of all three",
   "No single best, because MEDs from different ASes are incomparable"
  ],
  "answer": 1,
  "explain": "Grouping by AS picks 10.0.0.9 (MED 0) in AS 64510. Against the AS 64520 path MED is not compared, so IGP metric decides: 40 beats 50."
 },
 {
  "module": "m4",
  "q": "A customer tags its prefix with your documented do-not-announce-to-peers community. At the ingress router the route shows the community; at the egress router it shows no communities at all, and the route reaches a peer. What is the root cause?",
  "options": [
   "The egress router's export policy matches on the large-community form",
   "The customer must also attach NO_EXPORT for the signal to be honoured",
   "Reflectors remove all communities that were set by external customers",
   "A session between ingress and egress does not send communities"
  ],
  "answer": 3,
  "explain": "Communities present at ingress and absent at egress were stripped in transit, typically by a session without community sending."
 },
 {
  "module": "m4",
  "q": "You send MED 10 on link A and MED 100 on link B to the same provider, yet inbound traffic prefers link B. The provider confirms both MEDs are received. What is the most effective fix?",
  "options": [
   "Use the provider's community to lower its local preference on link B",
   "Lower the MED on link A to zero so that the difference becomes larger",
   "Advertise more-specific prefixes over link B than over link A",
   "Remove the MED from link B so it is treated as the worst value"
  ],
  "answer": 0,
  "explain": "Local preference in the provider's AS decides before MED. Provider communities act at that earlier step; a missing MED is treated as best by default, not worst."
 },
 {
  "module": "m4",
  "q": "A backup provider session uses `advertise-map RM-ADVERTISE non-exist-map RM-ISP1-ALIVE`, where RM-ISP1-ALIVE matches 0.0.0.0/0. Both providers send a default route. The primary fails, but the backup announcement never appears. Why?",
  "options": [
   "Non-exist-maps only check routes that were learned through iBGP",
   "The advertise-map must match the default route rather than the address block",
   "The default from the backup provider keeps the condition route present",
   "Conditional advertisement requires add-path on the backup session"
  ],
  "answer": 2,
  "explain": "The condition must match a signal only the primary sends. With both sending a default, the condition route never disappears."
 },
 {
  "module": "m4",
  "q": "eBGP sessions with BFD at 50 ms × 3 over a provider layer 2 service drop briefly during the provider's maintenance, which involves protection switching of about 200 ms. What is the best fix?",
  "options": [
   "Enable graceful restart on both sides of every affected session",
   "Raise BFD detection time above the provider's switching time",
   "Remove BFD and lower the BGP hold time to three seconds",
   "Disable next-hop tracking on the routers at both ends of the session"
  ],
  "answer": 1,
  "explain": "Detection must be slower than the protection of the layer below; otherwise BFD reports failures the transport would recover from."
 },
 {
  "module": "m4",
  "q": "A ROA authorises AS 64496 to originate 198.51.100.0/22 with maxLength 22. A route for 198.51.100.0/24 arrives with origin AS 64496. Your policy drops Invalid. What happens?",
  "options": [
   "The route is accepted as Valid, because the origin AS matches the ROA",
   "The route is accepted as NotFound, because no ROA lists the /24",
   "The route is accepted, because covered routes are always Valid",
   "The route is dropped, as it exceeds the authorised maximum length"
  ],
  "answer": 3,
  "explain": "The route is covered but exceeds maxLength, so it is Invalid and dropped. Origin match alone is not enough."
 }
]);
