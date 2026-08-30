import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const cycleEntries = {
  bathAndBasket: {
    keyConcern:
      "Do not let parts touch the tank bottom; use the equipment's compatible basket, tray, beaker, or suspension arrangement.",
    stage: "bath and basket",
  },
  cleaning: {
    keyConcern:
      "Use a cleaning medium approved for the movement parts, tank, and process; degas and run the equipment-specific program before introducing parts.",
    stage: "cleaning",
  },
  cycleSettings: {
    keyConcern:
      "There is no universal watch-movement time, temperature, or power setting; derive the cycle from the equipment, cleaner, load, and material instructions.",
    stage: "cycle settings",
  },
  dry: {
    keyConcern:
      "After rinsing, dry with a clean method appropriate to the part; inspect for trapped moisture before lubrication or reassembly.",
    stage: "drying",
  },
  partCompatibility: {
    keyConcern:
      "Check every part and material for ultrasonic compatibility. Sealed, liquid-filled, electronic, glued, or otherwise excluded components require another method.",
    stage: "part compatibility",
  },
  rinse: {
    keyConcern:
      "Rinse with fresh compatible fluid until cleaning residues are removed; do not carry cleaning solution into lubrication or assembly.",
    stage: "rinsing",
  },
} as const;

export type UltrasonicCycleFocus = keyof typeof cycleEntries;

export type UltrasonicCycleLookupInput = {
  readonly cycleFocus: UltrasonicCycleFocus;
};

export type UltrasonicCycleLookupOutput = {
  readonly cycleFocus: UltrasonicCycleFocus;
  readonly keyConcern: string;
  readonly stage: string;
};

export const lookupUltrasonicWatchPartsCycle = (
  input: UltrasonicCycleLookupInput,
): UltrasonicCycleLookupOutput => {
  const entry = cycleEntries[input.cycleFocus];
  if (entry === undefined)
    simpleError(
      "cycleFocus",
      "Ultrasonic cycle focus is not supported.",
      "unsupported_cycle_focus",
    );
  return {
    cycleFocus: input.cycleFocus,
    keyConcern: entry.keyConcern,
    stage: entry.stage,
  };
};

export const ultrasonicCycleExample = {
  input: { cycleFocus: "cycleSettings" },
  output: {
    cycleFocus: "cycleSettings",
    keyConcern:
      "There is no universal watch-movement time, temperature, or power setting; derive the cycle from the equipment, cleaner, load, and material instructions.",
    stage: "cycle settings",
  },
} satisfies ToolExample<
  UltrasonicCycleLookupInput,
  UltrasonicCycleLookupOutput
>;

export const ultrasonicCycleTool = createSimpleTool({
  calculate: (input) =>
    lookupUltrasonicWatchPartsCycle({
      cycleFocus: input.cycleFocus as UltrasonicCycleFocus,
    }),
  description:
    "Return a compatibility, bath, cleaning, rinse, dry, or cycle-setting control for ultrasonic watch-parts cleaning without inventing fixed process settings.",
  id: "horology/ultrasonic-watch-parts-cycle-stage-lookup",
  inputs: [
    {
      enum: [
        "partCompatibility",
        "bathAndBasket",
        "cleaning",
        "rinse",
        "dry",
        "cycleSettings",
      ],
      id: "cycleFocus",
      kind: "string",
      label: "Ultrasonic watch-parts cycle focus",
    },
  ],
  outputs: [
    {
      id: "cycleFocus",
      kind: "string",
      label: "Ultrasonic watch-parts cycle focus",
    },
    { id: "keyConcern", kind: "string", label: "Stage control or concern" },
    { id: "stage", kind: "string", label: "Cleaning stage" },
  ],
  title: "Ultrasonic Watch Parts Cycle Stage Lookup",
});

export const runUltrasonicCycle = ultrasonicCycleTool.execute;
export default ultrasonicCycleTool;
