import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const specificationEntries = {
  activeDocument: {
    keyDate: "MIL-PRF-46374, 11 August 2022",
    statement:
      "DLA lists MIL-PRF-46374 as the active performance specification titled Watch, Wrist: General Purpose.",
  },
  historicalName: {
    keyDate: "MIL-W-46374",
    statement:
      "Many field watches carry the historical MIL-W-46374 name; MIL-W-46374G was superseded by MIL-PRF-46374G, and the current active document is MIL-PRF-46374.",
  },
  lowLightUse: {
    keyDate: "current scope",
    statement:
      "The current scope covers analog wristwatches for continuous reading without wearer action for more than eight hours in low or no light.",
  },
  seriesCaution: {
    keyDate: "model attribution",
    statement:
      "A watch marketed as MIL-W or MIL-PRF-46374 still needs revision, type, class, manufacturer, date, and documentation checks; a dial reference alone is not complete compliance evidence.",
  },
  watchmaker: {
    keyDate: "government and contractor",
    statement:
      "The specification is a government performance document, not a consumer badge that makes every modern field watch interchangeable or automatically authentic.",
  },
} as const;

export type MilPrf46374Focus = keyof typeof specificationEntries;

export type MilPrf46374LookupInput = {
  readonly specificationFocus: MilPrf46374Focus;
};

export type MilPrf46374LookupOutput = {
  readonly keyDate: string;
  readonly specificationFocus: MilPrf46374Focus;
  readonly verifiedStatement: string;
};

export const lookupMilPrf46374Specification = (
  input: MilPrf46374LookupInput,
): MilPrf46374LookupOutput => {
  const entry = specificationEntries[input.specificationFocus];
  if (entry === undefined)
    simpleError(
      "specificationFocus",
      "MIL-PRF-46374 specification focus is not supported.",
      "unsupported_specification_focus",
    );
  return {
    keyDate: entry.keyDate,
    specificationFocus: input.specificationFocus,
    verifiedStatement: entry.statement,
  };
};

export const milPrf46374Example = {
  input: { specificationFocus: "activeDocument" },
  output: {
    keyDate: "MIL-PRF-46374, 11 August 2022",
    specificationFocus: "activeDocument",
    verifiedStatement:
      "DLA lists MIL-PRF-46374 as the active performance specification titled Watch, Wrist: General Purpose.",
  },
} satisfies ToolExample<MilPrf46374LookupInput, MilPrf46374LookupOutput>;

export const milPrf46374Tool = createSimpleTool({
  calculate: (input) =>
    lookupMilPrf46374Specification({
      specificationFocus: input.specificationFocus as MilPrf46374Focus,
    }),
  description:
    "Return the active DLA status, historical MIL-W name, low-light scope, or attribution cautions for the general-purpose field-watch specification.",
  id: "horology/mil-prf-46374-field-watch-specification-lookup",
  inputs: [
    {
      enum: [
        "activeDocument",
        "historicalName",
        "lowLightUse",
        "seriesCaution",
        "watchmaker",
      ],
      id: "specificationFocus",
      kind: "string",
      label: "MIL-PRF-46374 field-watch specification focus",
    },
  ],
  outputs: [
    { id: "keyDate", kind: "string", label: "Key date or status" },
    {
      id: "specificationFocus",
      kind: "string",
      label: "MIL-PRF-46374 field-watch specification focus",
    },
    {
      id: "verifiedStatement",
      kind: "string",
      label: "Verified MIL-PRF-46374 statement",
    },
  ],
  title: "MIL-PRF-46374 Field Watch Specification Lookup",
});

export const runMilPrf46374 = milPrf46374Tool.execute;
export default milPrf46374Tool;
