import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch43-shared.js";

export type Input = Readonly<{
  readonly independentlyAssessedThreeClauseSalience: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyAssessedThreeClauseSalience",
    label: "Independently assessed three clause salience",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (input.independentlyAssessedThreeClauseSalience.length !== 3)
    simpleError(
      "tricolon",
      "Exactly three independently annotated clause salience scores in one rubric.",
    );
  return {
    strictlyAscendingCallerSalience:
      input.independentlyAssessedThreeClauseSalience[0] <
        input.independentlyAssessedThreeClauseSalience[1] &&
      input.independentlyAssessedThreeClauseSalience[1] <
        input.independentlyAssessedThreeClauseSalience[2],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { independentlyAssessedThreeClauseSalience: [1, 2, 3] },
  output: { result: { strictlyAscendingCallerSalience: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "rhetoric/tricolon-three-part-ascending-build-checker",
  title: "Tricolon Three Part Ascending Build Checker",
  description:
    "Audit three-part ascending caller salience, not derive rhetorical force from clause word count.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
