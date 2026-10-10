import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly chartCode: string;
  readonly referencePopulation: string;
  readonly referenceVersion: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    chartCode: { type: "string", maxLength: 8192, minLength: 1 },
    referencePopulation: { type: "string", maxLength: 8192, minLength: 1 },
    referenceVersion: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["chartCode", "referencePopulation", "referenceVersion"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicitly selected growth-chart reference without providing centiles or choosing a clinical reference population. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { chartCode, referencePopulation, referenceVersion } = request;
  const compute = (): Output => {
    H.domain(chartCode.length > 0, "chartCode");
    H.domain(referencePopulation.length > 0, "referencePopulation");
    H.domain(referenceVersion.length > 0, "referenceVersion");
    return {
      token: JSON.stringify([chartCode, referencePopulation, referenceVersion]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    chartCode: "CH17",
    referencePopulation: "Population A",
    referenceVersion: "v3",
  },
  output: { token: '["CH17","Population A","v3"]' },
} satisfies ToolExample<Input, Output>;
export const pediatricGrowthReferenceKeyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["pediatrics", "health and medicine"],
      keywords: ["pediatrics", "health and medicine"],
    },
    id: "pediatrics/pediatric-growth-reference-key",
    title: "Pediatric Growth Reference Key",
    description:
      "Qualify an explicitly selected growth-chart reference without providing centiles or choosing a clinical reference population.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        chartCode: { type: "string", maxLength: 8192, minLength: 1 },
        referencePopulation: { type: "string", maxLength: 8192, minLength: 1 },
        referenceVersion: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["chartCode", "referencePopulation", "referenceVersion"],
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
          id: "chartCode",
          label: "Chart Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "referencePopulation",
          label: "Reference Population",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "referenceVersion",
          label: "Reference Version",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = pediatricGrowthReferenceKeyTool.execute;
export default pediatricGrowthReferenceKeyTool;
