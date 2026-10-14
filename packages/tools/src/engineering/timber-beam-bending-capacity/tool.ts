import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch49-shared.js";
export type Input = Readonly<{
  readonly callerAdjustedBendingStress: number;
  readonly actualSectionModulus: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "callerAdjustedBendingStress",
    label: "Caller adjusted bending stress",
    kind: "number",
  },
  {
    id: "actualSectionModulus",
    label: "Actual section modulus",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  positive(input.callerAdjustedBendingStress, "callerAdjustedBendingStress");
  positive(input.actualSectionModulus, "actualSectionModulus");
  return {
    value: input.callerAdjustedBendingStress * input.actualSectionModulus,
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { callerAdjustedBendingStress: 10, actualSectionModulus: 2 },
  output: { result: { value: 20 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/timber-beam-bending-capacity",
  title: "Timber Beam Bending Capacity Calculator",
  description:
    "Timber beam nominal material bending moment limit fbZ; adjusted stress, grade, wet service, size/stability factors independently engineer-established. Actual independently established compatible SI units/model context; conditional arithmetic, not code compliance, engineering design or safe operation approval.",
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
