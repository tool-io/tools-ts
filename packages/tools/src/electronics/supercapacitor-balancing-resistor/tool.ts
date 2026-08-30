import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SupercapacitorBalancingResistorInput = Readonly<{
  readonly targetVolts: number;
  readonly bleedAmperes: number;
}>;
export type SupercapacitorBalancingResistorOutput = Readonly<{
  readonly resistanceOhms: number;
}>;

export const calculateSupercapacitorBalancingResistor = (
  x: SupercapacitorBalancingResistorInput,
): SupercapacitorBalancingResistorOutput => {
  if (!Number.isFinite(x.targetVolts) || x.targetVolts < 0)
    simpleError("targetVolts", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.bleedAmperes) || x.bleedAmperes < 0)
    simpleError("bleedAmperes", "Provide a finite number at least 0.");
  const resistanceOhms = x.targetVolts / x.bleedAmperes;
  if (!Number.isFinite(resistanceOhms))
    simpleError(
      "resistanceOhms",
      "Inputs produce an undefined or non-finite result.",
    );
  return { resistanceOhms: Object.is(resistanceOhms, -0) ? 0 : resistanceOhms };
};

export const example = {
  input: { targetVolts: 2.5, bleedAmperes: 0.001 },
  output: { resistanceOhms: 2500 },
} satisfies ToolExample<
  SupercapacitorBalancingResistorInput,
  SupercapacitorBalancingResistorOutput
>;

export const tool = createSimpleTool({
  id: "electronics/supercapacitor-balancing-resistor",
  title: "Supercapacitor Balancing Resistor",
  description:
    "Parallel resistor needed for a chosen bleed current at the capacitor's target balancing voltage.",
  inputs: [
    {
      id: "targetVolts",
      kind: "number",
      label: "Target Volts",
      unit: "V",
      minimum: 0,
    },
    {
      id: "bleedAmperes",
      kind: "number",
      label: "Bleed Amperes",
      unit: "A",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "resistanceOhms",
      kind: "number",
      label: "Resistance Ohms",
      unit: "Ω",
    },
  ],
  calculate: (input) =>
    calculateSupercapacitorBalancingResistor({
      targetVolts: input.targetVolts as number,
      bleedAmperes: input.bleedAmperes as number,
    }),
});
export const supercapacitorBalancingResistorTool = tool;
export const runSupercapacitorBalancingResistor = tool.execute;
export default tool;
