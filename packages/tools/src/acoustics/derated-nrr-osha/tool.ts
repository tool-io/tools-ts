import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch51-shared.js";
export type Input = Readonly<{ readonly callerApplicableLabeledNrrDb: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "callerApplicableLabeledNrrDb",
    label: "Caller applicable labeled nrr db",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  nonnegative(
    input.callerApplicableLabeledNrrDb,
    "callerApplicableLabeledNrrDb",
  );
  return { value: Math.max(0, (input.callerApplicableLabeledNrrDb - 7) / 2) };
};
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: { callerApplicableLabeledNrrDb: 27 },
  output: { result: { value: 10 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "acoustics/derated-nrr-osha",
  title: "Derated NRR OSHA Calculator",
  description:
    "DeclaredOSHA-style50%deratedA-weightedNRRadjustmentmax(0,(NRR\u22127)/2),not fittingcertification/earlevel/safehearinglimit. Actual matched calibration,units,edition,geometry/measurement and model applicability independently established;not hearing/structural safety,compliance or universal perceptual prediction.",
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
