import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  simpleError,
} from "../batch52-shared.js";
export type Input = Readonly<{
  readonly premiseSubjects: readonly string[];
  readonly premisePredicates: readonly string[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "premiseSubjects", label: "Premise subjects", kind: "stringList" },
  { id: "premisePredicates", label: "Premise predicates", kind: "stringList" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  aligned(i.premiseSubjects, i.premisePredicates, "premises");
  if (
    !i.premiseSubjects.length ||
    [...i.premiseSubjects, ...i.premisePredicates].some((s) => !s.trim())
  )
    simpleError("premises", "Actual nonempty ordered class-inclusion terms.");
  const gaps = i.premisePredicates
    .slice(0, -1)
    .flatMap((v, j) => (v === i.premiseSubjects[j + 1] ? [] : [j]));
  return {
    premiseCount: i.premiseSubjects.length,
    chainLinkCount: i.premiseSubjects.length - 1,
    brokenLinkIndices: gaps,
    unbrokenUniversalInclusionChain: gaps.length === 0,
  };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: {
    premiseSubjects: ["A", "B", "C"],
    premisePredicates: ["B", "C", "D"],
  },
  output: {
    result: {
      premiseCount: 3,
      chainLinkCount: 2,
      brokenLinkIndices: [],
      unbrokenUniversalInclusionChain: true,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "logic/sorites-link-counter",
  title: "Lewis Carroll Sorites Premise Chain Link Counter",
  description:
    "Inspect explicit ordered universal class-inclusion sorites links; no existential import, natural-language parsing or arbitrary syllogism proof.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          premiseCount: { type: "number" },
          chainLinkCount: { type: "number" },
          brokenLinkIndices: { type: "array", items: { type: "number" } },
          unbrokenUniversalInclusionChain: { type: "boolean" },
        },
        required: [
          "premiseCount",
          "chainLinkCount",
          "brokenLinkIndices",
          "unbrokenUniversalInclusionChain",
        ],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
