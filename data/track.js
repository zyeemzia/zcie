window.TRACK = window.TRACK || { modules: [], exam: [] };
TRACK.meta = {
  "code": "ZCIE",
  "brand": "ZyeemZia™",
  "name": "Certified Internetwork Expert",
  "full": "ZyeemZia™ Certified Internetwork Expert",
  "short": "ZCIE",
  "domain": "zcie.zyeemzia.com",
  "pdf": "ZCIE-Book.pdf",
  "storeKey": "zcie.v1",
  "tagline": "Master the network. Prove it under pressure.",
  "lead": "An expert-level certification for senior engineers: methodical troubleshooting at speed, Layer 2 at scale, IGP and BGP mastery, MPLS and segment routing, EVPN fabrics and SD-WAN, multicast and QoS, and expert automation, rehearsed with full mock labs.",
  "signature": {
    "type": "loop",
    "name": "The ZCIE Mastery Ring",
    "centerSub": "Mastery Ring",
    "caption": "Eight disciplines an internetwork expert keeps sharp in a continuous loop: method, Layer 2, IGP, BGP, labels, fabrics, streams and code. Experts never finish the ring; they keep going round it."
  },
  "hours": "150–200",
  "level": "Expert",
  "audience": [
    "Senior network engineers and architects",
    "Service-provider and data-centre engineers",
    "ZCNP-level professionals aiming for expert status",
    "Technical leads for complex migrations"
  ],
  "passMark": 85,
  "distinctionMark": 92,
  "examSize": 45,
  "examMinutes": 90,
  "capstone": {
    "title": "Capstone: Expert mock lab across the Mastery Ring",
    "brief": "Build and document a full expert lab for a fictional national carrier and enterprise: an IS-IS/OSPF core with BGP route reflection, an MPLS L3VPN or SR-MPLS backbone, an EVPN data-centre fabric, multicast IPTV, an end-to-end QoS policy and automated verification. Then break and fix it under time pressure.",
    "deliverables": [
      "Lab topology and addressing for 15+ nodes",
      "IGP design with fast convergence (BFD, LFA/TI-LFA)",
      "BGP route-reflection and community policy framework",
      "MPLS L3VPN or SR-MPLS service for three customers",
      "VXLAN EVPN fabric with anycast gateway",
      "Multicast (PIM-SM/SSM) service with RP redundancy",
      "End-to-end QoS policy and validation",
      "Automated verification suite (Python/Ansible/templating)",
      "Timed troubleshooting log: 8 faults found and fixed",
      "Executive summary and lessons learned"
    ],
    "rubric": [
      {
        "criterion": "Methodology",
        "levels": [
          "Trial and error",
          "Structured",
          "Fast, evidence-based, documented"
        ]
      },
      {
        "criterion": "Layer 2",
        "levels": [
          "Unstable",
          "Stable and protected",
          "Optimised with forensics ready"
        ]
      },
      {
        "criterion": "IGP",
        "levels": [
          "Converges slowly",
          "Correct design",
          "Sub-second convergence proven"
        ]
      },
      {
        "criterion": "BGP",
        "levels": [
          "Peering only",
          "Policy framework",
          "Scalable, secure, deterministic"
        ]
      },
      {
        "criterion": "MPLS/SR",
        "levels": [
          "Partial",
          "Working VPNs",
          "Optimised paths and TE"
        ]
      },
      {
        "criterion": "Fabric",
        "levels": [
          "Not built",
          "Working EVPN",
          "Multihomed, verified, documented"
        ]
      },
      {
        "criterion": "Multicast & QoS",
        "levels": [
          "Missing",
          "Working",
          "Validated under load"
        ]
      },
      {
        "criterion": "Automation",
        "levels": [
          "Manual",
          "Scripted config",
          "Automated verification and rollback"
        ]
      }
    ]
  },
  "certificate": {
    "title": "Certificate of Achievement",
    "statement": "has successfully completed all modules of the ZyeemZia™ Certified Internetwork Expert track and passed the ZCIE certification exam",
    "skills": [
      "Expert troubleshooting",
      "IGP & BGP mastery",
      "MPLS & segment routing",
      "EVPN fabrics & SD-WAN",
      "Multicast, QoS & automation"
    ]
  },
  "disclaimer": "ZCIE is an independent certification programme created and issued by ZyeemZia. It is not affiliated with, endorsed by, sponsored by or equivalent to any certification from Cisco Systems, Inc. (including CCNA®, CCNP®, CCIE® and CCDE®) or from any other vendor or certifying body. All product names and trademarks belong to their respective owners. Configuration examples use widely taught, vendor-neutral style syntax.",
  "studyPlan": [
    [
      "Month 1",
      "m1 Method · m2 Layer2",
      "Lab build, methodology drills"
    ],
    [
      "Month 2",
      "m3 IGP",
      "IS-IS/OSPF deep labs, convergence"
    ],
    [
      "Month 3",
      "m4 BGP",
      "Route reflection, policy, security"
    ],
    [
      "Month 4",
      "m5 Label",
      "L3VPN, SR-MPLS labs"
    ],
    [
      "Month 5",
      "m6 Fabric",
      "EVPN and SD-WAN labs"
    ],
    [
      "Month 6",
      "m7 Stream",
      "Multicast and QoS labs"
    ],
    [
      "Month 7",
      "m8 Code",
      "Automation, mock labs"
    ],
    [
      "Month 8",
      "Capstone",
      "Full timed mock lab, certification exam"
    ]
  ]
};
