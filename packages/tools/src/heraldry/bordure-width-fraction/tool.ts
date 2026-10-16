import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  simpleError,
} from "../batch43-shared.js";

export type Input = Readonly<{
  readonly bordureWidth: number;
  readonly fieldWidth: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "bordureWidth", label: "Bordure width", kind: "number" },
  { id: "fieldWidth", label: "Field width", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  positive(input.fieldWidth, "fieldWidth");
  nonnegative(input.bordureWidth, "bordureWidth");
  if (input.bordureWidth > input.fieldWidth)
    simpleError("dimension", "Observed extent fits reference envelope.");
  return { observedFraction: input.bordureWidth / input.fieldWidth };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { bordureWidth: 20, fieldWidth: 100 },
  output: { result: { observedFraction: 0.2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "heraldry/bordure-width-fraction",
  title: "Bordure Border Width Fraction Calculator",
  description:
    "Observed bordure width fraction of caller horizontal field envelope.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { observedFraction: { type: "number" } },
        required: ["observedFraction"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
