import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly grossMass: number;
  readonly packaging: number;
  readonly inedible: number;
  readonly packagingInInedible: number;
};
export type Output = {
  readonly edibleMass: number;
  readonly edibleShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossMass: { type: "number", exclusiveMinimum: 0 },
    packaging: { type: "number", minimum: 0 },
    inedible: { type: "number", minimum: 0 },
    packagingInInedible: { type: "number", minimum: 0 },
  },
  required: ["grossMass", "packaging", "inedible", "packagingInInedible"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    edibleMass: { type: "number" },
    edibleShare: { type: "number" },
  },
  required: ["edibleMass", "edibleShare"],
} as const;
/** Calculate food bank edible weight packaging deduction from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { grossMass, packaging, inedible, packagingInInedible } = request;
  const compute = (): Output => {
    H.positive(grossMass);
    H.domain(
      packaging >= 0 &&
        inedible >= 0 &&
        packagingInInedible >= 0 &&
        packagingInInedible <= Math.min(packaging, inedible) &&
        packaging + inedible - packagingInInedible <= grossMass,
    );
    return {
      edibleMass: grossMass - packaging - inedible + packagingInInedible,
      edibleShare:
        (grossMass - packaging - inedible + packagingInInedible) / grossMass,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    grossMass: 100,
    packaging: 10,
    inedible: 20,
    packagingInInedible: 5,
  },
  output: { edibleMass: 75, edibleShare: 0.75 },
} satisfies ToolExample<Input, Output>;
export const foodBankEdibleWeightPackagingDeductionTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "food-security/food-bank-edible-weight-packaging-deduction",
      title: "Food Bank Edible Weight Packaging Deduction Tool",
      description:
        "Calculate food bank edible weight packaging deduction from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          grossMass: { type: "number", exclusiveMinimum: 0 },
          packaging: { type: "number", minimum: 0 },
          inedible: { type: "number", minimum: 0 },
          packagingInInedible: { type: "number", minimum: 0 },
        },
        required: ["grossMass", "packaging", "inedible", "packagingInInedible"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          edibleMass: { type: "number" },
          edibleShare: { type: "number" },
        },
        required: ["edibleMass", "edibleShare"],
      },
      ports: {
        inputs: [
          {
            id: "grossMass",
            label: "Gross Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "packaging",
            label: "Packaging",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "inedible",
            label: "Inedible",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "packagingInInedible",
            label: "Packaging In Inedible",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "edibleMass",
            label: "Edible Mass",
            valueType: { type: "number" },
          },
          {
            id: "edibleShare",
            label: "Edible Share",
            valueType: { type: "number", unit: "1" },
          },
        ],
      },
    },
    calculate,
  });
export const run = foodBankEdibleWeightPackagingDeductionTool.execute;
export default foodBankEdibleWeightPackagingDeductionTool;
