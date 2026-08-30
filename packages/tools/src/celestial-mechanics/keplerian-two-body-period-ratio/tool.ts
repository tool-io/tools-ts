import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { positive } from "../shared.js";

export type Input = Readonly<{
  readonly firstSemimajorAxis: number;
  readonly secondSemimajorAxis: number;
  readonly firstMu: number;
  readonly secondMu: number;
}>;
export type Output = Readonly<{
  readonly secondFirstPeriodRatio: number;
}>;
export const calculate = (input: Input): Output => {
  positive(input.firstSemimajorAxis, "firstSemimajorAxis");
  positive(input.secondSemimajorAxis, "secondSemimajorAxis");
  positive(input.firstMu, "firstMu");
  positive(input.secondMu, "secondMu");
  return {
    secondFirstPeriodRatio:
      (input.secondSemimajorAxis / input.firstSemimajorAxis) ** 1.5 *
      Math.sqrt(input.firstMu / input.secondMu),
  };
};
export const exampleInput = {
  firstSemimajorAxis: 1,
  secondSemimajorAxis: 4,
  firstMu: 1,
  secondMu: 4,
} satisfies Input;
export const exampleOutput = { secondFirstPeriodRatio: 4 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "celestial-mechanics/keplerian-two-body-period-ratio",
  title: "Keplerian Two Body Period Ratio",
  description:
    "Compare orbital periods around possibly different gravitating systems using semimajor axes and total gravitational parameters.",
  inputs: [
    { id: "firstSemimajorAxis", label: "First semimajor axis", kind: "number" },
    {
      id: "secondSemimajorAxis",
      label: "Second semimajor axis",
      kind: "number",
    },
    { id: "firstMu", label: "First mu", kind: "number" },
    { id: "secondMu", label: "Second mu", kind: "number" },
  ],
  outputs: [
    {
      id: "secondFirstPeriodRatio",
      label: "Second first period ratio",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      firstSemimajorAxis: value.firstSemimajorAxis as number,
      secondSemimajorAxis: value.secondSemimajorAxis as number,
      firstMu: value.firstMu as number,
      secondMu: value.secondMu as number,
    }),
});
export const run = tool.execute;
export default tool;
