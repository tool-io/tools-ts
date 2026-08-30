import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly liquidAssets: number;
  readonly taxDue: number;
  readonly otherNearTermObligations: number;
}>;
export type Output = Readonly<{
  readonly requiredLiquidity: number;
  readonly liquidityGap: number;
  readonly sufficientLiquidity: boolean;
}>;

export const calculate = (input: Input): Output => {
  const requiredLiquidity = input.taxDue + input.otherNearTermObligations;
  const liquidityGap = input.liquidAssets - requiredLiquidity;
  return {
    requiredLiquidity,
    liquidityGap,
    sufficientLiquidity: liquidityGap >= 0,
  };
};

export const exampleInput = {
  liquidAssets: 300000,
  taxDue: 250000,
  otherNearTermObligations: 100000,
} satisfies Input;
export const exampleOutput = {
  requiredLiquidity: 350000,
  liquidityGap: -50000,
  sufficientLiquidity: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      liquidAssets: input.liquidAssets as number,
      taxDue: input.taxDue as number,
      otherNearTermObligations: input.otherNearTermObligations as number,
    }),
  description:
    "Compare liquid estate assets with caller-supplied tax and near-term obligations.",
  id: "taxation/estate-liquidity-gap",
  inputs: [
    {
      id: "liquidAssets",
      label: "Liquid estate assets",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
    {
      id: "taxDue",
      label: "Estimated tax due",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
    {
      id: "otherNearTermObligations",
      label: "Other near-term obligations",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
  ],
  outputs: [
    {
      id: "requiredLiquidity",
      label: "Required liquidity",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
    {
      id: "liquidityGap",
      label: "Liquidity gap",
      kind: "number",
      unit: "currency",
    },
    {
      id: "sufficientLiquidity",
      label: "Sufficient liquidity",
      kind: "boolean",
    },
  ],
  title: "Estate Liquidity Gap",
});

export const run = tool.execute;
export default tool;
