import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TaperFunctionSimpleInput = Readonly<{
  readonly dbhCentimeters: number;
  readonly totalHeightMeters: number;
  readonly measurementHeightMeters: number;
}>;
export type TaperFunctionSimpleOutput = Readonly<{
  readonly estimatedDiameterCentimeters: number;
}>;

export const calculateTaperFunctionSimple = (
  x: TaperFunctionSimpleInput,
): TaperFunctionSimpleOutput => {
  if (!Number.isFinite(x.dbhCentimeters) || x.dbhCentimeters <= 0)
    simpleError("dbhCentimeters", "Provide a finite positive number.");
  if (!Number.isFinite(x.totalHeightMeters) || x.totalHeightMeters <= 0)
    simpleError("totalHeightMeters", "Provide a finite positive number.");
  if (
    !Number.isFinite(x.measurementHeightMeters) ||
    x.measurementHeightMeters < 0
  )
    simpleError(
      "measurementHeightMeters",
      "Provide a finite nonnegative number.",
    );
  if (!(
    x.totalHeightMeters > 1.3 &&
    x.measurementHeightMeters >= 1.3 &&
    x.measurementHeightMeters <= x.totalHeightMeters
  ))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const estimatedDiameterCentimeters =
    (x.dbhCentimeters * (x.totalHeightMeters - x.measurementHeightMeters)) /
    (x.totalHeightMeters - 1.3);
  if (!Number.isFinite(estimatedDiameterCentimeters))
    simpleError(
      "estimatedDiameterCentimeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    estimatedDiameterCentimeters: Object.is(estimatedDiameterCentimeters, -0)
      ? 0
      : estimatedDiameterCentimeters,
  };
};

export const example = {
  input: {
    dbhCentimeters: 20,
    totalHeightMeters: 20,
    measurementHeightMeters: 10,
  },
  output: { estimatedDiameterCentimeters: 10.695187165775401 },
} satisfies ToolExample<TaperFunctionSimpleInput, TaperFunctionSimpleOutput>;

export const tool = createSimpleTool({
  id: "forestry/taper-function-simple",
  title: "Taper Function Simple",
  description:
    "Linear stem-taper estimate above breast height, from measured DBH at 1.3 m to zero at total height.",
  inputs: [
    {
      id: "dbhCentimeters",
      kind: "number",
      label: "Dbh Centimeters",
      unit: "cm",
      minimum: 0,
    },
    {
      id: "totalHeightMeters",
      kind: "number",
      label: "Total Height Meters",
      unit: "m",
      minimum: 0,
    },
    {
      id: "measurementHeightMeters",
      kind: "number",
      label: "Measurement Height Meters",
      unit: "m",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "estimatedDiameterCentimeters",
      kind: "number",
      label: "Estimated Diameter Centimeters",
      unit: "cm",
    },
  ],
  calculate: (input) =>
    calculateTaperFunctionSimple({
      dbhCentimeters: input.dbhCentimeters as number,
      totalHeightMeters: input.totalHeightMeters as number,
      measurementHeightMeters: input.measurementHeightMeters as number,
    }),
});
export const taperFunctionSimpleTool = tool;
export const runTaperFunctionSimple = tool.execute;
export default tool;
