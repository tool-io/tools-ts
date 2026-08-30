import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly earlyEnergy0To50Milliseconds: number;
  readonly lateEnergyAfter50Milliseconds: number;
}>;
export type Output = Readonly<{ readonly clarityC50Decibels: number }>;

export const calculate = (input: Input): Output => {
  if (
    !Number.isFinite(input.earlyEnergy0To50Milliseconds) ||
    input.earlyEnergy0To50Milliseconds <= 0 ||
    !Number.isFinite(input.lateEnergyAfter50Milliseconds) ||
    input.lateEnergyAfter50Milliseconds <= 0
  )
    simpleError(
      "earlyEnergy0To50Milliseconds",
      "Early and late energies must be finite and positive.",
      "invalid_energy",
    );
  const energyRatio =
    input.earlyEnergy0To50Milliseconds / input.lateEnergyAfter50Milliseconds;
  const clarityC50Decibels =
    Number.isFinite(energyRatio) && energyRatio > 0
      ? 10 * Math.log10(energyRatio)
      : 10 *
        (Math.log10(input.earlyEnergy0To50Milliseconds) -
          Math.log10(input.lateEnergyAfter50Milliseconds));
  return { clarityC50Decibels };
};

export const example = {
  input: {
    earlyEnergy0To50Milliseconds: 100,
    lateEnergyAfter50Milliseconds: 10,
  },
  output: { clarityC50Decibels: 10.0 },
} satisfies ToolExample<Input, Output>;
export const edgeCase = {
  input: { earlyEnergy0To50Milliseconds: 1, lateEnergyAfter50Milliseconds: 1 },
  output: { clarityC50Decibels: 0 },
} satisfies { readonly input: Input; readonly output: Output };

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      earlyEnergy0To50Milliseconds:
        input.earlyEnergy0To50Milliseconds as number,
      lateEnergyAfter50Milliseconds:
        input.lateEnergyAfter50Milliseconds as number,
    }),
  description:
    "Calculate C50 as 10 log10 of early-to-late squared-impulse-response energy.",
  id: "acoustics/clarity-c50",
  inputs: [
    {
      id: "earlyEnergy0To50Milliseconds",
      kind: "number",
      label: "Early energy through 50 ms",
      minimum: 0,
    },
    {
      id: "lateEnergyAfter50Milliseconds",
      kind: "number",
      label: "Late energy after 50 ms",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "clarityC50Decibels", kind: "number", label: "C50", unit: "dB" },
  ],
  title: "Speech Clarity C50",
});

export const run = tool.execute;
export default tool;
