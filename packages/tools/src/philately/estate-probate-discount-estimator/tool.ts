import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  money,
  signedSum,
  rateMinor,
} from "../batch42-shared.js";
export type Input = Readonly<{
  readonly baseProbateMinor: number;
  readonly discountBasisPoints: number;
}>;
export type Output = Readonly<{ readonly estimatedValueMinor: number }>;
const inputFields = [
  { id: "baseProbateMinor", label: "Base probate minor", kind: "number" },
  { id: "discountBasisPoints", label: "Discount basis points", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  money(input.baseProbateMinor, "amount");
  bounded(input.discountBasisPoints, "basis points", 0, 10000);
  return {
    estimatedValueMinor: signedSum([
      input.baseProbateMinor,
      -rateMinor(input.baseProbateMinor, input.discountBasisPoints),
    ]),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  baseProbateMinor: 10000,
  discountBasisPoints: 2000,
} satisfies Input;
export const exampleOutput = { estimatedValueMinor: 8000 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "philately/estate-probate-discount-estimator",
  title: "Estate Probate Discount Value Estimator",
  description:
    "Subtract caller probate discount, not a tax or estate appraisal. Exact nearest-minor rounding with ties away from zero, one caller currency. Caller independently verifies observations, reference edition, units and applicability; not a grading-service certificate, authentication, conservation treatment, actual market price or legal/insurance entitlement.",
  inputs: inputFields,
  outputs: [
    {
      id: "estimatedValueMinor",
      label: "Estimated value minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      baseProbateMinor: value.baseProbateMinor as number,
      discountBasisPoints: value.discountBasisPoints as number,
    }),
});
export const run = tool.execute;
export default tool;
