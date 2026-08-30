import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HeatExchangerNtuEffectivenessInput = Readonly<{
  readonly numberOfTransferUnits: number;
  readonly capacityRateRatio: number;
}>;
export type HeatExchangerNtuEffectivenessOutput = Readonly<{
  readonly effectiveness: number;
}>;

export const calculateHeatExchangerNtuEffectiveness = (
  x: HeatExchangerNtuEffectivenessInput,
): HeatExchangerNtuEffectivenessOutput => {
  if (!Number.isFinite(x.numberOfTransferUnits) || x.numberOfTransferUnits < 0)
    simpleError("numberOfTransferUnits", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.capacityRateRatio) || x.capacityRateRatio < 0)
    simpleError("capacityRateRatio", "Provide a finite number at least 0.");
  if (x.capacityRateRatio > 1)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const effectiveness =
    (1 - Math.exp(-x.numberOfTransferUnits * (1 + x.capacityRateRatio))) /
    (1 + x.capacityRateRatio);
  if (!Number.isFinite(effectiveness))
    simpleError(
      "effectiveness",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { effectiveness: Object.is(effectiveness, -0) ? 0 : effectiveness };
};

export const example = {
  input: { numberOfTransferUnits: 1, capacityRateRatio: 0.5 },
  output: { effectiveness: 0.5179132265677134 },
} satisfies ToolExample<
  HeatExchangerNtuEffectivenessInput,
  HeatExchangerNtuEffectivenessOutput
>;

export const tool = createSimpleTool({
  id: "engineering/heat-exchanger-ntu-effectiveness",
  title: "Heat Exchanger NTU Effectiveness",
  description:
    "Parallel-flow heat-exchanger effectiveness ε=[1−exp(−NTU(1+Cr))]/(1+Cr) for capacity-rate ratio Cr in [0,1].",
  inputs: [
    {
      id: "numberOfTransferUnits",
      kind: "number",
      label: "Number Of Transfer Units",
      minimum: 0,
    },
    {
      id: "capacityRateRatio",
      kind: "number",
      label: "Capacity Rate Ratio",
      minimum: 0,
    },
  ],
  outputs: [{ id: "effectiveness", kind: "number", label: "Effectiveness" }],
  calculate: (input) =>
    calculateHeatExchangerNtuEffectiveness({
      numberOfTransferUnits: input.numberOfTransferUnits as number,
      capacityRateRatio: input.capacityRateRatio as number,
    }),
});
export const heatExchangerNtuEffectivenessTool = tool;
export const runHeatExchangerNtuEffectiveness = tool.execute;
export default tool;
