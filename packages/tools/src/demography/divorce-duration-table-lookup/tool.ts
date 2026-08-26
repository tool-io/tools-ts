import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DivorceDurationTableLookupInput = {
  readonly divorcesByDurationYear: readonly number[];
  readonly queryDurationYear: number;
};

export type DivorceDurationTableLookupOutput = {
  readonly percentOfAllDivorces: number;
  readonly modalDurationYear: number;
};

export const calculateDivorceDurationTableLookup = (
  input: DivorceDurationTableLookupInput,
): DivorceDurationTableLookupOutput => {
  const counts = input.divorcesByDurationYear;
  if (counts.length < 1)
    return simpleError(
      "divorcesByDurationYear",
      "Provide divorce counts for at least one duration year.",
      "invalid_list",
    );
  for (const count of counts)
    if (!(count >= 0))
      return simpleError(
        "divorcesByDurationYear",
        "Divorce counts must be non-negative.",
        "invalid_list",
      );
  if (
    !(
      Number.isSafeInteger(input.queryDurationYear) &&
      input.queryDurationYear >= 0
    ) ||
    input.queryDurationYear >= counts.length
  )
    return simpleError(
      "queryDurationYear",
      "The queried duration year must be an integer index within the table.",
      "invalid_duration",
    );
  let total = 0;
  for (const count of counts) total += count;
  if (!(total > 0))
    return simpleError(
      "divorcesByDurationYear",
      "Total divorces must be positive.",
      "invalid_list",
    );
  let modalDurationYear = 0;
  for (let index = 1; index < counts.length; index += 1)
    if ((counts[index] as number) > (counts[modalDurationYear] as number))
      modalDurationYear = index;
  return {
    percentOfAllDivorces:
      (100 * (counts[input.queryDurationYear] as number)) / total,
    modalDurationYear,
  };
};

export const divorceDurationTableLookupExample = {
  input: {
    divorcesByDurationYear: [120, 340, 520, 430, 280, 160, 90, 60],
    queryDurationYear: 2,
  },
  output: { percentOfAllDivorces: 26, modalDurationYear: 2 },
} satisfies ToolExample<
  DivorceDurationTableLookupInput,
  DivorceDurationTableLookupOutput
>;

export const divorceDurationTableLookupTool = createSimpleTool({
  id: "demography/divorce-duration-table-lookup",
  title: "Divorce Duration Table Lookup",
  description:
    "Read a divorce distribution by marriage duration, returning the percentage share of the queried duration year and the modal duration year.",
  inputs: [
    {
      description:
        "Divorces in each completed year of marriage since the wedding, where index i holds durations from i to i+1 years.",
      id: "divorcesByDurationYear",
      kind: "numberList",
      label: "By duration",
    },
    {
      description: "Duration year to look up, zero-based.",
      id: "queryDurationYear",
      kind: "integer",
      label: "Query year",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description:
        "Queried duration's divorces as a percentage of all divorces.",
      id: "percentOfAllDivorces",
      kind: "number",
      label: "Share %",
    },
    {
      description: "Duration-year index with the highest divorce count.",
      id: "modalDurationYear",
      kind: "integer",
      label: "Modal year",
    },
  ],
  calculate: (input) =>
    calculateDivorceDurationTableLookup(
      input as unknown as DivorceDurationTableLookupInput,
    ),
});

export const runDivorceDurationTableLookup =
  divorceDurationTableLookupTool.execute;
export default divorceDurationTableLookupTool;
