import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly score: number;
  readonly sourceLower: number;
  readonly targetLower: number;
  readonly scaleFactor: number;
};
export type Output = { readonly mappedScore: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    score: { type: "number" },
    sourceLower: { type: "number" },
    targetLower: { type: "number" },
    scaleFactor: { type: "number" },
  },
  required: ["score", "sourceLower", "targetLower", "scaleFactor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { mappedScore: { type: "number" } },
  required: ["mappedScore"],
} as const;
/** Apply an explicitly supplied affine research item crosswalk without validating scale equivalence. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { score, sourceLower, targetLower, scaleFactor } = request;
  const compute = (): Output => {
    H.domain(scaleFactor !== 0);
    return { mappedScore: targetLower + (score - sourceLower) * scaleFactor };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { score: 3, sourceLower: 1, targetLower: 0, scaleFactor: 2 },
  output: { mappedScore: 4 },
} satisfies ToolExample<Input, Output>;
export const functionalItemScaleOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "physiotherapy/functional-item-scale-offset",
    title: "Functional Item Scale Offset Tool",
    description:
      "Apply an explicitly supplied affine research item crosswalk without validating scale equivalence.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        score: { type: "number" },
        sourceLower: { type: "number" },
        targetLower: { type: "number" },
        scaleFactor: { type: "number" },
      },
      required: ["score", "sourceLower", "targetLower", "scaleFactor"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { mappedScore: { type: "number" } },
      required: ["mappedScore"],
    },
    ports: {
      inputs: [
        {
          id: "score",
          label: "Score",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sourceLower",
          label: "Source Lower",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "targetLower",
          label: "Target Lower",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "scaleFactor",
          label: "Scale Factor",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "mappedScore",
          label: "Mapped Score",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = functionalItemScaleOffsetTool.execute;
export default functionalItemScaleOffsetTool;
