import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, unique } from "../batch46-shared.js";
export type Input = Readonly<{
  readonly independentlyVerifiedOffenseOneElements: readonly string[];
  readonly independentlyVerifiedOffenseTwoElements: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyVerifiedOffenseOneElements",
    label: "Independently verified offense one elements",
    kind: "stringList",
  },
  {
    id: "independentlyVerifiedOffenseTwoElements",
    label: "Independently verified offense two elements",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  unique(input.independentlyVerifiedOffenseOneElements, "firstelements");
  unique(input.independentlyVerifiedOffenseTwoElements, "secondelements");
  const a = input.independentlyVerifiedOffenseOneElements.filter(
      (v) => !input.independentlyVerifiedOffenseTwoElements.includes(v),
    ),
    b = input.independentlyVerifiedOffenseTwoElements.filter(
      (v) => !input.independentlyVerifiedOffenseOneElements.includes(v),
    );
  return {
    elementsOnlyInFirst: a,
    elementsOnlyInSecond: b,
    bothHaveDistinctRequiredElements: !!a.length && !!b.length,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyVerifiedOffenseOneElements: ["a", "b"],
    independentlyVerifiedOffenseTwoElements: ["a", "c"],
  },
  output: {
    result: {
      elementsOnlyInFirst: ["b"],
      elementsOnlyInSecond: ["c"],
      bothHaveDistinctRequiredElements: true,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "criminology/double-jeopardy-elements-block-tester",
  title: "Double Jeopardy Same Elements Block Tester",
  description:
    "Compare actual independently legally established required-element sets in a restricted Blockburger-style premise audit. Statutory interpretation, exceptions, sovereigns, proceedings and legal double-jeopardy consequences remain external; no judicial outcome certified.",
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
