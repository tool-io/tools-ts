import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedValue: number;
  readonly center: number;
  readonly scale: number;
  readonly missingSentinel: number;
};
export type Output = {
  readonly scaledValue: number;
  readonly collidesWithSentinel: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedValue: { type: "number" },
    center: { type: "number" },
    scale: { type: "number" },
    missingSentinel: { type: "number" },
  },
  required: ["observedValue", "center", "scale", "missingSentinel"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scaledValue: { type: "number" },
    collidesWithSentinel: { type: "boolean" },
  },
  required: ["scaledValue", "collidesWithSentinel"],
} as const;
/** Compare an explicitly transformed scalar with a supplied missing-value sentinel without treating a collision as a missing observation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observedValue, center, scale, missingSentinel } = request;
  const compute = (): Output => {
    return {
      scaledValue: (observedValue - center) * scale,
      collidesWithSentinel:
        (observedValue - center) * scale === missingSentinel,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observedValue: 5, center: 1, scale: 2, missingSentinel: 8 },
  output: { scaledValue: 8, collidesWithSentinel: true },
} satisfies ToolExample<Input, Output>;
export const scaledMissingSentinelCollisionCheckTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["encode-decode"],
        fields: ["normalize", "data normalization", "computer science"],
        keywords: ["data normalization", "computer science"],
      },
      id: "normalize/scaled-missing-sentinel-collision-check",
      title: "Scaled Missing Sentinel Collision Check",
      description:
        "Compare an explicitly transformed scalar with a supplied missing-value sentinel without treating a collision as a missing observation.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          observedValue: { type: "number" },
          center: { type: "number" },
          scale: { type: "number" },
          missingSentinel: { type: "number" },
        },
        required: ["observedValue", "center", "scale", "missingSentinel"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          scaledValue: { type: "number" },
          collidesWithSentinel: { type: "boolean" },
        },
        required: ["scaledValue", "collidesWithSentinel"],
      },
      ports: {
        inputs: [
          {
            id: "observedValue",
            label: "Observed Value",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "center",
            label: "Center",
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
            id: "missingSentinel",
            label: "Missing Sentinel",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "scaledValue",
            label: "Scaled Value",
            valueType: { type: "number" },
          },
          {
            id: "collidesWithSentinel",
            label: "Collides With Sentinel",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = scaledMissingSentinelCollisionCheckTool.execute;
export default scaledMissingSentinelCollisionCheckTool;
