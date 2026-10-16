import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch51-shared.js";
export type Input = Readonly<{ readonly actualTuningForkFrequencyHz: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualTuningForkFrequencyHz",
    label: "Actual tuning fork frequency hz",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  positive(input.actualTuningForkFrequencyHz, "actualTuningForkFrequencyHz");
  return { value: 2 * input.actualTuningForkFrequencyHz };
};
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: { actualTuningForkFrequencyHz: 360 },
  output: { result: { value: 720 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horology/tuning-fork-beats",
  title: "Tuning Fork Frequency to Beats Calculator",
  description:
    "ExplicitONEtickonEACHforkhalf-cycle beatspersecond2f,not vibrations/hourbalance frequency. Actual independently established geometry,calibration,product/rubricedition,units and applicability;not provenance,identity,grade,safe procedure or operational/compliance approval.",
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
