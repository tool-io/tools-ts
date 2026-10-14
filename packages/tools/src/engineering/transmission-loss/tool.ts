import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualIncidentAcousticPower: number;
  readonly actualTransmittedAcousticPower: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualIncidentAcousticPower",
    label: "Actual incident acoustic power",
    kind: "number",
  },
  {
    id: "actualTransmittedAcousticPower",
    label: "Actual transmitted acoustic power",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  positive(input.actualIncidentAcousticPower, "actualIncidentAcousticPower");
  positive(
    input.actualTransmittedAcousticPower,
    "actualTransmittedAcousticPower",
  );
  return {
    value:
      10 *
      Math.log10(
        input.actualIncidentAcousticPower /
          input.actualTransmittedAcousticPower,
      ),
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualIncidentAcousticPower: 10, actualTransmittedAcousticPower: 1 },
  output: { result: { value: 10 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/transmission-loss",
  title: "Transmission Loss Calculator",
  description:
    "Actual acoustic power transmission loss10log incident/transmitted, not sonar geometric propagation or field pressure difference without area correction. Actual independently established compatible SI units/model context; conditional arithmetic, not code compliance, engineering design or safe operation approval.",
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
