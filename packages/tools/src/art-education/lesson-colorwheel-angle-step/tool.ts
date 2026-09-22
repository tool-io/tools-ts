import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sectors: number;
  readonly initialAngle: number;
  readonly sector: number;
};
export type Output = {
  readonly stepDegrees: number;
  readonly angleDegrees: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sectors: { type: "integer", minimum: 1 },
    initialAngle: { type: "number" },
    sector: { type: "integer", minimum: 0 },
  },
  required: ["sectors", "initialAngle", "sector"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stepDegrees: { type: "number" },
    angleDegrees: { type: "number" },
  },
  required: ["stepDegrees", "angleDegrees"],
} as const;
/** Even hue-circle teaching positions; no color-space or pigment-mixing equivalence is implied. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sectors, initialAngle, sector } = request;
  const compute = (): Output => {
    H.integer(sectors, 1);
    H.integer(sector, 0);
    return {
      stepDegrees: 360 / sectors,
      angleDegrees: H.mod(initialAngle + (360 * sector) / sectors, 360),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sectors: 12, initialAngle: 0, sector: 5 },
  output: { stepDegrees: 30, angleDegrees: 150 },
} satisfies ToolExample<Input, Output>;
export const lessonColorwheelAngleStepTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "art-education/lesson-colorwheel-angle-step",
    title: "Lesson Colorwheel Angle Step Tool",
    description:
      "Even hue-circle teaching positions; no color-space or pigment-mixing equivalence is implied.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sectors: { type: "integer", minimum: 1 },
        initialAngle: { type: "number" },
        sector: { type: "integer", minimum: 0 },
      },
      required: ["sectors", "initialAngle", "sector"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        stepDegrees: { type: "number" },
        angleDegrees: { type: "number" },
      },
      required: ["stepDegrees", "angleDegrees"],
    },
    ports: {
      inputs: [
        {
          id: "sectors",
          label: "Sectors",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "initialAngle",
          label: "Initial Angle",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sector",
          label: "Sector",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "stepDegrees",
          label: "Step Degrees",
          valueType: { type: "number" },
        },
        {
          id: "angleDegrees",
          label: "Angle Degrees",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = lessonColorwheelAngleStepTool.execute;
export default lessonColorwheelAngleStepTool;
