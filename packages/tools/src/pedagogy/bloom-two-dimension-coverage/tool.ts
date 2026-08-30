import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly cognitiveLevels: readonly string[];
  readonly knowledgeTypes: readonly string[];
  readonly itemCognitiveLevels: readonly string[];
  readonly itemKnowledgeTypes: readonly string[];
}>;
export type Output = Readonly<{
  readonly coverageMatrix: readonly (readonly number[])[];
  readonly coveredCells: number;
}>;
export const calculate = (input: Input): Output => {
  const a = input.cognitiveLevels,
    b = input.knowledgeTypes,
    n = input.itemCognitiveLevels.length;
  if (
    !a.length ||
    !b.length ||
    new Set(a).size !== a.length ||
    new Set(b).size !== b.length ||
    n !== input.itemKnowledgeTypes.length ||
    input.itemCognitiveLevels.some((v) => !a.includes(v)) ||
    input.itemKnowledgeTypes.some((v) => !b.includes(v))
  )
    simpleError(
      "itemCognitiveLevels",
      "Aligned item dimensions must occur in distinct cognitive and knowledge axes.",
    );
  const coverageMatrix = a.map((level) =>
    b.map(
      (knowledge) =>
        input.itemCognitiveLevels.filter(
          (v, i) => v === level && input.itemKnowledgeTypes[i] === knowledge,
        ).length,
    ),
  );
  return {
    coverageMatrix,
    coveredCells: coverageMatrix.flat().filter((v) => v > 0).length,
  };
};
export const exampleInput = {
  cognitiveLevels: ["remember", "apply"],
  knowledgeTypes: ["factual", "conceptual"],
  itemCognitiveLevels: ["remember", "apply", "apply"],
  itemKnowledgeTypes: ["factual", "conceptual", "conceptual"],
} satisfies Input;
export const exampleOutput = {
  coverageMatrix: [
    [1, 0],
    [0, 2],
  ],
  coveredCells: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pedagogy/bloom-two-dimension-coverage",
  title: "Bloom Two Dimension Coverage",
  description:
    "Tabulate assessment items across Bloom cognitive and knowledge dimensions.",
  inputs: [
    { id: "cognitiveLevels", label: "Cognitive levels", kind: "stringList" },
    { id: "knowledgeTypes", label: "Knowledge types", kind: "stringList" },
    {
      id: "itemCognitiveLevels",
      label: "Item cognitive levels",
      kind: "stringList",
    },
    {
      id: "itemKnowledgeTypes",
      label: "Item knowledge types",
      kind: "stringList",
    },
  ],
  outputs: [
    { id: "coverageMatrix", label: "Coverage matrix", kind: "matrix" },
    { id: "coveredCells", label: "Covered cells", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      cognitiveLevels: value.cognitiveLevels as readonly string[],
      knowledgeTypes: value.knowledgeTypes as readonly string[],
      itemCognitiveLevels: value.itemCognitiveLevels as readonly string[],
      itemKnowledgeTypes: value.itemKnowledgeTypes as readonly string[],
    }),
});
export const run = tool.execute;
export default tool;
