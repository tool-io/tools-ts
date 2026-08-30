import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { positive, aligned, rank } from "../shared.js";

export type Input = Readonly<{
  readonly epochOffsetsYears: readonly number[];
  readonly raParallaxFactors: readonly number[];
  readonly decParallaxFactors: readonly number[];
  readonly rankTolerance: number;
}>;
export type Output = Readonly<{
  readonly designRank: number;
  readonly designRowCount: number;
  readonly fullFiveParameterRank: boolean;
}>;
export const calculate = (input: Input): Output => {
  aligned(
    input.epochOffsetsYears,
    input.raParallaxFactors,
    "epochOffsetsYears",
  );
  aligned(
    input.epochOffsetsYears,
    input.decParallaxFactors,
    "epochOffsetsYears",
  );
  positive(input.rankTolerance, "rankTolerance");
  if (input.epochOffsetsYears.length > 64)
    simpleError(
      "epochOffsetsYears",
      "At most 64 two-coordinate epochs supported.",
    );
  const design = input.epochOffsetsYears.flatMap((t, i) => [
      [1, 0, t, 0, input.raParallaxFactors[i]],
      [0, 1, 0, t, input.decParallaxFactors[i]],
    ]),
    designRank = rank(design, input.rankTolerance);
  return {
    designRank,
    designRowCount: design.length,
    fullFiveParameterRank: designRank === 5,
  };
};
export const exampleInput = {
  epochOffsetsYears: [-1, 0, 1],
  raParallaxFactors: [1, 0, 1],
  decParallaxFactors: [0, 1, 0],
  rankTolerance: 1e-10,
} satisfies Input;
export const exampleOutput = {
  designRank: 5,
  designRowCount: 6,
  fullFiveParameterRank: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrometry/five-parameter-design-rank",
  title: "Five Parameter Design Rank",
  description:
    "Audit rank of a position/proper-motion/parallax design from supplied epoch offsets and RA*/Dec parallax factors; conditioning and measurement weights are not assessed.",
  inputs: [
    {
      id: "epochOffsetsYears",
      label: "Epoch offsets years",
      kind: "numberList",
    },
    {
      id: "raParallaxFactors",
      label: "Ra parallax factors",
      kind: "numberList",
    },
    {
      id: "decParallaxFactors",
      label: "Dec parallax factors",
      kind: "numberList",
    },
    { id: "rankTolerance", label: "Rank tolerance", kind: "number" },
  ],
  outputs: [
    { id: "designRank", label: "Design rank", kind: "number" },
    { id: "designRowCount", label: "Design row count", kind: "number" },
    {
      id: "fullFiveParameterRank",
      label: "Full five parameter rank",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      epochOffsetsYears: value.epochOffsetsYears as readonly number[],
      raParallaxFactors: value.raParallaxFactors as readonly number[],
      decParallaxFactors: value.decParallaxFactors as readonly number[],
      rankTolerance: value.rankTolerance as number,
    }),
});
export const run = tool.execute;
export default tool;
