import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick, angle } from "../batch52-shared.js";
export type Input = Readonly<{
  readonly quadrant: string;
  readonly angleDegrees: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "quadrant", label: "Quadrant", kind: "string" },
  { id: "angleDegrees", label: "Angle degrees", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  angle(i.angleDegrees, "angle", 0, 90);
  const a = pick(
    i.quadrant,
    {
      NE: i.angleDegrees,
      SE: 180 - i.angleDegrees,
      SW: 180 + i.angleDegrees,
      NW: 360 - i.angleDegrees,
    },
    "quadrant",
  );
  return { azimuthDegrees: a % 360 };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { quadrant: "NW", angleDegrees: 30 },
  output: { result: { azimuthDegrees: 330 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cartography/quadrant-to-azimuth-converter",
  title: "Quadrant Bearing to Azimuth Converter",
  description:
    "Four quadrant convention note; numerical conversion implemented separately by the angle input.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { azimuthDegrees: { type: "number" } },
        required: ["azimuthDegrees"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
