import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly spend: number;
  readonly scale: number;
  readonly halfSaturation: number;
  readonly exponent: number;
};
export type Output = { readonly response: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    spend: { type: "number", exclusiveMinimum: 0 },
    scale: { type: "number", minimum: 0 },
    halfSaturation: { type: "number", exclusiveMinimum: 0 },
    exponent: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["spend", "scale", "halfSaturation", "exponent"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { response: { type: "number" } },
  required: ["response"],
} as const;
/** Hill saturation response for one channel with all fitted parameters supplied explicitly. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { spend, scale, halfSaturation, exponent } = request;
  const compute = (): Output => {
    H.positive(spend);
    H.domain(scale >= 0);
    H.positive(halfSaturation);
    H.positive(exponent);
    return { response: scale / (1 + (halfSaturation / spend) ** exponent) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { spend: 100, scale: 1000, halfSaturation: 100, exponent: 2 },
  output: { response: 500 },
} satisfies ToolExample<Input, Output>;
export const marketingMixOneChannelResponseTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "marketing/marketing-mix-one-channel-response-term",
    title: "Marketing Mix One Channel Response Term Tool",
    description:
      "Hill saturation response for one channel with all fitted parameters supplied explicitly.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        spend: { type: "number", exclusiveMinimum: 0 },
        scale: { type: "number", minimum: 0 },
        halfSaturation: { type: "number", exclusiveMinimum: 0 },
        exponent: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["spend", "scale", "halfSaturation", "exponent"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { response: { type: "number" } },
      required: ["response"],
    },
    ports: {
      inputs: [
        {
          id: "spend",
          label: "Spend",
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
          id: "halfSaturation",
          label: "Half Saturation",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "exponent",
          label: "Exponent",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "response", label: "Response", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = marketingMixOneChannelResponseTermTool.execute;
export default marketingMixOneChannelResponseTermTool;
