import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const processEntries = {
  cnc: {
    keyDate: "modern manufacturing",
    statement:
      "CNC machining uses programmed tool paths for repeatable positioning, geometry, and production; machine capability still requires fixtures, tool condition, programming, and metrology.",
  },
  hybrid: {
    keyDate: "current workshop practice",
    statement:
      "Many workflows combine CNC roughing or repeat machining with hand fitting and finishing, especially for complex watch bridges and bevels.",
  },
  manualLathe: {
    keyDate: "traditional production",
    statement:
      "Manual lathe work depends on the operator's setup, tool control, feeds, and inspection; manually operated does not mean less dimensional control or lower precision.",
  },
  materialCaution: {
    keyDate: "material-specific",
    statement:
      "Tool wear, work hardening, grain, burrs, and finishing response change with alloy, geometry, and heat treatment, so process comparisons must be part-specific.",
  },
  qualityComparison: {
    keyDate: "inspection-dependent",
    statement:
      "CNC and hand production are not quality categories. Compare each finished part to the drawing, tolerances, surface intent, and inspection evidence.",
  },
} as const;

export type CncHandLatheFocus = keyof typeof processEntries;

export type CncHandLatheLookupInput = {
  readonly processFocus: CncHandLatheFocus;
};

export type CncHandLatheLookupOutput = {
  readonly keyDate: string;
  readonly processFocus: CncHandLatheFocus;
  readonly verifiedStatement: string;
};

export const lookupCncManualLatheWatchmaking = (
  input: CncHandLatheLookupInput,
): CncHandLatheLookupOutput => {
  const entry = processEntries[input.processFocus];
  if (entry === undefined)
    simpleError(
      "processFocus",
      "CNC or manual-lathe focus is not supported.",
      "unsupported_process_focus",
    );
  return {
    keyDate: entry.keyDate,
    processFocus: input.processFocus,
    verifiedStatement: entry.statement,
  };
};

export const cncHandLatheExample = {
  input: { processFocus: "qualityComparison" },
  output: {
    keyDate: "inspection-dependent",
    processFocus: "qualityComparison",
    verifiedStatement:
      "CNC and hand production are not quality categories. Compare each finished part to the drawing, tolerances, surface intent, and inspection evidence.",
  },
} satisfies ToolExample<CncHandLatheLookupInput, CncHandLatheLookupOutput>;

export const cncHandLatheTool = createSimpleTool({
  calculate: (input) =>
    lookupCncManualLatheWatchmaking({
      processFocus: input.processFocus as CncHandLatheFocus,
    }),
  description:
    "Compare CNC, manual-lathe, hybrid, inspection, and material-process facts in watchmaking without treating hand or machine production as an automatic quality ranking.",
  id: "horology/cnc-manual-lathe-watchmaking-lookup",
  inputs: [
    {
      enum: [
        "cnc",
        "manualLathe",
        "hybrid",
        "qualityComparison",
        "materialCaution",
      ],
      id: "processFocus",
      kind: "string",
      label: "CNC versus manual-lathe process focus",
    },
  ],
  outputs: [
    { id: "keyDate", kind: "string", label: "Process context" },
    {
      id: "processFocus",
      kind: "string",
      label: "CNC versus manual-lathe process focus",
    },
    {
      id: "verifiedStatement",
      kind: "string",
      label: "Verified watchmaking-process statement",
    },
  ],
  title: "CNC Manual Lathe Watchmaking Lookup",
});

export const runCncHandLathe = cncHandLatheTool.execute;
export default cncHandLatheTool;
