import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  noiseWeight,
} from "../batch51-shared.js";
export type Input = Readonly<{ readonly actualFrequencyHz: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "actualFrequencyHz", label: "Actual frequency hz", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  positive(input.actualFrequencyHz, "actualFrequencyHz");
  return { value: noiseWeight(input.actualFrequencyHz, true) };
};
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: { actualFrequencyHz: 100 },
  output: { result: { value: -19.144954291317546 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "acoustics/a-weighting-correction-lookup",
  title: "A-Weighting Correction Lookup",
  description:
    "Standardnominal A weightingtransfercorrectiondB fromactualpositivefrequency,not fullspectrumweightedLeq or calibratedinstrumenttolerance. Actual matched calibration,units,edition,geometry/measurement and model applicability independently established;not hearing/structural safety,compliance or universal perceptual prediction.",
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
