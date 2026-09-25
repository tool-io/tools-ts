import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly requiredLanguages: readonly string[];
  readonly authorizedLanguages: readonly string[];
  readonly suppliedLanguages: readonly string[];
};
export type Output = {
  readonly missingAuthorized: number;
  readonly unauthorizedSupplied: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requiredLanguages: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    authorizedLanguages: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    suppliedLanguages: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["requiredLanguages", "authorizedLanguages", "suppliedLanguages"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    missingAuthorized: { type: "integer" },
    unauthorizedSupplied: { type: "integer" },
  },
  required: ["missingAuthorized", "unauthorizedSupplied"],
} as const;
/** Compare literal language inventories under caller-provided authorization; do not infer community permissions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { requiredLanguages, authorizedLanguages, suppliedLanguages } = request;
  const compute = (): Output => {
    return {
      missingAuthorized: [...new Set(requiredLanguages)].filter(
        (x) =>
          authorizedLanguages.includes(x) && !suppliedLanguages.includes(x),
      ).length,
      unauthorizedSupplied: [...new Set(suppliedLanguages)].filter(
        (x) => !authorizedLanguages.includes(x),
      ).length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    requiredLanguages: ["en", "fr"],
    authorizedLanguages: ["en", "fr"],
    suppliedLanguages: ["en", "de"],
  },
  output: { missingAuthorized: 1, unauthorizedSupplied: 1 },
} satisfies ToolExample<Input, Output>;
export const authorizedDescriptionLanguageGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cultural-studies/authorized-description-language-gap",
    title: "Authorized Description Language Gap Tool",
    description:
      "Compare literal language inventories under caller-provided authorization; do not infer community permissions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requiredLanguages: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        authorizedLanguages: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        suppliedLanguages: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: [
        "requiredLanguages",
        "authorizedLanguages",
        "suppliedLanguages",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        missingAuthorized: { type: "integer" },
        unauthorizedSupplied: { type: "integer" },
      },
      required: ["missingAuthorized", "unauthorizedSupplied"],
    },
    ports: {
      inputs: [
        {
          id: "requiredLanguages",
          label: "Required Languages",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "authorizedLanguages",
          label: "Authorized Languages",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "suppliedLanguages",
          label: "Supplied Languages",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "missingAuthorized",
          label: "Missing Authorized",
          valueType: { type: "integer" },
        },
        {
          id: "unauthorizedSupplied",
          label: "Unauthorized Supplied",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = authorizedDescriptionLanguageGapTool.execute;
export default authorizedDescriptionLanguageGapTool;
