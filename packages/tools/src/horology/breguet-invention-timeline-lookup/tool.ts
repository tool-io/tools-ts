import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const inventionEntries = {
  constantForce: {
    keyDate: "1798",
    statement:
      "The Swatch Group states that Abraham-Louis Breguet developed a constant-force escapement patented in 1798.",
  },
  notExhaustive: {
    keyDate: "scope",
    statement:
      "This lookup covers only selected documented mechanisms; it is not an exhaustive catalogue of every device attributed to Breguet or his firm.",
  },
  overcoil: {
    keyDate: "1795",
    statement:
      "Breguet's official history dates the raised terminal-curve hairspring to 1795.",
  },
  tourbillon: {
    keyDate: "26 June 1801",
    statement:
      "Breguet states that Abraham-Louis Breguet received the tourbillon-regulator patent on 26 June 1801.",
  },
  watchmakingLegacy: {
    keyDate: "historical",
    statement:
      "Breguet's documented innovations span the regulating organ and power delivery, but no list should be used to infer that every modern complication was invented solely by Breguet.",
  },
} as const;

export type BreguetInventionFocus = keyof typeof inventionEntries;

export type BreguetInventionLookupInput = {
  readonly inventionFocus: BreguetInventionFocus;
};

export type BreguetInventionLookupOutput = {
  readonly inventionFocus: BreguetInventionFocus;
  readonly keyDate: string;
  readonly verifiedStatement: string;
};

export const lookupBreguetInventionTimeline = (
  input: BreguetInventionLookupInput,
): BreguetInventionLookupOutput => {
  const entry = inventionEntries[input.inventionFocus];
  if (entry === undefined)
    simpleError(
      "inventionFocus",
      "Breguet invention focus is not supported.",
      "unsupported_invention_focus",
    );
  return {
    inventionFocus: input.inventionFocus,
    keyDate: entry.keyDate,
    verifiedStatement: entry.statement,
  };
};

export const breguetInventionExample = {
  input: { inventionFocus: "tourbillon" },
  output: {
    inventionFocus: "tourbillon",
    keyDate: "26 June 1801",
    verifiedStatement:
      "Breguet states that Abraham-Louis Breguet received the tourbillon-regulator patent on 26 June 1801.",
  },
} satisfies ToolExample<
  BreguetInventionLookupInput,
  BreguetInventionLookupOutput
>;

export const breguetInventionTool = createSimpleTool({
  calculate: (input) =>
    lookupBreguetInventionTimeline({
      inventionFocus: input.inventionFocus as BreguetInventionFocus,
    }),
  description:
    "Return selected Breguet-house dates for the overcoil, constant-force escapement, and tourbillon, plus explicit scope cautions.",
  id: "horology/breguet-invention-timeline-lookup",
  inputs: [
    {
      enum: [
        "overcoil",
        "constantForce",
        "tourbillon",
        "watchmakingLegacy",
        "notExhaustive",
      ],
      id: "inventionFocus",
      kind: "string",
      label: "Breguet invention timeline focus",
    },
  ],
  outputs: [
    {
      id: "inventionFocus",
      kind: "string",
      label: "Breguet invention timeline focus",
    },
    { id: "keyDate", kind: "string", label: "Invention date or scope" },
    {
      id: "verifiedStatement",
      kind: "string",
      label: "Verified Breguet invention statement",
    },
  ],
  title: "Breguet Invention Timeline Lookup",
});

export const runBreguetInvention = breguetInventionTool.execute;
export default breguetInventionTool;
