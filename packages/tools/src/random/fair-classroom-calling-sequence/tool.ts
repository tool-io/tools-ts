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
import { calculate as calculateRoster } from "../../pedagogy/cold-call-equity-roster/tool.js";

export type FairClassroomCallingSequenceInput = {
  readonly studentIds: readonly string[];
  readonly priorCallCounts: readonly number[];
  readonly turns: number;
  readonly seed?: number;
};
export type FairClassroomCallingSequenceOutput = {
  readonly trace: readonly {
    readonly turn: number;
    readonly minimumBefore: number;
    readonly eligibleIds: readonly string[];
    readonly chosenId: string;
    readonly countBefore: number;
    readonly countAfter: number;
    readonly spreadBefore: number;
    readonly spreadAfter: number;
  }[];
  readonly finalCallCounts: readonly number[];
  readonly randomness: GeneratorReplay;
};
const studentIdSchema = {
    type: "string",
    minLength: 1,
    maxLength: 128,
  } as const,
  countSchema = {
    type: "integer",
    minimum: 0,
    maximum: Number.MAX_SAFE_INTEGER,
  } as const;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    studentIds: {
      type: "array",
      minItems: 1,
      maxItems: 128,
      items: studentIdSchema,
    },
    priorCallCounts: {
      type: "array",
      minItems: 1,
      maxItems: 128,
      items: countSchema,
    },
    turns: { type: "integer", minimum: 1, maximum: 512 },
    seed: generatorSeedSchema,
  },
  required: ["studentIds", "priorCallCounts", "turns"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    trace: {
      type: "array",
      minItems: 1,
      maxItems: 512,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          turn: { type: "integer", minimum: 1, maximum: 512 },
          minimumBefore: countSchema,
          eligibleIds: {
            type: "array",
            minItems: 1,
            maxItems: 128,
            items: studentIdSchema,
          },
          chosenId: studentIdSchema,
          countBefore: countSchema,
          countAfter: countSchema,
          spreadBefore: countSchema,
          spreadAfter: countSchema,
        },
        required: [
          "turn",
          "minimumBefore",
          "eligibleIds",
          "chosenId",
          "countBefore",
          "countAfter",
          "spreadBefore",
          "spreadAfter",
        ],
      },
    },
    finalCallCounts: {
      type: "array",
      minItems: 1,
      maxItems: 128,
      items: countSchema,
    },
    randomness: generatorReplaySchema,
  },
  required: ["trace", "finalCallCounts", "randomness"],
} as const;

const isInput = (input: unknown): input is FairClassroomCallingSequenceInput =>
  matchesModelInput(input, inputSchema);
export const calculateFairClassroomCallingSequence = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<FairClassroomCallingSequenceOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    if (new Set(input.studentIds).size !== input.studentIds.length)
      simpleError(
        "studentIds",
        "Entries must be distinct.",
        "duplicate_entries",
      );
    if (input.studentIds.length !== input.priorCallCounts.length)
      simpleError(
        "priorCallCounts",
        "Counts must align with the distinct supplied learners.",
        "unaligned_counts",
      );
    const random = createGeneratorRandom(input.seed, context),
      finalCallCounts = [...input.priorCallCounts];
    const trace = Array.from({ length: input.turns }, (_, i) => {
      const before = calculateRoster({
          studentIds: input.studentIds,
          priorCallCounts: finalCallCounts,
        }),
        minimumBefore =
          finalCallCounts[input.studentIds.indexOf(before.nextStudentId)];
      const eligibleIds = input.studentIds.filter(
          (_, index) => finalCallCounts[index] === minimumBefore,
        ),
        chosenId = random.pick(eligibleIds),
        index = input.studentIds.indexOf(chosenId),
        countBefore = finalCallCounts[index],
        countAfter = countBefore + 1;
      if (!Number.isSafeInteger(countAfter))
        simpleError(
          "priorCallCounts",
          "A selected count cannot be incremented exactly.",
          "count_overflow",
        );
      finalCallCounts[index] = countAfter;
      const after = calculateRoster({
        studentIds: input.studentIds,
        priorCallCounts: finalCallCounts,
      });
      return {
        turn: i + 1,
        minimumBefore,
        eligibleIds,
        chosenId,
        countBefore,
        countAfter,
        spreadBefore: before.callCountSpread,
        spreadAfter: after.callCountSpread,
      };
    });
    return toolSuccess({
      trace,
      finalCallCounts,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const fairClassroomCallingSequenceExample = {
  input: {
    studentIds: ["A", "B", "C"],
    priorCallCounts: [2, 0, 1],
    turns: 6,
    seed: 42,
  },
  output: {
    trace: [
      {
        turn: 1,
        minimumBefore: 0,
        eligibleIds: ["B"],
        chosenId: "B",
        countBefore: 0,
        countAfter: 1,
        spreadBefore: 2,
        spreadAfter: 1,
      },
      {
        turn: 2,
        minimumBefore: 1,
        eligibleIds: ["B", "C"],
        chosenId: "B",
        countBefore: 1,
        countAfter: 2,
        spreadBefore: 1,
        spreadAfter: 1,
      },
      {
        turn: 3,
        minimumBefore: 1,
        eligibleIds: ["C"],
        chosenId: "C",
        countBefore: 1,
        countAfter: 2,
        spreadBefore: 1,
        spreadAfter: 0,
      },
      {
        turn: 4,
        minimumBefore: 2,
        eligibleIds: ["A", "B", "C"],
        chosenId: "C",
        countBefore: 2,
        countAfter: 3,
        spreadBefore: 0,
        spreadAfter: 1,
      },
      {
        turn: 5,
        minimumBefore: 2,
        eligibleIds: ["A", "B"],
        chosenId: "A",
        countBefore: 2,
        countAfter: 3,
        spreadBefore: 1,
        spreadAfter: 1,
      },
      {
        turn: 6,
        minimumBefore: 2,
        eligibleIds: ["B"],
        chosenId: "B",
        countBefore: 2,
        countAfter: 3,
        spreadBefore: 1,
        spreadAfter: 0,
      },
    ],
    finalCallCounts: [3, 3, 3],
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<
  FairClassroomCallingSequenceInput,
  FairClassroomCallingSequenceOutput
>;
export const fairClassroomCallingSequenceTool = createModelDefinition<
  FairClassroomCallingSequenceInput,
  FairClassroomCallingSequenceOutput
>({
  id: "random/fair-classroom-calling-sequence",
  title: "Random Fair Classroom Calling Sequence Generator",
  description:
    "Choose only among supplied least-called learners, randomize ties, increment counts after each turn, and retain eligible IDs and before/after spreads. Prior counts and roster order are preserved; balance is a count-based rule rather than a claim about equitable educational outcomes.",
  inputSchema,
  outputSchema,
  execute: calculateFairClassroomCallingSequence,
});
export const runFairClassroomCallingSequence =
  fairClassroomCallingSequenceTool.execute;
export default fairClassroomCallingSequenceTool;
