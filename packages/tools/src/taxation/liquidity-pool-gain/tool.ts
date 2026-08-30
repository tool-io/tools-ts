import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly disposedAssetBasis: number;
  readonly receivedLpTokenValue: number;
  readonly transactionFees: number;
}>;
export type Output = Readonly<{
  readonly amountRealized: number;
  readonly recognizedGain: number;
  readonly lpTokenBasis: number;
}>;

export const calculate = (input: Input): Output => {
  const amountRealized = input.receivedLpTokenValue - input.transactionFees;
  return {
    amountRealized,
    recognizedGain: amountRealized - input.disposedAssetBasis,
    lpTokenBasis: input.receivedLpTokenValue,
  };
};

export const exampleInput = {
  disposedAssetBasis: 100,
  receivedLpTokenValue: 150,
  transactionFees: 10,
} satisfies Input;
export const exampleOutput = {
  amountRealized: 140,
  recognizedGain: 40,
  lpTokenBasis: 150,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      disposedAssetBasis: input.disposedAssetBasis as number,
      receivedLpTokenValue: input.receivedLpTokenValue as number,
      transactionFees: input.transactionFees as number,
    }),
  description:
    "Model liquidity-pool contribution gain from caller-supplied basis and value.",
  id: "taxation/liquidity-pool-gain",
  inputs: [
    {
      id: "disposedAssetBasis",
      label: "Basis of assets contributed",
      kind: "number",
      minimum: 0,
    },
    {
      id: "receivedLpTokenValue",
      label: "Fair value of LP tokens received",
      kind: "number",
      minimum: 0,
    },
    {
      id: "transactionFees",
      label: "Transaction fees",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "amountRealized", label: "Amount realized", kind: "number" },
    { id: "recognizedGain", label: "Modeled recognized gain", kind: "number" },
    { id: "lpTokenBasis", label: "LP-token basis", kind: "number", minimum: 0 },
  ],
  title: "Liquidity-Pool Gain",
});

export const run = tool.execute;
export default tool;
