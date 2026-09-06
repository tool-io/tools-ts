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
  unique,
} from "../batch42-shared.js";

export type Input = Readonly<{
  readonly seed: string;
  readonly count: number;
  readonly withoutReplacement: boolean;
  readonly topicTexts: readonly string[];
  readonly questionTemplates: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const inputFields = [
  { id: "seed", label: "Seed", kind: "string" },
  { id: "count", label: "Count", kind: "number" },
  { id: "withoutReplacement", label: "Without replacement", kind: "boolean" },
  { id: "topicTexts", label: "Topic texts", kind: "stringList" },
  { id: "questionTemplates", label: "Question templates", kind: "stringList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext): Output => {
  const random = sourceFor(input.seed, context);
  unique(input.topicTexts, "topics");
  unique(input.questionTemplates, "templates");
  if (input.questionTemplates.some((v) => !v.includes("{topic}")))
    simpleError(
      "template",
      "Every independently verified question template needs an explicit{topic}placeholder.",
    );
  const total = input.topicTexts.length * input.questionTemplates.length,
    chosen = indices(total, input, random);
  return {
    result: {
      questions: chosen.map((i) => {
        const topic =
            input.topicTexts[Math.floor(i / input.questionTemplates.length)],
          template =
            input.questionTemplates[i % input.questionTemplates.length];
        return { topic, question: template.replaceAll("{topic}", topic) };
      }),
      selectedPairIndices: chosen,
      unselectedPairCount: total - chosen.length,
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
    count: 1,
    withoutReplacement: true,
    topicTexts: ["fractions", "gravity"],
    questionTemplates: [
      "Why does {topic} work this way?",
      "How could {topic} relate to another idea?",
    ],
  },
} satisfies ToolExample<Input>;
export const tool = createSimpleTool({
  id: "random/elaborative-question-deck",
  title: "Random Elaborative Question Deck Generator",
  description:
    "Draw uniform topic/template pairs for independently reviewed elaborative question cards; count, replacement and duplicate semantic possibilities explicit. Does not generate/verify factual answers or promise retention efficacy.",
  inputs: inputFields,
  outputs: [
    { id: "result", label: "Reproducible sample and evidence", kind: "object" },
  ],
  calculate: (input, context) => calculate(input as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
