import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AtterbergConsistencyIndexInput = {
  readonly liquidLimitPercent: number;
  readonly waterContentPercent: number;
  readonly plasticityIndexPercent: number;
};

export type AtterbergConsistencyIndexOutput = {
  readonly consistencyIndex: number;
};

export const calculateAtterbergConsistencyIndex = (
  input: AtterbergConsistencyIndexInput,
): AtterbergConsistencyIndexOutput => {
  if (!(input.plasticityIndexPercent > 0))
    simpleError(
      "plasticityIndexPercent",
      "Plasticity index must be greater than zero.",
      "invalid_index",
    );
  return {
    consistencyIndex:
      (input.liquidLimitPercent - input.waterContentPercent) /
      input.plasticityIndexPercent,
  };
};

export const atterbergConsistencyIndexExample = {
  input: {
    liquidLimitPercent: 38,
    waterContentPercent: 25,
    plasticityIndexPercent: 17,
  },
  output: { consistencyIndex: 0.7647058823529411 },
} satisfies ToolExample<
  AtterbergConsistencyIndexInput,
  AtterbergConsistencyIndexOutput
>;

export const atterbergConsistencyIndexTool = createSimpleTool({
  id: "geology/atterberg-consistency-index",
  title: "Atterberg Consistency Index Calculator",
  description:
    "Compute the consistency index CI = (LL - w) / PI from liquid limit and natural water content in percent and the plasticity index.",
  inputs: [
    {
      description: "Liquid limit in percent.",
      id: "liquidLimitPercent",
      kind: "number",
      label: "LL",
    },
    {
      description: "Natural water content in percent.",
      id: "waterContentPercent",
      kind: "number",
      label: "w",
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
      description: "Consistency index (dimensionless).",
      id: "consistencyIndex",
      kind: "number",
      label: "CI",
    },
  ],
  calculate: (input) =>
    calculateAtterbergConsistencyIndex(
      input as unknown as AtterbergConsistencyIndexInput,
    ),
});

export const runAtterbergConsistencyIndex =
  atterbergConsistencyIndexTool.execute;
export default atterbergConsistencyIndexTool;
