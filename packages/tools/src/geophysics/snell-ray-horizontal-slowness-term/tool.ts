import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly incidentRadians: number;
  readonly firstVelocity: number;
  readonly secondVelocity: number;
};
export type Output = {
  readonly horizontalSlowness: number;
  readonly transmittedSine: number;
  readonly transmittedRadians: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    incidentRadians: { type: "number" },
    firstVelocity: { type: "number", exclusiveMinimum: 0 },
    secondVelocity: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["incidentRadians", "firstVelocity", "secondVelocity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    horizontalSlowness: { type: "number" },
    transmittedSine: { type: "number" },
    transmittedRadians: { type: "number" },
  },
  required: ["horizontalSlowness", "transmittedSine", "transmittedRadians"],
} as const;
/** Snell horizontal slowness and real transmitted angle measured from interface normal; evanescent cases are rejected. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { incidentRadians, firstVelocity, secondVelocity } = request;
  const compute = (): Output => {
    H.positive(firstVelocity);
    H.positive(secondVelocity);
    H.domain(
      incidentRadians >= -Math.PI / 2 &&
        incidentRadians <= Math.PI / 2 &&
        Math.abs(
          (secondVelocity * Math.sin(incidentRadians)) / firstVelocity,
        ) <= 1,
    );
    return {
      horizontalSlowness: Math.sin(incidentRadians) / firstVelocity,
      transmittedSine:
        (secondVelocity * Math.sin(incidentRadians)) / firstVelocity,
      transmittedRadians: Math.asin(
        (secondVelocity * Math.sin(incidentRadians)) / firstVelocity,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    incidentRadians: 0.5235987755982988,
    firstVelocity: 2,
    secondVelocity: 2,
  },
  output: {
    horizontalSlowness: 0.24999999999999997,
    transmittedSine: 0.49999999999999994,
    transmittedRadians: 0.5235987755982988,
  },
} satisfies ToolExample<Input, Output>;
export const snellRayHorizontalSlownessTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geophysics/snell-ray-horizontal-slowness-term",
    title: "Snell Ray Horizontal Slowness Term Tool",
    description:
      "Snell horizontal slowness and real transmitted angle measured from interface normal; evanescent cases are rejected.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        incidentRadians: { type: "number" },
        firstVelocity: { type: "number", exclusiveMinimum: 0 },
        secondVelocity: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["incidentRadians", "firstVelocity", "secondVelocity"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        horizontalSlowness: { type: "number" },
        transmittedSine: { type: "number" },
        transmittedRadians: { type: "number" },
      },
      required: ["horizontalSlowness", "transmittedSine", "transmittedRadians"],
    },
    ports: {
      inputs: [
        {
          id: "incidentRadians",
          label: "Incident Radians",
          required: true,
          valueType: { type: "number", unit: "rad" },
        },
        {
          id: "firstVelocity",
          label: "First Velocity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondVelocity",
          label: "Second Velocity",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "horizontalSlowness",
          label: "Horizontal Slowness",
          valueType: { type: "number" },
        },
        {
          id: "transmittedSine",
          label: "Transmitted Sine",
          valueType: { type: "number" },
        },
        {
          id: "transmittedRadians",
          label: "Transmitted Radians",
          valueType: { type: "number", unit: "rad" },
        },
      ],
    },
  },
  calculate,
});
export const run = snellRayHorizontalSlownessTermTool.execute;
export default snellRayHorizontalSlownessTermTool;
