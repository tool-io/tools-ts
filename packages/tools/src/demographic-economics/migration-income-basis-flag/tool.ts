import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly earnings: number;
  readonly remittances: number;
  readonly migrationCosts: number;
  readonly includeRemittances: boolean;
  readonly deductCosts: boolean;
};
export type Output = { readonly comparisonIncome: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    earnings: { type: "number", minimum: 0 },
    remittances: { type: "number", minimum: 0 },
    migrationCosts: { type: "number", minimum: 0 },
    includeRemittances: { type: "boolean" },
    deductCosts: { type: "boolean" },
  },
  required: [
    "earnings",
    "remittances",
    "migrationCosts",
    "includeRemittances",
    "deductCosts",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { comparisonIncome: { type: "number" } },
  required: ["comparisonIncome"],
} as const;
/** Calculate migration income basis flag from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    earnings,
    remittances,
    migrationCosts,
    includeRemittances,
    deductCosts,
  } = request;
  const compute = (): Output => {
    H.domain(earnings >= 0 && remittances >= 0 && migrationCosts >= 0);
    return {
      comparisonIncome:
        earnings +
        (includeRemittances ? remittances : 0) -
        (deductCosts ? migrationCosts : 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    earnings: 100,
    remittances: 20,
    migrationCosts: 10,
    includeRemittances: true,
    deductCosts: true,
  },
  output: { comparisonIncome: 110 },
} satisfies ToolExample<Input, Output>;
export const migrationIncomeBasisFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "demographic-economics/migration-income-basis-flag",
    title: "Migration Income Basis Flag Tool",
    description:
      "Calculate migration income basis flag from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        earnings: { type: "number", minimum: 0 },
        remittances: { type: "number", minimum: 0 },
        migrationCosts: { type: "number", minimum: 0 },
        includeRemittances: { type: "boolean" },
        deductCosts: { type: "boolean" },
      },
      required: [
        "earnings",
        "remittances",
        "migrationCosts",
        "includeRemittances",
        "deductCosts",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { comparisonIncome: { type: "number" } },
      required: ["comparisonIncome"],
    },
    ports: {
      inputs: [
        {
          id: "earnings",
          label: "Earnings",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "remittances",
          label: "Remittances",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "migrationCosts",
          label: "Migration Costs",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "includeRemittances",
          label: "Include Remittances",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "deductCosts",
          label: "Deduct Costs",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "comparisonIncome",
          label: "Comparison Income",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = migrationIncomeBasisFlagTool.execute;
export default migrationIncomeBasisFlagTool;
