import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly metricId: string;
  readonly outputUnit: string;
  readonly accountingBasis: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    metricId: { type: "string", maxLength: 8192, minLength: 1 },
    outputUnit: { type: "string", maxLength: 8192, minLength: 1 },
    accountingBasis: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["metricId", "outputUnit", "accountingBasis"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit sustainability metric denominator and accounting-basis label without comparing unlike metrics. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { metricId, outputUnit, accountingBasis } = request;
  const compute = (): Output => {
    H.domain(metricId.length > 0, "metricId");
    H.domain(outputUnit.length > 0, "outputUnit");
    H.domain(accountingBasis.length > 0, "accountingBasis");
    return { token: JSON.stringify([metricId, outputUnit, accountingBasis]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    metricId: "MET17",
    outputUnit: "kg product",
    accountingBasis: "farm gate",
  },
  output: { token: '["MET17","kg product","farm gate"]' },
} satisfies ToolExample<Input, Output>;
export const sustainabilityUnitOutputBasisTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "sustainable-agriculture",
        "sustainable agriculture",
        "agriculture",
      ],
      keywords: ["sustainable agriculture", "agriculture"],
    },
    id: "sustainable-agriculture/sustainability-unit-output-basis",
    title: "Sustainability Unit Output Basis",
    description:
      "Preserve an explicit sustainability metric denominator and accounting-basis label without comparing unlike metrics.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        metricId: { type: "string", maxLength: 8192, minLength: 1 },
        outputUnit: { type: "string", maxLength: 8192, minLength: 1 },
        accountingBasis: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["metricId", "outputUnit", "accountingBasis"],
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
          id: "outputUnit",
          label: "Output Unit",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "accountingBasis",
          label: "Accounting Basis",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = sustainabilityUnitOutputBasisTool.execute;
export default sustainabilityUnitOutputBasisTool;
