import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, angle } from "../batch52-shared.js";
export type Input = Readonly<{ readonly azimuthDegrees: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "azimuthDegrees", label: "Azimuth degrees", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  angle(i.azimuthDegrees, "azimuth", 0, 360);
  const a = i.azimuthDegrees % 360;
  return {
    quadrant: a <= 90 ? "NE" : a <= 180 ? "SE" : a <= 270 ? "SW" : "NW",
    quadrantAngleDegrees:
      a <= 90 ? a : a <= 180 ? 180 - a : a <= 270 ? a - 180 : 360 - a,
  };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { azimuthDegrees: 330 },
  output: { result: { quadrant: "NW", quadrantAngleDegrees: 30 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cartography/azimuth-to-quadrant-formatter",
  title: "Azimuth to Quadrant Bearing Formatter",
  description:
    "Azimuth to quadrant bearing, boundary convention NE at north/east, SE at south and SW at west; 360 normalizes to north.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          quadrant: { type: "string" },
          quadrantAngleDegrees: { type: "number" },
        },
        required: ["quadrant", "quadrantAngleDegrees"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
