import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CensorialIterationDecoderInput = {
  readonly text: string;
};

export type CensorialIterationDecoderOutput = {
  readonly marker: string;
  readonly iterationCount: number;
};

const SYMBOL_VALUES: Record<string, number> = {
  I: 1,
  V: 5,
  X: 10,
  L: 50,
  C: 100,
  D: 500,
  M: 1000,
};
const MARKER = /\bCENS(?:ORIS|ORIA|ORVM|OR)?\.?\s*·?\s*([IVXLCDM]+|\d+)\b/i;

const parseCountToken = (token: string): number => {
  if (/^\d+$/.test(token)) return Number.parseInt(token, 10);
  for (const ch of token)
    if (!(ch in SYMBOL_VALUES))
      return simpleError(
        "text",
        `Character '${ch}' in '${token}' is not a Roman numeral symbol.`,
        "invalid_numeral",
      );
  let value = 0;
  for (let i = 0; i < token.length; i += 1) {
    const cur = SYMBOL_VALUES[token[i]];
    const next = i + 1 < token.length ? SYMBOL_VALUES[token[i + 1]] : 0;
    value += cur < next ? -cur : cur;
  }
  return value;
};

export const calculateCensorialIterationDecoder = (
  input: CensorialIterationDecoderInput,
): CensorialIterationDecoderOutput => {
  if (!input.text.trim())
    return simpleError("text", "Titulature text is required.", "invalid_text");
  const normalized = input.text.replace(/·/g, " ");
  const match = MARKER.exec(normalized);
  if (!match)
    return simpleError(
      "text",
      "No censorial marker (CENS) followed by an iteration numeral was found.",
      "missing_marker",
    );
  return {
    marker: match[0].trim(),
    iterationCount: parseCountToken(match[1]),
  };
};

export const censorialIterationDecoderExample = {
  input: { text: "TI CLAVDIVS CAESAR AVG P M TR P VII IMP XI CENS II" },
  output: { marker: "CENS II", iterationCount: 2 },
} satisfies ToolExample<
  CensorialIterationDecoderInput,
  CensorialIterationDecoderOutput
>;

export const censorialIterationDecoderTool = createSimpleTool({
  id: "epigraphy/censorial-iteration-decoder",
  title: "Censorial Iteration Number Counter Decoder",
  description:
    "Decode the censorial-iteration count following a CENS (optionally CENSOR/CENSORIS/CENSORIA) marker with Roman-numeral or arabic numeral in an imperial titulature line.",
  inputs: [
    {
      description:
        "Imperial titulature line (interpuncts are treated as spaces).",
      id: "text",
      kind: "string",
      label: "Text",
    },
  ],
  outputs: [
    {
      description: "Matched marker phrase including numeral.",
      id: "marker",
      kind: "string",
      label: "Marker",
    },
    {
      description: "Number of censorial iterations held.",
      id: "iterationCount",
      kind: "integer",
      label: "Iterations",
    },
  ],
  calculate: (input) =>
    calculateCensorialIterationDecoder(
      input as unknown as CensorialIterationDecoderInput,
    ),
});

export const runCensorialIterationDecoder =
  censorialIterationDecoderTool.execute;
export default censorialIterationDecoderTool;
