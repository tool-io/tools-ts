import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly quantity: number;
  readonly suppliedUnitValue: number;
};
export type Output = { readonly recordedValue: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    quantity: { type: "number", minimum: 0 },
    suppliedUnitValue: { type: "number", minimum: 0 },
  },
  required: ["quantity", "suppliedUnitValue"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { recordedValue: { type: "number" } },
  required: ["recordedValue"],
} as const;
/** Extend an explicitly assigned unit value for a donated material quantity without appraising market value or tax deductibility. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { quantity, suppliedUnitValue } = request;
  const compute = (): Output => {
    H.domain(quantity >= 0 && suppliedUnitValue >= 0, "quantity");
    return { recordedValue: quantity * suppliedUnitValue };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { quantity: 12, suppliedUnitValue: 8 },
  output: { recordedValue: 96 },
} satisfies ToolExample<Input, Output>;
export const donatedMaterialUnitValueTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "community-development",
        "community development",
        "social sciences",
      ],
      keywords: ["community development", "social sciences"],
    },
    id: "community-development/donated-material-unit-value",
    title: "Donated Material Unit Value",
    description:
      "Extend an explicitly assigned unit value for a donated material quantity without appraising market value or tax deductibility.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        quantity: { type: "number", minimum: 0 },
        suppliedUnitValue: { type: "number", minimum: 0 },
      },
      required: ["quantity", "suppliedUnitValue"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { recordedValue: { type: "number" } },
      required: ["recordedValue"],
    },
    ports: {
      inputs: [
        {
          id: "quantity",
          label: "Quantity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedUnitValue",
          label: "Supplied Unit Value",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "recordedValue",
          label: "Recorded Value",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = donatedMaterialUnitValueTool.execute;
export default donatedMaterialUnitValueTool;
