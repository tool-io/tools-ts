import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualRoomVolumeCubicMeters: number;
  readonly actualEquivalentAbsorptionAreaSquareMeters: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualRoomVolumeCubicMeters",
    label: "Actual room volume cubic meters",
    kind: "number",
  },
  {
    id: "actualEquivalentAbsorptionAreaSquareMeters",
    label: "Actual equivalent absorption area square meters",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  positive(input.actualRoomVolumeCubicMeters, "actualRoomVolumeCubicMeters");
  positive(
    input.actualEquivalentAbsorptionAreaSquareMeters,
    "actualEquivalentAbsorptionAreaSquareMeters",
  );
  return {
    value:
      (0.161 * input.actualRoomVolumeCubicMeters) /
      input.actualEquivalentAbsorptionAreaSquareMeters,
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualRoomVolumeCubicMeters: 10,
    actualEquivalentAbsorptionAreaSquareMeters: 1,
  },
  output: { result: { value: 1.61 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/reverberation-time-sabine",
  title: "Sabine Reverberation Time Calculator",
  description:
    "Metric SabineT60=0.161V/Ausing independently established equivalent absorption area, diffuse field/low absorption approximation; not waveform decay measurement or universal room acoustics. Actual independently established compatible SI units/model context; conditional arithmetic, not code compliance, engineering design or safe operation approval.",
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
