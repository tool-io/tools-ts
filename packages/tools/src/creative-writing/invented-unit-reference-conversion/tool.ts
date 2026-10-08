import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly amount: number;
  readonly referenceUnitsPerInventedUnit: number;
};
export type Output = { readonly referenceAmount: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    amount: { type: "number" },
    referenceUnitsPerInventedUnit: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["amount", "referenceUnitsPerInventedUnit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { referenceAmount: { type: "number" } },
  required: ["referenceAmount"],
} as const;
/** Convert a signed fictional quantity using an explicitly defined positive reference-units-per-invented-unit factor. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { amount, referenceUnitsPerInventedUnit } = request;
  const compute = (): Output => {
    (H.domain(
      referenceUnitsPerInventedUnit > 0,
      "referenceUnitsPerInventedUnit",
    ),
      referenceUnitsPerInventedUnit);
    return { referenceAmount: amount * referenceUnitsPerInventedUnit };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { amount: 7, referenceUnitsPerInventedUnit: 2.5 },
  output: { referenceAmount: 17.5 },
} satisfies ToolExample<Input, Output>;
export const inventedUnitReferenceConversionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["creative-writing", "creative writing", "humanities"],
      keywords: ["creative writing", "humanities"],
    },
    id: "creative-writing/invented-unit-reference-conversion",
    title: "Invented Unit Reference Conversion",
    description:
      "Convert a signed fictional quantity using an explicitly defined positive reference-units-per-invented-unit factor.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        amount: { type: "number" },
        referenceUnitsPerInventedUnit: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["amount", "referenceUnitsPerInventedUnit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { referenceAmount: { type: "number" } },
      required: ["referenceAmount"],
    },
    ports: {
      inputs: [
        {
          id: "amount",
          label: "Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceUnitsPerInventedUnit",
          label: "Reference Units Per Invented Unit",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "referenceAmount",
          label: "Reference Amount",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = inventedUnitReferenceConversionTool.execute;
export default inventedUnitReferenceConversionTool;
