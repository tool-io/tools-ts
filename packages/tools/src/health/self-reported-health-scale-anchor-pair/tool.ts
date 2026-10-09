import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly scaleId: string;
  readonly lowerAnchorWording: string;
  readonly upperAnchorWording: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scaleId: { type: "string", maxLength: 8192, minLength: 1 },
    lowerAnchorWording: { type: "string", maxLength: 8192, minLength: 1 },
    upperAnchorWording: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["scaleId", "lowerAnchorWording", "upperAnchorWording"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve explicit self-report scale anchor wording without assigning health scores. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { scaleId, lowerAnchorWording, upperAnchorWording } = request;
  const compute = (): Output => {
    H.domain(scaleId.length > 0, "scaleId");
    H.domain(lowerAnchorWording.length > 0, "lowerAnchorWording");
    H.domain(upperAnchorWording.length > 0, "upperAnchorWording");
    return {
      token: JSON.stringify([scaleId, lowerAnchorWording, upperAnchorWording]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    scaleId: "S17",
    lowerAnchorWording: "least reported",
    upperAnchorWording: "most reported",
  },
  output: { token: '["S17","least reported","most reported"]' },
} satisfies ToolExample<Input, Output>;
export const selfReportedHealthScaleAnchorPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["health", "health and medicine"],
      keywords: ["health", "health and medicine"],
    },
    id: "health/self-reported-health-scale-anchor-pair",
    title: "Self Reported Health Scale Anchor Pair",
    description:
      "Preserve explicit self-report scale anchor wording without assigning health scores.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        scaleId: { type: "string", maxLength: 8192, minLength: 1 },
        lowerAnchorWording: { type: "string", maxLength: 8192, minLength: 1 },
        upperAnchorWording: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["scaleId", "lowerAnchorWording", "upperAnchorWording"],
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
          id: "lowerAnchorWording",
          label: "Lower Anchor Wording",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "upperAnchorWording",
          label: "Upper Anchor Wording",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = selfReportedHealthScaleAnchorPairTool.execute;
export default selfReportedHealthScaleAnchorPairTool;
