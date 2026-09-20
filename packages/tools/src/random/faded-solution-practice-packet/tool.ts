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
import { calculate as calculateFading } from "../../pedagogy/worked-example-fading/tool.js";

export type FadingProblem = {
  readonly id: string;
  readonly prompt: string;
  readonly solutionSteps: readonly string[];
};
export type FadedSolutionPracticePacketInput = {
  readonly problems: readonly FadingProblem[];
  readonly count: number;
  readonly seed?: number;
};
export type FadedSolutionPracticePacketOutput = {
  readonly exercises: readonly {
    readonly problemId: string;
    readonly prompt: string;
    readonly providedStepCount: number;
    readonly visibleSteps: readonly string[];
    readonly hiddenSteps: readonly string[];
    readonly solutionSteps: readonly string[];
  }[];
  readonly independentProblemCount: number;
  readonly randomness: GeneratorReplay;
};
const idSchema = { type: "string", minLength: 1, maxLength: 128 } as const,
  promptSchema = { type: "string", minLength: 1, maxLength: 2048 } as const,
  stepsSchema = {
    type: "array",
    maxItems: 32,
    items: { type: "string", minLength: 1, maxLength: 1024 },
  } as const;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    problems: {
      type: "array",
      minItems: 1,
      maxItems: 64,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          id: idSchema,
          prompt: promptSchema,
          solutionSteps: { ...stepsSchema, minItems: 1 },
        },
        required: ["id", "prompt", "solutionSteps"],
      },
    },
    count: { type: "integer", minimum: 1, maximum: 32 },
    seed: generatorSeedSchema,
  },
  required: ["problems", "count"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    exercises: {
      type: "array",
      minItems: 1,
      maxItems: 32,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          problemId: idSchema,
          prompt: promptSchema,
          providedStepCount: { type: "integer", minimum: 0, maximum: 32 },
          visibleSteps: stepsSchema,
          hiddenSteps: stepsSchema,
          solutionSteps: { ...stepsSchema, minItems: 1 },
        },
        required: [
          "problemId",
          "prompt",
          "providedStepCount",
          "visibleSteps",
          "hiddenSteps",
          "solutionSteps",
        ],
      },
    },
    independentProblemCount: { type: "integer", minimum: 0, maximum: 32 },
    randomness: generatorReplaySchema,
  },
  required: ["exercises", "independentProblemCount", "randomness"],
} as const;

const isInput = (input: unknown): input is FadedSolutionPracticePacketInput =>
  matchesModelInput(input, inputSchema);
export const calculateFadedSolutionPracticePacket = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<FadedSolutionPracticePacketOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    if (
      new Set(input.problems.map((problem) => problem.id)).size !==
      input.problems.length
    )
      simpleError(
        "problems",
        "Supplied problem IDs must be distinct.",
        "duplicate_problem",
      );
    const random = createGeneratorRandom(input.seed, context),
      schedules = new Map<number, readonly number[]>();
    const exercises = Array.from({ length: input.count }, (_, i) => {
      const problem = random.pick(input.problems),
        length = problem.solutionSteps.length;
      let schedule = schedules.get(length);
      if (!schedule) {
        schedule = calculateFading({
          solutionSteps: length,
          practiceProblems: input.count,
        }).providedStepCounts;
        schedules.set(length, schedule);
      }
      const providedStepCount = schedule[i];
      return {
        problemId: problem.id,
        prompt: problem.prompt,
        providedStepCount,
        visibleSteps: problem.solutionSteps.slice(0, providedStepCount),
        hiddenSteps: problem.solutionSteps.slice(providedStepCount),
        solutionSteps: problem.solutionSteps,
      };
    });
    return toolSuccess({
      exercises,
      independentProblemCount: exercises.filter(
        (exercise) => exercise.providedStepCount === 0,
      ).length,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const fadedSolutionPracticePacketExample = {
  input: {
    problems: [
      {
        id: "P1",
        prompt: "Solve x + 2 = 5",
        solutionSteps: ["Subtract 2 from both sides.", "x = 3"],
      },
      {
        id: "P2",
        prompt: "Solve 2x = 8",
        solutionSteps: ["Divide both sides by 2.", "x = 4"],
      },
    ],
    count: 4,
    seed: 42,
  },
  output: {
    exercises: [
      {
        problemId: "P2",
        prompt: "Solve 2x = 8",
        providedStepCount: 2,
        visibleSteps: ["Divide both sides by 2.", "x = 4"],
        hiddenSteps: [],
        solutionSteps: ["Divide both sides by 2.", "x = 4"],
      },
      {
        problemId: "P1",
        prompt: "Solve x + 2 = 5",
        providedStepCount: 1,
        visibleSteps: ["Subtract 2 from both sides."],
        hiddenSteps: ["x = 3"],
        solutionSteps: ["Subtract 2 from both sides.", "x = 3"],
      },
      {
        problemId: "P2",
        prompt: "Solve 2x = 8",
        providedStepCount: 0,
        visibleSteps: [],
        hiddenSteps: ["Divide both sides by 2.", "x = 4"],
        solutionSteps: ["Divide both sides by 2.", "x = 4"],
      },
      {
        problemId: "P2",
        prompt: "Solve 2x = 8",
        providedStepCount: 0,
        visibleSteps: [],
        hiddenSteps: ["Divide both sides by 2.", "x = 4"],
        solutionSteps: ["Divide both sides by 2.", "x = 4"],
      },
    ],
    independentProblemCount: 2,
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<
  FadedSolutionPracticePacketInput,
  FadedSolutionPracticePacketOutput
>;
export const fadedSolutionPracticePacketTool = createModelDefinition<
  FadedSolutionPracticePacketInput,
  FadedSolutionPracticePacketOutput
>({
  id: "random/faded-solution-practice-packet",
  title: "Random Faded Solution Practice Packet Generator",
  description:
    "Sample supplied problems with replacement and delegate each selected problem's worked-example fade schedule at its packet position. Return visible prefixes, hidden suffixes and complete caller-authored step keys, including repeated problems and zero-step independent exercises; app presentation and pedagogical validity are separate.",
  inputSchema,
  outputSchema,
  execute: calculateFadedSolutionPracticePacket,
});
export const runFadedSolutionPracticePacket =
  fadedSolutionPracticePacketTool.execute;
export default fadedSolutionPracticePacketTool;
