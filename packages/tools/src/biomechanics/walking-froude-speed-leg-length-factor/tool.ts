import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly speed: number;
  readonly legLength: number;
  readonly gravity: number;
};
export type Output = {
  readonly froude: number;
  readonly normalizedSpeed: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    speed: { type: "number", minimum: 0 },
    legLength: { type: "number", exclusiveMinimum: 0 },
    gravity: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["speed", "legLength", "gravity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    froude: { type: "number" },
    normalizedSpeed: { type: "number" },
  },
  required: ["froude", "normalizedSpeed"],
} as const;
/** Calculate walking froude speed leg length factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { speed, legLength, gravity } = request;
  const compute = (): Output => {
    H.domain(speed >= 0);
    H.positive(legLength);
    H.positive(gravity);
    return {
      froude: speed ** 2 / (gravity * legLength),
      normalizedSpeed: speed / Math.sqrt(gravity * legLength),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { speed: 2, legLength: 1, gravity: 4 },
  output: { froude: 1, normalizedSpeed: 1 },
} satisfies ToolExample<Input, Output>;
export const walkingFroudeSpeedLegLengthFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biomechanics/walking-froude-speed-leg-length-factor",
    title: "Walking Froude Speed Leg Length Factor Tool",
    description:
      "Calculate walking froude speed leg length factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        speed: { type: "number", minimum: 0 },
        legLength: { type: "number", exclusiveMinimum: 0 },
        gravity: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["speed", "legLength", "gravity"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        froude: { type: "number" },
        normalizedSpeed: { type: "number" },
      },
      required: ["froude", "normalizedSpeed"],
    },
    ports: {
      inputs: [
        {
          id: "speed",
          label: "Speed",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "legLength",
          label: "Leg Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "gravity",
          label: "Gravity",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "froude", label: "Froude", valueType: { type: "number" } },
        {
          id: "normalizedSpeed",
          label: "Normalized Speed",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = walkingFroudeSpeedLegLengthFactorTool.execute;
export default walkingFroudeSpeedLegLengthFactorTool;
