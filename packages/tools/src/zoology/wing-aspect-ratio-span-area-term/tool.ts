import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly span: number;
  readonly oneWingArea: number;
  readonly wingCount: number;
};
export type Output = {
  readonly totalArea: number;
  readonly aspectRatio: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    span: { type: "number", minimum: 0 },
    oneWingArea: { type: "number", exclusiveMinimum: 0 },
    wingCount: { type: "integer", minimum: 1 },
  },
  required: ["span", "oneWingArea", "wingCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalArea: { type: "number" },
    aspectRatio: { type: "number" },
  },
  required: ["totalArea", "aspectRatio"],
} as const;
/** Span-squared over explicitly totaled wing planform area; all length and area units must be coherent. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { span, oneWingArea, wingCount } = request;
  const compute = (): Output => {
    H.domain(span >= 0);
    H.positive(oneWingArea);
    H.integer(wingCount, 1);
    return {
      totalArea: oneWingArea * wingCount,
      aspectRatio: span ** 2 / (oneWingArea * wingCount),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { span: 2, oneWingArea: 0.25, wingCount: 2 },
  output: { totalArea: 0.5, aspectRatio: 8 },
} satisfies ToolExample<Input, Output>;
export const wingAspectRatioSpanAreaTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "zoology/wing-aspect-ratio-span-area-term",
    title: "Wing Aspect Ratio Span Area Term Tool",
    description:
      "Span-squared over explicitly totaled wing planform area; all length and area units must be coherent.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        span: { type: "number", minimum: 0 },
        oneWingArea: { type: "number", exclusiveMinimum: 0 },
        wingCount: { type: "integer", minimum: 1 },
      },
      required: ["span", "oneWingArea", "wingCount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalArea: { type: "number" },
        aspectRatio: { type: "number" },
      },
      required: ["totalArea", "aspectRatio"],
    },
    ports: {
      inputs: [
        {
          id: "span",
          label: "Span",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "oneWingArea",
          label: "One Wing Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "wingCount",
          label: "Wing Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "totalArea", label: "Total Area", valueType: { type: "number" } },
        {
          id: "aspectRatio",
          label: "Aspect Ratio",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = wingAspectRatioSpanAreaTermTool.execute;
export default wingAspectRatioSpanAreaTermTool;
