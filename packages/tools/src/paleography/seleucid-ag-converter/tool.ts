import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SeleucidAgConverterInput = {
  readonly direction:
    "ad_to_seleucid" | "bc_to_seleucid" | "seleucid_to_julian";
  readonly year: number;
  readonly month?: number;
  readonly newYearConvention?: "macedonian_october" | "babylonian_april";
};

export type SeleucidAgConverterOutput = {
  readonly convertedYear: number;
  readonly countingEra: "seleucid" | "ad" | "bc";
};

export const calculateSeleucidAgConverter = (
  input: SeleucidAgConverterInput,
): SeleucidAgConverterOutput => {
  if (
    input.direction !== "ad_to_seleucid" &&
    input.direction !== "bc_to_seleucid" &&
    input.direction !== "seleucid_to_julian"
  )
    return simpleError(
      "direction",
      "Choose a supported conversion direction.",
      "invalid_direction",
    );
  if (!(Number.isSafeInteger(input.year) && input.year >= 1))
    return simpleError(
      "year",
      "Year must be a positive integer.",
      "invalid_year",
    );
  const month = input.month ?? 1;
  if (!(Number.isSafeInteger(month) && month >= 1 && month <= 12))
    return simpleError(
      "month",
      "Month must be an integer from 1 to 12.",
      "invalid_month",
    );
  const convention = input.newYearConvention ?? "macedonian_october";
  if (convention !== "macedonian_october" && convention !== "babylonian_april")
    return simpleError(
      "newYearConvention",
      "Choose the Macedonian October or Babylonian April convention.",
      "invalid_convention",
    );
  const newYearMonth = convention === "babylonian_april" ? 4 : 10;
  const epochAstronomicalYear = convention === "babylonian_april" ? -310 : -311;
  const onOrAfterNewYear = month >= newYearMonth;
  if (input.direction === "ad_to_seleucid") {
    const convertedYear =
      input.year - epochAstronomicalYear + (onOrAfterNewYear ? 1 : 0);
    if (!Number.isSafeInteger(convertedYear))
      return simpleError(
        "year",
        "The converted year exceeds the safe integer range.",
        "numeric_overflow",
      );
    return { convertedYear, countingEra: "seleucid" };
  }
  if (input.direction === "bc_to_seleucid") {
    const astronomicalYear = 1 - input.year;
    const seleucid =
      astronomicalYear - epochAstronomicalYear + (onOrAfterNewYear ? 1 : 0);
    if (seleucid <= 0)
      return simpleError(
        "year",
        "The date precedes the first Seleucid year (autumn 312 BC).",
        "invalid_year",
      );
    return { convertedYear: seleucid, countingEra: "seleucid" };
  }
  const astronomicalYear =
    input.year + epochAstronomicalYear - (onOrAfterNewYear ? 1 : 0);
  if (astronomicalYear > 0)
    return { convertedYear: astronomicalYear, countingEra: "ad" };
  return { convertedYear: 1 - astronomicalYear, countingEra: "bc" };
};

export const seleucidAgConverterExample = {
  input: { direction: "bc_to_seleucid", year: 63, month: 6 },
  output: { convertedYear: 249, countingEra: "seleucid" },
} satisfies ToolExample<SeleucidAgConverterInput, SeleucidAgConverterOutput>;

export const seleucidAgConverterTool = createSimpleTool({
  id: "paleography/seleucid-ag-converter",
  title: "Seleucid Era (AG) Converter",
  description:
    "Convert years to and from the Seleucid era (anno Graecorum) under either attested new-year convention: the Macedonian autumn year from October (default) or the Babylonian spring year from April; SE 1 began in autumn/spring of 312/311 BC.",
  inputs: [
    {
      description: "Direction of conversion.",
      enum: ["ad_to_seleucid", "bc_to_seleucid", "seleucid_to_julian"],
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
    {
      default: 1,
      description:
        "Month of the date; determines which Seleucid year it falls in.",
      id: "month",
      kind: "integer",
      label: "Month",
      maximum: 12,
      minimum: 1,
    },
    {
      default: "macedonian_october",
      description: "New-year convention for the era.",
      enum: ["macedonian_october", "babylonian_april"],
      id: "newYearConvention",
      kind: "string",
      label: "New year",
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
      enum: ["seleucid", "ad", "bc"],
      id: "countingEra",
      kind: "string",
      label: "Counting era",
    },
  ],
  calculate: (input) =>
    calculateSeleucidAgConverter({
      direction: input.direction as SeleucidAgConverterInput["direction"],
      year: input.year as number,
      month: input.month as number,
      newYearConvention:
        input.newYearConvention as SeleucidAgConverterInput["newYearConvention"],
    }),
});

export const runSeleucidAgConverter = seleucidAgConverterTool.execute;
export default seleucidAgConverterTool;
