import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly metricId: string;
  readonly denominatorWording: string;
  readonly source: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    metricId: { type: "string", maxLength: 8192, minLength: 1 },
    denominatorWording: { type: "string", maxLength: 8192, minLength: 1 },
    source: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["metricId", "denominatorWording", "source"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit ratio or percentage denominator by source without choosing the denominator. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { metricId, denominatorWording, source } = request;
  const compute = (): Output => {
    H.domain(metricId.length > 0, "metricId");
    H.domain(denominatorWording.length > 0, "denominatorWording");
    H.domain(source.length > 0, "source");
    return { token: JSON.stringify([metricId, denominatorWording, source]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    metricId: "M17",
    denominatorWording: "all recorded observations",
    source: "Study A",
  },
  output: { token: '["M17","all recorded observations","Study A"]' },
} satisfies ToolExample<Input, Output>;
export const ratioPercentageDenominatorLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["proportions", "mathematics"],
      keywords: ["proportions", "mathematics"],
    },
    id: "proportions/ratio-percentage-denominator-label",
    title: "Ratio Percentage Denominator Label",
    description:
      "Qualify an explicit ratio or percentage denominator by source without choosing the denominator.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        metricId: { type: "string", maxLength: 8192, minLength: 1 },
        denominatorWording: { type: "string", maxLength: 8192, minLength: 1 },
        source: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["metricId", "denominatorWording", "source"],
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
          id: "metricId",
          label: "Metric Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "denominatorWording",
          label: "Denominator Wording",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "source",
          label: "Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = ratioPercentageDenominatorLabelTool.execute;
export default ratioPercentageDenominatorLabelTool;
