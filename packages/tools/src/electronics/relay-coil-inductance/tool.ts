import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RelayCoilInductanceInput = Readonly<{
  readonly coilResistanceOhms: number;
  readonly electricalTimeConstantSeconds: number;
}>;
export type RelayCoilInductanceOutput = Readonly<{
  coilInductanceHenries: number;
}>;

export const calculateRelayCoilInductance = (
  i: RelayCoilInductanceInput,
): RelayCoilInductanceOutput => {
  const value = i.coilResistanceOhms * i.electricalTimeConstantSeconds;
  if (!Number.isFinite(value))
    simpleError(
      "coilInductanceHenries",
      "The inputs produce a non-finite result.",
    );
  return { coilInductanceHenries: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: { coilResistanceOhms: 120, electricalTimeConstantSeconds: 0.01 },
  output: { coilInductanceHenries: 1.2 },
} satisfies ToolExample<RelayCoilInductanceInput, RelayCoilInductanceOutput>;

export const tool = createSimpleTool({
  id: "electronics/relay-coil-inductance",
  title: "Relay Coil Inductance",
  description:
    "Calculate relay-coil inductance from measured coil resistance and RL electrical time constant using L=Rτ; contact mechanics are not included.",
  inputs: [
    {
      id: "coilResistanceOhms",
      kind: "number",
      label: "Coil Resistance (Ω)",
      unit: "Ω",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "electricalTimeConstantSeconds",
      kind: "number",
      label: "Electrical Time Constant (s)",
      unit: "s",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "coilInductanceHenries",
      kind: "number",
      label: "Coil Inductance (H)",
      unit: "H",
    },
  ],
  calculate: (input) =>
    calculateRelayCoilInductance({
      coilResistanceOhms: input.coilResistanceOhms as number,
      electricalTimeConstantSeconds:
        input.electricalTimeConstantSeconds as number,
    }),
});
export const relayCoilInductanceTool = tool;
export const runRelayCoilInductance = tool.execute;
export default tool;
