import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AssumptionReversalInput = {
  readonly assumptions: ReadonlyArray<string>;
};

export type AssumptionReversalOutput = {
  readonly reversalCount: number;
  readonly reversalQuestions: ReadonlyArray<string>;
  readonly reversedAssumptions: ReadonlyArray<string>;
};

export const generateAssumptionReversalQuestions = (
  input: AssumptionReversalInput,
): AssumptionReversalOutput => {
  if (!Array.isArray(input.assumptions) || input.assumptions.length === 0)
    simpleError(
      "assumptions",
      "At least one assumption is required.",
      "assumptions_required",
    );
  const assumptions = input.assumptions.map((assumption, index) => {
    if (typeof assumption !== "string" || assumption.trim() === "")
      simpleError(
        `assumptions.${index}`,
        "Assumptions must be nonempty strings.",
        "invalid_assumption",
      );
    return assumption.trim();
  });
  if (
    new Set(assumptions.map((assumption) => assumption.toLowerCase())).size !==
    assumptions.length
  )
    simpleError(
      "assumptions",
      "Assumptions must be unique ignoring case.",
      "duplicate_assumption",
    );
  const reversedAssumptions = assumptions.map(
    (assumption) =>
      `${assumption.charAt(0).toUpperCase()}${assumption.slice(1)} is not true.`,
  );
  const reversalQuestions = assumptions.flatMap((assumption, index) => [
    `What if ${reversedAssumptions[index]!.toLowerCase()} What evidence would change our decision?`,
    `What strategy would remain viable if ${reversedAssumptions[index]!.toLowerCase()}`,
    `Which leading indicator would reveal that ${reversedAssumptions[index]!.toLowerCase()}`,
  ]);
  return {
    reversalCount: reversalQuestions.length,
    reversalQuestions,
    reversedAssumptions,
  };
};

export const assumptionReversalExample = {
  input: { assumptions: ["Demand will grow", "Costs will fall"] },
  output: {
    reversalCount: 6,
    reversalQuestions: [
      "What if demand will grow is not true. What evidence would change our decision?",
      "What strategy would remain viable if demand will grow is not true.",
      "Which leading indicator would reveal that demand will grow is not true.",
      "What if costs will fall is not true. What evidence would change our decision?",
      "What strategy would remain viable if costs will fall is not true.",
      "Which leading indicator would reveal that costs will fall is not true.",
    ],
    reversedAssumptions: [
      "Demand will grow is not true.",
      "Costs will fall is not true.",
    ],
  },
} satisfies ToolExample<AssumptionReversalInput, AssumptionReversalOutput>;

export const assumptionReversalTool = createSimpleTool({
  calculate: (input) =>
    generateAssumptionReversalQuestions({
      assumptions: input.assumptions as string[],
    }),
  description:
    "Generate three falsification and decision questions for each caller-supplied assumption.",
  id: "futurology/assumption-reversal-question-generator",
  inputs: [{ id: "assumptions", kind: "stringList", label: "Assumptions" }],
  outputs: [
    {
      id: "reversalCount",
      kind: "integer",
      label: "Reversal questions",
      minimum: 3,
    },
    {
      id: "reversalQuestions",
      kind: "stringList",
      label: "Reversal questions",
    },
    {
      id: "reversedAssumptions",
      kind: "stringList",
      label: "Reversed assumptions",
    },
  ],
  title: "Assumption Reversal Question Generator",
});

export const runAssumptionReversal = assumptionReversalTool.execute;
export default assumptionReversalTool;
