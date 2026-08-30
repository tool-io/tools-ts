import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DbhFromCircumferenceInput = Readonly<{
  readonly circumferenceCentimeters: number;
}>;
export type DbhFromCircumferenceOutput = Readonly<{
  readonly dbhCentimeters: number;
}>;

export const calculateDbhFromCircumference = (
  x: DbhFromCircumferenceInput,
): DbhFromCircumferenceOutput => {
  if (
    !Number.isFinite(x.circumferenceCentimeters) ||
    x.circumferenceCentimeters <= 0
  )
    simpleError(
      "circumferenceCentimeters",
      "Provide a finite positive number.",
    );
  const dbhCentimeters = x.circumferenceCentimeters / Math.PI;
  if (!Number.isFinite(dbhCentimeters))
    simpleError(
      "dbhCentimeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { dbhCentimeters: Object.is(dbhCentimeters, -0) ? 0 : dbhCentimeters };
};

export const example = {
  input: {
    circumferenceCentimeters: 100,
  },
  output: { dbhCentimeters: 31.830988618379067 },
} satisfies ToolExample<DbhFromCircumferenceInput, DbhFromCircumferenceOutput>;

export const tool = createSimpleTool({
  id: "forestry/dbh-from-circumference",
  title: "Dbh From Circumference",
  description:
    "Diameter at breast height in centimetres from stem circumference at the same measurement height.",
  inputs: [
    {
      id: "circumferenceCentimeters",
      kind: "number",
      label: "Circumference Centimeters",
      unit: "cm",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "dbhCentimeters",
      kind: "number",
      label: "Dbh Centimeters",
      unit: "cm",
    },
  ],
  calculate: (input) =>
    calculateDbhFromCircumference({
      circumferenceCentimeters: input.circumferenceCentimeters as number,
    }),
});
export const dbhFromCircumferenceTool = tool;
export const runDbhFromCircumference = tool.execute;
export default tool;
