import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly baseRate: number;
  readonly supplement: number;
  readonly taxRate: number;
  readonly supplementTaxable: boolean;
};
export type Output = { readonly tax: number; readonly total: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    baseRate: { type: "number", minimum: 0 },
    supplement: { type: "number", minimum: 0 },
    taxRate: { type: "number", minimum: 0 },
    supplementTaxable: { type: "boolean" },
  },
  required: ["baseRate", "supplement", "taxRate", "supplementTaxable"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { tax: { type: "number" }, total: { type: "number" } },
  required: ["tax", "total"],
} as const;
/** Calculate room upgrade supplement tax order from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { baseRate, supplement, taxRate, supplementTaxable } = request;
  const compute = (): Output => {
    H.domain(baseRate >= 0 && supplement >= 0 && taxRate >= 0);
    return {
      tax: (baseRate + (supplementTaxable ? supplement : 0)) * taxRate,
      total:
        baseRate +
        supplement +
        (baseRate + (supplementTaxable ? supplement : 0)) * taxRate,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    baseRate: 100,
    supplement: 20,
    taxRate: 0.1,
    supplementTaxable: true,
  },
  output: { tax: 12, total: 132 },
} satisfies ToolExample<Input, Output>;
export const roomUpgradeSupplementTaxOrderTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hospitality/room-upgrade-supplement-tax-order",
    title: "Room Upgrade Supplement Tax Order Tool",
    description:
      "Calculate room upgrade supplement tax order from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        baseRate: { type: "number", minimum: 0 },
        supplement: { type: "number", minimum: 0 },
        taxRate: { type: "number", minimum: 0 },
        supplementTaxable: { type: "boolean" },
      },
      required: ["baseRate", "supplement", "taxRate", "supplementTaxable"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { tax: { type: "number" }, total: { type: "number" } },
      required: ["tax", "total"],
    },
    ports: {
      inputs: [
        {
          id: "baseRate",
          label: "Base Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "supplement",
          label: "Supplement",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "taxRate",
          label: "Tax Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "supplementTaxable",
          label: "Supplement Taxable",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "tax", label: "Tax", valueType: { type: "number" } },
        { id: "total", label: "Total", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = roomUpgradeSupplementTaxOrderTool.execute;
export default roomUpgradeSupplementTaxOrderTool;
