import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { proteinSequence } from "../../core/protein.js";

export type Input = Readonly<{
  readonly sequence: string;
  readonly windowLength: number;
  readonly turnResidues: string;
}>;
export type Output = Readonly<{
  readonly windowScores: readonly number[];
  readonly bestStart: number;
}>;
export const calculate = (input: Input): Output => {
  const s = proteinSequence(input.sequence);
  if (
    !Number.isSafeInteger(input.windowLength) ||
    input.windowLength < 1 ||
    input.windowLength > s.length
  )
    simpleError("windowLength", "Valid turn window length required.");
  const windowScores = Array.from(
    { length: s.length - input.windowLength + 1 },
    (_, i) =>
      [...s.slice(i, i + input.windowLength)].filter((v) =>
        input.turnResidues.includes(v),
      ).length / input.windowLength,
  );
  return {
    windowScores,
    bestStart: windowScores.indexOf(Math.max(...windowScores)),
  };
};
export const exampleInput = {
  sequence: "GPNS",
  windowLength: 4,
  turnResidues: "GPNS",
} satisfies Input;
export const exampleOutput = {
  windowScores: [1],
  bestStart: 0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "proteomics/beta-turn-window-score",
  title: "Beta Turn Window Score",
  description:
    "Rank beta-turn candidate windows by caller-selected turn-favoring residues.",
  inputs: [
    { id: "sequence", label: "Sequence", kind: "string" },
    { id: "windowLength", label: "Window length", kind: "number" },
    { id: "turnResidues", label: "Turn residues", kind: "string" },
  ],
  outputs: [
    { id: "windowScores", label: "Window scores", kind: "numberList" },
    { id: "bestStart", label: "Best start", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      sequence: value.sequence as string,
      windowLength: value.windowLength as number,
      turnResidues: value.turnResidues as string,
    }),
});
export const run = tool.execute;
export default tool;
