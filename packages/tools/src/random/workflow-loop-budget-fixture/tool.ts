import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  createModelDefinition,
  matchesModelInput,
  modelInputIssues,
} from "../../core/model-definition.js";
import {
  invalidInput,
  toolSuccess,
  type ToolResult,
} from "../../core/result.js";
import { simpleError } from "../../core/simple.js";
import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSeedSchema,
  type GeneratorReplay,
} from "../generator-random.js";
import { budget as fixtureBudget } from "../m500b-web-json-json.js";
import {
  object,
  array,
  text,
  label,
  bounded,
  boolean,
  choice,
} from "../m500b-web-json-schema.js";
import { pick } from "../m500b-web-json-json.js";
import { workflowGraph, type Transition } from "../m500b-web-json-workflow.js";
import { calculateCycleChecker } from "../../graph/cycle-checker/tool.js";
export type WorkflowLoopBudgetFixtureInput = {
  readonly states: readonly string[];
  readonly transitions: readonly Transition[];
  readonly start: string;
  readonly visitBudget: number;
  readonly steps: number;
  readonly seed?: number;
};
export type WorkflowLoopBudgetFixtureOutput = {
  readonly graphHasCycle: boolean;
  readonly trace: readonly {
    readonly from: string;
    readonly to: string;
    readonly visitsBefore: number;
    readonly visitsAfter: number;
    readonly violation: boolean;
  }[];
  readonly visits: readonly {
    readonly state: string;
    readonly count: number;
  }[];
  readonly finalState: string;
  readonly stop: "budget" | "terminal" | "step-limit";
  readonly randomness: GeneratorReplay;
};
export const inputSchema = object(
  {
    states: array(label, 16, 1),
    transitions: array(object({ from: label, to: label }), 64),
    start: label,
    visitBudget: bounded(1, 64),
    steps: bounded(1, 64),
    seed: generatorSeedSchema,
  },
  ["states", "transitions", "start", "visitBudget", "steps"],
);
export const outputSchema = object({
  graphHasCycle: boolean,
  trace: array(
    object({
      from: text,
      to: text,
      visitsBefore: bounded(0, 64),
      visitsAfter: bounded(1, 65),
      violation: boolean,
    }),
    64,
  ),
  visits: array(object({ state: text, count: bounded(0, 65) }), 16),
  finalState: text,
  stop: choice(["budget", "terminal", "step-limit"]),
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is WorkflowLoopBudgetFixtureInput =>
  matchesModelInput(input, inputSchema);
export const calculateWorkflowLoopBudgetFixture = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<WorkflowLoopBudgetFixtureOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    fixtureBudget(JSON.stringify(input).length, 512, "", 900000);
    const graph = workflowGraph(input.states, input.transitions, input.start),
      graphHasCycle = calculateCycleChecker({ graph }).hasCycle,
      random = createGeneratorRandom(input.seed, context),
      counts = new Map(input.states.map((s) => [s, s === input.start ? 1 : 0])),
      trace: WorkflowLoopBudgetFixtureOutput["trace"][number][] = [];
    let state = input.start,
      stop: WorkflowLoopBudgetFixtureOutput["stop"] = "step-limit";
    for (let i = 0; i < input.steps; i++) {
      const outgoing = graph[state] ?? [];
      if (!outgoing.length) {
        random.unit();
        stop = "terminal";
        break;
      }
      const from = state,
        to = pick(outgoing, random),
        visitsBefore = counts.get(to) ?? 0,
        visitsAfter = visitsBefore + 1,
        violation = visitsAfter > input.visitBudget;
      counts.set(to, visitsAfter);
      state = to;
      trace.push({ from, to, visitsBefore, visitsAfter, violation });
      if (violation) {
        stop = "budget";
        break;
      }
      if (!graph[state]?.length) {
        stop = "terminal";
        break;
      }
    }
    return toolSuccess({
      graphHasCycle,
      trace,
      visits: input.states.map((state) => ({
        state,
        count: counts.get(state) ?? 0,
      })),
      finalState: state,
      stop,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const workflowLoopBudgetFixtureExample = {
  input: {
    states: ["a"],
    transitions: [{ from: "a", to: "a" }],
    start: "a",
    visitBudget: 2,
    steps: 5,
    seed: 42,
  },
  output: {
    graphHasCycle: true,
    trace: [
      { from: "a", to: "a", visitsBefore: 1, visitsAfter: 2, violation: false },
      { from: "a", to: "a", visitsBefore: 2, visitsAfter: 3, violation: true },
    ],
    visits: [{ state: "a", count: 3 }],
    finalState: "a",
    stop: "budget",
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  WorkflowLoopBudgetFixtureInput,
  WorkflowLoopBudgetFixtureOutput
>;
export const workflowLoopBudgetFixtureTool = createModelDefinition<
  WorkflowLoopBudgetFixtureInput,
  WorkflowLoopBudgetFixtureOutput
>({
  id: "random/workflow-loop-budget-fixture",
  title: "Random Workflow Loop Budget Fixture Generator",
  description:
    "Walk supplied transitions with an explicit per-state visit budget, retaining the first violation or terminal/step-limit stop and whole-graph cycle status.",
  inputSchema,
  outputSchema,
  execute: calculateWorkflowLoopBudgetFixture,
});
export const runWorkflowLoopBudgetFixture =
  workflowLoopBudgetFixtureTool.execute;
export default workflowLoopBudgetFixtureTool;
