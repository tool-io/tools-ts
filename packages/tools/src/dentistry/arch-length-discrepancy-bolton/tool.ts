import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyMeasuredAvailableArchPerimeterMm: number;
  readonly independentlyMeasuredRequiredSummedToothWidthsMm: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyMeasuredAvailableArchPerimeterMm",
    label: "Independently measured available arch perimeter mm",
    kind: "number",
  },
  {
    id: "independentlyMeasuredRequiredSummedToothWidthsMm",
    label: "Independently measured required summed tooth widths mm",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.independentlyMeasuredAvailableArchPerimeterMm, "available");
  nonnegative(
    input.independentlyMeasuredRequiredSummedToothWidthsMm,
    "required",
  );
  return {
    signedObservedArchSpaceDiscrepancyMm:
      input.independentlyMeasuredAvailableArchPerimeterMm -
      input.independentlyMeasuredRequiredSummedToothWidthsMm,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyMeasuredAvailableArchPerimeterMm: 70,
    independentlyMeasuredRequiredSummedToothWidthsMm: 75,
  },
  output: { result: { signedObservedArchSpaceDiscrepancyMm: -5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dentistry/arch-length-discrepancy-bolton",
  title: "Bolton Arch Length Discrepancy Calculator",
  description:
    "Correct title premise:arch-space discrepancy=available arch perimeter\u2212required tooth-width sum, negative shortage. Boltonis interarch tooth-size ratio, not this arch-length calculation. Actual matching arc/tooth set and methodology external; no extraction decision.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
