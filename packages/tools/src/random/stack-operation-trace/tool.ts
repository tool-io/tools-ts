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
import { runReverse } from "../../list/reverse/tool.js";
import {
  arraySchema,
  objectSchema,
  textSchema,
  countSchema,
  enumSchema,
  booleanSchema,
  nullableSchema,
  distinct,
  coreOutput,
} from "../m500b-csv-algorithms-schemas.js";

type StackOperation = "push" | "pop" | "peek";
export type StackOperationTraceInput = {
  readonly initialValues: readonly string[];
  readonly values: readonly string[];
  readonly operations: readonly StackOperation[];
  readonly eventCount: number;
  readonly seed?: number;
};
type StackEvent = {
  readonly kind: StackOperation;
  readonly value: string | null;
  readonly underflow: boolean;
  readonly stack: readonly string[];
};
export type StackOperationTraceOutput = {
  readonly events: readonly StackEvent[];
  readonly finalStack: readonly string[];
  readonly finalTopFirst: readonly string[];
  readonly randomness: GeneratorReplay;
};
const operationSchema = enumSchema(["push", "pop", "peek"]),
  stackSchema = arraySchema(textSchema, 80);
export const inputSchema = objectSchema(
  {
    initialValues: arraySchema(textSchema, 16),
    values: arraySchema(textSchema, 16, 1),
    operations: arraySchema(operationSchema, 3, 1),
    eventCount: countSchema(64, 1),
    seed: generatorSeedSchema,
  },
  ["initialValues", "values", "operations", "eventCount"],
);
export const outputSchema = objectSchema({
  events: arraySchema(
    objectSchema({
      kind: operationSchema,
      value: nullableSchema(textSchema),
      underflow: booleanSchema,
      stack: stackSchema,
    }),
    64,
  ),
  finalStack: stackSchema,
  finalTopFirst: stackSchema,
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is StackOperationTraceInput =>
  matchesModelInput(input, inputSchema);
export const calculateStackOperationTrace = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<StackOperationTraceOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    distinct(input.operations, "operations");
    if (
      input.eventCount * (input.initialValues.length + input.eventCount) >
      2048
    )
      return simpleError(
        "eventCount",
        "Stack history is limited to 2048 potential cell snapshots.",
        "resource_limit",
      );
    const random = createGeneratorRandom(input.seed, context),
      stack = [...input.initialValues];
    const events = Array.from({ length: input.eventCount }, (): StackEvent => {
      const kind = random.pick(input.operations),
        underflow = kind !== "push" && stack.length === 0;
      let value: string | null;
      if (kind === "push") {
        value = random.pick(input.values);
        stack.push(value);
      } else
        value =
          kind === "pop"
            ? (stack.pop() ?? null)
            : (stack[stack.length - 1] ?? null);
      return { kind, value, underflow, stack: [...stack] };
    });
    return toolSuccess({
      events,
      finalStack: [...stack],
      finalTopFirst: coreOutput(runReverse({ values: stack })).values,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const stackOperationTraceExample = {
  input: {
    initialValues: ["a"],
    values: ["b", "c"],
    operations: ["pop", "push", "peek"],
    eventCount: 4,
    seed: 42,
  },
  output: {
    events: [
      { kind: "push", value: "b", underflow: false, stack: ["a", "b"] },
      { kind: "peek", value: "b", underflow: false, stack: ["a", "b"] },
      { kind: "peek", value: "b", underflow: false, stack: ["a", "b"] },
      { kind: "pop", value: "b", underflow: false, stack: ["a"] },
    ],
    finalStack: ["a"],
    finalTopFirst: ["a"],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<StackOperationTraceInput, StackOperationTraceOutput>;
export const stackOperationTraceTool = createModelDefinition<
  StackOperationTraceInput,
  StackOperationTraceOutput
>({
  id: "random/stack-operation-trace",
  title: "Random Stack Operation Trace Generator",
  description:
    "Generate sampled push, pop and peek operations with bottom-to-top LIFO snapshots, explicit empty-stack underflows and a delegated top-first final view.",
  inputSchema,
  outputSchema,
  execute: calculateStackOperationTrace,
});
export const runStackOperationTrace = stackOperationTraceTool.execute;
export default stackOperationTraceTool;
