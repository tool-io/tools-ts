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
  readonly actualRoomVolume: number;
  readonly actualFrequencyHz: number;
  readonly actualMediumSoundSpeed: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "actualRoomVolume", label: "Actual room volume", kind: "number" },
  { id: "actualFrequencyHz", label: "Actual frequency hz", kind: "number" },
  {
    id: "actualMediumSoundSpeed",
    label: "Actual medium sound speed",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  positive(input.actualRoomVolume, "actualRoomVolume");
  nonnegative(input.actualFrequencyHz, "actualFrequencyHz");
  positive(input.actualMediumSoundSpeed, "actualMediumSoundSpeed");
  return {
    value:
      (4 * Math.PI * input.actualRoomVolume * input.actualFrequencyHz ** 2) /
      input.actualMediumSoundSpeed ** 3,
  };
};
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: {
    actualRoomVolume: 1,
    actualFrequencyHz: 1,
    actualMediumSoundSpeed: 1,
  },
  output: { result: { value: 12.566370614359172 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "acoustics/modal-density-high-frequency",
  title: "Modal Density High Frequency Calculator",
  description:
    "Leadingvolume Weylhigh-frequencyroommodaldensitydN/df=4\u03c0Vf\u00b2/c\u00b3,omittedsurface/edgecorrections,not exactlowfrequencymode enumeration. Actual matched calibration,units,edition,geometry/measurement and model applicability independently established;not hearing/structural safety,compliance or universal perceptual prediction.",
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
