import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly oldIncome: number;
  readonly newIncome: number;
  readonly oldBenefit: number;
  readonly newBenefit: number;
  readonly taxIncrease: number;
};
export type Output = {
  readonly grossGain: number;
  readonly disposableGain: number;
  readonly effectiveLossRate: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    oldIncome: { type: "number", minimum: 0 },
    newIncome: { type: "number" },
    oldBenefit: { type: "number", minimum: 0 },
    newBenefit: { type: "number", minimum: 0 },
    taxIncrease: { type: "number", minimum: 0 },
  },
  required: [
    "oldIncome",
    "newIncome",
    "oldBenefit",
    "newBenefit",
    "taxIncrease",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossGain: { type: "number" },
    disposableGain: { type: "number" },
    effectiveLossRate: { type: "number" },
  },
  required: ["grossGain", "disposableGain", "effectiveLossRate"],
} as const;
/** Calculate benefit cliff discrete income gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { oldIncome, newIncome, oldBenefit, newBenefit, taxIncrease } = request;
  const compute = (): Output => {
    H.domain(
      newIncome > oldIncome &&
        oldIncome >= 0 &&
        oldBenefit >= 0 &&
        newBenefit >= 0 &&
        taxIncrease >= 0,
    );
    return {
      grossGain: newIncome - oldIncome,
      disposableGain:
        newIncome - oldIncome + newBenefit - oldBenefit - taxIncrease,
      effectiveLossRate:
        (oldBenefit - newBenefit + taxIncrease) / (newIncome - oldIncome),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    oldIncome: 100,
    newIncome: 110,
    oldBenefit: 20,
    newBenefit: 0,
    taxIncrease: 2,
  },
  output: { grossGain: 10, disposableGain: -12, effectiveLossRate: 2.2 },
} satisfies ToolExample<Input, Output>;
export const benefitCliffDiscreteIncomeGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "public-policy/benefit-cliff-discrete-income-gap",
    title: "Benefit Cliff Discrete Income Gap Tool",
    description:
      "Calculate benefit cliff discrete income gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        oldIncome: { type: "number", minimum: 0 },
        newIncome: { type: "number" },
        oldBenefit: { type: "number", minimum: 0 },
        newBenefit: { type: "number", minimum: 0 },
        taxIncrease: { type: "number", minimum: 0 },
      },
      required: [
        "oldIncome",
        "newIncome",
        "oldBenefit",
        "newBenefit",
        "taxIncrease",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossGain: { type: "number" },
        disposableGain: { type: "number" },
        effectiveLossRate: { type: "number" },
      },
      required: ["grossGain", "disposableGain", "effectiveLossRate"],
    },
    ports: {
      inputs: [
        {
          id: "oldIncome",
          label: "Old Income",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "newIncome",
          label: "New Income",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "oldBenefit",
          label: "Old Benefit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "newBenefit",
          label: "New Benefit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "taxIncrease",
          label: "Tax Increase",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "grossGain", label: "Gross Gain", valueType: { type: "number" } },
        {
          id: "disposableGain",
          label: "Disposable Gain",
          valueType: { type: "number" },
        },
        {
          id: "effectiveLossRate",
          label: "Effective Loss Rate",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = benefitCliffDiscreteIncomeGapTool.execute;
export default benefitCliffDiscreteIncomeGapTool;
