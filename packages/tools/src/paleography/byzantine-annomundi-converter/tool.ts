import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ByzantineAnnomundiConverterInput = {
  readonly adYear: number;
  readonly month?: number;
};

export type ByzantineAnnomundiConverterOutput = {
  readonly annoMundi: number;
  readonly indiction: number;
  readonly byzantineYearSpan: string;
};

const FIRST_INDICTION_ANNO_MUNDI = 6821;

export const calculateByzantineAnnomundiConverter = (
  input: ByzantineAnnomundiConverterInput,
): ByzantineAnnomundiConverterOutput => {
  if (!(
    Number.isSafeInteger(input.adYear) &&
    input.adYear >= 1 &&
    input.adYear <= Number.MAX_SAFE_INTEGER - 5509
  ))
    return simpleError(
      "adYear",
      "AD year must be a positive integer.",
      "invalid_year",
    );
  const month = input.month ?? 1;
  if (!(Number.isSafeInteger(month) && month >= 1 && month <= 12))
    return simpleError(
      "month",
      "Month must be an integer from 1 to 12.",
      "invalid_month",
    );
  const annoMundi = month >= 9 ? input.adYear + 5509 : input.adYear + 5508;
  const indiction =
    ((((annoMundi - FIRST_INDICTION_ANNO_MUNDI) % 15) + 15) % 15) + 1;
  const startAd = annoMundi - 5509;
  return {
    annoMundi,
    indiction,
    byzantineYearSpan: `${startAd}-09-01 to ${startAd + 1}-08-31`,
  };
};

export const byzantineAnnomundiConverterExample = {
  input: { adYear: 1453, month: 5 },
  output: {
    annoMundi: 6961,
    indiction: 6,
    byzantineYearSpan: "1452-09-01 to 1453-08-31",
  },
} satisfies ToolExample<
  ByzantineAnnomundiConverterInput,
  ByzantineAnnomundiConverterOutput
>;

export const byzantineAnnomundiConverterTool = createSimpleTool({
  id: "paleography/byzantine-annomundi-converter",
  title: "Byzantine Anno Mundi Converter",
  description:
    "Convert an AD year and month into the Byzantine Anno Mundi year that begins on 1 September (AM = AD + 5509 from September, else AD + 5508) with its 15-year indiction counted from the first indiction of AM 6821 (September 312).",
  inputs: [
    {
      description: "AD calendar year.",
      id: "adYear",
      kind: "integer",
      label: "AD year",
      minimum: 1,
    },
    {
      default: 1,
      description:
        "Month of the AD date; determines which Anno Mundi year it falls in.",
      id: "month",
      kind: "integer",
      label: "Month",
      maximum: 12,
      minimum: 1,
    },
  ],
  outputs: [
    {
      description: "Byzantine year from the creation of the world.",
      id: "annoMundi",
      kind: "integer",
      label: "Anno Mundi",
    },
    {
      description:
        "Indiction number 1-15 for the same September-start tax year.",
      id: "indiction",
      kind: "integer",
      label: "Indiction",
      maximum: 15,
      minimum: 1,
    },
    {
      description: "Julian-date span covered by that Anno Mundi year.",
      id: "byzantineYearSpan",
      kind: "string",
      label: "Year span",
    },
  ],
  calculate: (input) =>
    calculateByzantineAnnomundiConverter({
      adYear: input.adYear as number,
      month: input.month as number | undefined,
    }),
});

export const runByzantineAnnomundiConverter =
  byzantineAnnomundiConverterTool.execute;
export default byzantineAnnomundiConverterTool;
