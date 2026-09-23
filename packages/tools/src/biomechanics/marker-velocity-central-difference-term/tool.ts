import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly beforePosition: number;
  readonly afterPosition: number;
  readonly stepSeconds: number;
};
export type Output = { readonly velocity: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    beforePosition: { type: "number" },
    afterPosition: { type: "number" },
    stepSeconds: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["beforePosition", "afterPosition", "stepSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { velocity: { type: "number" } },
  required: ["velocity"],
} as const;
/** Symmetric samples equally spaced on either side of the evaluation instant; sample gap is twice stepSeconds. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { beforePosition, afterPosition, stepSeconds } = request;
  const compute = (): Output => {
    H.positive(stepSeconds);
    return { velocity: (afterPosition - beforePosition) / (2 * stepSeconds) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { beforePosition: 1, afterPosition: 1.4, stepSeconds: 0.1 },
  output: { velocity: 1.9999999999999996 },
} satisfies ToolExample<Input, Output>;
export const markerVelocityCentralDifferenceTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "biomechanics/marker-velocity-central-difference-term",
      title: "Marker Velocity Central Difference Term Tool",
      description:
        "Symmetric samples equally spaced on either side of the evaluation instant; sample gap is twice stepSeconds.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          beforePosition: { type: "number" },
          afterPosition: { type: "number" },
          stepSeconds: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["beforePosition", "afterPosition", "stepSeconds"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { velocity: { type: "number" } },
        required: ["velocity"],
      },
      ports: {
        inputs: [
          {
            id: "beforePosition",
            label: "Before Position",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "afterPosition",
            label: "After Position",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "stepSeconds",
            label: "Step Seconds",
            required: true,
            valueType: { type: "number", unit: "s" },
          },
        ],
        outputs: [
          { id: "velocity", label: "Velocity", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = markerVelocityCentralDifferenceTermTool.execute;
export default markerVelocityCentralDifferenceTermTool;
