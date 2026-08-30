import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const philosophyEntries = {
  fullMetalEvolution: {
    keyDate: "GMW-B5000 lineage",
    statement:
      "Casio's GMW-B5000 history treats the full-metal watch as an evolution of the original G-SHOCK mission, adding metal construction and finishing without replacing the core shock-resistance idea.",
  },
  originPhrase: {
    keyDate: "1983",
    statement:
      "Casio records Kikuo Ibe's original proposal as a durable watch that would not break even if dropped; the shock-resistant structure was finalized in 1983.",
  },
  shockResistance: {
    keyDate: "origin",
    statement:
      "The origin of G-SHOCK was a long program of trial and error to make a watch structure that would withstand dropping.",
  },
  squareDesign: {
    keyDate: "origin design",
    statement:
      "Casio describes the square, visually reduced G-SHOCK design as a product of the single-minded pursuit of shock resistance.",
  },
  terminologyCaution: {
    keyDate: "unverified slogan",
    statement:
      "Casio's official GMW-B5000 history does not present Go Everywhere, Do All as a verified founding slogan; use the documented break-resistant mission rather than attributing an invented quotation.",
  },
} as const;

export type GshockPhilosophyFocus = keyof typeof philosophyEntries;

export type GshockPhilosophyLookupInput = {
  readonly philosophyFocus: GshockPhilosophyFocus;
};

export type GshockPhilosophyLookupOutput = {
  readonly keyDate: string;
  readonly philosophyFocus: GshockPhilosophyFocus;
  readonly verifiedStatement: string;
};

export const lookupGshockPhilosophy = (
  input: GshockPhilosophyLookupInput,
): GshockPhilosophyLookupOutput => {
  const entry = philosophyEntries[input.philosophyFocus];
  if (entry === undefined)
    simpleError(
      "philosophyFocus",
      "G-SHOCK philosophy focus is not supported.",
      "unsupported_philosophy_focus",
    );
  return {
    keyDate: entry.keyDate,
    philosophyFocus: input.philosophyFocus,
    verifiedStatement: entry.statement,
  };
};

export const gshockPhilosophyExample = {
  input: { philosophyFocus: "originPhrase" },
  output: {
    keyDate: "1983",
    philosophyFocus: "originPhrase",
    verifiedStatement:
      "Casio records Kikuo Ibe's original proposal as a durable watch that would not break even if dropped; the shock-resistant structure was finalized in 1983.",
  },
} satisfies ToolExample<
  GshockPhilosophyLookupInput,
  GshockPhilosophyLookupOutput
>;

export const gshockPhilosophyTool = createSimpleTool({
  calculate: (input) =>
    lookupGshockPhilosophy({
      philosophyFocus: input.philosophyFocus as GshockPhilosophyFocus,
    }),
  description:
    "Return Casio's official G-SHOCK origin phrase, shock-resistance mission, square design, full-metal evolution, or unverified-slogan caution.",
  id: "horology/g-shock-design-history-lookup",
  inputs: [
    {
      enum: [
        "originPhrase",
        "shockResistance",
        "squareDesign",
        "fullMetalEvolution",
        "terminologyCaution",
      ],
      id: "philosophyFocus",
      kind: "string",
      label: "G-SHOCK Go Everywhere Do All philosophy focus",
    },
  ],
  outputs: [
    { id: "keyDate", kind: "string", label: "Key date or status" },
    {
      id: "philosophyFocus",
      kind: "string",
      label: "G-SHOCK Go Everywhere Do All philosophy focus",
    },
    {
      id: "verifiedStatement",
      kind: "string",
      label: "Verified G-SHOCK statement",
    },
  ],
  title: "G-SHOCK Design History Lookup",
});

export const runGshockPhilosophy = gshockPhilosophyTool.execute;
export default gshockPhilosophyTool;
