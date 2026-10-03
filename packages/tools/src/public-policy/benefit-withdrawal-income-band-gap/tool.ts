import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly income: number;
  readonly bandStart: number;
  readonly bandEnd: number;
  readonly suppliedRate: number;
  readonly benefit: number;
};
export type Output = {
  readonly incomeInBand: number;
  readonly withdrawal: number;
  readonly remainingBenefit: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    income: { type: "number" },
    bandStart: { type: "number" },
    bandEnd: { type: "number" },
    suppliedRate: { type: "number", minimum: 0 },
    benefit: { type: "number", minimum: 0 },
  },
  required: ["income", "bandStart", "bandEnd", "suppliedRate", "benefit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    incomeInBand: { type: "number" },
    withdrawal: { type: "number" },
    remainingBenefit: { type: "number" },
  },
  required: ["incomeInBand", "withdrawal", "remainingBenefit"],
} as const;
/** Calculate benefit withdrawal income band gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { income, bandStart, bandEnd, suppliedRate, benefit } = request;
  const compute = (): Output => {
    H.domain(bandEnd >= bandStart && suppliedRate >= 0 && benefit >= 0);
    return {
      incomeInBand: Math.max(0, Math.min(income, bandEnd) - bandStart),
      withdrawal: Math.min(
        benefit,
        Math.max(0, Math.min(income, bandEnd) - bandStart) * suppliedRate,
      ),
      remainingBenefit:
        benefit -
        Math.min(
          benefit,
          Math.max(0, Math.min(income, bandEnd) - bandStart) * suppliedRate,
        ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    income: 150,
    bandStart: 100,
    bandEnd: 200,
    suppliedRate: 0.5,
    benefit: 80,
  },
  output: { incomeInBand: 50, withdrawal: 25, remainingBenefit: 55 },
} satisfies ToolExample<Input, Output>;
export const benefitWithdrawalIncomeBandGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "public-policy/benefit-withdrawal-income-band-gap",
    title: "Benefit Withdrawal Income Band Gap Tool",
    description:
      "Calculate benefit withdrawal income band gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        income: { type: "number" },
        bandStart: { type: "number" },
        bandEnd: { type: "number" },
        suppliedRate: { type: "number", minimum: 0 },
        benefit: { type: "number", minimum: 0 },
      },
      required: ["income", "bandStart", "bandEnd", "suppliedRate", "benefit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        incomeInBand: { type: "number" },
        withdrawal: { type: "number" },
        remainingBenefit: { type: "number" },
      },
      required: ["incomeInBand", "withdrawal", "remainingBenefit"],
    },
    ports: {
      inputs: [
        {
          id: "income",
          label: "Income",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "bandStart",
          label: "Band Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "bandEnd",
          label: "Band End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedRate",
          label: "Supplied Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "benefit",
          label: "Benefit",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "incomeInBand",
          label: "Income In Band",
          valueType: { type: "number" },
        },
        {
          id: "withdrawal",
          label: "Withdrawal",
          valueType: { type: "number" },
        },
        {
          id: "remainingBenefit",
          label: "Remaining Benefit",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = benefitWithdrawalIncomeBandGapTool.execute;
export default benefitWithdrawalIncomeBandGapTool;
