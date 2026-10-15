import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  nonnegative,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualOverBarkDiameter: number;
  readonly actualUnderBarkDiameter: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualOverBarkDiameter",
    label: "Actual over bark diameter",
    kind: "number",
  },
  {
    id: "actualUnderBarkDiameter",
    label: "Actual under bark diameter",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  positive(input.actualOverBarkDiameter, "actualOverBarkDiameter");
  nonnegative(input.actualUnderBarkDiameter, "actualUnderBarkDiameter");
  if (input.actualOverBarkDiameter < input.actualUnderBarkDiameter)
    simpleError("bark", "ActualOD≥ID.");
  return {
    value: input.actualOverBarkDiameter - input.actualUnderBarkDiameter,
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualOverBarkDiameter: 10, actualUnderBarkDiameter: 8 },
  output: { result: { value: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/double-bark-thickness",
  title: "Double Bark Thickness Calculator",
  description:
    "Actual diametral DOUBLE bark thickness OD\u2212ID, not average RADIAL thickness(OD\u2212ID)/2.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { value: { type: "number" } },
        required: ["value"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
