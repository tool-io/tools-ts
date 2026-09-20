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
  choice,
} from "../m500b-web-json-schema.js";
import { pick, distinct } from "../m500b-web-json-json.js";
import { workflowGraph, type Transition } from "../m500b-web-json-workflow.js";
import { calculateBreadthFirstTraversal } from "../../graph/breadth-first-traversal/tool.js";
export type WorkflowDeadEndFixtureInput = {
  readonly states: readonly string[];
  readonly transitions: readonly Transition[];
  readonly start: string;
  readonly terminals: readonly string[];
  readonly mode: "trap" | "unreachable";
  readonly seed?: number;
};
export type WorkflowDeadEndFixtureOutput = {
  readonly plantedState: string;
  readonly graph: Readonly<Record<string, readonly string[]>>;
  readonly reachable: readonly string[];
  readonly unreachable: readonly string[];
  readonly cannotComplete: readonly string[];
  readonly terminalTraps: readonly string[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = object(
  {
    states: array(label, 16, 2),
    transitions: array(object({ from: label, to: label }), 64),
    start: label,
    terminals: array(label, 16, 1),
    mode: choice(["trap", "unreachable"]),
    seed: generatorSeedSchema,
  },
  ["states", "transitions", "start", "terminals", "mode"],
);
export const outputSchema = object({
  plantedState: text,
  graph: { type: "object", additionalProperties: array(text, 16) },
  reachable: array(text, 16),
  unreachable: array(text, 16),
  cannotComplete: array(text, 16),
  terminalTraps: array(text, 16),
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is WorkflowDeadEndFixtureInput =>
  matchesModelInput(input, inputSchema);
export const calculateWorkflowDeadEndFixture = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<WorkflowDeadEndFixtureOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    fixtureBudget(JSON.stringify(input).length, 512, "", 900000);
    const graph = workflowGraph(input.states, input.transitions, input.start);
    distinct(input.terminals, "terminals");
    if (input.terminals.some((t) => !input.states.includes(t)))
      simpleError(
        "terminals",
        "Terminal states must be supplied.",
        "unknown_state",
      );
    const before = calculateBreadthFirstTraversal({
        graph,
        start: input.start,
      }).visitOrder,
      candidates = input.states.filter(
        (s) =>
          s !== input.start &&
          (input.mode === "unreachable" ||
            (!input.terminals.includes(s) &&
              (graph[s]?.length ?? 0) > 0 &&
              before.includes(s))),
      );
    if (!candidates.length)
      simpleError(
        "mode",
        "No supplied state can receive the requested planted control.",
        "no_control_candidate",
      );
    const random = createGeneratorRandom(input.seed, context),
      plantedState = pick(candidates, random);
    if (input.mode === "trap")
      Object.defineProperty(graph, plantedState, {
        value: [],
        enumerable: true,
        writable: true,
        configurable: true,
      });
    else
      for (const s of input.states)
        Object.defineProperty(graph, s, {
          value: (graph[s] ?? []).filter((t) => t !== plantedState),
          enumerable: true,
          writable: true,
          configurable: true,
        });
    const reachable = calculateBreadthFirstTraversal({
        graph,
        start: input.start,
      }).visitOrder,
      unreachable = input.states.filter((s) => !reachable.includes(s)),
      reverse = Object.fromEntries(
        input.states.map((s) => [
          s,
          input.states.filter((from) => (graph[from] ?? []).includes(s)),
        ]),
      ),
      canComplete = new Set<string>();
    for (const start of input.terminals)
      calculateBreadthFirstTraversal({
        graph: reverse,
        start,
      }).visitOrder.forEach((s) => canComplete.add(s));
    const cannotComplete = reachable.filter((s) => !canComplete.has(s)),
      terminalTraps = cannotComplete.filter(
        (s) => (graph[s]?.length ?? 0) === 0,
      );
    return toolSuccess({
      plantedState,
      graph,
      reachable,
      unreachable,
      cannotComplete,
      terminalTraps,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const workflowDeadEndFixtureExample = {
  input: {
    states: ["a", "b", "done"],
    transitions: [
      { from: "a", to: "b" },
      { from: "b", to: "done" },
    ],
    start: "a",
    terminals: ["done"],
    mode: "trap",
    seed: 42,
  },
  output: {
    plantedState: "b",
    graph: { a: ["b"], b: [], done: [] },
    reachable: ["a", "b"],
    unreachable: ["done"],
    cannotComplete: ["a", "b"],
    terminalTraps: ["b"],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  WorkflowDeadEndFixtureInput,
  WorkflowDeadEndFixtureOutput
>;
export const workflowDeadEndFixtureTool = createModelDefinition<
  WorkflowDeadEndFixtureInput,
  WorkflowDeadEndFixtureOutput
>({
  id: "random/workflow-dead-end-fixture",
  title: "Random Workflow Dead-End Fixture Generator",
  description:
    "Plant an unreachable state or nonterminal trap in a supplied workflow graph and retain start reachability and terminal-completion labels.",
  inputSchema,
  outputSchema,
  execute: calculateWorkflowDeadEndFixture,
});
export const runWorkflowDeadEndFixture = workflowDeadEndFixtureTool.execute;
export default workflowDeadEndFixtureTool;
