import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  money,
  signedSum,
} from "../batch42-shared.js";
export type Input = Readonly<{
  readonly realizedHammerMinor: number;
  readonly estimateMinor: number;
}>;
export type Output = Readonly<{
  readonly signedVarianceMinor: number;
  readonly signedVariancePercent: number;
}>;
const inputFields = [
  { id: "realizedHammerMinor", label: "Realized hammer minor", kind: "number" },
  { id: "estimateMinor", label: "Estimate minor", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  money(input.realizedHammerMinor, "realized");
  money(input.estimateMinor, "estimate");
  positive(input.estimateMinor, "estimate");
  return {
    signedVarianceMinor: signedSum([
      input.realizedHammerMinor,
      -input.estimateMinor,
    ]),
    signedVariancePercent:
      (100 * (input.realizedHammerMinor - input.estimateMinor)) /
      input.estimateMinor,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  realizedHammerMinor: 12000,
  estimateMinor: 10000,
} satisfies Input;
export const exampleOutput = {
  signedVarianceMinor: 2000,
  signedVariancePercent: 20,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "philately/realized-hammer-variance-percent",
  title: "Realized versus Estimate Hammer Variance Percent Calculator",
  description:
    "Compare same-currency hammer and estimate, not hammer with all-in price. Caller independently verifies observations, reference edition, units and applicability; not a grading-service certificate, authentication, conservation treatment, actual market price or legal/insurance entitlement.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedVarianceMinor",
      label: "Signed variance minor",
      kind: "number",
    },
    {
      id: "signedVariancePercent",
      label: "Signed variance percent",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      realizedHammerMinor: value.realizedHammerMinor as number,
      estimateMinor: value.estimateMinor as number,
    }),
});
export const run = tool.execute;
export default tool;
