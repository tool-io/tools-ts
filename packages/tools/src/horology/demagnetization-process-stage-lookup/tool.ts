import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const processEntries = {
  fieldDecay: {
    keyConcern:
      "A demagnetizer is intended to produce a decreasing alternating field; use the equipment's decay cycle rather than an invented time or pass count.",
    stage: "field decay",
  },
  limitations: {
    keyConcern:
      "A watch that is magnetically stuck can still have a separate mechanical fault. Demagnetizing does not diagnose or repair train, escapement, balance, or lubrication defects.",
    stage: "limitations",
  },
  modeSelection: {
    keyConcern:
      "Use a device and mode approved for the caliber and loose-part restrictions. Permanent magnets, sealed magnetic assemblies, and magnetically sensitive components require separate handling.",
    stage: "mode selection",
  },
  passes: {
    keyConcern:
      "There is no universal number of demagnetizing passes; follow the device, material, and service instructions and stop when the required process is complete.",
    stage: "pass count",
  },
  verification: {
    keyConcern:
      "Verify timekeeping and magnetic behavior with suitable test equipment after demagnetization, then address any remaining rate deviation as a separate diagnosis.",
    stage: "verification",
  },
} as const;

export type DemagnetizationFocus = keyof typeof processEntries;

export type DemagnetizationLookupInput = {
  readonly processFocus: DemagnetizationFocus;
};

export type DemagnetizationLookupOutput = {
  readonly keyConcern: string;
  readonly processFocus: DemagnetizationFocus;
  readonly stage: string;
};

export const lookupDemagnetizationProcess = (
  input: DemagnetizationLookupInput,
): DemagnetizationLookupOutput => {
  const entry = processEntries[input.processFocus];
  if (entry === undefined)
    simpleError(
      "processFocus",
      "Demagnetization process focus is not supported.",
      "unsupported_process_focus",
    );
  return {
    keyConcern: entry.keyConcern,
    processFocus: input.processFocus,
    stage: entry.stage,
  };
};

export const demagnetizationProcessExample = {
  input: { processFocus: "passes" },
  output: {
    keyConcern:
      "There is no universal number of demagnetizing passes; follow the device, material, and service instructions and stop when the required process is complete.",
    processFocus: "passes",
    stage: "pass count",
  },
} satisfies ToolExample<
  DemagnetizationLookupInput,
  DemagnetizationLookupOutput
>;

export const demagnetizationProcessTool = createSimpleTool({
  calculate: (input) =>
    lookupDemagnetizationProcess({
      processFocus: input.processFocus as DemagnetizationFocus,
    }),
  description:
    "Return a mode, field-decay, pass-count, verification, or limitation control for watch demagnetization without a universal operating recipe.",
  id: "horology/demagnetization-process-stage-lookup",
  inputs: [
    {
      enum: [
        "modeSelection",
        "fieldDecay",
        "passes",
        "verification",
        "limitations",
      ],
      id: "processFocus",
      kind: "string",
      label: "Demagnetization process focus",
    },
  ],
  outputs: [
    { id: "keyConcern", kind: "string", label: "Process control or concern" },
    {
      id: "processFocus",
      kind: "string",
      label: "Demagnetization process focus",
    },
    { id: "stage", kind: "string", label: "Demagnetization process stage" },
  ],
  title: "Demagnetization Process Stage Lookup",
});

export const runDemagnetizationProcess = demagnetizationProcessTool.execute;
export default demagnetizationProcessTool;
