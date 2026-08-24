import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SpanishEraYearConverterInput = {
  readonly year: number;
  readonly direction?: "ad_to_era" | "era_to_ad";
};

export type SpanishEraYearConverterOutput = {
  readonly convertedYear: number;
};

export const calculateSpanishEraYearConverter = (
  input: SpanishEraYearConverterInput,
): SpanishEraYearConverterOutput => {
  if (!(Number.isSafeInteger(input.year) && input.year >= 1))
    return simpleError(
      "year",
      "Year must be a positive integer.",
      "invalid_year",
    );
  const direction = input.direction ?? "ad_to_era";
  if (direction !== "ad_to_era" && direction !== "era_to_ad")
    return simpleError(
      "direction",
      "Choose a supported conversion direction.",
      "invalid_direction",
    );
  if (direction === "era_to_ad") {
    if (input.year <= 38)
      return simpleError(
        "year",
        "The Spanish Era begins at year 39 (= AD 1).",
        "invalid_year",
      );
    return { convertedYear: input.year - 38 };
  }
  const convertedYear = input.year + 38;
  if (!Number.isSafeInteger(convertedYear))
    return simpleError(
      "year",
      "The converted year exceeds the safe integer range.",
      "numeric_overflow",
    );
  return { convertedYear };
};

export const spanishEraYearConverterExample = {
  input: { year: 1086, direction: "ad_to_era" },
  output: { convertedYear: 1124 },
} satisfies ToolExample<
  SpanishEraYearConverterInput,
  SpanishEraYearConverterOutput
>;

export const spanishEraYearConverterTool = createSimpleTool({
  id: "paleography/spanish-era-year-converter",
  title: "Spanish Era Year Converter",
  description:
    "Convert between AD years and the Spanish Era (Aera Hispanicae) used in Iberian charters, where Era year = AD + 38 counting from the epoch of 1 January 38 BC.",
  inputs: [
    {
      description: "Year to convert.",
      id: "year",
      kind: "integer",
      label: "Year",
      minimum: 1,
    },
    {
      default: "ad_to_era",
      description: "Conversion direction.",
      enum: ["ad_to_era", "era_to_ad"],
      id: "direction",
      kind: "string",
      label: "Direction",
    },
  ],
  outputs: [
    {
      description: "Converted year in the other reckoning.",
      id: "convertedYear",
      kind: "integer",
      label: "Converted year",
      minimum: 1,
    },
  ],
  calculate: (input) =>
    calculateSpanishEraYearConverter({
      year: input.year as number,
      direction: input.direction as SpanishEraYearConverterInput["direction"],
    }),
});

export const runSpanishEraYearConverter = spanishEraYearConverterTool.execute;
export default spanishEraYearConverterTool;
