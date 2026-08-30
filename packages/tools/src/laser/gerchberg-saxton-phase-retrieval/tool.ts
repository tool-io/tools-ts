import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly sourceAmplitude: readonly number[];
  readonly targetAmplitude: readonly number[];
  readonly iterations: number;
}>;
export type Output = Readonly<{
  readonly sourcePhaseRadians: readonly number[];
  readonly finalTargetAmplitude: readonly number[];
}>;

export const calculate = (input: Input): Output => {
  const n = input.sourceAmplitude.length;
  if (
    n === 0 ||
    input.targetAmplitude.length !== n ||
    input.sourceAmplitude.some((value) => value < 0) ||
    input.targetAmplitude.some((value) => value < 0)
  )
    simpleError(
      "sourceAmplitude",
      "Amplitude lists must be aligned, nonempty, and nonnegative.",
      "invalid_amplitudes",
    );
  let phase = Array(n).fill(0);
  const transform = (
    amplitude: readonly number[],
    angles: readonly number[],
    inverse = false,
  ) =>
    Array.from({ length: n }, (_, k) => {
      let re = 0,
        im = 0;
      for (let j = 0; j < n; j += 1) {
        const angle =
          angles[j] + ((inverse ? 1 : -1) * 2 * Math.PI * j * k) / n;
        re += amplitude[j] * Math.cos(angle);
        im += amplitude[j] * Math.sin(angle);
      }
      if (inverse) {
        re /= n;
        im /= n;
      }
      return { amplitude: Math.hypot(re, im), phase: Math.atan2(im, re) };
    });
  for (let step = 0; step < input.iterations; step += 1) {
    const target = transform(input.sourceAmplitude, phase);
    const source = transform(
      input.targetAmplitude,
      target.map((value) => value.phase),
      true,
    );
    phase = source.map((value) => value.phase);
  }
  const finalTargetAmplitude = transform(input.sourceAmplitude, phase).map(
    (value) => value.amplitude,
  );
  return { sourcePhaseRadians: phase, finalTargetAmplitude };
};

export const exampleInput = {
  sourceAmplitude: [1, 1],
  targetAmplitude: [2, 0],
  iterations: 1,
} satisfies Input;
export const exampleOutput = {
  sourcePhaseRadians: [0, 0],
  finalTargetAmplitude: [2, 1.2246467991473532e-16],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      sourceAmplitude: input.sourceAmplitude as readonly number[],
      targetAmplitude: input.targetAmplitude as readonly number[],
      iterations: input.iterations as number,
    }),
  description:
    "Run a bounded one-dimensional Gerchberg–Saxton phase-retrieval iteration.",
  id: "laser/gerchberg-saxton-phase-retrieval",
  inputs: [
    {
      id: "sourceAmplitude",
      label: "Source-plane amplitudes",
      kind: "numberList",
    },
    {
      id: "targetAmplitude",
      label: "Target-plane amplitudes",
      kind: "numberList",
    },
    {
      id: "iterations",
      label: "Iteration count",
      kind: "integer",
      minimum: 1,
      maximum: 100,
    },
  ],
  outputs: [
    {
      id: "sourcePhaseRadians",
      label: "Retrieved source phase",
      kind: "numberList",
      unit: "rad",
    },
    {
      id: "finalTargetAmplitude",
      label: "Final target-plane amplitudes",
      kind: "numberList",
    },
  ],
  title: "Gerchberg\u2013Saxton Phase Retrieval",
});

export const run = tool.execute;
export default tool;
