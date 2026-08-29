import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SupercapacitorVoltageAfterTimeInput = Readonly<{
  readonly initialVoltageV: number;
  readonly elapsedSeconds: number;
  readonly leakageResistanceOhms: number;
  readonly capacitanceFarads: number;
}>;
export type SupercapacitorVoltageAfterTimeOutput = Readonly<{
  voltageV: number;
}>;

export const calculateSupercapacitorVoltageAfterTime = (
  i: SupercapacitorVoltageAfterTimeInput,
): SupercapacitorVoltageAfterTimeOutput => {
  const value =
    i.initialVoltageV *
    Math.exp(
      -i.elapsedSeconds / (i.leakageResistanceOhms * i.capacitanceFarads),
    );
  if (!Number.isFinite(value))
    simpleError("voltageV", "The inputs produce a non-finite result.");
  return { voltageV: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: {
    initialVoltageV: 5,
    elapsedSeconds: 1000,
    leakageResistanceOhms: 10000,
    capacitanceFarads: 1,
  },
  output: { voltageV: 4.524187090179797 },
} satisfies ToolExample<
  SupercapacitorVoltageAfterTimeInput,
  SupercapacitorVoltageAfterTimeOutput
>;

export const tool = createSimpleTool({
  id: "electronics/supercapacitor-voltage-after-time",
  title: "Supercapacitor Voltage After Time",
  description:
    "Estimate supercapacitor voltage after time through a constant parallel leakage resistance using V(t)=V0e^(−t/RC).",
  inputs: [
    {
      id: "initialVoltageV",
      kind: "number",
      label: "Initial (V)",
      unit: "V",
      minimum: 0,
    },
    {
      id: "elapsedSeconds",
      kind: "number",
      label: "Elapsed (s)",
      unit: "s",
      minimum: 0,
    },
    {
      id: "leakageResistanceOhms",
      kind: "number",
      label: "Leakage Resistance (Ω)",
      unit: "Ω",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "capacitanceFarads",
      kind: "number",
      label: "Capacitance (F)",
      unit: "F",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    { id: "voltageV", kind: "number", label: "Voltage (V)", unit: "V" },
  ],
  calculate: (input) =>
    calculateSupercapacitorVoltageAfterTime({
      initialVoltageV: input.initialVoltageV as number,
      elapsedSeconds: input.elapsedSeconds as number,
      leakageResistanceOhms: input.leakageResistanceOhms as number,
      capacitanceFarads: input.capacitanceFarads as number,
    }),
});
export const supercapacitorVoltageAfterTimeTool = tool;
export const runSupercapacitorVoltageAfterTime = tool.execute;
export default tool;
