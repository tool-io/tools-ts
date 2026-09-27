import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly token: string;
  readonly codes: readonly string[];
  readonly labels: readonly string[];
};
export type Output = { readonly found: boolean; readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    token: { type: "string", maxLength: 8192 },
    codes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    labels: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["token", "codes", "labels"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    found: { type: "boolean" },
    label: { type: "string", maxLength: 8192 },
  },
  required: ["found", "label"],
} as const;
/** Exact token lookup in an explicit caller-owned codebook; no security, blinding enforcement or study allocation is supplied. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { token, codes, labels } = request;
  const compute = (): Output => {
    H.domain(
      codes.length === labels.length && new Set(codes).size === codes.length,
    );
    const index = codes.indexOf(token);
    return { found: index >= 0, label: index >= 0 ? labels[index] : "" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { token: "B", codes: ["A", "B"], labels: ["placebo", "active"] },
  output: { found: true, label: "active" },
} satisfies ToolExample<Input, Output>;
export const researchBlindCodeMappingOneTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "experimental-psychology/research-blind-code-mapping-one-token",
    title: "Research Blind Code Mapping One Token Tool",
    description:
      "Exact token lookup in an explicit caller-owned codebook; no security, blinding enforcement or study allocation is supplied.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        token: { type: "string", maxLength: 8192 },
        codes: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        labels: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["token", "codes", "labels"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        found: { type: "boolean" },
        label: { type: "string", maxLength: 8192 },
      },
      required: ["found", "label"],
    },
    ports: {
      inputs: [
        {
          id: "token",
          label: "Token",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "codes",
          label: "Codes",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "labels",
          label: "Labels",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        { id: "found", label: "Found", valueType: { type: "boolean" } },
        { id: "label", label: "Label", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = researchBlindCodeMappingOneTokenTool.execute;
export default researchBlindCodeMappingOneTokenTool;
