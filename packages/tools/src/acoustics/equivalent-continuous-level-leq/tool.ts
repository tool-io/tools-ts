import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type EquivalentContinuousLevelLeqInput = Readonly<{
  readonly firstDecibels: number;
  readonly firstSeconds: number;
  readonly secondDecibels: number;
  readonly secondSeconds: number;
}>;
export type EquivalentContinuousLevelLeqOutput = Readonly<{
  readonly leqDecibels: number;
}>;

export const calculateEquivalentContinuousLevelLeq = (
  x: EquivalentContinuousLevelLeqInput,
): EquivalentContinuousLevelLeqOutput => {
  if (!Number.isFinite(x.firstDecibels))
    simpleError("firstDecibels", "Provide a finite number.");
  if (!Number.isFinite(x.firstSeconds) || x.firstSeconds <= 0)
    simpleError("firstSeconds", "Provide a finite positive number.");
  if (!Number.isFinite(x.secondDecibels))
    simpleError("secondDecibels", "Provide a finite number.");
  if (!Number.isFinite(x.secondSeconds) || x.secondSeconds <= 0)
    simpleError("secondSeconds", "Provide a finite positive number.");
  const leqDecibels =
    10 *
    Math.log10(
      (x.firstSeconds * 10 ** (x.firstDecibels / 10) +
        x.secondSeconds * 10 ** (x.secondDecibels / 10)) /
        (x.firstSeconds + x.secondSeconds),
    );
  if (!Number.isFinite(leqDecibels))
    simpleError(
      "leqDecibels",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { leqDecibels: Object.is(leqDecibels, -0) ? 0 : leqDecibels };
};

export const example = {
  input: {
    firstDecibels: 60,
    firstSeconds: 60,
    secondDecibels: 70,
    secondSeconds: 60,
  },
  output: { leqDecibels: 67.40362689494245 },
} satisfies ToolExample<
  EquivalentContinuousLevelLeqInput,
  EquivalentContinuousLevelLeqOutput
>;

export const tool = createSimpleTool({
  id: "acoustics/equivalent-continuous-level-leq",
  title: "Equivalent Continuous Level Leq",
  description:
    "Two-interval equivalent continuous sound level from each interval's level and duration.",
  inputs: [
    {
      id: "firstDecibels",
      kind: "number",
      label: "First Decibels",
      unit: "dB",
    },
    {
      id: "firstSeconds",
      kind: "number",
      label: "First Seconds",
      unit: "s",
      minimum: 0,
    },
    {
      id: "secondDecibels",
      kind: "number",
      label: "Second Decibels",
      unit: "dB",
    },
    {
      id: "secondSeconds",
      kind: "number",
      label: "Second Seconds",
      unit: "s",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "leqDecibels", kind: "number", label: "Leq Decibels", unit: "dB" },
  ],
  calculate: (input) =>
    calculateEquivalentContinuousLevelLeq({
      firstDecibels: input.firstDecibels as number,
      firstSeconds: input.firstSeconds as number,
      secondDecibels: input.secondDecibels as number,
      secondSeconds: input.secondSeconds as number,
    }),
});
export const equivalentContinuousLevelLeqTool = tool;
export const runEquivalentContinuousLevelLeq = tool.execute;
export default tool;
