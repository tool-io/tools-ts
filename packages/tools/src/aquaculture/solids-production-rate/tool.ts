import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative, fraction } from "../shared.js";
export type Input = Readonly<{
  readonly feedKgPerDay: number;
  readonly uneatenFeedFraction: number;
  readonly consumedFeedDryFecalFraction: number;
  readonly captureFraction: number;
}>;
export type Output = Readonly<{
  readonly uneatenSolidsKgPerDay: number;
  readonly fecalSolidsKgPerDay: number;
  readonly totalSolidsKgPerDay: number;
  readonly capturedSolidsKgPerDay: number;
}>;
const inputFields = [
  { id: "feedKgPerDay", label: "Feed kg per day", kind: "number" },
  { id: "uneatenFeedFraction", label: "Uneaten feed fraction", kind: "number" },
  {
    id: "consumedFeedDryFecalFraction",
    label: "Consumed feed dry fecal fraction",
    kind: "number",
  },
  { id: "captureFraction", label: "Capture fraction", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.feedKgPerDay, "feedKgPerDay");
  fraction(input.uneatenFeedFraction, "uneatenFeedFraction");
  fraction(input.consumedFeedDryFecalFraction, "consumedFeedDryFecalFraction");
  fraction(input.captureFraction, "captureFraction");
  const uneatenSolidsKgPerDay = input.feedKgPerDay * input.uneatenFeedFraction,
    fecalSolidsKgPerDay =
      input.feedKgPerDay *
      (1 - input.uneatenFeedFraction) *
      input.consumedFeedDryFecalFraction,
    totalSolidsKgPerDay = uneatenSolidsKgPerDay + fecalSolidsKgPerDay;
  return {
    uneatenSolidsKgPerDay,
    fecalSolidsKgPerDay,
    totalSolidsKgPerDay,
    capturedSolidsKgPerDay: totalSolidsKgPerDay * input.captureFraction,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  feedKgPerDay: 100,
  uneatenFeedFraction: 0.1,
  consumedFeedDryFecalFraction: 0.2,
  captureFraction: 0.8,
} satisfies Input;
export const exampleOutput = {
  uneatenSolidsKgPerDay: 10,
  fecalSolidsKgPerDay: 18,
  totalSolidsKgPerDay: 28,
  capturedSolidsKgPerDay: 22.4,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aquaculture/solids-production-rate",
  title: "Solids Production Rate",
  description:
    "Partition supplied dry feed into uneaten and fecal solids then apply mechanical capture; dry-mass basis excludes dissolved organics and biological sludge.",
  inputs: inputFields,
  outputs: [
    {
      id: "uneatenSolidsKgPerDay",
      label: "Uneaten solids kg per day",
      kind: "number",
    },
    {
      id: "fecalSolidsKgPerDay",
      label: "Fecal solids kg per day",
      kind: "number",
    },
    {
      id: "totalSolidsKgPerDay",
      label: "Total solids kg per day",
      kind: "number",
    },
    {
      id: "capturedSolidsKgPerDay",
      label: "Captured solids kg per day",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      feedKgPerDay: value.feedKgPerDay as number,
      uneatenFeedFraction: value.uneatenFeedFraction as number,
      consumedFeedDryFecalFraction:
        value.consumedFeedDryFecalFraction as number,
      captureFraction: value.captureFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
