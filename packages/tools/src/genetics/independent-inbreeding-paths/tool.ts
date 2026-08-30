import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { count, fraction, aligned } from "../shared.js";

export type Input = Readonly<{
  readonly firstParentPathGenerations: readonly number[];
  readonly secondParentPathGenerations: readonly number[];
  readonly ancestorInbreeding: readonly number[];
  readonly independentPathsConfirmed: boolean;
}>;
export type Output = Readonly<{
  readonly pathContributions: readonly number[];
  readonly offspringInbreeding: number;
}>;
export const calculate = (input: Input): Output => {
  aligned(
    input.firstParentPathGenerations,
    input.secondParentPathGenerations,
    "firstParentPathGenerations",
  );
  aligned(
    input.firstParentPathGenerations,
    input.ancestorInbreeding,
    "ancestorInbreeding",
  );
  if (!input.independentPathsConfirmed)
    simpleError(
      "independentPathsConfirmed",
      "Caller must confirm independent, nonduplicated pedigree paths.",
    );
  const pathContributions = input.firstParentPathGenerations.map((v, i) => {
      count(v, "firstParentPathGenerations");
      count(
        input.secondParentPathGenerations[i],
        "secondParentPathGenerations",
      );
      fraction(input.ancestorInbreeding[i], "ancestorInbreeding");
      return (
        0.5 ** (v + input.secondParentPathGenerations[i] + 1) *
        (1 + input.ancestorInbreeding[i])
      );
    }),
    offspringInbreeding = pathContributions.reduce((a, b) => a + b, 0);
  if (offspringInbreeding > 1)
    simpleError(
      "firstParentPathGenerations",
      "Path contributions exceed a valid inbreeding coefficient.",
    );
  return { pathContributions, offspringInbreeding };
};
export const exampleInput = {
  firstParentPathGenerations: [2, 2],
  secondParentPathGenerations: [2, 2],
  ancestorInbreeding: [0, 0],
  independentPathsConfirmed: true,
} satisfies Input;
export const exampleOutput = {
  pathContributions: [0.03125, 0.03125],
  offspringInbreeding: 0.0625,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "genetics/independent-inbreeding-paths",
  title: "Independent Inbreeding Paths",
  description:
    "Sum caller-validated independent common-ancestor path contributions to offspring inbreeding.",
  inputs: [
    {
      id: "firstParentPathGenerations",
      label: "First parent path generations",
      kind: "numberList",
    },
    {
      id: "secondParentPathGenerations",
      label: "Second parent path generations",
      kind: "numberList",
    },
    {
      id: "ancestorInbreeding",
      label: "Ancestor inbreeding",
      kind: "numberList",
    },
    {
      id: "independentPathsConfirmed",
      label: "Independent paths confirmed",
      kind: "boolean",
    },
  ],
  outputs: [
    {
      id: "pathContributions",
      label: "Path contributions",
      kind: "numberList",
    },
    {
      id: "offspringInbreeding",
      label: "Offspring inbreeding",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      firstParentPathGenerations:
        value.firstParentPathGenerations as readonly number[],
      secondParentPathGenerations:
        value.secondParentPathGenerations as readonly number[],
      ancestorInbreeding: value.ancestorInbreeding as readonly number[],
      independentPathsConfirmed: value.independentPathsConfirmed as boolean,
    }),
});
export const run = tool.execute;
export default tool;
