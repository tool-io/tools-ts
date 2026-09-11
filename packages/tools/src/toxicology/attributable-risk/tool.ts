import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  fraction,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualIndependentlyAssessedExposedRisk: number;
  readonly actualMatchedUnexposedRisk: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualIndependentlyAssessedExposedRisk",
    label: "Actual independently assessed exposed risk",
    kind: "number",
  },
  {
    id: "actualMatchedUnexposedRisk",
    label: "Actual matched unexposed risk",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  fraction(input.actualIndependentlyAssessedExposedRisk, "exposed-risk");
  positive(input.actualIndependentlyAssessedExposedRisk, "exposed-risk");
  fraction(input.actualMatchedUnexposedRisk, "unexposed-risk");
  const d =
    input.actualIndependentlyAssessedExposedRisk -
    input.actualMatchedUnexposedRisk;
  return {
    signedObservedAttributableRisk: d,
    conditionalExposedAttributableFraction:
      d / input.actualIndependentlyAssessedExposedRisk,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualIndependentlyAssessedExposedRisk: 0.3,
    actualMatchedUnexposedRisk: 0.1,
  },
  output: {
    result: {
      signedObservedAttributableRisk: 0.2,
      conditionalExposedAttributableFraction: 0.6666666666666666,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "toxicology/attributable-risk",
  title: "Attributable Risk Calculator",
  description:
    "Actual independently qualified exposed-versus-unexposed risk difference and difference/exposed-risk fraction. Causal attribution, confounding and compatible populations external; negative results retained, not predicted toxic harm.",
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
