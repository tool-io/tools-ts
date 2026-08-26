import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TribuniciaPotestasExtractorInput = {
  readonly text: string;
  readonly accessionSignedYear?: number;
  readonly renewal?: "december10" | "january1";
};

export type TribuniciaPotestasExtractorOutput = {
  readonly marker: string;
  readonly countValue: number;
  readonly startYearSigned: number;
  readonly majorityYearSigned: number;
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
const MARKER =
  /\bTR(?:IB(?:VN?)?)?\.?\s*·?\s*P(?:O(?:T(?:ESTAS)?)?)?\.?\s*·?\s*([IVXLCDM]+|\d+)\b/i;

const parseCountToken = (rawToken: string): number => {
  const token = rawToken.toUpperCase();
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

export const calculateTribuniciaPotestasExtractor = (
  input: TribuniciaPotestasExtractorInput,
): TribuniciaPotestasExtractorOutput => {
  if (!input.text.trim())
    return simpleError("text", "Titulature text is required.", "invalid_text");
  const match = MARKER.exec(input.text);
  if (!match)
    return simpleError(
      "text",
      "No tribunician-power marker (TR POT) followed by a numeral was found.",
      "missing_marker",
    );
  const countValue = parseCountToken(match[1]);
  const accessionSignedYear = input.accessionSignedYear ?? -22;
  const startYearSigned = accessionSignedYear + countValue - 1;
  return {
    marker: match[0].trim(),
    countValue,
    startYearSigned,
    majorityYearSigned:
      (input.renewal ?? "december10") === "december10"
        ? startYearSigned + 1
        : startYearSigned,
  };
};

export const tribuniciaPotestasExtractorExample = {
  input: { text: "IMP CAESAR DIVI F AVGVSTVS TR POT XVIII" },
  output: {
    marker: "TR POT XVIII",
    countValue: 18,
    startYearSigned: -5,
    majorityYearSigned: -4,
  },
} satisfies ToolExample<
  TribuniciaPotestasExtractorInput,
  TribuniciaPotestasExtractorOutput
>;

export const tribuniciaPotestasExtractorTool = createSimpleTool({
  id: "epigraphy/tribunicia-potestas-extractor",
  title: "Tribunician Power Count Year Extractor",
  description:
    "Read the tribunician-power count (TR P / TR POT / TRIB POT n) out of an imperial titulature and convert it to astronomical signed years (negative = BC, e.g., -22 = 23 BC) from an accession epoch, assuming renewal on December 10 by default or January 1.",
  inputs: [
    {
      description: "Imperial titulature line.",
      id: "text",
      kind: "string",
      label: "Text",
    },
    {
      default: -22,
      description:
        "Astronomical signed year (negative = BC) in which tribunician power year I began; default -22 corresponds to Augustus, December 23 BC.",
      id: "accessionSignedYear",
      kind: "integer",
      label: "Accession epoch",
    },
    {
      default: "december10",
      description:
        "Annual renewal month convention for attributing the majority civil year.",
      enum: ["december10", "january1"],
      id: "renewal",
      kind: "string",
      label: "Renewal",
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
      description: "Tribunician-power iteration count.",
      id: "countValue",
      kind: "integer",
      label: "TP count",
    },
    {
      description:
        "Astronomical signed year (negative = BC) in which this tribunician year begins.",
      id: "startYearSigned",
      kind: "integer",
      label: "Start year",
    },
    {
      description:
        "Astronomical signed year covering most days of this tribunician year under the chosen renewal convention.",
      id: "majorityYearSigned",
      kind: "integer",
      label: "Majority year",
    },
  ],
  calculate: (input) =>
    calculateTribuniciaPotestasExtractor(
      input as unknown as TribuniciaPotestasExtractorInput,
    ),
});

export const runTribuniciaPotestasExtractor =
  tribuniciaPotestasExtractorTool.execute;
export default tribuniciaPotestasExtractorTool;
