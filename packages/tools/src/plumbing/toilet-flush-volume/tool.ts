import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  bounded,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedFullFlushLiters: number;
  readonly observedReducedFlushLiters: number;
  readonly observedFullFlushCount: number;
  readonly observedReducedFlushCount: number;
}>;
export type Output = Readonly<{
  readonly observedTotalToiletFlushLiters: number;
  readonly observedMeanLitersPerFlush: number;
}>;
const inputFields = [
  {
    id: "observedFullFlushLiters",
    label: "Observed full flush liters",
    kind: "number",
  },
  {
    id: "observedReducedFlushLiters",
    label: "Observed reduced flush liters",
    kind: "number",
  },
  {
    id: "observedFullFlushCount",
    label: "Observed full flush count",
    kind: "number",
  },
  {
    id: "observedReducedFlushCount",
    label: "Observed reduced flush count",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.observedFullFlushLiters, "observedFullFlushLiters");
  nonnegative(input.observedReducedFlushLiters, "observedReducedFlushLiters");
  bounded(input.observedFullFlushCount, "flushes", 0, 1000000);
  bounded(input.observedReducedFlushCount, "flushes", 0, 1000000);
  const count = input.observedFullFlushCount + input.observedReducedFlushCount;
  positive(count, "flushes");
  const volume =
    input.observedFullFlushLiters * input.observedFullFlushCount +
    input.observedReducedFlushLiters * input.observedReducedFlushCount;
  return {
    observedTotalToiletFlushLiters: volume,
    observedMeanLitersPerFlush: volume / count,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedFullFlushLiters: 6,
  observedReducedFlushLiters: 3,
  observedFullFlushCount: 4,
  observedReducedFlushCount: 6,
} satisfies Input;
export const exampleOutput = {
  observedTotalToiletFlushLiters: 42,
  observedMeanLitersPerFlush: 4.2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/toilet-flush-volume",
  title: "Plumbing Toilet Flush Volume Calculator",
  description:
    "Reconcile actual dual-flush volumes and independent full/reduced counts, not nominal fixture label or equal-volume count multiplication.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedTotalToiletFlushLiters",
      label: "Observed total toilet flush liters",
      kind: "number",
    },
    {
      id: "observedMeanLitersPerFlush",
      label: "Observed mean liters per flush",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedFullFlushLiters: value.observedFullFlushLiters as number,
      observedReducedFlushLiters: value.observedReducedFlushLiters as number,
      observedFullFlushCount: value.observedFullFlushCount as number,
      observedReducedFlushCount: value.observedReducedFlushCount as number,
    }),
});
export const run = tool.execute;
export default tool;
