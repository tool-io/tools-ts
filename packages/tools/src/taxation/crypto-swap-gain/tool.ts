import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly disposedAssetBasis: number;
  readonly receivedAssetFairValue: number;
  readonly transactionFees: number;
}>;
export type Output = Readonly<{
  readonly amountRealized: number;
  readonly recognizedGain: number;
  readonly receivedAssetBasis: number;
}>;

export const calculate = (input: Input): Output => {
  const amountRealized = input.receivedAssetFairValue - input.transactionFees;
  return {
    amountRealized,
    recognizedGain: amountRealized - input.disposedAssetBasis,
    receivedAssetBasis: input.receivedAssetFairValue,
  };
};

export const exampleInput = {
  disposedAssetBasis: 100,
  receivedAssetFairValue: 150,
  transactionFees: 10,
} satisfies Input;
export const exampleOutput = {
  amountRealized: 140,
  recognizedGain: 40,
  receivedAssetBasis: 150,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      disposedAssetBasis: input.disposedAssetBasis as number,
      receivedAssetFairValue: input.receivedAssetFairValue as number,
      transactionFees: input.transactionFees as number,
    }),
  description:
    "Calculate gain and replacement basis for a caller-valued crypto swap.",
  id: "taxation/crypto-swap-gain",
  inputs: [
    {
      id: "disposedAssetBasis",
      label: "Disposed asset basis",
      kind: "number",
      minimum: 0,
    },
    {
      id: "receivedAssetFairValue",
      label: "Received asset fair value",
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
    { id: "recognizedGain", label: "Recognized gain", kind: "number" },
    {
      id: "receivedAssetBasis",
      label: "Received asset basis",
      kind: "number",
      minimum: 0,
    },
  ],
  title: "Crypto Swap Gain",
});

export const run = tool.execute;
export default tool;
