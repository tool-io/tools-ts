import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedServicePointCount: number;
  readonly observedFirstServeInCount: number;
  readonly observedFirstServePointsWon: number;
  readonly observedSecondServePointsWon: number;
}>;
export type Output = Readonly<{
  readonly firstServeInPercent: number;
  readonly firstServeConditionalWonPercent: number;
  readonly allServicePointsWonPercent: number;
}>;
const inputFields = [
  {
    id: "observedServicePointCount",
    label: "Observed service point count",
    kind: "number",
  },
  {
    id: "observedFirstServeInCount",
    label: "Observed first serve in count",
    kind: "number",
  },
  {
    id: "observedFirstServePointsWon",
    label: "Observed first serve points won",
    kind: "number",
  },
  {
    id: "observedSecondServePointsWon",
    label: "Observed second serve points won",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  bounded(input.observedServicePointCount, "points", 1, 1000000);
  bounded(
    input.observedFirstServeInCount,
    "first",
    1,
    input.observedServicePointCount,
  );
  bounded(
    input.observedFirstServePointsWon,
    "won",
    0,
    input.observedFirstServeInCount,
  );
  bounded(
    input.observedSecondServePointsWon,
    "secondWon",
    0,
    input.observedServicePointCount - input.observedFirstServeInCount,
  );
  return {
    firstServeInPercent:
      (100 * input.observedFirstServeInCount) / input.observedServicePointCount,
    firstServeConditionalWonPercent:
      (100 * input.observedFirstServePointsWon) /
      input.observedFirstServeInCount,
    allServicePointsWonPercent:
      (100 *
        (input.observedFirstServePointsWon +
          input.observedSecondServePointsWon)) /
      input.observedServicePointCount,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedServicePointCount: 100,
  observedFirstServeInCount: 60,
  observedFirstServePointsWon: 42,
  observedSecondServePointsWon: 20,
} satisfies Input;
export const exampleOutput = {
  firstServeInPercent: 60,
  firstServeConditionalWonPercent: 70,
  allServicePointsWonPercent: 62,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sports/tennis-first-serve-percent-won-conversion",
  title: "First Serve Percent Won Conversion",
  description:
    "Reconcile actual first-in, conditional first-win and second-win tennis point evidence; first-in×conditional-win is not all service wins, no inferred double-fault policy.",
  inputs: inputFields,
  outputs: [
    {
      id: "firstServeInPercent",
      label: "First serve in percent",
      kind: "number",
    },
    {
      id: "firstServeConditionalWonPercent",
      label: "First serve conditional won percent",
      kind: "number",
    },
    {
      id: "allServicePointsWonPercent",
      label: "All service points won percent",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedServicePointCount: value.observedServicePointCount as number,
      observedFirstServeInCount: value.observedFirstServeInCount as number,
      observedFirstServePointsWon: value.observedFirstServePointsWon as number,
      observedSecondServePointsWon:
        value.observedSecondServePointsWon as number,
    }),
});
export const run = tool.execute;
export default tool;
