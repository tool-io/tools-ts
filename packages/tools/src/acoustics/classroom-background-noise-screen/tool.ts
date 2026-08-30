import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly backgroundLevelDecibelsA: number;
  readonly limitDecibelsA: number;
}>;
export type Output = Readonly<{
  readonly marginDecibels: number;
  readonly withinCallerLimit: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (
    !Number.isFinite(input.backgroundLevelDecibelsA) ||
    !Number.isFinite(input.limitDecibelsA)
  )
    simpleError(
      "backgroundLevelDecibelsA",
      "Levels must be finite.",
      "invalid_level",
    );
  const marginDecibels = input.limitDecibelsA - input.backgroundLevelDecibelsA;
  if (!Number.isFinite(marginDecibels))
    simpleError(
      "backgroundLevelDecibelsA",
      "Level margin is out of range.",
      "numeric_overflow",
    );
  return { marginDecibels, withinCallerLimit: marginDecibels >= 0 };
};

export const example = {
  input: { backgroundLevelDecibelsA: 33, limitDecibelsA: 35 },
  output: { marginDecibels: 2, withinCallerLimit: true },
} satisfies ToolExample<Input, Output>;
export const edgeCase = {
  input: { backgroundLevelDecibelsA: 40, limitDecibelsA: 35 },
  output: { marginDecibels: -5, withinCallerLimit: false },
} satisfies { readonly input: Input; readonly output: Output };

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      backgroundLevelDecibelsA: input.backgroundLevelDecibelsA as number,
      limitDecibelsA: input.limitDecibelsA as number,
    }),
  description:
    "Compare an unoccupied furnished classroom background level with a caller-supplied limit; 35 dBA, not 30 dBA, is the common ANSI/ASA S12.60 design value for typical core learning spaces.",
  id: "acoustics/classroom-background-noise-screen",
  inputs: [
    {
      id: "backgroundLevelDecibelsA",
      kind: "number",
      label: "Background level",
      unit: "dBA",
    },
    {
      id: "limitDecibelsA",
      kind: "number",
      label: "Caller-supplied limit",
      unit: "dBA",
    },
  ],
  outputs: [
    {
      id: "marginDecibels",
      kind: "number",
      label: "Margin to limit",
      unit: "dB",
    },
    { id: "withinCallerLimit", kind: "boolean", label: "Within caller limit" },
  ],
  title: "Classroom Background-Noise Screen",
});

export const run = tool.execute;
export default tool;
