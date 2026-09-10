import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch48-shared.js";
export type Input = Readonly<{
  readonly independentlyEstablishedEvenModePropagationConstantPerMeter: number;
  readonly independentlyEstablishedOddModePropagationConstantPerMeter: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyEstablishedEvenModePropagationConstantPerMeter",
    label: "Independently established even mode propagation constant per meter",
    kind: "number",
  },
  {
    id: "independentlyEstablishedOddModePropagationConstantPerMeter",
    label: "Independently established odd mode propagation constant per meter",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(
    input.independentlyEstablishedEvenModePropagationConstantPerMeter,
    "evenbeta",
  );
  positive(
    input.independentlyEstablishedOddModePropagationConstantPerMeter,
    "oddbeta",
  );
  positive(
    Math.abs(
      input.independentlyEstablishedEvenModePropagationConstantPerMeter -
        input.independentlyEstablishedOddModePropagationConstantPerMeter,
    ),
    "supermode-splitting",
  );
  return {
    conditionalCompleteTransferLengthMeters:
      Math.PI /
      Math.abs(
        input.independentlyEstablishedEvenModePropagationConstantPerMeter -
          input.independentlyEstablishedOddModePropagationConstantPerMeter,
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyEstablishedEvenModePropagationConstantPerMeter: 4,
    independentlyEstablishedOddModePropagationConstantPerMeter: 2,
  },
  output: {
    result: { conditionalCompleteTransferLengthMeters: 1.5707963267948966 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/directional-coupler-coupling-length",
  title: "Semiconductor Directional Coupler Coupling Length Calculator",
  description:
    "Ideal identical lossless two-waveguide complete-transfer coupling length \u03c0/|\u03b2even\u2212\u03b2odd|from independently established supermode propagation constants. No asymmetry, loss, dispersion or geometric coupling inference.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
