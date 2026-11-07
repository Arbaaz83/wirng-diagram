/* Arbaaz's Diagram — demo content data */

const WIRE_COLORS = [
  { code: "RED",   name: "Battery +12V",       hex: "#d92b22", group: "Power" },
  { code: "BLK",   name: "Ground",              hex: "#39414e", group: "Power" },
  { code: "GRN",   name: "Ignition Signal",    hex: "#0f7b3f", group: "Signal" },
  { code: "YEL",   name: "Accessories +12V",   hex: "#c99a00", group: "Power" },
  { code: "ORG",   name: "Ignition Run",        hex: "#cf6b1d", group: "Power" },
  { code: "PNK",   name: "Starter / Power",     hex: "#8e44ad", group: "Power" },
  { code: "BLU",   name: "CAN High (CAN_H)",    hex: "#2b5cc4", group: "Data" },
  { code: "GRY",   name: "CAN Low (CAN_L)",     hex: "#55617a", group: "Data" },
  { code: "BRN",   name: "Signal ±12V",         hex: "#9c5a1e", group: "Data" },
  { code: "PUR",   name: "Switched Power",      hex: "#6b3fa0", group: "Power" },
  { code: "LTH",   name: "Lighting",            hex: "#dfe3ea", group: "Signal" },
];

function wireByCode(code) {
  return WIRE_COLORS.find((c) => c.code === code) || { code: code, name: code, hex: "#888", group: "Other" };
}

const VEHICLES = [
  {
    id: "golf-mk5",
    name: "Golf Mk5",
    make: "Volkswagen",
    model: "Golf",
    years: "2004 – 2013",
    body: "3-door & 5-door hatchback",
    engines: ["2.0 FSI", "2.5 TDI PD"],
    tagline: "The benchmark hot hatch — complete engine harness and body control schematics.",
    diagrams: [
      {
        id: "engine",
        title: "Engine Management & Power Supply",
        system: "Powertrain",
        version: "Original wiring",
        summary: "Battery feed through the ignition switch, engine control unit, sensor bus and module power lines for the 2.0 FSI / 2.5 TDI.",
        canvas: { w: 940, h: 620 },
        components: [
          { id: "bat",    name: "+12V Battery",        x: 64,  y: 250, w: 170, h: 60,  kind: "battery", sub: "Lead-acid · 12V" },
          { id: "gnd",    name: "Chassis Ground",      x: 64,  y: 372, w: 170, h: 60,  kind: "ground",  sub: "Ground strap / body" },
          { id: "ecu",    name: "Engine Control Unit", x: 360, y: 120, w: 180, h: 120, kind: "ecu",     sub: "Bosch MED9 / Marelli" },
          { id: "igsw",   name: "Ignition Switch",     x: 620, y: 380, w: 170, h: 64,  kind: "igswitch", sub: "ACC · IGN · START" },
          { id: "abs",    name: "ABS Module",           x: 620, y: 180, w: 170, h: 60,  kind: "abs",     sub: "Redundant control" },
          { id: "airbag", name: "Airbag Control Unit", x: 620, y: 60,  w: 170, h: 60,  kind: "airbag",  sub: "Supplementary restraint" },
          { id: "fuel",   name: "Fuel Pump Relay",     x: 620, y: 300, w: 170, h: 60,  kind: "relay",   sub: "30A · 40A" },
          { id: "s_maf",  name: "MAF Sensor",          x: 64,  y: 60,  w: 150, h: 60,  kind: "sensor",  sub: "Hot-wire MAF" },
          { id: "s_map",  name: "MAP Sensor",          x: 64,  y: 180, w: 150, h: 60,  kind: "sensor",  sub: "Manifold pressure" },
        ],
        pins: {
          bat: { "+": { x: 228, y: 272 }, "-": { x: 228, y: 296 } },
          gnd: { "0": { x: 228, y: 420 } },
          ecu: { "70": { x: 536, y: 150 }, "30": { x: 536, y: 190 }, "31": { x: 536, y: 230 }, "19": { x: 366, y: 190 }, "20": { x: 366, y: 218 } },
          igsw: { "ACC": { x: 620, y: 396 }, "IGN": { x: 620, y: 424 } },
          abs: { "BAT": { x: 786, y: 200 } },
          airbag: { "BAT": { x: 786, y: 70 } },
          fuel: { "PWR": { x: 786, y: 316 } },
          s_maf: { "OUT": { x: 210, y: 90 } },
          s_map: { "OUT": { x: 210, y: 210 } },
        },
        wires: [
          { id: "g1", from: "bat:+",  to: "ecu:70", code: "RED",  name: "+12V main supply",      gauge: "0.75" },
          { id: "g2", from: "bat:+",  to: "ecu:30", code: "RED",  name: "+12V supply",            gauge: "0.75" },
          { id: "g3", from: "ecu:19", to: "gnd:0",  code: "BLK",  name: "Signal ground",          gauge: "0.5" },
          { id: "g4", from: "ecu:20", to: "gnd:0",  code: "BLK",  name: "Signal ground",          gauge: "0.5" },
          { id: "g5", from: "bat:-",  to: "gnd:0",  code: "BLK",  name: "Battery negative / strap", gauge: "0.5" },
          { id: "g6", from: "bat:+",  to: "abs:BAT", code: "RED",  name: "ABS module power",       gauge: "0.75" },
          { id: "g7", from: "bat:+",  to: "airbag:BAT", code: "RED", name: "Airbag module power",  gauge: "0.75" },
          { id: "g8", from: "bat:+",  to: "fuel:PWR", code: "RED",  name: "Fuel pump power",        gauge: "0.75" },
          { id: "g9", from: "igsw:IGN", to: "ecu:31", code: "ORG", name: "Ignition output",       gauge: "0.5" },
          { id: "g10", from: "bat:+",  to: "igsw:ACC", code: "YEL",  name: "Accessories +12V",      gauge: "0.75" },
          { id: "g11", from: "ecu:31", to: "s_maf:OUT", code: "GRN", name: "MAF signal",            gauge: "0.5" },
          { id: "g12", from: "ecu:31", to: "s_map:OUT", code: "GRN", name: "MAP signal",            gauge: "0.5" },
        ],
        notes: [
          "+12V feed passes through the ignition relay before reaching the ECU pin 70.",
          "Signal grounds (ECU pins 19 / 20) must be low impedance — check the chassis strap.",
          "Battery negative is shared by ABS, airbag and body ground straps.",
        ],
      },
      {
        id: "body",
        title: "Body Control & CAN Bus",
        system: "Body & CAN",
        version: "Original wiring",
        summary: "Power distribution to body modules, CAN bus backbone between control modules.",
        canvas: { w: 940, h: 620 },
        components: [
          { id: "bat",  name: "+12V Battery",        x: 64,  y: 250, w: 170, h: 60,  kind: "battery", sub: "Lead-acid · 12V" },
          { id: "gnd",  name: "Chassis Ground",      x: 64,  y: 372, w: 170, h: 60,  kind: "ground",  sub: "Ground strap / body" },
          { id: "bcm",  name: "Body Control Module", x: 330, y: 140, w: 180, h: 120, kind: "bcm",     sub: "Gateway · LIN bus" },
          { id: "abs",  name: "ABS Module",           x: 620, y: 180, w: 170, h: 60,  kind: "abs",     sub: "Redundant control" },
          { id: "air",  name: "Airbag Control Unit", x: 620, y: 60,  w: 170, h: 60,  kind: "airbag",  sub: "Supplementary restraint" },
          { id: "rad",  name: "Audio / ACC Unit",    x: 620, y: 300, w: 170, h: 60,  kind: "module",  sub: "Stereo & accessories" },
        ],
        pins: {
          bat: { "+": { x: 228, y: 272 }, "-": { x: 228, y: 296 } },
          gnd: { "0": { x: 228, y: 420 } },
          bcm: { "BAT": { x: 506, y: 160 }, "CANH": { x: 506, y: 110 }, "CANL": { x: 506, y: 150 } },
          abs: { "BAT": { x: 786, y: 200 }, "CANH": { x: 786, y: 196 }, "CANL": { x: 700, y: 236 } },
          air: { "BAT": { x: 786, y: 70 }, "CANH": { x: 786, y: 76 }, "CANL": { x: 700, y: 116 } },
          rad: { "BAT": { x: 786, y: 316 } },
        },
        wires: [
          { id: "b1", from: "bat:+",  to: "bcm:BAT", code: "RED",  name: "+12V body supply",       gauge: "0.75" },
          { id: "b2", from: "bat:+",  to: "rad:BAT", code: "RED",  name: "Audio / ACC power",      gauge: "0.75" },
          { id: "b3", from: "bcm:CANH", to: "abs:CANH", code: "BLU", name: "CAN bus high",          gauge: "0.25" },
          { id: "b4", from: "bcm:CANL", to: "abs:CANL", code: "GRY", name: "CAN bus low",           gauge: "0.25" },
          { id: "b5", from: "bcm:CANH", to: "air:CANH", code: "BLU", name: "CAN bus high",          gauge: "0.25" },
          { id: "b6", from: "bcm:CANL", to: "air:CANL", code: "GRY", name: "CAN bus low",           gauge: "0.25" },
        ],
        notes: [
          "CAN_H / CAN_L are a twisted pair routed through the gateway module.",
          "Modules without a CAN interface share the LIN bus (pin 1 of the 25-pin connector).",
        ],
      },
    ],
    procedures: [
      {
        id: "golf-timing-belt",
        vehicleId: "golf-mk5",
        title: "Timing belt service",
        system: "Engine",
        difficulty: "Advanced",
        time: "3 h 40 min",
        tools: ["Timing belt tool", "Tensioner locking tool", "Socket set", "Breaker bar", "Fuel pressure release"],
        summary: "Replace the timing belt on the 2.0 FSI / 2.5 TDI with correct camshaft alignment.",
        steps: [
          { h: "Release fuel system pressure", p: "Depressurize the fuel rail via the Schrader valve before loosening any fitting." },
          { h: "Remove intake manifold and valve cover", p: "Detach the intake manifold, drain oil and remove the valve cover.", torque: "12 N·m" },
          { h: "Release belt tension", p: "Rotate the crankshaft, push the camshaft tensioner against the cam gear and lock it." },
          { h: "Mark alignment and remove belt", p: "Align camshaft marks and remove the old belt without twisting it." },
          { h: "Install new belt and tension", p: "Set the tensioner to specification and rotate the crankshaft two full turns to verify tension." },
          { h: "Rebuild and start", p: "Refit components, fill fluids and crank without fuel before first start." },
        ],
        diagramId: "golf-mk5/engine",
      },
      {
        id: "golf-fuel-pressure",
        vehicleId: "golf-mk5",
        title: "Fuel pressure leak check",
        system: "Engine",
        difficulty: "Basic",
        time: "45 min",
        tools: ["Fuel pressure gauge", "Rags", "Ignition key"],
        summary: "Verify rail pressure after fuel pump relay replacement or intermittent no-pressure codes.",
        steps: [
          { h: "Verify relay and fuse", p: "Check the fuel pump relay, fuse and inertia switch." },
          { h: "Measure rail pressure", p: "Connect the gauge to the Schrader valve and verify ~3.5 bar (50 psi) at key-on." },
          { h: "Leak down test", p: "Hold pressure and inspect for drop within the test window." },
        ],
      },
    ],
  },
  {
    id: "audi-a4-b5",
    name: "A4 (B5)",
    make: "Audi",
    model: "A4",
    years: "1999 – 2001",
    body: "Sedan / wagon",
    engines: ["1.8T AGU", "1.9 TDI"],
    tagline: "Compact executive — 1.8T engine harness with full sensor coverage.",
    diagrams: [
      {
        id: "engine",
        title: "1.8T Engine Management & Power",
        system: "Powertrain",
        version: "Original wiring",
        summary: "Engine control unit feeding the 1.8T: fuel pump, ignition, sensors and ABS / airbag power.",
        canvas: { w: 940, h: 620 },
        components: [
          { id: "bat",    name: "+12V Battery",        x: 64,  y: 250, w: 170, h: 60,  kind: "battery", sub: "Lead-acid · 12V" },
          { id: "gnd",    name: "Chassis Ground",      x: 64,  y: 372, w: 170, h: 60,  kind: "ground",  sub: "Ground strap / body" },
          { id: "ecu",    name: "Engine Control Unit", x: 360, y: 120, w: 180, h: 120, kind: "ecu",     sub: "Bosch MED9 / Marelli" },
          { id: "igsw",   name: "Ignition Switch",     x: 620, y: 380, w: 170, h: 64,  kind: "igswitch", sub: "ACC · IGN · START" },
          { id: "abs",    name: "ABS Module",           x: 620, y: 180, w: 170, h: 60,  kind: "abs",     sub: "Redundant control" },
          { id: "airbag", name: "Airbag Control Unit", x: 620, y: 60,  w: 170, h: 60,  kind: "airbag",  sub: "Supplementary restraint" },
          { id: "fuel",   name: "Fuel Pump Relay",     x: 620, y: 300, w: 170, h: 60,  kind: "relay",   sub: "30A · 40A" },
          { id: "s_maf",  name: "MAF Sensor",          x: 64,  y: 60,  w: 150, h: 60,  kind: "sensor",  sub: "Hot-wire MAF" },
          { id: "s_map",  name: "MAP Sensor",          x: 64,  y: 180, w: 150, h: 60,  kind: "sensor",  sub: "Manifold pressure" },
          { id: "s_tps",  name: "TPS Sensor",          x: 64,  y: 300, w: 150, h: 60,  kind: "sensor",  sub: "Throttle position" },
        ],
        pins: {
          bat: { "+": { x: 228, y: 272 }, "-": { x: 228, y: 296 } },
          gnd: { "0": { x: 228, y: 420 } },
          ecu: { "70": { x: 536, y: 150 }, "30": { x: 536, y: 190 }, "31": { x: 536, y: 230 }, "19": { x: 366, y: 190 }, "20": { x: 366, y: 218 } },
          igsw: { "ACC": { x: 620, y: 396 }, "IGN": { x: 620, y: 424 } },
          abs: { "BAT": { x: 786, y: 200 } },
          airbag: { "BAT": { x: 786, y: 70 } },
          fuel: { "PWR": { x: 786, y: 316 } },
          s_maf: { "OUT": { x: 210, y: 90 } },
          s_map: { "OUT": { x: 210, y: 210 } },
          s_tps: { "OUT": { x: 210, y: 330 } },
        },
        wires: [
          { id: "a1", from: "bat:+",   to: "ecu:70",  code: "RED",  name: "+12V main supply", gauge: "0.75" },
          { id: "a2", from: "bat:+",   to: "ecu:30",  code: "RED",  name: "+12V supply",       gauge: "0.75" },
          { id: "a3", from: "ecu:19",  to: "gnd:0",   code: "BLK",  name: "Signal ground",     gauge: "0.5" },
          { id: "a4", from: "ecu:20",  to: "gnd:0",   code: "BLK",  name: "Signal ground",     gauge: "0.5" },
          { id: "a5", from: "bat:-",   to: "gnd:0",   code: "BLK",  name: "Battery negative / strap", gauge: "0.5" },
          { id: "a6", from: "bat:+",   to: "abs:BAT", code: "RED",  name: "ABS module power",  gauge: "0.75" },
          { id: "a7", from: "bat:+",   to: "airbag:BAT", code: "RED", name: "Airbag module power", gauge: "0.75" },
          { id: "a8", from: "bat:+",   to: "fuel:PWR", code: "RED",  name: "Fuel pump power",   gauge: "0.75" },
          { id: "a9", from: "igsw:IGN", to: "ecu:31", code: "ORG",  name: "Ignition output",   gauge: "0.5" },
          { id: "a10", from: "bat:+",   to: "igsw:ACC", code: "YEL", name: "Accessories +12V", gauge: "0.75" },
          { id: "a11", from: "ecu:31",  to: "s_maf:OUT", code: "GRN", name: "MAF signal",       gauge: "0.5" },
          { id: "a12", from: "ecu:31",  to: "s_map:OUT", code: "GRN", name: "MAP signal",       gauge: "0.5" },
          { id: "a13", from: "ecu:31",  to: "s_tps:OUT", code: "GRN", name: "TPS signal",       gauge: "0.5" },
        ],
        notes: [
          "The 1.8T uses a hot-wire MAF and manifold pressure sensor on the same signal line.",
          "Signal ground through the ECU must be star-grounded to chassis.",
        ],
      },
    ],
    procedures: [
      {
        id: "audi-a4-airbag",
        vehicleId: "audi-a4-b5",
        title: "Airbag warning after battery disconnect",
        system: "Safety · Airbag",
        difficulty: "Intermediate",
        time: "30 min",
        tools: ["OBD scanner", "12V source / battery"],
        summary: "Clear the airbag warning after a battery disconnect on the B5 platform.",
        steps: [
          { h: "Disconnect battery", p: "Remove the negative terminal first and wait at least 3 minutes." },
          { h: "Reconnect and wait", p: "Reconnect in correct order and wait 10 minutes for capacitor discharge." },
          { h: "Clear warning via OBD", p: "Use the diagnostic tool to clear the airbag fault memory." },
          { h: "Verify readiness", p: "Check that all airbag circuits report ready." },
        ],
      },
      {
        id: "audi-a4-ground",
        vehicleId: "audi-a4-b5",
        title: "Engine ground strap replacement",
        system: "Electrical",
        difficulty: "Basic",
        time: "25 min",
        tools: ["Wrench set", "Safety glasses"],
        summary: "Replace the engine-to-chassis ground strap and re-check continuity.",
        steps: [
          { h: "Remove engine cover", p: "Detach the engine grounding strap from the chassis bracket." },
          { h: "Install new strap", p: "Use a new copper braid strap with boot terminals." },
          { h: "Verify continuity", p: "Check strap resistance below 0.05 ohm." },
        ],
      },
    ],
  },
  {
    id: "audi-a3-8p",
    name: "A3 (8P)",
    make: "Audi",
    model: "A3",
    years: "2003 – 2012",
    body: "3-door & 5-door hatchback",
    engines: ["1.8T", "2.0 TDI"],
    tagline: "Compact Audi with 8P electrical architecture and timing-critical belt service.",
    diagrams: [
      {
        id: "engine",
        title: "8P Engine Management & Power",
        system: "Powertrain",
        version: "Original wiring",
        summary: "ECU, fuel pump relay, ignition and sensor network for the 1.8T / 2.0 TDI of the A3 8P.",
        canvas: { w: 940, h: 620 },
        components: [
          { id: "bat",    name: "+12V Battery",        x: 64,  y: 250, w: 170, h: 60,  kind: "battery", sub: "Lead-acid · 12V" },
          { id: "gnd",    name: "Chassis Ground",      x: 64,  y: 372, w: 170, h: 60,  kind: "ground",  sub: "Ground strap / body" },
          { id: "ecu",    name: "Engine Control Unit", x: 360, y: 120, w: 180, h: 120, kind: "ecu",     sub: "Bosch MED9 / Marelli" },
          { id: "igsw",   name: "Ignition Switch",     x: 620, y: 380, w: 170, h: 64,  kind: "igswitch", sub: "ACC · IGN · START" },
          { id: "abs",    name: "ABS Module",           x: 620, y: 180, w: 170, h: 60,  kind: "abs",     sub: "Redundant control" },
          { id: "airbag", name: "Airbag Control Unit", x: 620, y: 60,  w: 170, h: 60,  kind: "airbag",  sub: "Supplementary restraint" },
          { id: "fuel",   name: "Fuel Pump Relay",     x: 620, y: 300, w: 170, h: 60,  kind: "relay",   sub: "30A · 40A" },
          { id: "s_maf",  name: "MAF Sensor",          x: 64,  y: 60,  w: 150, h: 60,  kind: "sensor",  sub: "Hot-wire MAF" },
          { id: "s_map",  name: "MAP Sensor",          x: 64,  y: 180, w: 150, h: 60,  kind: "sensor",  sub: "Manifold pressure" },
          { id: "s_cool", name: "Coolant Temp Sensor", x: 64,  y: 420, w: 150, h: 60,  kind: "sensor",  sub: "NTC thermistor" },
        ],
        pins: {
          bat: { "+": { x: 228, y: 272 }, "-": { x: 228, y: 296 } },
          gnd: { "0": { x: 228, y: 420 } },
          ecu: { "70": { x: 536, y: 150 }, "30": { x: 536, y: 190 }, "31": { x: 536, y: 230 }, "19": { x: 366, y: 190 }, "20": { x: 366, y: 218 } },
          igsw: { "ACC": { x: 620, y: 396 }, "IGN": { x: 620, y: 424 } },
          abs: { "BAT": { x: 786, y: 200 } },
          airbag: { "BAT": { x: 786, y: 70 } },
          fuel: { "PWR": { x: 786, y: 316 } },
          s_maf: { "OUT": { x: 210, y: 90 } },
          s_map: { "OUT": { x: 210, y: 210 } },
          s_cool: { "OUT": { x: 210, y: 450 } },
        },
        wires: [
          { id: "c1", from: "bat:+",   to: "ecu:70",  code: "RED",  name: "+12V main supply", gauge: "0.75" },
          { id: "c2", from: "bat:+",   to: "ecu:30",  code: "RED",  name: "+12V supply",       gauge: "0.75" },
          { id: "c3", from: "ecu:19",  to: "gnd:0",   code: "BLK",  name: "Signal ground",     gauge: "0.5" },
          { id: "c4", from: "ecu:20",  to: "gnd:0",   code: "BLK",  name: "Signal ground",     gauge: "0.5" },
          { id: "c5", from: "bat:-",   to: "gnd:0",   code: "BLK",  name: "Battery negative / strap", gauge: "0.5" },
          { id: "c6", from: "bat:+",   to: "abs:BAT", code: "RED",  name: "ABS module power",  gauge: "0.75" },
          { id: "c7", from: "bat:+",   to: "airbag:BAT", code: "RED", name: "Airbag module power", gauge: "0.75" },
          { id: "c8", from: "bat:+",   to: "fuel:PWR", code: "RED",  name: "Fuel pump power",   gauge: "0.75" },
          { id: "c9", from: "igsw:IGN", to: "ecu:31", code: "ORG",  name: "Ignition output",   gauge: "0.5" },
          { id: "c10", from: "bat:+",   to: "igsw:ACC", code: "YEL", name: "Accessories +12V", gauge: "0.75" },
          { id: "c11", from: "ecu:31",  to: "s_maf:OUT", code: "GRN", name: "MAF signal",       gauge: "0.5" },
          { id: "c12", from: "ecu:31",  to: "s_map:OUT", code: "GRN", name: "MAP signal",       gauge: "0.5" },
          { id: "c13", from: "ecu:31",  to: "s_cool:OUT", code: "GRN", name: "Coolant temp signal", gauge: "0.5" },
        ],
        notes: [
          "The 8P ECU reads the NTC coolant temperature sensor for fan control.",
          "Signal ground (pins 19 / 20) must be low impedance — clean the chassis strap.",
        ],
      },
    ],
    procedures: [
      {
        id: "audi-a3-timing",
        vehicleId: "audi-a3-8p",
        title: "Timing belt replacement",
        system: "Engine",
        difficulty: "Advanced",
        time: "4 h 10 min",
        tools: ["Timing belt tool", "Tensioner locking tool", "Socket set", "Breaker bar", "Fuel release"],
        summary: "Replace the double-clutch style timing belt on the 8P with exact mark alignment.",
        steps: [
          { h: "Release fuel system pressure", p: "Depressurize the fuel rail via the Schrader valve." },
          { h: "Remove covers and components", p: "Remove valve cover, intake manifold and exhaust components." },
          { h: "Lock camshaft tensioner", p: "Push the tensioner against the cam gear and lock it.", torque: "27 N·m" },
          { h: "Mark and remove belt", p: "Align timing marks and remove the old belt." },
          { h: "Set tension and install", p: "Set the new belt tension per specification and rotate two turns to verify." },
        ],
      },
    ],
  },
  {
    id: "skoda-octavia-mk3",
    name: "Octavia Mk3",
    make: "Skoda",
    model: "Octavia",
    years: "2005 – 2013",
    body: "Hatchback / wagon",
    engines: ["1.8 TSI / 2.0 TDI"],
    tagline: "Value hatchback — diesel sensor network and ground strap focus.",
    diagrams: [
      {
        id: "engine",
        title: "2.0 TDI Engine Management & Power",
        system: "Powertrain",
        version: "Original wiring",
        summary: "ECU feed, glow plug circuit and sensor lines for the 2.0 TDI PD engine.",
        canvas: { w: 940, h: 620 },
        components: [
          { id: "bat",    name: "+12V Battery",        x: 64,  y: 250, w: 170, h: 60,  kind: "battery", sub: "Lead-acid · 12V" },
          { id: "gnd",    name: "Chassis Ground",      x: 64,  y: 372, w: 170, h: 60,  kind: "ground",  sub: "Ground strap / body" },
          { id: "ecu",    name: "Engine Control Unit", x: 360, y: 120, w: 180, h: 120, kind: "ecu",     sub: "Bosch MED9 / Marelli" },
          { id: "igsw",   name: "Ignition Switch",     x: 620, y: 380, w: 170, h: 64,  kind: "igswitch", sub: "ACC · IGN · START" },
          { id: "abs",    name: "ABS Module",           x: 620, y: 180, w: 170, h: 60,  kind: "abs",     sub: "Redundant control" },
          { id: "airbag", name: "Airbag Control Unit", x: 620, y: 60,  w: 170, h: 60,  kind: "airbag",  sub: "Supplementary restraint" },
          { id: "fuel",   name: "Fuel Pump Relay",     x: 620, y: 300, w: 170, h: 60,  kind: "relay",   sub: "30A · 40A" },
          { id: "s_maf",  name: "MAF Sensor",          x: 64,  y: 60,  w: 150, h: 60,  kind: "sensor",  sub: "Hot-wire MAF" },
          { id: "s_map",  name: "MAP Sensor",          x: 64,  y: 180, w: 150, h: 60,  kind: "sensor",  sub: "Manifold pressure" },
          { id: "s_gls",  name: "Glow Plug Relay",     x: 64,  y: 420, w: 170, h: 60,  kind: "relay",   sub: "Diesel heater" },
        ],
        pins: {
          bat: { "+": { x: 228, y: 272 }, "-": { x: 228, y: 296 } },
          gnd: { "0": { x: 228, y: 420 } },
          ecu: { "70": { x: 536, y: 150 }, "30": { x: 536, y: 190 }, "31": { x: 536, y: 230 }, "19": { x: 366, y: 190 }, "20": { x: 366, y: 218 } },
          igsw: { "ACC": { x: 620, y: 396 }, "IGN": { x: 620, y: 424 } },
          abs: { "BAT": { x: 786, y: 200 } },
          airbag: { "BAT": { x: 786, y: 70 } },
          fuel: { "PWR": { x: 786, y: 316 } },
          s_maf: { "OUT": { x: 210, y: 90 } },
          s_map: { "OUT": { x: 210, y: 210 } },
          s_gls: { "OUT": { x: 210, y: 450 } },
        },
        wires: [
          { id: "s1", from: "bat:+",   to: "ecu:70",  code: "RED",  name: "+12V main supply", gauge: "0.75" },
          { id: "s2", from: "bat:+",   to: "ecu:30",  code: "RED",  name: "+12V supply",       gauge: "0.75" },
          { id: "s3", from: "ecu:19",  to: "gnd:0",   code: "BLK",  name: "Signal ground",     gauge: "0.5" },
          { id: "s4", from: "ecu:20",  to: "gnd:0",   code: "BLK",  name: "Signal ground",     gauge: "0.5" },
          { id: "s5", from: "bat:-",   to: "gnd:0",   code: "BLK",  name: "Battery negative / strap", gauge: "0.5" },
          { id: "s6", from: "bat:+",   to: "abs:BAT", code: "RED",  name: "ABS module power",  gauge: "0.75" },
          { id: "s7", from: "bat:+",   to: "airbag:BAT", code: "RED", name: "Airbag module power", gauge: "0.75" },
          { id: "s8", from: "bat:+",   to: "fuel:PWR", code: "RED",  name: "Fuel pump power",   gauge: "0.75" },
          { id: "s9", from: "igsw:IGN", to: "ecu:31", code: "ORG",  name: "Ignition output",   gauge: "0.5" },
          { id: "s10", from: "bat:+",   to: "igsw:ACC", code: "YEL", name: "Accessories +12V", gauge: "0.75" },
          { id: "s11", from: "ecu:31",  to: "s_maf:OUT", code: "GRN", name: "MAF signal",       gauge: "0.5" },
          { id: "s12", from: "ecu:31",  to: "s_map:OUT", code: "GRN", name: "MAP signal",       gauge: "0.5" },
          { id: "s13", from: "ecu:31",  to: "s_gls:OUT", code: "GRN", name: "Glow plug circuit", gauge: "0.5" },
        ],
        notes: [
          "Glow plug relay output is pulsed by the ECU on cold start.",
          "Battery negative is shared by ABS, airbag and body ground straps.",
        ],
      },
    ],
    procedures: [
      {
        id: "skoda-ground",
        vehicleId: "skoda-octavia-mk3",
        title: "Engine ground & isolation check",
        system: "Electrical",
        difficulty: "Basic",
        time: "25 min",
        tools: ["Multimeter", "Wrench set"],
        summary: "Verify engine ground strap continuity and isolation between battery and chassis.",
        steps: [
          { h: "Inspect ground strap", p: "Check for corrosion, broken braid or missing boot terminals." },
          { h: "Measure continuity", p: "Measure between engine ground point and chassis negative (< 0.05 ohm)." },
          { h: "Isolate battery", p: "Lift the battery negative terminal and check for parasitic drain after modules sleep." },
        ],
      },
    ],
  },
];

function getVehicle(id) { return VEHICLES.find((v) => v.id === id) || null; }
function getDiagram(vid, did) {
  const v = getVehicle(vid);
  if (!v) return null;
  return (v.diagrams || []).find((d) => d.id === did) || null;
}
function getProcedures(vid) { return (getVehicle(vid)?.procedures || []); }

const ALL_DIAGRAMS = [];
VEHICLES.forEach((v) => (v.diagrams || []).forEach((d) => ALL_DIAGRAMS.push({ ...d, vehicleId: v.id, vehicle: v })));
const ALL_PROCEDURES = [];
VEHICLES.forEach((v) => (v.procedures || []).forEach((p) => ALL_PROCEDURES.push({ ...p, vehicleId: v.id, vehicle: v })));

const TPI_DB = [
  { id: "tpi-1", vehicleId: "golf-mk5", code: "P0300", title: "Random / multiple cylinder misfire", system: "Engine", protocol: "VAG TIS", description: "Misfire detected across multiple cylinders. Check ignition coils, fuel pressure and compression." },
  { id: "tpi-2", vehicleId: "golf-mk5", code: "P0171", title: "System too lean", system: "Fuel", protocol: "VAG TIS", description: "Fuel trim above threshold. Check MAF signal, fuel pressure and vacuum leaks." },
  { id: "tpi-3", vehicleId: "audi-a4-b5", code: "P0400", title: "Turbocharger boost leak", system: "Engine", protocol: "VAG TIS", description: "Boost pressure leak detected. Inspect intercooler and charge hoses." },
  { id: "tpi-4", vehicleId: "audi-a3-8p", code: "P0455", title: "EVAP system large leak", system: "Fuel", protocol: "VAG TIS", description: "Large EVAP leak detected. Check purge valve and fuel cap seal." },
  { id: "tpi-5", vehicleId: "skoda-octavia-mk3", code: "P0087", title: "Fuel rail pressure low", system: "Fuel", protocol: "VAG TIS", description: "Fuel rail pressure below threshold. Check fuel pump relay and pressure regulator." },
];

function getTpi(id) { return TPI_DB.find((t) => t.id === id) || null; }
function searchTpi(q) {
  const query = (q || "").trim().toLowerCase();
  if (!query) return [];
  return TPI_DB.filter((t) => [t.code, t.title, t.system, t.description, t.protocol].join(" ").toLowerCase().includes(query));
}

function searchAll(q) {
  const query = (q || "").trim().toLowerCase();
  if (!query) return { diagrams: [], procedures: [] };
  const diagrams = [], procedures = [];
  ALL_DIAGRAMS.forEach((d) => {
    const v = d.vehicle || getVehicle(d.vehicleId);
    const hay = [d.title, d.system, d.version, d.summary, v ? v.name + " " + v.make + " " + v.model : "", ...(d.components || []).map((c) => c.name + " " + (c.sub || "")), ...(d.wires || []).map((w) => w.name + " " + w.code), ...(d.notes || [])].join(" ").toLowerCase();
    if (hay.includes(query)) diagrams.push(d);
  });
  ALL_PROCEDURES.forEach((p) => {
    const v = p.vehicle || getVehicle(p.vehicleId);
    const hay = [p.title, p.system, p.summary, v ? v.name + " " + v.make + " " + v.model : "", ...(p.steps || []).map((s) => s.h + " " + s.p)].join(" ").toLowerCase();
    if (hay.includes(query)) procedures.push(p);
  });
  return { diagrams: diagrams.slice(0, 12), procedures: procedures.slice(0, 12) };
}
