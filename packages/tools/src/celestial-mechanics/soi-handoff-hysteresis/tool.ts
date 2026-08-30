import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { positive, nonnegative } from "../shared.js";

export type Input = Readonly<{
  readonly currentDistance: number;
  readonly entryBoundary: number;
  readonly exitBoundary: number;
  readonly previouslyInside: boolean;
}>;
export type Output = Readonly<{
  readonly nowInside: boolean;
  readonly transition: string;
}>;
export const calculate = (input: Input): Output => {
  nonnegative(input.currentDistance, "currentDistance");
  positive(input.entryBoundary, "entryBoundary");
  if (input.exitBoundary < input.entryBoundary)
    simpleError(
      "exitBoundary",
      "Exit boundary must be at least the entry boundary.",
    );
  const nowInside = input.previouslyInside
    ? input.currentDistance <= input.exitBoundary
    : input.currentDistance < input.entryBoundary;
  return {
    nowInside,
    transition:
      nowInside === input.previouslyInside
        ? "none"
        : nowInside
          ? "enter"
          : "exit",
  };
};
export const exampleInput = {
  currentDistance: 105,
  entryBoundary: 100,
  exitBoundary: 110,
  previouslyInside: true,
} satisfies Input;
export const exampleOutput = {
  nowInside: true,
  transition: "none",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "celestial-mechanics/soi-handoff-hysteresis",
  title: "Soi Handoff Hysteresis",
  description:
    "Apply caller-defined sphere-of-influence handoff hysteresis to a sampled trajectory; boundaries are not universal force-dominance limits.",
  inputs: [
    { id: "currentDistance", label: "Current distance", kind: "number" },
    { id: "entryBoundary", label: "Entry boundary", kind: "number" },
    { id: "exitBoundary", label: "Exit boundary", kind: "number" },
    { id: "previouslyInside", label: "Previously inside", kind: "boolean" },
  ],
  outputs: [
    { id: "nowInside", label: "Now inside", kind: "boolean" },
    { id: "transition", label: "Transition", kind: "string" },
  ],
  calculate: (value) =>
    calculate({
      currentDistance: value.currentDistance as number,
      entryBoundary: value.entryBoundary as number,
      exitBoundary: value.exitBoundary as number,
      previouslyInside: value.previouslyInside as boolean,
    }),
});
export const run = tool.execute;
export default tool;
