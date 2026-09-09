import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly independentlyMeasuredFixtureLoadNewtons: readonly number[];
  readonly independentlyEngineeredAllowableFixtureLoadsNewtons: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyMeasuredFixtureLoadNewtons",
    label: "Independently measured fixture load newtons",
    kind: "numberList",
  },
  {
    id: "independentlyEngineeredAllowableFixtureLoadsNewtons",
    label: "Independently engineered allowable fixture loads newtons",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  aligned(
    input.independentlyMeasuredFixtureLoadNewtons,
    input.independentlyEngineeredAllowableFixtureLoadsNewtons,
    "fixtures",
  );
  input.independentlyMeasuredFixtureLoadNewtons.forEach((v) =>
    nonnegative(v, "load"),
  );
  input.independentlyEngineeredAllowableFixtureLoadsNewtons.forEach((v) =>
    positive(v, "rating"),
  );
  return {
    signedFixtureCapacityMarginsNewtons:
      input.independentlyEngineeredAllowableFixtureLoadsNewtons.map(
        (v, i) => v - input.independentlyMeasuredFixtureLoadNewtons[i],
      ),
    fixtureExceedsCallerRatingFlags:
      input.independentlyMeasuredFixtureLoadNewtons.map((v, i) =>
        v > input.independentlyEngineeredAllowableFixtureLoadsNewtons[i]
          ? 1
          : 0,
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyMeasuredFixtureLoadNewtons: [100, 200],
    independentlyEngineeredAllowableFixtureLoadsNewtons: [150, 150],
  },
  output: {
    result: {
      signedFixtureCapacityMarginsNewtons: [50, -50],
      fixtureExceedsCallerRatingFlags: [0, 1],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "museology/hanging-weight-fixture-limit-checker",
  title: "Painting Hanging Weight per Fixture Limit Checker",
  description:
    "Per-fixture actual measured load/rating screen; actual unequal sharing must be independently measured, not assume painting weight evenly divides. No wall/fastener/dynamic safety or hanging authorization.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
