import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  createModelDefinition,
  matchesModelInput,
  modelInputIssues,
} from "../../core/model-definition.js";
import { invalidInput, type ToolResult } from "../../core/result.js";
import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSeedSchema,
  type GeneratorRandom,
  type GeneratorReplay,
} from "../generator-random.js";
import { simpleError } from "../../core/simple.js";
import {
  mocksArray,
  mocksObject,
  mocksLabel,
  mocksInteger,
  mocksBoolean,
  mocksDistinct,
  mocksPick,
  mocksTimestamp,
  mocksFrequencies,
  mocksOrdered,
  mocksSafe,
  mocksFinish,
} from "../m250-parser-mocks-support.js";
export type WorkflowAuditTrailDatasetInput = {
  readonly states: readonly string[];
  readonly transitions: readonly {
    readonly from: string;
    readonly to: string;
  }[];
  readonly initialState: string;
  readonly actorIds: readonly string[];
  readonly count: number;
  readonly startMilliseconds: number;
  readonly endMilliseconds: number;
  readonly includeInvalidControl: boolean;
  readonly seed?: number;
};
export type WorkflowAuditTrailDatasetOutput = {
  readonly events: readonly {
    readonly id: string;
    readonly from: string;
    readonly to: string;
    readonly actorId: string;
    readonly timestampMilliseconds: number;
  }[];
  readonly finalState: string;
  readonly stateFrequencies: readonly {
    readonly label: string;
    readonly count: number;
  }[];
  readonly controls: readonly {
    readonly from: string;
    readonly to: string;
    readonly validTransition: boolean;
  }[];
  readonly randomness: GeneratorReplay;
};
const transitionSchema = mocksObject({ from: mocksLabel, to: mocksLabel });
export const inputSchema = mocksObject(
  {
    states: mocksArray(mocksLabel, 32, 1),
    transitions: mocksArray(transitionSchema, 1024),
    initialState: mocksLabel,
    actorIds: mocksArray(mocksLabel, 128, 1),
    count: { type: "integer", minimum: 1, maximum: 128 },
    startMilliseconds: mocksInteger,
    endMilliseconds: mocksInteger,
    includeInvalidControl: mocksBoolean,
    seed: generatorSeedSchema,
  },
  [
    "states",
    "transitions",
    "initialState",
    "actorIds",
    "count",
    "startMilliseconds",
    "endMilliseconds",
    "includeInvalidControl",
  ],
);
export const outputSchema = mocksObject({
  events: mocksArray(
    mocksObject({
      id: mocksLabel,
      from: mocksLabel,
      to: mocksLabel,
      actorId: mocksLabel,
      timestampMilliseconds: mocksInteger,
    }),
    128,
    1,
  ),
  finalState: mocksLabel,
  stateFrequencies: mocksArray(
    mocksObject({ label: mocksLabel, count: mocksInteger }),
    32,
  ),
  controls: mocksArray(
    mocksObject({
      from: mocksLabel,
      to: mocksLabel,
      validTransition: mocksBoolean,
    }),
    1,
  ),
  randomness: generatorReplaySchema,
});
const generate = (
  input: WorkflowAuditTrailDatasetInput,
  random: GeneratorRandom,
): Omit<WorkflowAuditTrailDatasetOutput, "randomness"> => {
  mocksDistinct(input.states, "states");
  mocksDistinct(input.actorIds, "actorIds");
  mocksDistinct(
    input.transitions.map((edge) => JSON.stringify([edge.from, edge.to])),
    "transitions",
  );
  if (
    !input.states.includes(input.initialState) ||
    input.transitions.some(
      (edge) =>
        !input.states.includes(edge.from) || !input.states.includes(edge.to),
    )
  )
    simpleError(
      "transitions",
      "Every endpoint and the initial state must be supplied states.",
      "unknown_state",
    );
  mocksOrdered(
    input.startMilliseconds,
    input.endMilliseconds,
    "endMilliseconds",
  );
  mocksSafe(
    input.endMilliseconds - input.startMilliseconds + 1,
    "endMilliseconds",
  );
  const outgoing = new Map(
    input.states.map((state) => [
      state,
      input.transitions
        .filter((edge) => edge.from === state)
        .map((edge) => edge.to),
    ]),
  );
  // Dynamic reachability reserves enough transitions to satisfy the exact requested length.
  const reachable: Set<string>[] = [new Set(input.states)];
  for (let remaining = 1; remaining <= input.count; remaining += 1)
    reachable.push(
      new Set(
        input.states.filter((state) =>
          (outgoing.get(state) ?? []).some((to) =>
            reachable[remaining - 1].has(to),
          ),
        ),
      ),
    );
  if (!reachable[input.count].has(input.initialState))
    simpleError(
      "count",
      "No workflow walk has the requested number of transitions.",
      "infeasible_workflow_length",
    );
  // When a control is requested, reserve a final state with at least one absent outgoing edge.
  const controlReachable: Set<string>[] = [
    new Set(
      input.states.filter(
        (state) => (outgoing.get(state) ?? []).length < input.states.length,
      ),
    ),
  ];
  for (let remaining = 1; remaining <= input.count; remaining += 1)
    controlReachable.push(
      new Set(
        input.states.filter((state) =>
          (outgoing.get(state) ?? []).some((to) =>
            controlReachable[remaining - 1].has(to),
          ),
        ),
      ),
    );
  if (
    input.includeInvalidControl &&
    !controlReachable[input.count].has(input.initialState)
  )
    simpleError(
      "includeInvalidControl",
      "No requested-length walk ends at a state with an invalid-transition control.",
      "no_invalid_transition",
    );
  const viability = input.includeInvalidControl ? controlReachable : reachable;
  let state = input.initialState,
    timestamp = input.startMilliseconds;
  const events = Array.from({ length: input.count }, (_, i) => {
    const from = state,
      options = (outgoing.get(state) ?? []).filter((to) =>
        viability[input.count - i - 1].has(to),
      );
    state = mocksPick(options, random);
    const actorId = mocksPick(input.actorIds, random);
    timestamp = mocksTimestamp(timestamp, input.endMilliseconds, random);
    return {
      id: "event-" + (i + 1),
      from,
      to: state,
      actorId,
      timestampMilliseconds: timestamp,
    };
  });
  const controls = input.includeInvalidControl
    ? [
        {
          from: state,
          to: mocksPick(
            input.states.filter(
              (candidate) => !(outgoing.get(state) ?? []).includes(candidate),
            ),
            random,
          ),
          validTransition: false,
        },
      ]
    : [];
  return {
    events,
    finalState: state,
    stateFrequencies: mocksFrequencies(events.map((event) => event.to)),
    controls,
  };
};
export const workflowAuditTrailDatasetExample = {
  input: {
    states: ["draft", "review", "done"],
    transitions: [
      { from: "draft", to: "review" },
      { from: "review", to: "done" },
    ],
    initialState: "draft",
    actorIds: ["actor-a", "actor-b"],
    count: 2,
    startMilliseconds: 1000,
    endMilliseconds: 2000,
    includeInvalidControl: true,
    seed: 42,
  },
  output: {
    events: [
      {
        id: "event-1",
        from: "draft",
        to: "review",
        actorId: "actor-a",
        timestampMilliseconds: 1853,
      },
      {
        id: "event-2",
        from: "review",
        to: "done",
        actorId: "actor-a",
        timestampMilliseconds: 1930,
      },
    ],
    finalState: "done",
    stateFrequencies: [
      { label: "review", count: 1 },
      { label: "done", count: 1 },
    ],
    controls: [{ from: "done", to: "draft", validTransition: false }],
    randomness: { seed: 42, source: "seed" },
  },
} as const satisfies ToolExample<
  WorkflowAuditTrailDatasetInput,
  WorkflowAuditTrailDatasetOutput
>;

const isInput = (input: unknown): input is WorkflowAuditTrailDatasetInput =>
  matchesModelInput(input, inputSchema);
export const calculateWorkflowAuditTrailDataset = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<WorkflowAuditTrailDatasetOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const random = createGeneratorRandom(input.seed, context);
    return mocksFinish(
      {
        ...generate(input, random),
        randomness: generatorReplay(input.seed, context),
      },
      outputSchema,
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const workflowAuditTrailDatasetTool = createModelDefinition<
  WorkflowAuditTrailDatasetInput,
  WorkflowAuditTrailDatasetOutput
>({
  id: "random/workflow-audit-trail-dataset",
  title: "Random Workflow Audit Trail Dataset Generator",
  description:
    "Walk a supplied workflow graph for an exact event count with monotonic synthetic timestamps, actors, state frequencies, and a separately labeled invalid transition.",
  inputSchema,
  outputSchema,
  execute: calculateWorkflowAuditTrailDataset,
});
export const runWorkflowAuditTrailDataset =
  workflowAuditTrailDatasetTool.execute;
export default workflowAuditTrailDatasetTool;
