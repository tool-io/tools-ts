import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly quantity: number;
  readonly unitRate: number;
  readonly fixedAdjustment: number;
};
export type Output = { readonly extendedAmount: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    quantity: { type: "number", minimum: 0 },
    unitRate: { type: "number", minimum: 0 },
    fixedAdjustment: { type: "number" },
  },
  required: ["quantity", "unitRate", "fixedAdjustment"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { extendedAmount: { type: "number" } },
  required: ["extendedAmount"],
} as const;
/** Extend an explicitly measured construction quantity at a supplied unit rate plus a signed fixed adjustment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { quantity, unitRate, fixedAdjustment } = request;
  const compute = (): Output => {
    H.domain(quantity >= 0 && unitRate >= 0, "quantity");
    return { extendedAmount: quantity * unitRate + fixedAdjustment };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { quantity: 120, unitRate: 15, fixedAdjustment: -100 },
  output: { extendedAmount: 1700 },
} satisfies ToolExample<Input, Output>;
export const constructionUnitRateExtensionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: [
        "construction-management",
        "construction management",
        "engineering",
      ],
      keywords: ["construction management", "engineering"],
    },
    id: "construction-management/construction-unit-rate-extension",
    title: "Construction Unit Rate Extension",
    description:
      "Extend an explicitly measured construction quantity at a supplied unit rate plus a signed fixed adjustment.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        quantity: { type: "number", minimum: 0 },
        unitRate: { type: "number", minimum: 0 },
        fixedAdjustment: { type: "number" },
      },
      required: ["quantity", "unitRate", "fixedAdjustment"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { extendedAmount: { type: "number" } },
      required: ["extendedAmount"],
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
          id: "unitRate",
          label: "Unit Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fixedAdjustment",
          label: "Fixed Adjustment",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "extendedAmount",
          label: "Extended Amount",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = constructionUnitRateExtensionTool.execute;
export default constructionUnitRateExtensionTool;
