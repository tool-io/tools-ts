import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, fraction } from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualIndependentlyAssessedResponseRisk: number;
  readonly matchedIndependentlyAssessedBackgroundRisk: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualIndependentlyAssessedResponseRisk",
    label: "Actual independently assessed response risk",
    kind: "number",
  },
  {
    id: "matchedIndependentlyAssessedBackgroundRisk",
    label: "Matched independently assessed background risk",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  fraction(input.actualIndependentlyAssessedResponseRisk, "response");
  fraction(input.matchedIndependentlyAssessedBackgroundRisk, "background");
  return {
    signedObservedAddedRisk:
      input.actualIndependentlyAssessedResponseRisk -
      input.matchedIndependentlyAssessedBackgroundRisk,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualIndependentlyAssessedResponseRisk: 0.3,
    matchedIndependentlyAssessedBackgroundRisk: 0.1,
  },
  output: { result: { signedObservedAddedRisk: 0.2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "toxicology/added-risk",
  title: "Added Risk Calculator",
  description:
    "Added risk=response\u2212background, not normalized extra risk or infer a causal excess from observational rates. Actual matched risk populations/endpoint conventions external.",
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
