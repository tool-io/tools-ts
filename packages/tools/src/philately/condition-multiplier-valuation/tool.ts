import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  money,
  rateMinor,
} from "../batch42-shared.js";
export type Input = Readonly<{
  readonly catalogueBaseMinor: number;
  readonly conditionBasisPoints: number;
}>;
export type Output = Readonly<{ readonly estimatedValueMinor: number }>;
const inputFields = [
  { id: "catalogueBaseMinor", label: "Catalogue base minor", kind: "number" },
  {
    id: "conditionBasisPoints",
    label: "Condition basis points",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  money(input.catalogueBaseMinor, "amount");
  bounded(input.conditionBasisPoints, "basis points", 0, 100000);
  return {
    estimatedValueMinor: rateMinor(
      input.catalogueBaseMinor,
      input.conditionBasisPoints,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  catalogueBaseMinor: 10001,
  conditionBasisPoints: 5000,
} satisfies Input;
export const exampleOutput = { estimatedValueMinor: 5001 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "philately/condition-multiplier-valuation",
  title: "Condition Multiplier Applied Valuation Calculator",
  description:
    "Apply a caller condition multiplier to catalogue base. Exact nearest-minor rounding with ties away from zero, one caller currency. Caller independently verifies observations, reference edition, units and applicability; not a grading-service certificate, authentication, conservation treatment, actual market price or legal/insurance entitlement.",
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
      catalogueBaseMinor: value.catalogueBaseMinor as number,
      conditionBasisPoints: value.conditionBasisPoints as number,
    }),
});
export const run = tool.execute;
export default tool;
