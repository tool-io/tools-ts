import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const gimbalEntries = {
  bowl: {
    keyDate: "standardized marine chronometer",
    statement:
      "The chronometer movement was fitted into a protective bowl, often with a glass lid, and the bowl was supported in the gimbal assembly.",
  },
  box: {
    keyDate: "marine use",
    statement:
      "The wooden box housed the gimbal, movement bowl, winding key, and locking provisions and could itself be secured for handling or transport.",
  },
  gimbal: {
    keyDate: "marine use",
    statement:
      "Two pivoted rings called gimbals supported the bowl so the chronometer could remain closer to level as the ship rocked.",
  },
  handling: {
    keyDate: "use and transport",
    statement:
      "The gimbal improves orientation aboard ship but does not make the instrument immune to shock, moisture, handling, or enclosure changes.",
  },
  lockCaution: {
    keyDate: "operating state",
    statement:
      "Historical boxes used gimbal locks and box latches to prevent movement or damage in transport; understand the correct locked, use, and service states before handling an original instrument.",
  },
} as const;

export type MarineGimbalFocus = keyof typeof gimbalEntries;

export type MarineGimbalLookupInput = {
  readonly gimbalFocus: MarineGimbalFocus;
};

export type MarineGimbalLookupOutput = {
  readonly gimbalFocus: MarineGimbalFocus;
  readonly keyDate: string;
  readonly verifiedStatement: string;
};

export const lookupMarineChronometerGimbal = (
  input: MarineGimbalLookupInput,
): MarineGimbalLookupOutput => {
  const entry = gimbalEntries[input.gimbalFocus];
  if (entry === undefined)
    simpleError(
      "gimbalFocus",
      "Marine chronometer gimbal focus is not supported.",
      "unsupported_gimbal_focus",
    );
  return {
    gimbalFocus: input.gimbalFocus,
    keyDate: entry.keyDate,
    verifiedStatement: entry.statement,
  };
};

export const marineGimbalExample = {
  input: { gimbalFocus: "gimbal" },
  output: {
    gimbalFocus: "gimbal",
    keyDate: "marine use",
    verifiedStatement:
      "Two pivoted rings called gimbals supported the bowl so the chronometer could remain closer to level as the ship rocked.",
  },
} satisfies ToolExample<MarineGimbalLookupInput, MarineGimbalLookupOutput>;

export const marineGimbalTool = createSimpleTool({
  calculate: (input) =>
    lookupMarineChronometerGimbal({
      gimbalFocus: input.gimbalFocus as MarineGimbalFocus,
    }),
  description:
    "Return the bowl, ring-gimbal, box, handling, or lock-state function of a historical marine chronometer and its carrying case.",
  id: "horology/marine-chronometer-gimbal-purpose-lookup",
  inputs: [
    {
      enum: ["bowl", "gimbal", "box", "handling", "lockCaution"],
      id: "gimbalFocus",
      kind: "string",
      label: "Marine chronometer gimbal focus",
    },
  ],
  outputs: [
    {
      id: "gimbalFocus",
      kind: "string",
      label: "Marine chronometer gimbal focus",
    },
    { id: "keyDate", kind: "string", label: "Marine-use context" },
    {
      id: "verifiedStatement",
      kind: "string",
      label: "Verified gimbal statement",
    },
  ],
  title: "Marine Chronometer Gimbal Purpose Lookup",
});

export const runMarineGimbal = marineGimbalTool.execute;
export default marineGimbalTool;
