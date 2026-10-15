import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch51-shared.js";
export type Input = Readonly<{ readonly actualCallerKnownAgeYears: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualCallerKnownAgeYears",
    label: "Actual caller known age years",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  bounded(
    input.actualCallerKnownAgeYears,
    "actualCallerKnownAgeYears",
    0,
    1000000,
  );
  return { value: 2 * input.actualCallerKnownAgeYears + 5 };
};
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: { actualCallerKnownAgeYears: 10 },
  output: { result: { value: 25 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "fun/magic-age-trick",
  title: "Magic Age Trick Calculator",
  description:
    "Transparenttoyagearithmeticaltransformation2age+5,agealreadycallerknown,not infer demographicage.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { value: { type: "number" } },
        required: ["value"],
      },
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
