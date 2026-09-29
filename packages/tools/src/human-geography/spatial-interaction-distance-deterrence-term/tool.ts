import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly distance: number;
  readonly scale: number;
  readonly power: number;
  readonly exponential: boolean;
};
export type Output = { readonly deterrence: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    distance: { type: "number", minimum: 0 },
    scale: { type: "number", exclusiveMinimum: 0 },
    power: { type: "number", minimum: 0 },
    exponential: { type: "boolean" },
  },
  required: ["distance", "scale", "power", "exponential"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { deterrence: { type: "number" } },
  required: ["deterrence"],
} as const;
/** Explicit exponential or shifted-power distance deterrence normalized to one at zero distance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { distance, scale, power, exponential } = request;
  const compute = (): Output => {
    H.domain(distance >= 0 && power >= 0);
    H.positive(scale);
    return {
      deterrence: exponential
        ? Math.exp(-distance / scale)
        : (1 + distance / scale) ** -power,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { distance: 10, scale: 10, power: 2, exponential: true },
  output: { deterrence: 0.36787944117144233 },
} satisfies ToolExample<Input, Output>;
export const spatialInteractionDistanceDeterrenceTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "human-geography/spatial-interaction-distance-deterrence-term",
      title: "Spatial Interaction Distance Deterrence Term Tool",
      description:
        "Explicit exponential or shifted-power distance deterrence normalized to one at zero distance.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          distance: { type: "number", minimum: 0 },
          scale: { type: "number", exclusiveMinimum: 0 },
          power: { type: "number", minimum: 0 },
          exponential: { type: "boolean" },
        },
        required: ["distance", "scale", "power", "exponential"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { deterrence: { type: "number" } },
        required: ["deterrence"],
      },
      ports: {
        inputs: [
          {
            id: "distance",
            label: "Distance",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "scale",
            label: "Scale",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "power",
            label: "Power",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "exponential",
            label: "Exponential",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "deterrence",
            label: "Deterrence",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = spatialInteractionDistanceDeterrenceTermTool.execute;
export default spatialInteractionDistanceDeterrenceTermTool;
