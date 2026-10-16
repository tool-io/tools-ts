import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualBeatErrorMilliseconds: number;
  readonly actualOscillationFrequencyHz: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualBeatErrorMilliseconds",
    label: "Actual beat error milliseconds",
    kind: "number",
  },
  {
    id: "actualOscillationFrequencyHz",
    label: "Actual oscillation frequency hz",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  nonnegative(input.actualBeatErrorMilliseconds, "actualBeatErrorMilliseconds");
  positive(input.actualOscillationFrequencyHz, "actualOscillationFrequencyHz");
  return {
    value:
      (input.actualBeatErrorMilliseconds *
        input.actualOscillationFrequencyHz *
        360) /
      1000,
  };
};
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: { actualBeatErrorMilliseconds: 1, actualOscillationFrequencyHz: 2 },
  output: { result: { value: 0.72 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horology/beat-error-to-degrees",
  title: "Beat Error to Degrees Calculator",
  description:
    "Declaredfullcyclephaseangleofactualtimeerror360ft,not half-beatdifferenceora safe escapementadjustment. Actual independently established geometry,calibration,product/rubricedition,units and applicability;not provenance,identity,grade,safe procedure or operational/compliance approval.",
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
