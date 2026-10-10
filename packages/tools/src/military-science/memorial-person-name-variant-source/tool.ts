import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly memorialRecordId: string;
  readonly suppliedNameVariant: string;
  readonly source: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    memorialRecordId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedNameVariant: { type: "string", maxLength: 8192, minLength: 1 },
    source: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["memorialRecordId", "suppliedNameVariant", "source"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit memorial name variant by source without identifying living people or reconciling identity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { memorialRecordId, suppliedNameVariant, source } = request;
  const compute = (): Output => {
    H.domain(memorialRecordId.length > 0, "memorialRecordId");
    H.domain(suppliedNameVariant.length > 0, "suppliedNameVariant");
    H.domain(source.length > 0, "source");
    return {
      token: JSON.stringify([memorialRecordId, suppliedNameVariant, source]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    memorialRecordId: "M17",
    suppliedNameVariant: "Name A",
    source: "Inscription A",
  },
  output: { token: '["M17","Name A","Inscription A"]' },
} satisfies ToolExample<Input, Output>;
export const memorialPersonNameVariantSourceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["military-science", "military science", "social sciences"],
      keywords: ["military science", "social sciences"],
    },
    id: "military-science/memorial-person-name-variant-source",
    title: "Memorial Person Name Variant Source",
    description:
      "Qualify an explicit memorial name variant by source without identifying living people or reconciling identity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        memorialRecordId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedNameVariant: { type: "string", maxLength: 8192, minLength: 1 },
        source: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["memorialRecordId", "suppliedNameVariant", "source"],
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
          id: "memorialRecordId",
          label: "Memorial Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedNameVariant",
          label: "Supplied Name Variant",
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
export const run = memorialPersonNameVariantSourceTool.execute;
export default memorialPersonNameVariantSourceTool;
