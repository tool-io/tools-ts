import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualMediumSoundSpeed: number;
  readonly actualPlateMassPerArea: number;
  readonly actualPlateFlexuralRigidity: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualMediumSoundSpeed",
    label: "Actual medium sound speed",
    kind: "number",
  },
  {
    id: "actualPlateMassPerArea",
    label: "Actual plate mass per area",
    kind: "number",
  },
  {
    id: "actualPlateFlexuralRigidity",
    label: "Actual plate flexural rigidity",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  positive(input.actualMediumSoundSpeed, "actualMediumSoundSpeed");
  positive(input.actualPlateMassPerArea, "actualPlateMassPerArea");
  positive(input.actualPlateFlexuralRigidity, "actualPlateFlexuralRigidity");
  return {
    value:
      (input.actualMediumSoundSpeed ** 2 / (2 * Math.PI)) *
      Math.sqrt(
        input.actualPlateMassPerArea / input.actualPlateFlexuralRigidity,
      ),
  };
};
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: {
    actualMediumSoundSpeed: 1,
    actualPlateMassPerArea: 1,
    actualPlateFlexuralRigidity: 1,
  },
  output: { result: { value: 0.15915494309189535 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "acoustics/wall-coincidence-frequency",
  title: "Wall Coincidence Frequency Calculator",
  description:
    "Idealcriticalcoincidencefrequencythinplate c\u00b2/(2\u03c0)\u221a(m/D),not arbitrarySTC from masslaw. Actual matched calibration,units,edition,geometry/measurement and model applicability independently established;not hearing/structural safety,compliance or universal perceptual prediction.",
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
