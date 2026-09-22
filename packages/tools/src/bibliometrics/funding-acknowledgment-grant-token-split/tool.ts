import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly text: string; readonly separator: string };
export type Output = {
  readonly grants: readonly string[];
  readonly duplicates: readonly string[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    text: { type: "string", maxLength: 8192 },
    separator: { type: "string", maxLength: 8192 },
  },
  required: ["text", "separator"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grants: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    duplicates: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["grants", "duplicates"],
} as const;
/** Split an explicitly delimited grant-identifier field, preserving spelling and reporting exact duplicates. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { text, separator } = request;
  const compute = (): Output => {
    H.domain(separator.length > 0);
    const grants = text.split(separator).map((x) => x.trim());
    H.domain(grants.length <= 256 && grants.every((x) => x.length > 0));
    const unique = [...new Set(grants)];
    return {
      grants: unique,
      duplicates: unique.filter(
        (x) => grants.filter((g) => g === x).length > 1,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { text: "AB-1; CD-2; AB-1", separator: ";" },
  output: { grants: ["AB-1", "CD-2"], duplicates: ["AB-1"] },
} satisfies ToolExample<Input, Output>;
export const fundingAcknowledgmentGrantTokenSplitTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "bibliometrics/funding-acknowledgment-grant-token-split",
      title: "Funding Acknowledgment Grant Token Split Tool",
      description:
        "Split an explicitly delimited grant-identifier field, preserving spelling and reporting exact duplicates.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          text: { type: "string", maxLength: 8192 },
          separator: { type: "string", maxLength: 8192 },
        },
        required: ["text", "separator"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          grants: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          duplicates: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
        },
        required: ["grants", "duplicates"],
      },
      ports: {
        inputs: [
          {
            id: "text",
            label: "Text",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "separator",
            label: "Separator",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          {
            id: "grants",
            label: "Grants",
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "duplicates",
            label: "Duplicates",
            valueType: { type: "list", items: { type: "string" } },
          },
        ],
      },
    },
    calculate,
  });
export const run = fundingAcknowledgmentGrantTokenSplitTool.execute;
export default fundingAcknowledgmentGrantTokenSplitTool;
