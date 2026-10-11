import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  nonnegative,
} from "../batch51-shared.js";
export type Input = Readonly<{ readonly actualFrequencyHz: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "actualFrequencyHz", label: "Actual frequency hz", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  nonnegative(input.actualFrequencyHz, "actualFrequencyHz");
  if (input.actualFrequencyHz > 20000) simpleError("f", "0…20kHzbranch.");
  return {
    value:
      13 * Math.atan(0.00076 * input.actualFrequencyHz) +
      3.5 * Math.atan((input.actualFrequencyHz / 7500) ** 2),
  };
};
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: { actualFrequencyHz: 1000 },
  output: { result: { value: 8.510531510721993 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "acoustics/bark-band-converter",
  title: "Bark Band Converter",
  description:
    "DeclaredZwickerBarkcoordinateapproximationz(f),0\u2264f\u226420kHz,not frequencybinindexormel. Actual matched calibration,units,edition,geometry/measurement and model applicability independently established;not hearing/structural safety,compliance or universal perceptual prediction.",
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
