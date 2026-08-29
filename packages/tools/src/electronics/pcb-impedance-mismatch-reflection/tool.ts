import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PcbImpedanceMismatchReflectionInput = Readonly<{
  readonly characteristicImpedanceOhms: number;
  readonly loadImpedanceOhms: number;
}>;
export type PcbImpedanceMismatchReflectionOutput = Readonly<{
  reflectionCoefficient: number;
}>;

export const calculatePcbImpedanceMismatchReflection = (
  i: PcbImpedanceMismatchReflectionInput,
): PcbImpedanceMismatchReflectionOutput => {
  const denominator = i.loadImpedanceOhms + i.characteristicImpedanceOhms;
  const value = Number.isFinite(denominator)
    ? (i.loadImpedanceOhms - i.characteristicImpedanceOhms) / denominator
    : (i.loadImpedanceOhms /
        Math.max(i.loadImpedanceOhms, i.characteristicImpedanceOhms) -
        i.characteristicImpedanceOhms /
          Math.max(i.loadImpedanceOhms, i.characteristicImpedanceOhms)) /
      (i.loadImpedanceOhms /
        Math.max(i.loadImpedanceOhms, i.characteristicImpedanceOhms) +
        i.characteristicImpedanceOhms /
          Math.max(i.loadImpedanceOhms, i.characteristicImpedanceOhms));
  if (!Number.isFinite(value))
    simpleError(
      "reflectionCoefficient",
      "The inputs produce a non-finite result.",
    );
  return { reflectionCoefficient: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: { characteristicImpedanceOhms: 50, loadImpedanceOhms: 100 },
  output: { reflectionCoefficient: 0.3333333333333333 },
} satisfies ToolExample<
  PcbImpedanceMismatchReflectionInput,
  PcbImpedanceMismatchReflectionOutput
>;

export const tool = createSimpleTool({
  id: "electronics/pcb-impedance-mismatch-reflection",
  title: "PCB Impedance Mismatch Reflection",
  description:
    "Calculate signed voltage reflection coefficient at a PCB transmission-line load as (Zload−Z0)/(Zload+Z0) for real positive impedances.",
  inputs: [
    {
      id: "characteristicImpedanceOhms",
      kind: "number",
      label: "Characteristic Impedance (Ω)",
      unit: "Ω",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "loadImpedanceOhms",
      kind: "number",
      label: "Load Impedance (Ω)",
      unit: "Ω",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "reflectionCoefficient",
      kind: "number",
      label: "Reflection Coefficient",
    },
  ],
  calculate: (input) =>
    calculatePcbImpedanceMismatchReflection({
      characteristicImpedanceOhms: input.characteristicImpedanceOhms as number,
      loadImpedanceOhms: input.loadImpedanceOhms as number,
    }),
});
export const pcbImpedanceMismatchReflectionTool = tool;
export const runPcbImpedanceMismatchReflection = tool.execute;
export default tool;
