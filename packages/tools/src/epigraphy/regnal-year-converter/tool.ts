import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type RegnalYearConverterInput = {
  readonly regnalYear: number;
  readonly accessionYear: number;
  readonly accessionEra?: "BC" | "AD";
};

export type RegnalYearConverterOutput = {
  readonly era: "BC" | "AD";
  readonly year: number;
};

export const calculateRegnalYearConverter = (
  input: RegnalYearConverterInput,
): RegnalYearConverterOutput => {
  if (input.accessionEra === "BC") {
    if (input.regnalYear <= input.accessionYear)
      return {
        era: "BC",
        year: input.accessionYear - input.regnalYear + 1,
      };
    return { era: "AD", year: input.regnalYear - input.accessionYear };
  }
  return { era: "AD", year: input.accessionYear + input.regnalYear - 1 };
};

export const regnalYearConverterExample = {
  input: { regnalYear: 15, accessionYear: 27, accessionEra: "BC" },
  output: { era: "BC", year: 13 },
} satisfies ToolExample<RegnalYearConverterInput, RegnalYearConverterOutput>;

export const regnalYearConverterTool = createSimpleTool({
  id: "epigraphy/regnal-year-converter",
  title: "Regnal Year to Absolute Year Converter",
  description:
    "Convert a regnal year to an absolute BC/AD calendar year from the ruler's accession year and era, counting the accession year itself as regnal year one.",
  inputs: [
    {
      description: "Regnal year count (accession year is year 1).",
      id: "regnalYear",
      kind: "integer",
      label: "Regnal year",
      minimum: 1,
    },
    {
      description: "Absolute calendar year of accession.",
      id: "accessionYear",
      kind: "integer",
      label: "Accession year",
      minimum: 1,
    },
    {
      default: "AD",
      description: "Era of the accession year.",
      enum: ["AD", "BC"],
      id: "accessionEra",
      kind: "string",
      label: "Accession era",
    },
  ],
  outputs: [
    {
      description: "Resulting calendar era.",
      enum: ["AD", "BC"],
      id: "era",
      kind: "string",
      label: "Era",
    },
    {
      description: "Absolute calendar year of the given regnal year.",
      id: "year",
      kind: "integer",
      label: "Year",
    },
  ],
  calculate: (input) =>
    calculateRegnalYearConverter(input as unknown as RegnalYearConverterInput),
});

export const runRegnalYearConverter = regnalYearConverterTool.execute;
export default regnalYearConverterTool;
