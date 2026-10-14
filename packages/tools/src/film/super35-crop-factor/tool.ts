import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch50-shared.js";
export type Input = Readonly<{
  readonly callerMatchedReferenceImageDiagonal: number;
  readonly actualMeasuredActiveImageDiagonal: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "callerMatchedReferenceImageDiagonal",
    label: "Caller matched reference image diagonal",
    kind: "number",
  },
  {
    id: "actualMeasuredActiveImageDiagonal",
    label: "Actual measured active image diagonal",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  positive(
    input.callerMatchedReferenceImageDiagonal,
    "callerMatchedReferenceImageDiagonal",
  );
  positive(
    input.actualMeasuredActiveImageDiagonal,
    "actualMeasuredActiveImageDiagonal",
  );
  return {
    value:
      input.callerMatchedReferenceImageDiagonal /
      input.actualMeasuredActiveImageDiagonal,
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerMatchedReferenceImageDiagonal: 4,
    actualMeasuredActiveImageDiagonal: 2,
  },
  output: { result: { value: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "film/super35-crop-factor",
  title: "Super35 Crop Factor Calculator",
  description:
    "Actual Super35 active image DIAGONAL crop factor versus independent reference diagonal, same units. No universally fixed gate dimensions, field height fraction or lens factor prescribed.",
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
