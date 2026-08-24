import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AucChroniclerConverterInput = {
  readonly direction?: "ad_to_auc" | "bc_to_auc" | "auc_to_ad";
  readonly year: number;
};

export type AucChroniclerConverterOutput = {
  readonly convertedYear: number;
  readonly countingEra: "auc" | "ad" | "bc";
};

export const calculateAucChroniclerConverter = (
  input: AucChroniclerConverterInput,
): AucChroniclerConverterOutput => {
  if (!(Number.isSafeInteger(input.year) && input.year >= 1))
    return simpleError(
      "year",
      "Year must be a positive integer.",
      "invalid_year",
    );
  const direction = input.direction ?? "ad_to_auc";
  if (direction === "ad_to_auc") {
    if (input.year > Number.MAX_SAFE_INTEGER - 753)
      return simpleError(
        "year",
        "The converted AUC year exceeds the safe integer range.",
        "numeric_range",
      );
    return { convertedYear: input.year + 753, countingEra: "auc" };
  }
  if (direction === "bc_to_auc") {
    if (input.year > 753)
      return simpleError(
        "year",
        "The date precedes the founding of Rome (AUC 1 = 753 BC).",
        "invalid_year",
      );
    return { convertedYear: 754 - input.year, countingEra: "auc" };
  }
  return input.year >= 754
    ? { convertedYear: input.year - 753, countingEra: "ad" }
    : { convertedYear: 754 - input.year, countingEra: "bc" };
};

export const aucChroniclerConverterExample = {
  input: { direction: "ad_to_auc", year: 476 },
  output: { convertedYear: 1229, countingEra: "auc" },
} satisfies ToolExample<
  AucChroniclerConverterInput,
  AucChroniclerConverterOutput
>;

export const aucChroniclerConverterTool = createSimpleTool({
  id: "paleography/auc-chronicler-converter",
  title: "AUC Chronicler Converter",
  description:
    "Convert years to and from ab urbe condita reckoning used by chroniclers under Varro's convention (Rome founded 753 BC; AD year + 753; no year zero), with the civil year starting 1 January.",
  inputs: [
    {
      default: "ad_to_auc",
      description: "Direction of conversion.",
      enum: ["ad_to_auc", "bc_to_auc", "auc_to_ad"],
      id: "direction",
      kind: "string",
      label: "Direction",
    },
    {
      description: "Year in the source reckoning.",
      id: "year",
      kind: "integer",
      label: "Year",
      minimum: 1,
    },
  ],
  outputs: [
    {
      description: "Converted year in the target reckoning.",
      id: "convertedYear",
      kind: "integer",
      label: "Converted year",
      minimum: 1,
    },
    {
      description: "Which reckoning convertedYear counts.",
      enum: ["auc", "ad", "bc"],
      id: "countingEra",
      kind: "string",
      label: "Counting era",
    },
  ],
  calculate: (input) =>
    calculateAucChroniclerConverter({
      direction: input.direction as AucChroniclerConverterInput["direction"],
      year: input.year as number,
    }),
});

export const runAucChroniclerConverter = aucChroniclerConverterTool.execute;
export default aucChroniclerConverterTool;
