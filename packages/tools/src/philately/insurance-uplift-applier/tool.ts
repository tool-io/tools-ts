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
  readonly baseReplacementMinor: number;
  readonly upliftBasisPoints: number;
}>;
export type Output = Readonly<{ readonly estimatedValueMinor: number }>;
const inputFields = [
  {
    id: "baseReplacementMinor",
    label: "Base replacement minor",
    kind: "number",
  },
  { id: "upliftBasisPoints", label: "Uplift basis points", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  money(input.baseReplacementMinor, "amount");
  bounded(input.upliftBasisPoints, "basis points", 0, 100000);
  return {
    estimatedValueMinor: signedSum([
      input.baseReplacementMinor,
      rateMinor(input.baseReplacementMinor, input.upliftBasisPoints),
    ]),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  baseReplacementMinor: 10000,
  upliftBasisPoints: 2000,
} satisfies Input;
export const exampleOutput = { estimatedValueMinor: 12000 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "philately/insurance-uplift-applier",
  title: "Insurance Replacement Value Uplift Percent Applier",
  description:
    "Add caller insurance replacement uplift, not an insurer coverage decision. Exact nearest-minor rounding with ties away from zero, one caller currency. Caller independently verifies observations, reference edition, units and applicability; not a grading-service certificate, authentication, conservation treatment, actual market price or legal/insurance entitlement.",
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
      baseReplacementMinor: value.baseReplacementMinor as number,
      upliftBasisPoints: value.upliftBasisPoints as number,
    }),
});
export const run = tool.execute;
export default tool;
