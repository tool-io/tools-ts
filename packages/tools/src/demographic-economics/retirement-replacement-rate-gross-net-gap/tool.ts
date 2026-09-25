import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly grossPension: number;
  readonly grossWage: number;
  readonly pensionTax: number;
  readonly wageTax: number;
};
export type Output = {
  readonly grossRate: number;
  readonly netRate: number;
  readonly gap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossPension: { type: "number" },
    grossWage: { type: "number", exclusiveMinimum: 0 },
    pensionTax: { type: "number", minimum: 0 },
    wageTax: { type: "number", minimum: 0 },
  },
  required: ["grossPension", "grossWage", "pensionTax", "wageTax"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossRate: { type: "number" },
    netRate: { type: "number" },
    gap: { type: "number" },
  },
  required: ["grossRate", "netRate", "gap"],
} as const;
/** Calculate retirement replacement rate gross net gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { grossPension, grossWage, pensionTax, wageTax } = request;
  const compute = (): Output => {
    H.positive(grossWage);
    H.domain(
      pensionTax >= 0 &&
        grossPension >= pensionTax &&
        wageTax >= 0 &&
        grossWage > wageTax,
    );
    return {
      grossRate: grossPension / grossWage,
      netRate: (grossPension - pensionTax) / (grossWage - wageTax),
      gap:
        (grossPension - pensionTax) / (grossWage - wageTax) -
        grossPension / grossWage,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { grossPension: 600, grossWage: 1000, pensionTax: 60, wageTax: 200 },
  output: { grossRate: 0.6, netRate: 0.675, gap: 0.07500000000000007 },
} satisfies ToolExample<Input, Output>;
export const retirementReplacementRateGrossNetGapTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "demographic-economics/retirement-replacement-rate-gross-net-gap",
      title: "Retirement Replacement Rate Gross Net Gap Tool",
      description:
        "Calculate retirement replacement rate gross net gap from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          grossPension: { type: "number" },
          grossWage: { type: "number", exclusiveMinimum: 0 },
          pensionTax: { type: "number", minimum: 0 },
          wageTax: { type: "number", minimum: 0 },
        },
        required: ["grossPension", "grossWage", "pensionTax", "wageTax"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          grossRate: { type: "number" },
          netRate: { type: "number" },
          gap: { type: "number" },
        },
        required: ["grossRate", "netRate", "gap"],
      },
      ports: {
        inputs: [
          {
            id: "grossPension",
            label: "Gross Pension",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "grossWage",
            label: "Gross Wage",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "pensionTax",
            label: "Pension Tax",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "wageTax",
            label: "Wage Tax",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "grossRate",
            label: "Gross Rate",
            valueType: { type: "number" },
          },
          { id: "netRate", label: "Net Rate", valueType: { type: "number" } },
          { id: "gap", label: "Gap", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = retirementReplacementRateGrossNetGapTool.execute;
export default retirementReplacementRateGrossNetGapTool;
