import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly axisRms: readonly number[];
  readonly suppliedWeights: readonly number[];
  readonly referenceRms: number;
};
export type Output = {
  readonly weightedRms: number;
  readonly referenceRatio: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    axisRms: { type: "array", maxItems: 256, items: { type: "number" } },
    suppliedWeights: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    referenceRms: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["axisRms", "suppliedWeights", "referenceRms"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    weightedRms: { type: "number" },
    referenceRatio: { type: "number" },
  },
  required: ["weightedRms", "referenceRatio"],
} as const;
/** Combine supplied orthogonal RMS components and weights without selecting occupational limits. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { axisRms, suppliedWeights, referenceRms } = request;
  const compute = (): Output => {
    H.sameLength(axisRms, suppliedWeights);
    H.domain(
      axisRms.every((x) => x >= 0) && suppliedWeights.every((x) => x >= 0),
    );
    H.positive(referenceRms);
    return {
      weightedRms: Math.hypot(...axisRms.map((x, i) => x * suppliedWeights[i])),
      referenceRatio:
        Math.hypot(...axisRms.map((x, i) => x * suppliedWeights[i])) /
        referenceRms,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { axisRms: [3, 4], suppliedWeights: [1, 1], referenceRms: 10 },
  output: { weightedRms: 5, referenceRatio: 0.5 },
} satisfies ToolExample<Input, Output>;
export const vibrationAxisWeightReferenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "occupational-health/vibration-axis-weight-reference",
    title: "Vibration Axis Weight Reference Tool",
    description:
      "Combine supplied orthogonal RMS components and weights without selecting occupational limits.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        axisRms: { type: "array", maxItems: 256, items: { type: "number" } },
        suppliedWeights: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        referenceRms: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["axisRms", "suppliedWeights", "referenceRms"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        weightedRms: { type: "number" },
        referenceRatio: { type: "number" },
      },
      required: ["weightedRms", "referenceRatio"],
    },
    ports: {
      inputs: [
        {
          id: "axisRms",
          label: "Axis Rms",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "suppliedWeights",
          label: "Supplied Weights",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "referenceRms",
          label: "Reference Rms",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "weightedRms",
          label: "Weighted Rms",
          valueType: { type: "number" },
        },
        {
          id: "referenceRatio",
          label: "Reference Ratio",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = vibrationAxisWeightReferenceTool.execute;
export default vibrationAxisWeightReferenceTool;
