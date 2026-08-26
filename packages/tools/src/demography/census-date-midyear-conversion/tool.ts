import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CensusDateMidyearConversionInput = {
  readonly censusCount: number;
  readonly censusDate: string;
  readonly midyearDate: string;
  readonly annualGrowthRatePercent: number;
};

export type CensusDateMidyearConversionOutput = {
  readonly elapsedDays: number;
  readonly elapsedYears: number;
  readonly midyearEquivalentPopulation: number;
};

const parseIsoDate = (value: string, field: string): number => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match)
    simpleError(
      field,
      "Dates must use the ISO calendar form YYYY-MM-DD.",
      "invalid_date",
    );
  const year = Number(match![1]!);
  const month = Number(match![2]!);
  const day = Number(match![3]!);
  if (month < 1 || month > 12 || day < 1 || day > 31)
    simpleError(
      field,
      "The date is not a valid calendar date.",
      "invalid_date",
    );
  const utc = Date.UTC(year, month - 1, day);
  const check = new Date(utc);
  if (
    check.getUTCFullYear() !== year ||
    check.getUTCMonth() !== month - 1 ||
    check.getUTCDate() !== day
  )
    simpleError(
      field,
      "The date is not a valid calendar date.",
      "invalid_date",
    );
  return utc;
};

export const calculateCensusDateMidyearConversion = (
  input: CensusDateMidyearConversionInput,
): CensusDateMidyearConversionOutput => {
  if (!(
    typeof input.censusCount === "number" &&
    Number.isFinite(input.censusCount) &&
    input.censusCount > 0
  ))
    simpleError(
      "censusCount",
      "The census count must be greater than zero.",
      "invalid_population",
    );
  if (!(
    typeof input.annualGrowthRatePercent === "number" &&
    Number.isFinite(input.annualGrowthRatePercent) &&
    input.annualGrowthRatePercent > -100
  ))
    simpleError(
      "annualGrowthRatePercent",
      "The annual growth rate must be finite and above -100 percent.",
      "invalid_rate",
    );
  const censusUtc = parseIsoDate(input.censusDate, "censusDate");
  const midyearUtc = parseIsoDate(input.midyearDate, "midyearDate");
  const elapsedDays = Math.round((midyearUtc - censusUtc) / 86400000);
  const elapsedYears = elapsedDays / 365.25;
  return {
    elapsedDays,
    elapsedYears,
    midyearEquivalentPopulation:
      input.censusCount *
      Math.exp((input.annualGrowthRatePercent / 100) * elapsedYears),
  };
};

export const censusDateMidyearConversionExample = {
  input: {
    censusCount: 1000000,
    censusDate: "2000-01-01",
    midyearDate: "2000-07-01",
    annualGrowthRatePercent: 2,
  },
  output: {
    elapsedDays: 182,
    elapsedYears: 0.49828884325804246,
    midyearEquivalentPopulation: 1010015.6005925958,
  },
} satisfies ToolExample<
  CensusDateMidyearConversionInput,
  CensusDateMidyearConversionOutput
>;

export const censusDateMidyearConversionTool = createSimpleTool({
  id: "demography/census-date-midyear-conversion",
  title: "Census Date Midyear Conversion",
  description:
    "Convert a census count taken on an arbitrary date to a mid-year equivalent by exponential interpolation at an assumed constant annual growth rate over the elapsed days between the two dates.",
  inputs: [
    {
      description: "Population enumerated at the census date.",
      id: "censusCount",
      kind: "number",
      label: "Census count",
      minimum: 0,
    },
    {
      description: "Census reference date in ISO form YYYY-MM-DD.",
      id: "censusDate",
      kind: "string",
      label: "Census date",
    },
    {
      description:
        "Target date such as the mid-year point in ISO form YYYY-MM-DD.",
      id: "midyearDate",
      kind: "string",
      label: "Target date",
    },
    {
      description:
        "Assumed constant annual growth rate in percent for the interval; supply the observed or assumed value.",
      id: "annualGrowthRatePercent",
      kind: "number",
      label: "Growth rate",
    },
  ],
  outputs: [
    {
      description: "Whole days between the census and target dates.",
      id: "elapsedDays",
      kind: "integer",
      label: "Elapsed days",
    },
    {
      description: "Elapsed time in years using a 365.25-day year.",
      id: "elapsedYears",
      kind: "number",
      label: "Elapsed years",
    },
    {
      description:
        "Mid-year equivalent population from exponential interpolation.",
      id: "midyearEquivalentPopulation",
      kind: "number",
      label: "Mid-year population",
    },
  ],
  calculate: (input) =>
    calculateCensusDateMidyearConversion(
      input as unknown as CensusDateMidyearConversionInput,
    ),
});

export const runCensusDateMidyearConversion =
  censusDateMidyearConversionTool.execute;
export default censusDateMidyearConversionTool;
