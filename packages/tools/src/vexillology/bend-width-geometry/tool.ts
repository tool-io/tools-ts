import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  rad,
  simpleError,
} from "../batch43-shared.js";

export type Input = Readonly<{
  readonly bandPerpendicularWidth: number;
  readonly angleDegrees: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "bandPerpendicularWidth",
    label: "Band perpendicular width",
    kind: "number",
  },
  { id: "angleDegrees", label: "Angle degrees", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  positive(input.bandPerpendicularWidth, "bandPerpendicularWidth");
  if (input.angleDegrees <= 0 || input.angleDegrees >= 90)
    simpleError("angle", "Strictly0–90 degrees nonsingular oblique angle.");
  return {
    verticalInterceptWidth:
      input.bandPerpendicularWidth /
      Math.abs(Math.cos(rad(input.angleDegrees))),
    horizontalInterceptWidth:
      input.bandPerpendicularWidth /
      Math.abs(Math.sin(rad(input.angleDegrees))),
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { bandPerpendicularWidth: 10, angleDegrees: 45 },
  output: {
    result: {
      verticalInterceptWidth: 14.142135623730951,
      horizontalInterceptWidth: 14.142135623730951,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vexillology/bend-width-geometry",
  title: "Diagonal Bend Width Geometry Calculator",
  description:
    "Ideal oblique flag band width projected to vertical/horizontal intercept spans; not clipped band area. Angle strictly between0 and 90 degrees.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          verticalInterceptWidth: { type: "number" },
          horizontalInterceptWidth: { type: "number" },
        },
        required: ["verticalInterceptWidth", "horizontalInterceptWidth"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
