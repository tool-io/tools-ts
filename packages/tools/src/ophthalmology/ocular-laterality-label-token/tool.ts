import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly token: string;
  readonly leftTokens: readonly string[];
  readonly rightTokens: readonly string[];
  readonly bothTokens: readonly string[];
};
export type Output = { readonly laterality: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    token: { type: "string", maxLength: 8192 },
    leftTokens: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    rightTokens: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    bothTokens: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["token", "leftTokens", "rightTokens", "bothTokens"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { laterality: { type: "string", maxLength: 8192 } },
  required: ["laterality"],
} as const;
/** Classify an explicitly supplied ocular record label under disjoint caller-provided vocabularies. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { token, leftTokens, rightTokens, bothTokens } = request;
  const compute = (): Output => {
    H.domain(
      !leftTokens.some(
        (x) => rightTokens.includes(x) || bothTokens.includes(x),
      ) && !rightTokens.some((x) => bothTokens.includes(x)),
    );
    return {
      laterality: leftTokens.includes(token)
        ? "left"
        : rightTokens.includes(token)
          ? "right"
          : bothTokens.includes(token)
            ? "both"
            : "unknown",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    token: "OS",
    leftTokens: ["OS"],
    rightTokens: ["OD"],
    bothTokens: ["OU"],
  },
  output: { laterality: "left" },
} satisfies ToolExample<Input, Output>;
export const ocularLateralityLabelTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ophthalmology/ocular-laterality-label-token",
    title: "Ocular Laterality Label Token Tool",
    description:
      "Classify an explicitly supplied ocular record label under disjoint caller-provided vocabularies.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        token: { type: "string", maxLength: 8192 },
        leftTokens: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        rightTokens: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        bothTokens: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["token", "leftTokens", "rightTokens", "bothTokens"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { laterality: { type: "string", maxLength: 8192 } },
      required: ["laterality"],
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
          id: "leftTokens",
          label: "Left Tokens",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "rightTokens",
          label: "Right Tokens",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "bothTokens",
          label: "Both Tokens",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "laterality",
          label: "Laterality",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = ocularLateralityLabelTokenTool.execute;
export default ocularLateralityLabelTokenTool;
