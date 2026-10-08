import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly limit: number;
  readonly unit: string;
  readonly belowLimit: boolean;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    limit: { type: "number", minimum: 0 },
    unit: { type: "string", maxLength: 8192, minLength: 1 },
    belowLimit: { type: "boolean" },
  },
  required: ["limit", "unit", "belowLimit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Format an explicitly recorded hormone assay detection-limit statement without substituting a concentration or interpreting hormone status. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { limit, unit, belowLimit } = request;
  const compute = (): Output => {
    H.domain(limit >= 0 && unit.length > 0, "limit");
    return { token: (belowLimit ? "< " : "limit ") + limit + " " + unit };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { limit: 0.1, unit: "nmol/L", belowLimit: true },
  output: { token: "< 0.1 nmol/L" },
} satisfies ToolExample<Input, Output>;
export const hormoneTestDetectionLimitTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["endocrinology", "health and medicine"],
      keywords: ["endocrinology", "health and medicine"],
    },
    id: "endocrinology/hormone-test-detection-limit-token",
    title: "Hormone Test Detection Limit Token",
    description:
      "Format an explicitly recorded hormone assay detection-limit statement without substituting a concentration or interpreting hormone status.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        limit: { type: "number", minimum: 0 },
        unit: { type: "string", maxLength: 8192, minLength: 1 },
        belowLimit: { type: "boolean" },
      },
      required: ["limit", "unit", "belowLimit"],
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
          id: "limit",
          label: "Limit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "unit",
          label: "Unit",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "belowLimit",
          label: "Below Limit",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = hormoneTestDetectionLimitTokenTool.execute;
export default hormoneTestDetectionLimitTokenTool;
