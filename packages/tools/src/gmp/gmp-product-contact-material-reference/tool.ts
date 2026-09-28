import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedCode: string;
  readonly declaredCode: string;
  readonly source: string;
  readonly edition: string;
  readonly approvedCodes: readonly string[];
};
export type Output = {
  readonly codesMatch: boolean;
  readonly listed: boolean;
  readonly referenceKey: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedCode: { type: "string", maxLength: 8192 },
    declaredCode: { type: "string", maxLength: 8192 },
    source: { type: "string", maxLength: 8192 },
    edition: { type: "string", maxLength: 8192 },
    approvedCodes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: [
    "observedCode",
    "declaredCode",
    "source",
    "edition",
    "approvedCodes",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    codesMatch: { type: "boolean" },
    listed: { type: "boolean" },
    referenceKey: { type: "string", maxLength: 8192 },
  },
  required: ["codesMatch", "listed", "referenceKey"],
} as const;
/** Compare supplied product-contact material attribution without suitability assessment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observedCode, declaredCode, source, edition, approvedCodes } =
    request;
  const compute = (): Output => {
    H.domain(source.length > 0 && edition.length > 0);
    return {
      codesMatch: observedCode === declaredCode,
      listed: approvedCodes.includes(observedCode),
      referenceKey: JSON.stringify([source, edition, declaredCode]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    observedCode: "M1",
    declaredCode: "M1",
    source: "registry",
    edition: "v1",
    approvedCodes: ["M1"],
  },
  output: {
    codesMatch: true,
    listed: true,
    referenceKey: '["registry","v1","M1"]',
  },
} satisfies ToolExample<Input, Output>;
export const gmpProductContactMaterialReferenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gmp/gmp-product-contact-material-reference",
    title: "GMP Product Contact Material Reference Tool",
    description:
      "Compare supplied product-contact material attribution without suitability assessment.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedCode: { type: "string", maxLength: 8192 },
        declaredCode: { type: "string", maxLength: 8192 },
        source: { type: "string", maxLength: 8192 },
        edition: { type: "string", maxLength: 8192 },
        approvedCodes: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: [
        "observedCode",
        "declaredCode",
        "source",
        "edition",
        "approvedCodes",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        codesMatch: { type: "boolean" },
        listed: { type: "boolean" },
        referenceKey: { type: "string", maxLength: 8192 },
      },
      required: ["codesMatch", "listed", "referenceKey"],
    },
    ports: {
      inputs: [
        {
          id: "observedCode",
          label: "Observed Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "declaredCode",
          label: "Declared Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "source",
          label: "Source",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "edition",
          label: "Edition",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "approvedCodes",
          label: "Approved Codes",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "codesMatch",
          label: "Codes Match",
          valueType: { type: "boolean" },
        },
        { id: "listed", label: "Listed", valueType: { type: "boolean" } },
        {
          id: "referenceKey",
          label: "Reference Key",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = gmpProductContactMaterialReferenceTool.execute;
export default gmpProductContactMaterialReferenceTool;
