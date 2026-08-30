import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly foreground: readonly number[];
  readonly localBackground: readonly number[];
  readonly floorAtZero: boolean;
}>;
export type Output = Readonly<{
  readonly correctedSignals: readonly number[];
  readonly backgroundTotal: number;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.foreground.length === 0 ||
    input.foreground.length !== input.localBackground.length ||
    input.localBackground.some((v) => v < 0)
  )
    simpleError(
      "foreground",
      "Aligned foreground and nonnegative local backgrounds are required.",
    );
  return {
    correctedSignals: input.foreground.map((v, i) =>
      input.floorAtZero
        ? Math.max(0, v - input.localBackground[i])
        : v - input.localBackground[i],
    ),
    backgroundTotal: input.localBackground.reduce((a, b) => a + b, 0),
  };
};

export const exampleInput = {
  foreground: [10, 5, 20],
  localBackground: [2, 6, 8],
  floorAtZero: true,
} satisfies Input;
export const exampleOutput = {
  correctedSignals: [8, 0, 12],
  backgroundTotal: 16,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "transcriptomics/microarray-background-correction",
  title: "Microarray Background Correction",
  description: "Subtract local microarray background for each probe spot.",
  inputs: [
    { id: "foreground", kind: "numberList", label: "Foreground" },
    { id: "localBackground", kind: "numberList", label: "Local background" },
    { id: "floorAtZero", kind: "boolean", label: "Floor at zero" },
  ],
  outputs: [
    { id: "correctedSignals", kind: "numberList", label: "Corrected signals" },
    { id: "backgroundTotal", kind: "number", label: "Background total" },
  ],
  calculate: (value) =>
    calculate({
      foreground: value.foreground as readonly number[],
      localBackground: value.localBackground as readonly number[],
      floorAtZero: value.floorAtZero as boolean,
    }),
});
export const run = tool.execute;
export default tool;
