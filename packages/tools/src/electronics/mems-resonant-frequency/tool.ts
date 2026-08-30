import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MemsResonantFrequencyInput = Readonly<{
  readonly effectiveStiffnessNPerM: number;
  readonly effectiveMassKg: number;
}>;
export type MemsResonantFrequencyOutput = Readonly<{
  readonly naturalFrequencyHz: number;
}>;

export const calculateMemsResonantFrequency = (
  x: MemsResonantFrequencyInput,
): MemsResonantFrequencyOutput => {
  if (
    !Number.isFinite(x.effectiveStiffnessNPerM) ||
    x.effectiveStiffnessNPerM < 0
  )
    simpleError(
      "effectiveStiffnessNPerM",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.effectiveMassKg) || x.effectiveMassKg < 0)
    simpleError("effectiveMassKg", "Provide a finite number at least 0.");
  if (!(x.effectiveMassKg > 0))
    simpleError("effectiveMassKg", "Effective mass must be positive.");
  const naturalFrequencyHz =
    Math.sqrt(x.effectiveStiffnessNPerM / x.effectiveMassKg) / (2 * Math.PI);
  if (!Number.isFinite(naturalFrequencyHz))
    simpleError("naturalFrequencyHz", "The inputs produce an invalid result.");
  return {
    naturalFrequencyHz: Object.is(naturalFrequencyHz, -0)
      ? 0
      : naturalFrequencyHz,
  };
};

export const example = {
  input: { effectiveStiffnessNPerM: 100, effectiveMassKg: 0.01 },
  output: { naturalFrequencyHz: 15.915494309189533 },
} satisfies ToolExample<
  MemsResonantFrequencyInput,
  MemsResonantFrequencyOutput
>;

export const tool = createSimpleTool({
  id: "electronics/mems-resonant-frequency",
  title: "MEMS Resonant Frequency",
  description:
    "Find the undamped natural frequency of a single-degree-of-freedom MEMS proof mass from effective stiffness and effective mass.",
  inputs: [
    {
      id: "effectiveStiffnessNPerM",
      kind: "number",
      label: "Effective stiffness",
      unit: "N/m",
      minimum: 0,
    },
    {
      id: "effectiveMassKg",
      kind: "number",
      label: "Effective proof mass",
      unit: "kg",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "naturalFrequencyHz",
      kind: "number",
      label: "Undamped natural frequency",
      unit: "Hz",
    },
  ],
  calculate: (input) =>
    calculateMemsResonantFrequency({
      effectiveStiffnessNPerM: input.effectiveStiffnessNPerM as number,
      effectiveMassKg: input.effectiveMassKg as number,
    }),
});
export const memsResonantFrequencyTool = tool;
export const runMemsResonantFrequency = tool.execute;
export default tool;
