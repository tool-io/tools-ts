import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type OpampShortCircuitPowerInput = Readonly<{
  readonly supplyToShortVoltageV: number;
  readonly shortCircuitCurrentAmperes: number;
}>;
export type OpampShortCircuitPowerOutput = Readonly<{
  outputStagePowerW: number;
}>;

export const calculateOpampShortCircuitPower = (
  i: OpampShortCircuitPowerInput,
): OpampShortCircuitPowerOutput => {
  const value =
    Math.abs(i.supplyToShortVoltageV) * i.shortCircuitCurrentAmperes;
  if (!Number.isFinite(value))
    simpleError("outputStagePowerW", "The inputs produce a non-finite result.");
  return { outputStagePowerW: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: { supplyToShortVoltageV: 12, shortCircuitCurrentAmperes: 0.04 },
  output: { outputStagePowerW: 0.48 },
} satisfies ToolExample<
  OpampShortCircuitPowerInput,
  OpampShortCircuitPowerOutput
>;

export const tool = createSimpleTool({
  id: "electronics/opamp-short-circuit-power",
  title: "Opamp Short Circuit Power",
  description:
    "Estimate output-stage dissipation during an op-amp short to ground as supply-to-short voltage magnitude times the measured short-circuit current; this is not total device power.",
  inputs: [
    {
      id: "supplyToShortVoltageV",
      kind: "number",
      label: "Supply To Short (V)",
      unit: "V",
    },
    {
      id: "shortCircuitCurrentAmperes",
      kind: "number",
      label: "Short Circuit Current (A)",
      unit: "A",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "outputStagePowerW",
      kind: "number",
      label: "Output Stage Power (W)",
      unit: "W",
    },
  ],
  calculate: (input) =>
    calculateOpampShortCircuitPower({
      supplyToShortVoltageV: input.supplyToShortVoltageV as number,
      shortCircuitCurrentAmperes: input.shortCircuitCurrentAmperes as number,
    }),
});
export const opampShortCircuitPowerTool = tool;
export const runOpampShortCircuitPower = tool.execute;
export default tool;
