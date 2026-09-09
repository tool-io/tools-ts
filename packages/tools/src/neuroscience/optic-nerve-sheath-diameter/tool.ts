import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, mean } from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyMeasuredLeftOnsDiametersMm: readonly number[];
  readonly independentlyMeasuredRightOnsDiametersMm: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyMeasuredLeftOnsDiametersMm",
    label: "Independently measured left ons diameters mm",
    kind: "numberList",
  },
  {
    id: "independentlyMeasuredRightOnsDiametersMm",
    label: "Independently measured right ons diameters mm",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  [
    input.independentlyMeasuredLeftOnsDiametersMm,
    input.independentlyMeasuredRightOnsDiametersMm,
  ].forEach((v) => v.forEach((x) => positive(x, "diameter")));
  const l = mean(input.independentlyMeasuredLeftOnsDiametersMm),
    r = mean(input.independentlyMeasuredRightOnsDiametersMm);
  return {
    observedLeftMeanOnsDiameterMm: l,
    observedRightMeanOnsDiameterMm: r,
    signedRightMinusLeftMeanMm: r - l,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyMeasuredLeftOnsDiametersMm: [4, 6],
    independentlyMeasuredRightOnsDiametersMm: [5, 7],
  },
  output: {
    result: {
      observedLeftMeanOnsDiameterMm: 5,
      observedRightMeanOnsDiameterMm: 6,
      signedRightMinusLeftMeanMm: 1,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/optic-nerve-sheath-diameter",
  title: "Optic Nerve Sheath Diameter Calculator",
  description:
    "Actual protocol-matched left/right optic-nerve-sheath repeat measurements, not infer intracranial pressure from an arbitrary universal cutoff. Measurement depth, plane, device and qualified assessment external.",
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
