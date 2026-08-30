import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly earlyEnergy0To80Milliseconds: number;
  readonly lateEnergyAfter80Milliseconds: number;
}>;
export type Output = Readonly<{ readonly clarityC80Decibels: number }>;

export const calculate = (input: Input): Output => {
  if (
    !Number.isFinite(input.earlyEnergy0To80Milliseconds) ||
    input.earlyEnergy0To80Milliseconds <= 0 ||
    !Number.isFinite(input.lateEnergyAfter80Milliseconds) ||
    input.lateEnergyAfter80Milliseconds <= 0
  )
    simpleError(
      "earlyEnergy0To80Milliseconds",
      "Early and late energies must be finite and positive.",
      "invalid_energy",
    );
  const energyRatio =
    input.earlyEnergy0To80Milliseconds / input.lateEnergyAfter80Milliseconds;
  const clarityC80Decibels =
    Number.isFinite(energyRatio) && energyRatio > 0
      ? 10 * Math.log10(energyRatio)
      : 10 *
        (Math.log10(input.earlyEnergy0To80Milliseconds) -
          Math.log10(input.lateEnergyAfter80Milliseconds));
  return { clarityC80Decibels };
};

export const example = {
  input: {
    earlyEnergy0To80Milliseconds: 100,
    lateEnergyAfter80Milliseconds: 25,
  },
  output: { clarityC80Decibels: 6.020599913279624 },
} satisfies ToolExample<Input, Output>;
export const edgeCase = {
  input: { earlyEnergy0To80Milliseconds: 1, lateEnergyAfter80Milliseconds: 1 },
  output: { clarityC80Decibels: 0 },
} satisfies { readonly input: Input; readonly output: Output };

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      earlyEnergy0To80Milliseconds:
        input.earlyEnergy0To80Milliseconds as number,
      lateEnergyAfter80Milliseconds:
        input.lateEnergyAfter80Milliseconds as number,
    }),
  description:
    "Calculate C80 as 10 log10 of early-to-late squared-impulse-response energy.",
  id: "acoustics/clarity-c80",
  inputs: [
    {
      id: "earlyEnergy0To80Milliseconds",
      kind: "number",
      label: "Early energy through 80 ms",
      minimum: 0,
    },
    {
      id: "lateEnergyAfter80Milliseconds",
      kind: "number",
      label: "Late energy after 80 ms",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "clarityC80Decibels", kind: "number", label: "C80", unit: "dB" },
  ],
  title: "Music Clarity C80",
});

export const run = tool.execute;
export default tool;
