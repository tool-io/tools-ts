import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly lateralEnergy5To80Milliseconds: number;
  readonly omnidirectionalEnergy0To80Milliseconds: number;
}>;
export type Output = Readonly<{ readonly lateralFraction: number }>;

export const calculate = (input: Input): Output => {
  if (
    !Number.isFinite(input.lateralEnergy5To80Milliseconds) ||
    input.lateralEnergy5To80Milliseconds < 0
  )
    simpleError(
      "lateralEnergy5To80Milliseconds",
      "Lateral energy must be finite and nonnegative.",
      "invalid_energy",
    );
  if (
    !Number.isFinite(input.omnidirectionalEnergy0To80Milliseconds) ||
    input.omnidirectionalEnergy0To80Milliseconds <= 0
  )
    simpleError(
      "omnidirectionalEnergy0To80Milliseconds",
      "Omnidirectional energy must be finite and positive.",
      "invalid_energy",
    );
  if (
    input.lateralEnergy5To80Milliseconds >
    input.omnidirectionalEnergy0To80Milliseconds
  )
    simpleError(
      "lateralEnergy5To80Milliseconds",
      "Lateral energy cannot exceed the supplied total early energy.",
      "inconsistent_energy",
    );
  return {
    lateralFraction:
      input.lateralEnergy5To80Milliseconds /
      input.omnidirectionalEnergy0To80Milliseconds,
  };
};

export const example = {
  input: {
    lateralEnergy5To80Milliseconds: 25,
    omnidirectionalEnergy0To80Milliseconds: 100,
  },
  output: { lateralFraction: 0.25 },
} satisfies ToolExample<Input, Output>;
export const edgeCase = {
  input: {
    lateralEnergy5To80Milliseconds: 0,
    omnidirectionalEnergy0To80Milliseconds: 10,
  },
  output: { lateralFraction: 0 },
} satisfies { readonly input: Input; readonly output: Output };

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      lateralEnergy5To80Milliseconds:
        input.lateralEnergy5To80Milliseconds as number,
      omnidirectionalEnergy0To80Milliseconds:
        input.omnidirectionalEnergy0To80Milliseconds as number,
    }),
  description:
    "Calculate the early lateral-energy fraction from caller-supplied 5–80 ms lateral and 0–80 ms omnidirectional energies.",
  id: "acoustics/early-lateral-energy-fraction",
  inputs: [
    {
      id: "lateralEnergy5To80Milliseconds",
      kind: "number",
      label: "Lateral energy from 5 to 80 ms",
      minimum: 0,
    },
    {
      id: "omnidirectionalEnergy0To80Milliseconds",
      kind: "number",
      label: "Omnidirectional energy from 0 to 80 ms",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "lateralFraction",
      kind: "number",
      label: "Early lateral fraction",
      minimum: 0,
      maximum: 1,
    },
  ],
  title: "Early Lateral Energy Fraction",
});

export const run = tool.execute;
export default tool;
