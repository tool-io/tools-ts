import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly quantity: number;
  readonly unit: string;
  readonly precision: string;
};
export type Output = { readonly attributes: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    quantity: { type: "integer", minimum: 0 },
    unit: { type: "string", maxLength: 8192 },
    precision: {
      type: "string",
      maxLength: 8192,
      enum: ["exact", "approximate"],
    },
  },
  required: ["quantity", "unit", "precision"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { attributes: { type: "string", maxLength: 8192 } },
  required: ["attributes"],
} as const;
/** Format a bounded TEI gap extent attribute fragment from an explicit count, unit token and precision flag; no textual loss is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { quantity, unit, precision } = request;
  const compute = (): Output => {
    H.integer(quantity, 0);
    H.domain(/^[A-Za-z][A-Za-z0-9-]*(?![\s\S])/.test(unit));
    H.domain(["exact", "approximate"].includes(precision));
    return {
      attributes:
        'quantity="' +
        quantity +
        '" unit="' +
        unit +
        '"' +
        (precision === "approximate" ? ' precision="low"' : ""),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { quantity: 3, unit: "character", precision: "exact" },
  output: { attributes: 'quantity="3" unit="character"' },
} satisfies ToolExample<Input, Output>;
export const teiGapExtentUnitTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "digital-humanities/tei-gap-extent-unit-token",
    title: "TEI Gap Extent Unit Token Tool",
    description:
      "Format a bounded TEI gap extent attribute fragment from an explicit count, unit token and precision flag; no textual loss is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        quantity: { type: "integer", minimum: 0 },
        unit: { type: "string", maxLength: 8192 },
        precision: {
          type: "string",
          maxLength: 8192,
          enum: ["exact", "approximate"],
        },
      },
      required: ["quantity", "unit", "precision"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { attributes: { type: "string", maxLength: 8192 } },
      required: ["attributes"],
    },
    ports: {
      inputs: [
        {
          id: "quantity",
          label: "Quantity",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "unit",
          label: "Unit",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "precision",
          label: "Precision",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "attributes",
          label: "Attributes",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = teiGapExtentUnitTokenTool.execute;
export default teiGapExtentUnitTokenTool;
