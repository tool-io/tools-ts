import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RelayCoilPowerInput = Readonly<{
  readonly coilVoltageV: number;
  readonly coilResistanceOhms: number;
}>;
export type RelayCoilPowerOutput = Readonly<{ coilPowerW: number }>;

export const calculateRelayCoilPower = (
  i: RelayCoilPowerInput,
): RelayCoilPowerOutput => {
  const direct = i.coilVoltageV ** 2 / i.coilResistanceOhms;
  const value =
    Number.isFinite(direct) && (direct !== 0 || i.coilVoltageV === 0)
      ? direct
      : (i.coilVoltageV / i.coilResistanceOhms) * i.coilVoltageV;
  if (!Number.isFinite(value))
    simpleError("coilPowerW", "The inputs produce a non-finite result.");
  return { coilPowerW: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: { coilVoltageV: 12, coilResistanceOhms: 120 },
  output: { coilPowerW: 1.2 },
} satisfies ToolExample<RelayCoilPowerInput, RelayCoilPowerOutput>;

export const tool = createSimpleTool({
  id: "electronics/relay-coil-power",
  title: "Relay Coil Power",
  description:
    "Calculate DC relay-coil electrical power as applied voltage squared divided by coil resistance; AC impedance is outside this model.",
  inputs: [
    { id: "coilVoltageV", kind: "number", label: "Coil (V)", unit: "V" },
    {
      id: "coilResistanceOhms",
      kind: "number",
      label: "Coil Resistance (Ω)",
      unit: "Ω",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    { id: "coilPowerW", kind: "number", label: "Coil Power (W)", unit: "W" },
  ],
  calculate: (input) =>
    calculateRelayCoilPower({
      coilVoltageV: input.coilVoltageV as number,
      coilResistanceOhms: input.coilResistanceOhms as number,
    }),
});
export const relayCoilPowerTool = tool;
export const runRelayCoilPower = tool.execute;
export default tool;
