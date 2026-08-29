import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ContactorCoilCurrentInput = Readonly<{
  readonly coilVoltageV: number;
  readonly coilResistanceOhms: number;
}>;
export type ContactorCoilCurrentOutput = Readonly<{
  coilCurrentAmperes: number;
}>;

export const calculateContactorCoilCurrent = (
  i: ContactorCoilCurrentInput,
): ContactorCoilCurrentOutput => {
  const value = i.coilVoltageV / i.coilResistanceOhms;
  if (!Number.isFinite(value))
    simpleError(
      "coilCurrentAmperes",
      "The inputs produce a non-finite result.",
    );
  return { coilCurrentAmperes: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: { coilVoltageV: 24, coilResistanceOhms: 48 },
  output: { coilCurrentAmperes: 0.5 },
} satisfies ToolExample<ContactorCoilCurrentInput, ContactorCoilCurrentOutput>;

export const tool = createSimpleTool({
  id: "electronics/contactor-coil-current",
  title: "Contactor Coil Current",
  description:
    "Calculate DC contactor-coil steady current from applied voltage and DC coil resistance; do not use this for AC inrush or inductive impedance.",
  inputs: [
    {
      id: "coilVoltageV",
      kind: "number",
      label: "Coil (V)",
      unit: "V",
      minimum: 0,
    },
    {
      id: "coilResistanceOhms",
      kind: "number",
      label: "Coil Resistance (Ω)",
      unit: "Ω",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    {
      id: "coilCurrentAmperes",
      kind: "number",
      label: "Coil Current (A)",
      unit: "A",
    },
  ],
  calculate: (input) =>
    calculateContactorCoilCurrent({
      coilVoltageV: input.coilVoltageV as number,
      coilResistanceOhms: input.coilResistanceOhms as number,
    }),
});
export const contactorCoilCurrentTool = tool;
export const runContactorCoilCurrent = tool.execute;
export default tool;
