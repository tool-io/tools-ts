import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AtterbergLiquidityIndexInput = {
  readonly waterContentPercent: number;
  readonly plasticLimitPercent: number;
  readonly plasticityIndexPercent: number;
};

export type AtterbergLiquidityIndexOutput = {
  readonly liquidityIndex: number;
};

export const calculateAtterbergLiquidityIndex = (
  input: AtterbergLiquidityIndexInput,
): AtterbergLiquidityIndexOutput => {
  if (!(input.plasticityIndexPercent > 0))
    simpleError(
      "plasticityIndexPercent",
      "Plasticity index must be greater than zero.",
      "invalid_index",
    );
  return {
    liquidityIndex:
      (input.waterContentPercent - input.plasticLimitPercent) /
      input.plasticityIndexPercent,
  };
};

export const atterbergLiquidityIndexExample = {
  input: {
    waterContentPercent: 28,
    plasticLimitPercent: 21,
    plasticityIndexPercent: 19,
  },
  output: { liquidityIndex: 0.3684210526315789 },
} satisfies ToolExample<
  AtterbergLiquidityIndexInput,
  AtterbergLiquidityIndexOutput
>;

export const atterbergLiquidityIndexTool = createSimpleTool({
  id: "geology/atterberg-liquidity-index",
  title: "Atterberg Liquidity Index Calculator",
  description:
    "Compute the liquidity index LI = (w - PL) / PI from natural water content and plastic limit in percent and the plasticity index.",
  inputs: [
    {
      description: "Natural water content in percent.",
      id: "waterContentPercent",
      kind: "number",
      label: "w",
    },
    {
      description: "Plastic limit in percent.",
      id: "plasticLimitPercent",
      kind: "number",
      label: "PL",
    },
    {
      description: "Plasticity index in percent.",
      id: "plasticityIndexPercent",
      kind: "number",
      label: "PI",
    },
  ],
  outputs: [
    {
      description: "Liquidity index (dimensionless).",
      id: "liquidityIndex",
      kind: "number",
      label: "LI",
    },
  ],
  calculate: (input) =>
    calculateAtterbergLiquidityIndex(
      input as unknown as AtterbergLiquidityIndexInput,
    ),
});

export const runAtterbergLiquidityIndex = atterbergLiquidityIndexTool.execute;
export default atterbergLiquidityIndexTool;
