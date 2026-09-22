import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly tubeMonths: number;
  readonly monthlyRate: number;
  readonly minimumFee: number;
  readonly discount: number;
};
export type Output = { readonly gross: number; readonly payable: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tubeMonths: { type: "number", minimum: 0 },
    monthlyRate: { type: "number", minimum: 0 },
    minimumFee: { type: "number", minimum: 0 },
    discount: { type: "number", minimum: 0 },
  },
  required: ["tubeMonths", "monthlyRate", "minimumFee", "discount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { gross: { type: "number" }, payable: { type: "number" } },
  required: ["gross", "payable"],
} as const;
/** Calculate biobank storage fee tube month term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { tubeMonths, monthlyRate, minimumFee, discount } = request;
  const compute = (): Output => {
    H.domain(
      tubeMonths >= 0 && monthlyRate >= 0 && minimumFee >= 0 && discount >= 0,
    );
    return {
      gross: Math.max(minimumFee, tubeMonths * monthlyRate),
      payable: Math.max(minimumFee, tubeMonths * monthlyRate) - discount,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { tubeMonths: 120, monthlyRate: 2, minimumFee: 100, discount: 20 },
  output: { gross: 240, payable: 220 },
} satisfies ToolExample<Input, Output>;
export const biobankStorageFeeTubeMonthTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biobanking/biobank-storage-fee-tube-month-term",
    title: "Biobank Storage Fee Tube Month Term Tool",
    description:
      "Calculate biobank storage fee tube month term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        tubeMonths: { type: "number", minimum: 0 },
        monthlyRate: { type: "number", minimum: 0 },
        minimumFee: { type: "number", minimum: 0 },
        discount: { type: "number", minimum: 0 },
      },
      required: ["tubeMonths", "monthlyRate", "minimumFee", "discount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { gross: { type: "number" }, payable: { type: "number" } },
      required: ["gross", "payable"],
    },
    ports: {
      inputs: [
        {
          id: "tubeMonths",
          label: "Tube Months",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "monthlyRate",
          label: "Monthly Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "minimumFee",
          label: "Minimum Fee",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "discount",
          label: "Discount",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "gross", label: "Gross", valueType: { type: "number" } },
        { id: "payable", label: "Payable", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = biobankStorageFeeTubeMonthTermTool.execute;
export default biobankStorageFeeTubeMonthTermTool;
