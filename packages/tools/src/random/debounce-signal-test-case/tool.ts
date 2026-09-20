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
import type { ToolExecutionContext } from "../../core/definition.js";
import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSeedSchema,
  type GeneratorReplay,
} from "../generator-random.js";
import {
  calculateDebounceFilter,
  debounceFilterInputSchema,
} from "../../microcontroller/debounce-filter/tool.js";

export type DebounceSignalTestCaseInput = {
  readonly initial: boolean;
  readonly transitionCount: number;
  readonly initialHoldSamples: number;
  readonly stableHoldSamples: number;
  readonly maximumBounceSamples: number;
  readonly oldStateProbability: number;
  readonly requiredSamples: number;
  readonly samplePeriodMilliseconds: number;
  readonly seed?: number;
};
export type DebounceSignalTestCaseOutput = {
  readonly samplePeriodMilliseconds: number;
  readonly timesMilliseconds: readonly number[];
  readonly clean: readonly boolean[];
  readonly raw: readonly boolean[];
  readonly filtered: readonly boolean[];
  readonly intendedTransitions: readonly {
    readonly startIndex: number;
    readonly stableStartIndex: number;
    readonly bounceSamples: number;
    readonly targetState: boolean;
  }[];
  readonly detectedTransitions: readonly {
    readonly index: number;
    readonly timeMilliseconds: number;
    readonly state: boolean;
  }[];
  readonly mismatchCounts: {
    readonly rawVersusClean: number;
    readonly filteredVersusClean: number;
  };
  readonly randomness: GeneratorReplay;
};
const signalSchema = {
  type: "array",
  minItems: 1,
  maxItems: 4096,
  items: { type: "boolean" },
} as const;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    initial: { type: "boolean" },
    transitionCount: { type: "integer", minimum: 1, maximum: 32 },
    initialHoldSamples: { type: "integer", minimum: 0, maximum: 128 },
    stableHoldSamples: { type: "integer", minimum: 1, maximum: 128 },
    maximumBounceSamples: { type: "integer", minimum: 0, maximum: 32 },
    oldStateProbability: { type: "number", minimum: 0, maximum: 1 },
    requiredSamples: debounceFilterInputSchema.properties.requiredSamples,
    samplePeriodMilliseconds: { type: "number", exclusiveMinimum: 0 },
    seed: generatorSeedSchema,
  },
  required: [
    "initial",
    "transitionCount",
    "initialHoldSamples",
    "stableHoldSamples",
    "maximumBounceSamples",
    "oldStateProbability",
    "requiredSamples",
    "samplePeriodMilliseconds",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    samplePeriodMilliseconds: { type: "number", exclusiveMinimum: 0 },
    timesMilliseconds: {
      type: "array",
      minItems: 1,
      maxItems: 4096,
      items: { type: "number", minimum: 0 },
    },
    clean: signalSchema,
    raw: signalSchema,
    filtered: signalSchema,
    intendedTransitions: {
      type: "array",
      minItems: 1,
      maxItems: 32,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          startIndex: { type: "integer", minimum: 0, maximum: 4095 },
          stableStartIndex: { type: "integer", minimum: 0, maximum: 4095 },
          bounceSamples: { type: "integer", minimum: 0, maximum: 32 },
          targetState: { type: "boolean" },
        },
        required: [
          "startIndex",
          "stableStartIndex",
          "bounceSamples",
          "targetState",
        ],
      },
    },
    detectedTransitions: {
      type: "array",
      maxItems: 4096,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          index: { type: "integer", minimum: 0, maximum: 4095 },
          timeMilliseconds: { type: "number", minimum: 0 },
          state: { type: "boolean" },
        },
        required: ["index", "timeMilliseconds", "state"],
      },
    },
    mismatchCounts: {
      type: "object",
      additionalProperties: false,
      properties: {
        rawVersusClean: { type: "integer", minimum: 0, maximum: 4096 },
        filteredVersusClean: { type: "integer", minimum: 0, maximum: 4096 },
      },
      required: ["rawVersusClean", "filteredVersusClean"],
    },
    randomness: generatorReplaySchema,
  },
  required: [
    "samplePeriodMilliseconds",
    "timesMilliseconds",
    "clean",
    "raw",
    "filtered",
    "intendedTransitions",
    "detectedTransitions",
    "mismatchCounts",
    "randomness",
  ],
} as const;

const isInput = (input: unknown): input is DebounceSignalTestCaseInput =>
  matchesModelInput(input, inputSchema);
export const calculateDebounceSignalTestCase = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<DebounceSignalTestCaseOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    if (
      input.initialHoldSamples +
        input.transitionCount *
          (input.maximumBounceSamples + input.stableHoldSamples) >
      4096
    )
      simpleError(
        "transitionCount",
        "The maximum generated signal length is limited to 4096 samples.",
        "resource_limit",
      );
    const random = createGeneratorRandom(input.seed, context),
      clean: boolean[] = Array(input.initialHoldSamples).fill(input.initial),
      raw = [...clean],
      intendedTransitions: DebounceSignalTestCaseOutput["intendedTransitions"][number][] =
        [];
    let previous = input.initial;
    for (
      let transition = 0;
      transition < input.transitionCount;
      transition += 1
    ) {
      const targetState = !previous,
        bounceSamples = random.integer(0, input.maximumBounceSamples),
        startIndex = raw.length;
      for (let i = 0; i < bounceSamples; i += 1) {
        clean.push(targetState);
        raw.push(
          random.unit() < input.oldStateProbability ? previous : targetState,
        );
      }
      const stableStartIndex = raw.length;
      for (let i = 0; i < input.stableHoldSamples; i += 1) {
        clean.push(targetState);
        raw.push(targetState);
      }
      intendedTransitions.push({
        startIndex,
        stableStartIndex,
        bounceSamples,
        targetState,
      });
      previous = targetState;
    }
    const timesMilliseconds = raw.map(
      (_, index) => index * input.samplePeriodMilliseconds,
    );
    if (
      timesMilliseconds.some(
        (value, index) =>
          !Number.isFinite(value) ||
          (index > 0 && value <= timesMilliseconds[index - 1]),
      )
    )
      simpleError(
        "samplePeriodMilliseconds",
        "Sample times must be finite and distinguishable.",
        "numeric_overflow",
      );
    const result = calculateDebounceFilter({
      initial: input.initial,
      samples: raw,
      requiredSamples: input.requiredSamples,
    });
    if (!result.ok)
      throw new Error(
        "Generated Boolean samples were rejected by the debounce core.",
      );
    const filtered = result.output.states,
      detectedTransitions: DebounceSignalTestCaseOutput["detectedTransitions"][number][] =
        [];
    previous = input.initial;
    filtered.forEach((state, index) => {
      if (state !== previous)
        detectedTransitions.push({
          index,
          timeMilliseconds: timesMilliseconds[index],
          state,
        });
      previous = state;
    });
    const differences = (values: readonly boolean[]): number =>
      values.reduce(
        (sum, value, index) => sum + Number(value !== clean[index]),
        0,
      );
    return toolSuccess({
      samplePeriodMilliseconds: input.samplePeriodMilliseconds,
      timesMilliseconds,
      clean,
      raw,
      filtered,
      intendedTransitions,
      detectedTransitions,
      mismatchCounts: {
        rawVersusClean: differences(raw),
        filteredVersusClean: differences(filtered),
      },
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const debounceSignalTestCaseExample = {
  input: {
    initial: false,
    transitionCount: 2,
    initialHoldSamples: 2,
    stableHoldSamples: 3,
    maximumBounceSamples: 2,
    oldStateProbability: 0.5,
    requiredSamples: 2,
    samplePeriodMilliseconds: 10,
    seed: 42,
  },
  output: {
    samplePeriodMilliseconds: 10,
    timesMilliseconds: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
    clean: [
      false,
      false,
      true,
      true,
      true,
      true,
      false,
      false,
      false,
      false,
      false,
    ],
    raw: [
      false,
      false,
      false,
      true,
      true,
      true,
      false,
      true,
      false,
      false,
      false,
    ],
    filtered: [
      false,
      false,
      false,
      false,
      true,
      true,
      true,
      true,
      true,
      false,
      false,
    ],
    intendedTransitions: [
      {
        startIndex: 2,
        stableStartIndex: 3,
        bounceSamples: 1,
        targetState: true,
      },
      {
        startIndex: 6,
        stableStartIndex: 8,
        bounceSamples: 2,
        targetState: false,
      },
    ],
    detectedTransitions: [
      {
        index: 4,
        timeMilliseconds: 40,
        state: true,
      },
      {
        index: 9,
        timeMilliseconds: 90,
        state: false,
      },
    ],
    mismatchCounts: {
      rawVersusClean: 2,
      filteredVersusClean: 5,
    },
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<
  DebounceSignalTestCaseInput,
  DebounceSignalTestCaseOutput
>;
export const debounceSignalTestCaseTool = createModelDefinition<
  DebounceSignalTestCaseInput,
  DebounceSignalTestCaseOutput
>({
  id: "random/debounce-signal-test-case",
  title: "Random Debounce Signal Test Case Generator",
  description:
    "Generate intended Boolean transitions with seeded bounded old/new-state bounce prefixes and explicit stable holds/sample times, then delegate consecutive-sample debouncing; retain clean/raw/filtered signals, detected edges, and mismatch counts without promising that filtering reconstructs the clean signal or qualifies hardware.",
  inputSchema,
  outputSchema,
  execute: calculateDebounceSignalTestCase,
});
export const runDebounceSignalTestCase = debounceSignalTestCaseTool.execute;
export default debounceSignalTestCaseTool;
