import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly effectSize: number;
  readonly reverseReference: boolean;
};
export type Output = { readonly reorientedEffectSize: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    effectSize: { type: "number" },
    reverseReference: { type: "boolean" },
  },
  required: ["effectSize", "reverseReference"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { reorientedEffectSize: { type: "number" } },
  required: ["reorientedEffectSize"],
} as const;
/** Reverse or preserve an explicitly signed contrast effect size without transforming an odds ratio or unsigned measure. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { effectSize, reverseReference } = request;
  const compute = (): Output => {
    return { reorientedEffectSize: effectSize * (reverseReference ? -1 : 1) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { effectSize: 0.6, reverseReference: true },
  output: { reorientedEffectSize: -0.6 },
} satisfies ToolExample<Input, Output>;
export const effectSizeSignedReferenceChangeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["statistics", "mathematics"],
      keywords: ["statistics", "mathematics"],
    },
    id: "statistics/effect-size-signed-reference-change",
    title: "Effect Size Signed Reference Change",
    description:
      "Reverse or preserve an explicitly signed contrast effect size without transforming an odds ratio or unsigned measure.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        effectSize: { type: "number" },
        reverseReference: { type: "boolean" },
      },
      required: ["effectSize", "reverseReference"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { reorientedEffectSize: { type: "number" } },
      required: ["reorientedEffectSize"],
    },
    ports: {
      inputs: [
        {
          id: "effectSize",
          label: "Effect Size",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reverseReference",
          label: "Reverse Reference",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "reorientedEffectSize",
          label: "Reoriented Effect Size",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = effectSizeSignedReferenceChangeTool.execute;
export default effectSizeSignedReferenceChangeTool;
