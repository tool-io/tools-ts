import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly positionsBp: readonly number[];
  readonly readCounts: readonly number[];
}>;
export type Output = Readonly<{
  readonly summitPositionBp: number;
  readonly summitReadCount: number;
  readonly readsPerPosition: number;
}>;

export const calculate = (input: Input): Output => {
  const n = input.positionsBp.length;
  if (
    n === 0 ||
    input.readCounts.length !== n ||
    input.readCounts.some((v) => v < 0)
  )
    simpleError(
      "positionsBp",
      "Aligned positions and nonnegative counts are required.",
      "invalid_peak",
    );
  const summitReadCount = Math.max(...input.readCounts),
    index = input.readCounts.indexOf(summitReadCount);
  return {
    summitPositionBp: input.positionsBp[index],
    summitReadCount,
    readsPerPosition: input.readCounts.reduce((a, b) => a + b, 0) / n,
  };
};

export const exampleInput = {
  positionsBp: [100, 110, 120],
  readCounts: [5, 20, 10],
} satisfies Input;
export const exampleOutput = {
  summitPositionBp: 110,
  summitReadCount: 20,
  readsPerPosition: 11.666666666666666,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      positionsBp: input.positionsBp as readonly number[],
      readCounts: input.readCounts as readonly number[],
    }),
  description: "Record a ChIP-seq peak summit from positional read counts.",
  id: "epigenetics/peak-summit",
  inputs: [
    {
      id: "positionsBp",
      label: "Peak positions",
      kind: "numberList",
      unit: "bp",
    },
    { id: "readCounts", label: "Read counts", kind: "numberList" },
  ],
  outputs: [
    {
      id: "summitPositionBp",
      label: "Peak summit position",
      kind: "number",
      unit: "bp",
    },
    {
      id: "summitReadCount",
      label: "Summit read count",
      kind: "number",
      minimum: 0,
    },
    {
      id: "readsPerPosition",
      label: "Mean reads per position",
      kind: "number",
      minimum: 0,
    },
  ],
  title: "Peak Summit",
});

export const run = tool.execute;
export default tool;
