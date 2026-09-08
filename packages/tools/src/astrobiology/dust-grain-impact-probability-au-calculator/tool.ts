import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch46-shared.js";
export type Input = Readonly<{
  readonly callerCalibratedImpactRatePerAu: number;
  readonly pathLengthAu: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerCalibratedImpactRatePerAu",
    label: "Caller calibrated impact rate per au",
    kind: "number",
  },
  { id: "pathLengthAu", label: "Path length au", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.callerCalibratedImpactRatePerAu, "rate");
  nonnegative(input.pathLengthAu, "path");
  return {
    conditionalAtLeastOneImpactProbability: -Math.expm1(
      -input.callerCalibratedImpactRatePerAu * input.pathLengthAu,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { callerCalibratedImpactRatePerAu: 1, pathLengthAu: 1 },
  output: {
    result: { conditionalAtLeastOneImpactProbability: 0.6321205588285577 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrobiology/dust-grain-impact-probability-au-calculator",
  title: "Interstellar Dust Grain Impact Probability per AU Calculator",
  description:
    "Conditional homogeneous Poisson dust-impact probability from independently calibrated geometry/size-specific rate per AU. No damage probability, actual dust environment or shield performance inferred.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
