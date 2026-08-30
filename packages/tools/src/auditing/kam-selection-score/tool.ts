import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly significantRisk: boolean;
  readonly highManagementJudgment: boolean;
  readonly significantTransactions: boolean;
  readonly significantEvents: boolean;
  readonly selectionThreshold: number;
}>;
export type Output = Readonly<{
  readonly selectionScore: number;
  readonly triggeredFactors: readonly string[];
  readonly candidateKam: boolean;
}>;

export const calculate = (input: Input): Output => {
  const entries = [
      ["significantRisk", input.significantRisk, 3],
      ["highManagementJudgment", input.highManagementJudgment, 2],
      ["significantTransactions", input.significantTransactions, 2],
      ["significantEvents", input.significantEvents, 1],
    ] as const,
    triggeredFactors = entries.filter(([, on]) => on).map(([id]) => id),
    selectionScore = entries.reduce(
      (sum, [, on, weight]) => sum + (on ? weight : 0),
      0,
    );
  return {
    selectionScore,
    triggeredFactors,
    candidateKam: selectionScore >= input.selectionThreshold,
  };
};

export const exampleInput = {
  significantRisk: true,
  highManagementJudgment: true,
  significantTransactions: false,
  significantEvents: false,
  selectionThreshold: 5,
} satisfies Input;
export const exampleOutput = {
  selectionScore: 5,
  triggeredFactors: ["significantRisk", "highManagementJudgment"],
  candidateKam: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      significantRisk: input.significantRisk as boolean,
      highManagementJudgment: input.highManagementJudgment as boolean,
      significantTransactions: input.significantTransactions as boolean,
      significantEvents: input.significantEvents as boolean,
      selectionThreshold: input.selectionThreshold as number,
    }),
  description:
    "Score key-audit-matter candidate factors against a supplied threshold.",
  id: "auditing/kam-selection-score",
  inputs: [
    {
      id: "significantRisk",
      label: "Matter is a significant risk",
      kind: "boolean",
    },
    {
      id: "highManagementJudgment",
      label: "High management judgment",
      kind: "boolean",
    },
    {
      id: "significantTransactions",
      label: "Significant unusual transactions",
      kind: "boolean",
    },
    {
      id: "significantEvents",
      label: "Significant events or developments",
      kind: "boolean",
    },
    {
      id: "selectionThreshold",
      label: "Selection score threshold",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "selectionScore",
      label: "KAM selection score",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "triggeredFactors",
      label: "Triggered selection factors",
      kind: "stringList",
    },
    {
      id: "candidateKam",
      label: "Meets supplied candidate threshold",
      kind: "boolean",
    },
  ],
  title: "KAM Selection Score",
});

export const run = tool.execute;
export default tool;
