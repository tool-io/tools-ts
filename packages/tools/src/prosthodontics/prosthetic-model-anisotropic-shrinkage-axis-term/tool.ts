import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly axes: readonly number[];
  readonly retention: readonly number[];
};
export type Output = {
  readonly correctedAxes: readonly number[];
  readonly volumeRetention: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    axes: { type: "array", maxItems: 256, items: { type: "number" } },
    retention: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["axes", "retention"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    correctedAxes: { type: "array", maxItems: 256, items: { type: "number" } },
    volumeRetention: { type: "number" },
  },
  required: ["correctedAxes", "volumeRetention"],
} as const;
/** Calculate prosthetic model anisotropic shrinkage axis term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { axes, retention } = request;
  const compute = (): Output => {
    H.domain(
      axes.length === 3 &&
        retention.length === 3 &&
        axes.every((x) => x >= 0) &&
        retention.every((x) => x > 0),
    );
    return {
      correctedAxes: axes.map((x, i) => x / retention[i]),
      volumeRetention: retention[0] * retention[1] * retention[2],
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { axes: [8, 18, 27], retention: [0.8, 0.9, 0.9] },
  output: { correctedAxes: [10, 20, 30], volumeRetention: 0.6480000000000001 },
} satisfies ToolExample<Input, Output>;
export const prostheticModelAnisotropicShrinkageAxisTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "prosthodontics/prosthetic-model-anisotropic-shrinkage-axis-term",
      title: "Prosthetic Model Anisotropic Shrinkage Axis Term Tool",
      description:
        "Calculate prosthetic model anisotropic shrinkage axis term from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          axes: { type: "array", maxItems: 256, items: { type: "number" } },
          retention: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
        },
        required: ["axes", "retention"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          correctedAxes: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
          volumeRetention: { type: "number" },
        },
        required: ["correctedAxes", "volumeRetention"],
      },
      ports: {
        inputs: [
          {
            id: "axes",
            label: "Axes",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "retention",
            label: "Retention",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
        ],
        outputs: [
          {
            id: "correctedAxes",
            label: "Corrected Axes",
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "volumeRetention",
            label: "Volume Retention",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = prostheticModelAnisotropicShrinkageAxisTermTool.execute;
export default prostheticModelAnisotropicShrinkageAxisTermTool;
