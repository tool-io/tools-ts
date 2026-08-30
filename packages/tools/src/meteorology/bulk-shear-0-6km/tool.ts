import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, interpolate } from "../shared.js";

export type Input = Readonly<{
  readonly heightsAboveGroundM: readonly number[];
  readonly eastWindMPerSecond: readonly number[];
  readonly northWindMPerSecond: readonly number[];
}>;
export type Output = Readonly<{
  readonly bulkZeroToSixKmShearVectorMPerSecond: readonly number[];
  readonly bulkZeroToSixKmShearMagnitudeMPerSecond: number;
}>;
const inputFields = [
  {
    id: "heightsAboveGroundM",
    label: "Heights above ground m",
    kind: "numberList",
  },
  {
    id: "eastWindMPerSecond",
    label: "East wind m per second",
    kind: "numberList",
  },
  {
    id: "northWindMPerSecond",
    label: "North wind m per second",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const x =
      interpolate(input.heightsAboveGroundM, input.eastWindMPerSecond, 6000) -
      interpolate(input.heightsAboveGroundM, input.eastWindMPerSecond, 0),
    y =
      interpolate(input.heightsAboveGroundM, input.northWindMPerSecond, 6000) -
      interpolate(input.heightsAboveGroundM, input.northWindMPerSecond, 0);
  return {
    bulkZeroToSixKmShearVectorMPerSecond: [x, y],
    bulkZeroToSixKmShearMagnitudeMPerSecond: Math.hypot(x, y),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  heightsAboveGroundM: [0, 3000, 6000],
  eastWindMPerSecond: [1, 5, 11],
  northWindMPerSecond: [2, 5, 22],
} satisfies Input;
export const exampleOutput = {
  bulkZeroToSixKmShearVectorMPerSecond: [10, 20],
  bulkZeroToSixKmShearMagnitudeMPerSecond: 22.360679774997898,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "meteorology/bulk-shear-0-6km",
  title: "Bulk Shear 0 To 6KM",
  description:
    "Interpolate observed 0/6000 m AGL wind endpoints before signed bulk shear difference; full layer coverage required, not average shear rate, surface-speed difference or a storm warning.",
  inputs: inputFields,
  outputs: [
    {
      id: "bulkZeroToSixKmShearVectorMPerSecond",
      label: "Bulk zero to six km shear vector m per second",
      kind: "numberList",
    },
    {
      id: "bulkZeroToSixKmShearMagnitudeMPerSecond",
      label: "Bulk zero to six km shear magnitude m per second",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      heightsAboveGroundM: value.heightsAboveGroundM as readonly number[],
      eastWindMPerSecond: value.eastWindMPerSecond as readonly number[],
      northWindMPerSecond: value.northWindMPerSecond as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
