import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CosIterationCounterInput = {
  readonly text: string;
};

export type CosIterationCounterOutput = {
  readonly found: boolean;
  readonly iteration: number;
  readonly marker: string;
};

const COS_PATTERN =
  /\bcos(?=\.|[\s]|$)\.?[.\s]*(?:ul\.?)?[.\s]*([ivxlcdm]+|\d+)?(?=[^\p{L}\d]|$)/iu;
const ITERUM_PATTERN = /\biter(?:um)?\.?(?=\s|$|[.,;)])/i;
const ROMAN_VALUES: Record<string, number> = {
  i: 1,
  v: 5,
  x: 10,
  l: 50,
  c: 100,
  d: 500,
  m: 1000,
};

const parseNumeralToken = (token: string): number => {
  if (/^\d+$/.test(token)) return Number.parseInt(token, 10);
  const numeral = token.toLowerCase();
  let total = 0;
  for (let index = 0; index < numeral.length; index += 1) {
    const current = ROMAN_VALUES[numeral[index]];
    if (current === undefined)
      return simpleError(
        "text",
        `Invalid Roman numeral after cos.: ${token}.`,
        "invalid_roman_numeral",
      );
    const next =
      index + 1 < numeral.length ? ROMAN_VALUES[numeral[index + 1]] : undefined;
    total += next !== undefined && next > current ? -current : current;
  }
  return total;
};

export const calculateCosIterationCounter = (
  input: CosIterationCounterInput,
): CosIterationCounterOutput => {
  if (!input.text.trim())
    simpleError("text", "Text must contain characters.", "empty_text");
  const cosMatch = COS_PATTERN.exec(input.text);
  const iterumFound = ITERUM_PATTERN.test(input.text);
  const numeral = cosMatch?.[1];
  if (!cosMatch && !iterumFound)
    return { found: false, iteration: 0, marker: "" };
  const iteration = numeral ? parseNumeralToken(numeral) : iterumFound ? 2 : 1;
  const marker = cosMatch ? cosMatch[0].trim() : iterumFound ? "iterum" : "";
  return { found: true, iteration, marker };
};

export const cosIterationCounterExample = {
  input: { text: "Imp. Caesar divi filius Augustus cos. XI" },
  output: { found: true, iteration: 11, marker: "cos. XI" },
} satisfies ToolExample<CosIterationCounterInput, CosIterationCounterOutput>;

export const cosIterationCounterTool = createSimpleTool({
  id: "epigraphy/cos-iteration-counter",
  title: "Ordinal Suffix on Consul Times Counter",
  description:
    "Counts consulship iterations from 'cos.' ordinal numerals and standalone 'iter(um)' markers in titulature.",
  inputs: [
    {
      id: "text",
      kind: "string",
      label: "Text",
      description: "Titulature or inscription text.",
    },
  ],
  outputs: [
    {
      id: "found",
      kind: "boolean",
      label: "Found",
      description: "Whether a consular iteration marker was detected.",
    },
    {
      id: "iteration",
      kind: "integer",
      label: "Iteration",
      description: "Consulship count, zero when no marker is found.",
    },
    {
      id: "marker",
      kind: "string",
      label: "Marker",
      description: "Matched marker substring, empty when none found.",
    },
  ],
  calculate: (input) =>
    calculateCosIterationCounter(input as unknown as CosIterationCounterInput),
});

export const runCosIterationCounter = cosIterationCounterTool.execute;
export default cosIterationCounterTool;
