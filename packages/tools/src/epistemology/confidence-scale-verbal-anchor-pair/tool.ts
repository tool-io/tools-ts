import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly scaleId: string;
  readonly lowerAnchor: string;
  readonly upperAnchor: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scaleId: { type: "string", maxLength: 8192, minLength: 1 },
    lowerAnchor: { type: "string", maxLength: 8192, minLength: 1 },
    upperAnchor: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["scaleId", "lowerAnchor", "upperAnchor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve explicitly supplied lower and upper verbal confidence anchors without assigning numeric probabilities. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { scaleId, lowerAnchor, upperAnchor } = request;
  const compute = (): Output => {
    H.domain(scaleId.length > 0, "scaleId");
    H.domain(lowerAnchor.length > 0, "lowerAnchor");
    H.domain(upperAnchor.length > 0, "upperAnchor");
    return { token: JSON.stringify([scaleId, lowerAnchor, upperAnchor]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { scaleId: "S17", lowerAnchor: "uncertain", upperAnchor: "certain" },
  output: { token: '["S17","uncertain","certain"]' },
} satisfies ToolExample<Input, Output>;
export const confidenceScaleVerbalAnchorPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "epistemology/confidence-scale-verbal-anchor-pair",
    title: "Confidence Scale Verbal Anchor Pair Tool",
    description:
      "Preserve explicitly supplied lower and upper verbal confidence anchors without assigning numeric probabilities.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        scaleId: { type: "string", maxLength: 8192, minLength: 1 },
        lowerAnchor: { type: "string", maxLength: 8192, minLength: 1 },
        upperAnchor: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["scaleId", "lowerAnchor", "upperAnchor"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "scaleId",
          label: "Scale Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "lowerAnchor",
          label: "Lower Anchor",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "upperAnchor",
          label: "Upper Anchor",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = confidenceScaleVerbalAnchorPairTool.execute;
export default confidenceScaleVerbalAnchorPairTool;
