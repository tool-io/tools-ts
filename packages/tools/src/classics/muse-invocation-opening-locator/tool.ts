import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  simpleError,
} from "../batch43-shared.js";

export type Input = Readonly<{
  readonly independentlyAnnotatedInvocationLineIndices: readonly number[];
  readonly callerOpeningEndExclusive: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyAnnotatedInvocationLineIndices",
    label: "Independently annotated invocation line indices",
    kind: "numberList",
  },
  {
    id: "callerOpeningEndExclusive",
    label: "Caller opening end exclusive",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(input.callerOpeningEndExclusive, "opening", 1, 100000);
  input.independentlyAnnotatedInvocationLineIndices.forEach((v) =>
    bounded(v, "line", 0, 100000),
  );
  if (
    new Set(input.independentlyAnnotatedInvocationLineIndices).size !==
    input.independentlyAnnotatedInvocationLineIndices.length
  )
    simpleError("lineindices", "Distinct witnessed line indices.");
  return {
    invocationsWithinOpening:
      input.independentlyAnnotatedInvocationLineIndices.filter(
        (v) => v < input.callerOpeningEndExclusive,
      ),
    laterInvocationIndices:
      input.independentlyAnnotatedInvocationLineIndices.filter(
        (v) => v >= input.callerOpeningEndExclusive,
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyAnnotatedInvocationLineIndices: [0, 9],
    callerOpeningEndExclusive: 5,
  },
  output: {
    result: { invocationsWithinOpening: [0], laterInvocationIndices: [9] },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/muse-invocation-opening-locator",
  title: "Muse Invocation Opening Locator",
  description:
    "Locate independently annotated Muse invocation lines within an explicit half-open opening window, zero-based indices, not lexical inference from a translated muse token.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
