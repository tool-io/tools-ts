import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type EsdClampingVoltageInput = Readonly<{
  readonly breakdownVoltageV: number;
  readonly pulseCurrentAmperes: number;
  readonly dynamicResistanceOhms: number;
}>;
export type EsdClampingVoltageOutput = Readonly<{ clampingVoltageV: number }>;

export const calculateEsdClampingVoltage = (
  i: EsdClampingVoltageInput,
): EsdClampingVoltageOutput => {
  const value =
    i.breakdownVoltageV + i.pulseCurrentAmperes * i.dynamicResistanceOhms;
  if (!Number.isFinite(value))
    simpleError("clampingVoltageV", "The inputs produce a non-finite result.");
  return { clampingVoltageV: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: {
    breakdownVoltageV: 6,
    pulseCurrentAmperes: 10,
    dynamicResistanceOhms: 0.5,
  },
  output: { clampingVoltageV: 11 },
} satisfies ToolExample<EsdClampingVoltageInput, EsdClampingVoltageOutput>;

export const tool = createSimpleTool({
  id: "electronics/esd-clamping-voltage",
  title: "Esd Clamping Voltage",
  description:
    "Estimate ESD protection clamping voltage with a fitted dynamic-resistance model V=Vbr+I Rd; use device pulse-current data for the chosen waveform.",
  inputs: [
    {
      id: "breakdownVoltageV",
      kind: "number",
      label: "Breakdown (V)",
      unit: "V",
      minimum: 0,
    },
    {
      id: "pulseCurrentAmperes",
      kind: "number",
      label: "Pulse Current (A)",
      unit: "A",
      minimum: 0,
    },
    {
      id: "dynamicResistanceOhms",
      kind: "number",
      label: "Dynamic Resistance (Ω)",
      unit: "Ω",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "clampingVoltageV",
      kind: "number",
      label: "Clamping (V)",
      unit: "V",
    },
  ],
  calculate: (input) =>
    calculateEsdClampingVoltage({
      breakdownVoltageV: input.breakdownVoltageV as number,
      pulseCurrentAmperes: input.pulseCurrentAmperes as number,
      dynamicResistanceOhms: input.dynamicResistanceOhms as number,
    }),
});
export const esdClampingVoltageTool = tool;
export const runEsdClampingVoltage = tool.execute;
export default tool;
