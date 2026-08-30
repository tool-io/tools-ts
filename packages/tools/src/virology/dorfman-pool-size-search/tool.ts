import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { fraction, count } from "../shared.js";

export type Input = Readonly<{
  readonly prevalenceFraction: number;
  readonly maximumPoolSize: number;
}>;
export type Output = Readonly<{
  readonly bestPoolSize: number;
  readonly expectedTestsPerPerson: number;
  readonly expectedTestsSavedPercent: number;
}>;
export const calculate = (input: Input): Output => {
  fraction(input.prevalenceFraction, "prevalenceFraction");
  count(input.maximumPoolSize, "maximumPoolSize", 1);
  if (input.maximumPoolSize > 10000)
    simpleError("maximumPoolSize", "Search is limited to 10000 pool sizes.");
  let bestPoolSize = 1,
    expectedTestsPerPerson = 1;
  for (let n = 2; n <= input.maximumPoolSize; n++) {
    const tests = 1 / n - Math.expm1(n * Math.log1p(-input.prevalenceFraction));
    if (tests < expectedTestsPerPerson) {
      bestPoolSize = n;
      expectedTestsPerPerson = tests;
    }
  }
  return {
    bestPoolSize,
    expectedTestsPerPerson,
    expectedTestsSavedPercent: 100 * (1 - expectedTestsPerPerson),
  };
};
export const exampleInput = {
  prevalenceFraction: 0.01,
  maximumPoolSize: 10,
} satisfies Input;
export const exampleOutput = {
  bestPoolSize: 10,
  expectedTestsPerPerson: 0.19561792499119568,
  expectedTestsSavedPercent: 80.43820750088044,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "virology/dorfman-pool-size-search",
  title: "Dorfman Pool Size Search",
  description:
    "Search Dorfman two-stage pool sizes under independent infection and perfect-test assumptions; dilution sensitivity is not modeled.",
  inputs: [
    {
      id: "prevalenceFraction",
      label: "Prevalence fraction",
      kind: "number",
      minimum: 0,
      maximum: 1,
    },
    {
      id: "maximumPoolSize",
      label: "Maximum pool size",
      kind: "integer",
      minimum: 1,
    },
  ],
  outputs: [
    { id: "bestPoolSize", label: "Best pool size", kind: "number" },
    {
      id: "expectedTestsPerPerson",
      label: "Expected tests per person",
      kind: "number",
    },
    {
      id: "expectedTestsSavedPercent",
      label: "Expected tests saved percent",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      prevalenceFraction: value.prevalenceFraction as number,
      maximumPoolSize: value.maximumPoolSize as number,
    }),
});
export const run = tool.execute;
export default tool;
