import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RealRateOfReturnInput = {
  readonly nominalReturnPercent?: number;
  readonly inflationPercent?: number;
};

export type RealRateOfReturnOutput = {
  readonly realReturnPercent: number;
};

export const calculateRealRateOfReturn = (
  input: RealRateOfReturnInput,
): RealRateOfReturnOutput => {
  const nominalFactor = 1 + (input.nominalReturnPercent ?? 8) / 100;
  const inflationFactor = 1 + (input.inflationPercent ?? 3) / 100;
  if (nominalFactor <= 0 || inflationFactor <= 0)
    return simpleError(
      "nominalReturnPercent",
      "Rates must be greater than -100 percent.",
      "invalid_rate",
    );
  return {
    realReturnPercent: (nominalFactor / inflationFactor - 1) * 100,
  };
};

export const realRateOfReturnExample = {
  input: {
    nominalReturnPercent: 8,
    inflationPercent: 3,
  },
  output: {
    realReturnPercent: 4.854368932038833,
  },
} satisfies ToolExample<RealRateOfReturnInput, RealRateOfReturnOutput>;

export const realRateOfReturnTool = createSimpleTool({
  id: "finance/real-rate-of-return",
  title: "Real Rate of Return Calculator",
  description:
    "Apply the Fisher equation to convert a nominal return and inflation into a real rate of return in percent.",
  inputs: [
    {
      description: "Nominal return in percent.",
      default: 8,
      id: "nominalReturnPercent",
      kind: "number",
      label: "Nominal return",
    },
    {
      description: "Inflation rate in percent.",
      default: 3,
      id: "inflationPercent",
      kind: "number",
      label: "Inflation",
    },
  ],
  outputs: [
    {
      description: "Real rate of return in percent.",
      id: "realReturnPercent",
      kind: "number",
      label: "Real return",
    },
  ],
  calculate: (input) =>
    calculateRealRateOfReturn({
      inflationPercent: input.inflationPercent as number,
      nominalReturnPercent: input.nominalReturnPercent as number,
    }),
});

export const runRealRateOfReturn = realRateOfReturnTool.execute;
export default realRateOfReturnTool;
