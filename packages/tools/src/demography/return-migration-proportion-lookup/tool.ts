import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ReturnMigrationProportionLookupInput = {
  readonly returnMigrants: number;
  readonly totalInMigrants: number;
};

export type ReturnMigrationProportionLookupOutput = {
  readonly returnProportionPercent: number;
};

export const calculateReturnMigrationProportionLookup = (
  input: ReturnMigrationProportionLookupInput,
): ReturnMigrationProportionLookupOutput => {
  if (!(input.returnMigrants >= 0))
    simpleError(
      "returnMigrants",
      "Return migrants must be non-negative.",
      "invalid_count",
    );
  if (!(input.totalInMigrants > 0))
    simpleError(
      "totalInMigrants",
      "Total in-migrants must be greater than zero.",
      "invalid_count",
    );
  if (input.returnMigrants > input.totalInMigrants)
    simpleError(
      "returnMigrants",
      "Return migrants cannot exceed total in-migrants.",
      "invalid_count",
    );
  return {
    returnProportionPercent:
      (input.returnMigrants / input.totalInMigrants) * 100,
  };
};

export const returnMigrationProportionLookupExample = {
  input: { returnMigrants: 5000, totalInMigrants: 40000 },
  output: { returnProportionPercent: 12.5 },
} satisfies ToolExample<
  ReturnMigrationProportionLookupInput,
  ReturnMigrationProportionLookupOutput
>;

export const returnMigrationProportionLookupTool = createSimpleTool({
  id: "demography/return-migration-proportion-lookup",
  title: "Return Migration Proportion Lookup",
  description:
    "Compute the proportion of in-migration to a place that consists of former residents moving back, as return migrants per hundred total in-migrants.",
  inputs: [
    {
      description: "In-migrants who previously lived in the destination.",
      id: "returnMigrants",
      kind: "number",
      label: "Return migrants",
      minimum: 0,
    },
    {
      description: "All in-migrants to the destination over the period.",
      id: "totalInMigrants",
      kind: "number",
      label: "Total in-migrants",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Return migrants as a percent of all in-migrants.",
      id: "returnProportionPercent",
      kind: "number",
      label: "Return %",
    },
  ],
  calculate: (input) =>
    calculateReturnMigrationProportionLookup(
      input as unknown as ReturnMigrationProportionLookupInput,
    ),
});

export const runReturnMigrationProportionLookup =
  returnMigrationProportionLookupTool.execute;
export default returnMigrationProportionLookupTool;
