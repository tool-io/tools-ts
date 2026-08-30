import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { nonnegative } from "../shared.js";

export type Input = Readonly<{
  readonly geneOrder: readonly string[];
  readonly intervalDistancesCm: readonly number[];
  readonly startPositionCm: number;
}>;
export type Output = Readonly<{
  readonly mapPositionsCm: readonly number[];
  readonly totalMapLengthCm: number;
}>;
export const calculate = (input: Input): Output => {
  if (
    input.geneOrder.length < 2 ||
    input.intervalDistancesCm.length !== input.geneOrder.length - 1 ||
    new Set(input.geneOrder).size !== input.geneOrder.length
  )
    simpleError(
      "geneOrder",
      "Distinct ordered genes and one distance per consecutive interval required.",
    );
  input.intervalDistancesCm.forEach((v) =>
    nonnegative(v, "intervalDistancesCm"),
  );
  let position = input.startPositionCm;
  const mapPositionsCm = [position];
  for (const distance of input.intervalDistancesCm) {
    position += distance;
    mapPositionsCm.push(position);
  }
  return { mapPositionsCm, totalMapLengthCm: position - input.startPositionCm };
};
export const exampleInput = {
  geneOrder: ["A", "B", "C"],
  intervalDistancesCm: [10, 20],
  startPositionCm: 0,
} satisfies Input;
export const exampleOutput = {
  mapPositionsCm: [0, 10, 30],
  totalMapLengthCm: 30,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "genetics/linkage-interval-map",
  title: "Linkage Interval Map",
  description:
    "Build additive genetic-map positions from ordered adjacent interval distances.",
  inputs: [
    { id: "geneOrder", label: "Gene order", kind: "stringList" },
    {
      id: "intervalDistancesCm",
      label: "Interval distances cm",
      kind: "numberList",
    },
    { id: "startPositionCm", label: "Start position cm", kind: "number" },
  ],
  outputs: [
    { id: "mapPositionsCm", label: "Map positions cm", kind: "numberList" },
    { id: "totalMapLengthCm", label: "Total map length cm", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      geneOrder: value.geneOrder as readonly string[],
      intervalDistancesCm: value.intervalDistancesCm as readonly number[],
      startPositionCm: value.startPositionCm as number,
    }),
});
export const run = tool.execute;
export default tool;
