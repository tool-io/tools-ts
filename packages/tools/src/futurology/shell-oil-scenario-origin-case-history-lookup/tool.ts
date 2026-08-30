import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

const shellScenarioHistory = {
  historicalContext:
    "Royal Dutch Shell developed formal long-range scenario planning during a period of greater energy-system and geopolitical uncertainty.",
  methodContribution:
    "The Shell work helped institutionalize scenario analysis as a strategic planning practice rather than only a forecasting exercise.",
  planningLesson:
    "Scenarios are most useful when leaders can connect alternative futures to current decisions, assumptions, and triggers.",
  verificationCaution:
    "Case history does not prove that a forecast was correct or that a method transfers unchanged to every organization.",
} as const;

export type ShellOilScenarioHistoryInput = {
  readonly focus: "context" | "method" | "lesson" | "caution";
};

export type ShellOilScenarioHistoryOutput = {
  readonly historyEntry: string;
  readonly focus: ShellOilScenarioHistoryInput["focus"];
};

export const lookupShellOilScenarioHistory = (
  input: ShellOilScenarioHistoryInput,
): ShellOilScenarioHistoryOutput => {
  const fieldByFocus = {
    caution: "verificationCaution",
    context: "historicalContext",
    lesson: "planningLesson",
    method: "methodContribution",
  } as const;
  return {
    historyEntry: shellScenarioHistory[fieldByFocus[input.focus]],
    focus: input.focus,
  };
};

export const shellOilScenarioHistoryExample = {
  input: { focus: "lesson" },
  output: {
    historyEntry:
      "Scenarios are most useful when leaders can connect alternative futures to current decisions, assumptions, and triggers.",
    focus: "lesson",
  },
} satisfies ToolExample<
  ShellOilScenarioHistoryInput,
  ShellOilScenarioHistoryOutput
>;

export const shellOilScenarioHistoryTool = createSimpleTool({
  calculate: (input) =>
    lookupShellOilScenarioHistory({
      focus: input.focus as ShellOilScenarioHistoryInput["focus"],
    }),
  description:
    "Look up a concise context, method, lesson, or verification caution about Shell's origin case in scenario planning.",
  id: "futurology/shell-oil-scenario-origin-case-history-lookup",
  inputs: [
    {
      enum: ["context", "method", "lesson", "caution"],
      id: "focus",
      kind: "string",
      label: "History focus",
    },
  ],
  outputs: [
    { id: "historyEntry", kind: "string", label: "Scenario history entry" },
    { id: "focus", kind: "string", label: "History focus" },
  ],
  title: "Shell Oil Scenario Origin Case History Lookup",
});

export const runShellOilScenarioHistory = shellOilScenarioHistoryTool.execute;
export default shellOilScenarioHistoryTool;
