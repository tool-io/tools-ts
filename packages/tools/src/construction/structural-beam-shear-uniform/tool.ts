import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualUniformLoadPerLength: number;
  readonly actualSimplySupportedSpan: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualUniformLoadPerLength",
    label: "Actual uniform load per length",
    kind: "number",
  },
  {
    id: "actualSimplySupportedSpan",
    label: "Actual simply supported span",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  nonnegative(input.actualUniformLoadPerLength, "actualUniformLoadPerLength");
  positive(input.actualSimplySupportedSpan, "actualSimplySupportedSpan");
  return {
    value:
      (input.actualUniformLoadPerLength * input.actualSimplySupportedSpan) / 2,
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualUniformLoadPerLength: 5, actualSimplySupportedSpan: 4 },
  output: { result: { value: 10 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "construction/structural-beam-shear-uniform",
  title: "Beam Shear Uniform Calculator",
  description:
    "Simply supported full span uniform load maximum reaction/end shear|V|max=wL/2, no bending moment or continuous beam analysis. Actual independently established design/material/calibration and matched units; not a safe work instruction, code compliance or engineering approval.",
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
