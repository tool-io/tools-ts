import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly requiredSourceCategories: readonly string[];
  readonly representedSourceCategories: readonly string[];
}>;
export type Output = Readonly<{
  readonly requiredCategoryCount: number;
  readonly representedRequiredCount: number;
  readonly missingCategories: readonly string[];
  readonly coveragePercent: number;
}>;

export const calculate = (input: Input): Output => {
  const norm = (values: readonly string[]) => [
    ...new Set(
      values.map((value) => value.trim().toLowerCase()).filter(Boolean),
    ),
  ];
  const required = norm(input.requiredSourceCategories),
    represented = new Set(norm(input.representedSourceCategories));
  if (required.length === 0)
    simpleError(
      "requiredSourceCategories",
      "At least one required category is needed.",
      "empty_requirements",
    );
  const missingCategories = required.filter((value) => !represented.has(value));
  return {
    requiredCategoryCount: required.length,
    representedRequiredCount: required.length - missingCategories.length,
    missingCategories,
    coveragePercent:
      ((required.length - missingCategories.length) / required.length) * 100,
  };
};

export const exampleInput = {
  requiredSourceCategories: ["official", "resident", "expert"],
  representedSourceCategories: ["official", "expert"],
} satisfies Input;
export const exampleOutput = {
  requiredCategoryCount: 3,
  representedRequiredCount: 2,
  missingCategories: ["resident"],
  coveragePercent: 66.66666666666666,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      requiredSourceCategories:
        input.requiredSourceCategories as readonly string[],
      representedSourceCategories:
        input.representedSourceCategories as readonly string[],
    }),
  description: "Measure source-category coverage in a roundup.",
  id: "journalism/roundup-source-coverage",
  inputs: [
    {
      id: "requiredSourceCategories",
      label: "Required source categories",
      kind: "stringList",
    },
    {
      id: "representedSourceCategories",
      label: "Represented source categories",
      kind: "stringList",
    },
  ],
  outputs: [
    {
      id: "requiredCategoryCount",
      label: "Required category count",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "representedRequiredCount",
      label: "Represented required categories",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "missingCategories",
      label: "Missing source categories",
      kind: "stringList",
    },
    {
      id: "coveragePercent",
      label: "Source-category coverage",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
  ],
  title: "Roundup Source Coverage",
});

export const run = tool.execute;
export default tool;
