import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch43-shared.js";

export type Input = Readonly<{
  readonly observedChargeCenter: readonly number[];
  readonly independentlyMeasuredFieldCentroid: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "observedChargeCenter",
    label: "Observed charge center",
    kind: "numberList",
  },
  {
    id: "independentlyMeasuredFieldCentroid",
    label: "Independently measured field centroid",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (
    input.observedChargeCenter.length !== 2 ||
    input.independentlyMeasuredFieldCentroid.length !== 2
  )
    simpleError("point", "Actual planar centroid pairs.");
  const v = input.observedChargeCenter.map(
    (x, i) => x - input.independentlyMeasuredFieldCentroid[i],
  );
  return { signedOffset: v, offsetDistance: Math.hypot(...v) };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    observedChargeCenter: [40, 70],
    independentlyMeasuredFieldCentroid: [50, 60],
  },
  output: {
    result: { signedOffset: [-10, 10], offsetDistance: 14.142135623730951 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "heraldry/single-charge-centering-offset",
  title: "Single Charge Centering Offset Calculator",
  description:
    "Offset actual charge center from independently measured shield centroid, not rectangular-envelope midpoint.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
