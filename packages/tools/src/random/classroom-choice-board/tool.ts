import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  simpleError,
  type SimpleField,
} from "../../core/simple.js";
import {
  validateRandomInput,
  finish,
  sourceFor,
  indices,
  bounded,
  aligned,
  unique,
} from "../batch42-shared.js";

export type Input = Readonly<{
  readonly seed: string;
  readonly count: number;
  readonly choiceIds: readonly string[];
  readonly choiceDescriptions: readonly string[];
  readonly columns: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const inputFields = [
  { id: "seed", label: "Seed", kind: "string" },
  { id: "count", label: "Count", kind: "number" },
  { id: "choiceIds", label: "Choice ids", kind: "stringList" },
  {
    id: "choiceDescriptions",
    label: "Choice descriptions",
    kind: "stringList",
  },
  { id: "columns", label: "Columns", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext): Output => {
  const random = sourceFor(input.seed, context);
  unique(input.choiceIds, "choices");
  aligned(input.choiceIds, input.choiceDescriptions, "descriptions");
  bounded(input.columns, "columns", 1, 8);
  const chosen = indices(
    input.choiceIds.length,
    { ...input, withoutReplacement: true },
    random,
  );
  return {
    result: {
      cells: chosen.map((i, j) => ({
        row: Math.floor(j / input.columns),
        column: j % input.columns,
        choiceId: input.choiceIds[i],
        description: input.choiceDescriptions[i],
      })),
      rows: Math.ceil(input.count / input.columns),
      unusedCells:
        Math.ceil(input.count / input.columns) * input.columns - input.count,
      unselectedChoiceIds: input.choiceIds.filter(
        (_, i) => !chosen.includes(i),
      ),
    },
  };
};
export const calculate = (
  input: Input,
  context?: ToolExecutionContext,
): Output => {
  validateRandomInput(input, inputFields);
  return finish(compute(input, context));
};
export const example = {
  input: {
    seed: "tool.io/batch42",
    count: 2,
    choiceIds: ["a", "b", "c"],
    choiceDescriptions: [
      "Read one paragraph",
      "Draw one diagram",
      "Explain one idea",
    ],
    columns: 2,
  },
} satisfies ToolExample<Input>;
export const tool = createSimpleTool({
  id: "random/classroom-choice-board",
  title: "Random Classroom Choice Board Generator",
  description:
    "Draw distinct caller-defined accessible activity choices into a row-major board. Partial final rows retain unused cells; no pedagogy efficacy, differentiation or accessibility certification.",
  inputs: inputFields,
  outputs: [
    { id: "result", label: "Reproducible sample and evidence", kind: "object" },
  ],
  calculate: (input, context) => calculate(input as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
