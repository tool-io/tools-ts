import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const termEntries = {
  grail: {
    keyDate: "collector vocabulary",
    statement:
      "Holy grail and grail are subjective collector terms for a reference a buyer regards as exceptionally desirable or difficult to obtain.",
  },
  marketingCaution: {
    keyDate: "language caution",
    statement:
      "Unobtainium, holy grail, grail, and grail-adjacent are not regulated horological grades; marketing copy is not independent rarity evidence.",
  },
  unobtainium: {
    keyDate: "hyperbolic collector vocabulary",
    statement:
      "Unobtainium figuratively describes something that is extremely difficult or seemingly impossible to obtain, but it does not specify a verifiable scarcity level.",
  },
  valuationCaution: {
    keyDate: "market analysis",
    statement:
      "A grail label does not establish value. Supply, demand, condition, provenance, originality, and comparable sales remain separate evidence.",
  },
  verification: {
    keyDate: "collector research",
    statement:
      "Verify claimed rarity using reference-level production records, known examples, market history, and current condition rather than tier vocabulary alone.",
  },
} as const;

export type CollectorTermFocus = keyof typeof termEntries;

export type CollectorTermLookupInput = {
  readonly termFocus: CollectorTermFocus;
};

export type CollectorTermLookupOutput = {
  readonly keyDate: string;
  readonly termFocus: CollectorTermFocus;
  readonly verifiedMeaning: string;
};

export const lookupUnobtainiumCollectorTerm = (
  input: CollectorTermLookupInput,
): CollectorTermLookupOutput => {
  const entry = termEntries[input.termFocus];
  if (entry === undefined)
    simpleError(
      "termFocus",
      "Collector term focus is not supported.",
      "unsupported_term_focus",
    );
  return {
    keyDate: entry.keyDate,
    termFocus: input.termFocus,
    verifiedMeaning: entry.statement,
  };
};

export const collectorTermExample = {
  input: { termFocus: "marketingCaution" },
  output: {
    keyDate: "language caution",
    termFocus: "marketingCaution",
    verifiedMeaning:
      "Unobtainium, holy grail, grail, and grail-adjacent are not regulated horological grades; marketing copy is not independent rarity evidence.",
  },
} satisfies ToolExample<CollectorTermLookupInput, CollectorTermLookupOutput>;

export const collectorTermTool = createSimpleTool({
  calculate: (input) =>
    lookupUnobtainiumCollectorTerm({
      termFocus: input.termFocus as CollectorTermFocus,
    }),
  description:
    "Define grail, holy grail, unobtainium, valuation, verification, and marketing cautions without converting subjective collector vocabulary into a formal rarity tier.",
  id: "horology/unobtainium-collector-term-lookup",
  inputs: [
    {
      enum: [
        "grail",
        "unobtainium",
        "valuationCaution",
        "verification",
        "marketingCaution",
      ],
      id: "termFocus",
      kind: "string",
      label: "Unobtainium collector-term focus",
    },
  ],
  outputs: [
    { id: "keyDate", kind: "string", label: "Term context" },
    {
      id: "termFocus",
      kind: "string",
      label: "Unobtainium collector-term focus",
    },
    {
      id: "verifiedMeaning",
      kind: "string",
      label: "Verified collector-term meaning",
    },
  ],
  title: "Unobtainium Collector Term Lookup",
});

export const runCollectorTerm = collectorTermTool.execute;
export default collectorTermTool;
