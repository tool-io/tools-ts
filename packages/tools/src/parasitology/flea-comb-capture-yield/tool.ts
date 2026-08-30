import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { count } from "../shared.js";

export type Input = Readonly<{
  readonly combPassCounts: readonly number[];
  readonly totalExaminedAnimals: number;
}>;
export type Output = Readonly<{
  readonly totalCaptured: number;
  readonly meanPerPass: number;
  readonly capturedPerAnimal: number;
}>;
export const calculate = (input: Input): Output => {
  if (!input.combPassCounts.length)
    simpleError(
      "combPassCounts",
      "Nonempty comb-pass capture counts required.",
    );
  input.combPassCounts.forEach((v) => count(v, "combPassCounts"));
  count(input.totalExaminedAnimals, "totalExaminedAnimals", 1);
  const totalCaptured = input.combPassCounts.reduce((a, b) => a + b, 0);
  return {
    totalCaptured,
    meanPerPass: totalCaptured / input.combPassCounts.length,
    capturedPerAnimal: totalCaptured / input.totalExaminedAnimals,
  };
};
export const exampleInput = {
  combPassCounts: [3, 2, 1],
  totalExaminedAnimals: 2,
} satisfies Input;
export const exampleOutput = {
  totalCaptured: 6,
  meanPerPass: 2,
  capturedPerAnimal: 3,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "parasitology/flea-comb-capture-yield",
  title: "Flea Comb Capture Yield",
  description:
    "Summarize adult flea captures per comb pass and per examined animal.",
  inputs: [
    { id: "combPassCounts", label: "Comb pass counts", kind: "numberList" },
    {
      id: "totalExaminedAnimals",
      label: "Total examined animals",
      kind: "integer",
    },
  ],
  outputs: [
    { id: "totalCaptured", label: "Total captured", kind: "number" },
    { id: "meanPerPass", label: "Mean per pass", kind: "number" },
    { id: "capturedPerAnimal", label: "Captured per animal", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      combPassCounts: value.combPassCounts as readonly number[],
      totalExaminedAnimals: value.totalExaminedAnimals as number,
    }),
});
export const run = tool.execute;
export default tool;
