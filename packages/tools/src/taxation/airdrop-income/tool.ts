import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly tokensReceived: number;
  readonly fairValuePerToken: number;
  readonly claimingCosts: number;
}>;
export type Output = Readonly<{
  readonly grossIncome: number;
  readonly netIncome: number;
  readonly basisPerToken: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.tokensReceived <= 0)
    simpleError(
      "tokensReceived",
      "Tokens received must be positive.",
      "invalid_quantity",
    );
  const grossIncome = input.tokensReceived * input.fairValuePerToken;
  return {
    grossIncome,
    netIncome: grossIncome - input.claimingCosts,
    basisPerToken: grossIncome / input.tokensReceived,
  };
};

export const exampleInput = {
  tokensReceived: 10,
  fairValuePerToken: 5,
  claimingCosts: 10,
} satisfies Input;
export const exampleOutput = {
  grossIncome: 50,
  netIncome: 40,
  basisPerToken: 5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      tokensReceived: input.tokensReceived as number,
      fairValuePerToken: input.fairValuePerToken as number,
      claimingCosts: input.claimingCosts as number,
    }),
  description:
    "Calculate airdrop income and per-token basis from supplied fair value.",
  id: "taxation/airdrop-income",
  inputs: [
    {
      id: "tokensReceived",
      label: "Tokens received",
      kind: "number",
      minimum: 0,
    },
    {
      id: "fairValuePerToken",
      label: "Fair value per token",
      kind: "number",
      minimum: 0,
    },
    {
      id: "claimingCosts",
      label: "Claiming costs",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "grossIncome",
      label: "Gross airdrop income",
      kind: "number",
      minimum: 0,
    },
    { id: "netIncome", label: "Net income after costs", kind: "number" },
    {
      id: "basisPerToken",
      label: "Basis per token",
      kind: "number",
      minimum: 0,
    },
  ],
  title: "Airdrop Income",
});

export const run = tool.execute;
export default tool;
