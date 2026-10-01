import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly amountToken: string;
  readonly unitToken: string;
  readonly source: string;
  readonly allowedUnits: readonly string[];
};
export type Output = {
  readonly unitListed: boolean;
  readonly sourceKey: string;
  readonly amountPreserved: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    amountToken: { type: "string", maxLength: 8192 },
    unitToken: { type: "string", maxLength: 8192 },
    source: { type: "string", maxLength: 8192 },
    allowedUnits: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["amountToken", "unitToken", "source", "allowedUnits"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unitListed: { type: "boolean" },
    sourceKey: { type: "string", maxLength: 8192 },
    amountPreserved: { type: "string", maxLength: 8192 },
  },
  required: ["unitListed", "sourceKey", "amountPreserved"],
} as const;
/** Preserve literal supplied product-label quantities and units without dose conversion or safety/efficacy assessment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { amountToken, unitToken, source, allowedUnits } = request;
  const compute = (): Output => {
    return {
      unitListed: allowedUnits.includes(unitToken),
      sourceKey: JSON.stringify([source, unitToken]),
      amountPreserved: amountToken,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    amountToken: "10",
    unitToken: "mg",
    source: "label-A",
    allowedUnits: ["mg", "g"],
  },
  output: {
    unitListed: true,
    sourceKey: '["label-A","mg"]',
    amountPreserved: "10",
  },
} satisfies ToolExample<Input, Output>;
export const productLabelUnitTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "naturopathy/product-label-unit-token",
    title: "Product Label Unit Token Tool",
    description:
      "Preserve literal supplied product-label quantities and units without dose conversion or safety/efficacy assessment.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        amountToken: { type: "string", maxLength: 8192 },
        unitToken: { type: "string", maxLength: 8192 },
        source: { type: "string", maxLength: 8192 },
        allowedUnits: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["amountToken", "unitToken", "source", "allowedUnits"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        unitListed: { type: "boolean" },
        sourceKey: { type: "string", maxLength: 8192 },
        amountPreserved: { type: "string", maxLength: 8192 },
      },
      required: ["unitListed", "sourceKey", "amountPreserved"],
    },
    ports: {
      inputs: [
        {
          id: "amountToken",
          label: "Amount Token",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "unitToken",
          label: "Unit Token",
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
          id: "allowedUnits",
          label: "Allowed Units",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "unitListed",
          label: "Unit Listed",
          valueType: { type: "boolean" },
        },
        { id: "sourceKey", label: "Source Key", valueType: { type: "string" } },
        {
          id: "amountPreserved",
          label: "Amount Preserved",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = productLabelUnitTokenTool.execute;
export default productLabelUnitTokenTool;
