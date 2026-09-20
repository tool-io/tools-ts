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
import { calculate as calculateJigsaw } from "../../pedagogy/jigsaw-rotation-schedule/tool.js";

export type JigsawLearningAssignmentInput = {
  readonly studentIds: readonly string[];
  readonly topicIds: readonly string[];
  readonly seed?: number;
};
export type JigsawLearningAssignmentOutput = {
  readonly studentOrder: readonly string[];
  readonly topicOrder: readonly string[];
  readonly homeGroups: readonly (readonly string[])[];
  readonly expertGroups: readonly {
    readonly topicId: string;
    readonly studentIds: readonly string[];
  }[];
  readonly randomness: GeneratorReplay;
};
const idSchema = { type: "string", minLength: 1, maxLength: 128 } as const,
  studentsSchema = {
    type: "array",
    minItems: 1,
    maxItems: 128,
    items: idSchema,
  } as const,
  topicsSchema = {
    type: "array",
    minItems: 1,
    maxItems: 16,
    items: idSchema,
  } as const;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    studentIds: studentsSchema,
    topicIds: topicsSchema,
    seed: generatorSeedSchema,
  },
  required: ["studentIds", "topicIds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    studentOrder: studentsSchema,
    topicOrder: topicsSchema,
    homeGroups: {
      type: "array",
      minItems: 1,
      maxItems: 128,
      items: { type: "array", minItems: 1, maxItems: 16, items: idSchema },
    },
    expertGroups: {
      type: "array",
      minItems: 1,
      maxItems: 16,
      items: {
        type: "object",
        additionalProperties: false,
        properties: { topicId: idSchema, studentIds: studentsSchema },
        required: ["topicId", "studentIds"],
      },
    },
    randomness: generatorReplaySchema,
  },
  required: [
    "studentOrder",
    "topicOrder",
    "homeGroups",
    "expertGroups",
    "randomness",
  ],
} as const;

const isInput = (input: unknown): input is JigsawLearningAssignmentInput =>
  matchesModelInput(input, inputSchema);
export const calculateJigsawLearningAssignment = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<JigsawLearningAssignmentOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    if (new Set(input.studentIds).size !== input.studentIds.length)
      simpleError(
        "studentIds",
        "Entries must be distinct.",
        "duplicate_entries",
      );
    if (new Set(input.topicIds).size !== input.topicIds.length)
      simpleError("topicIds", "Entries must be distinct.", "duplicate_entries");
    if (input.studentIds.some((id) => id.includes(",")))
      simpleError(
        "studentIds",
        "Learner IDs cannot contain the core's comma delimiter.",
        "ambiguous_id",
      );
    if (input.studentIds.length % input.topicIds.length !== 0)
      simpleError(
        "studentIds",
        "The roster must fill complete home groups of one member per topic.",
        "incomplete_home_groups",
      );
    const random = createGeneratorRandom(input.seed, context),
      studentOrder = random.shuffle(input.studentIds),
      topicOrder = random.shuffle(input.topicIds);
    const core = calculateJigsaw({
      studentIds: studentOrder,
      topicIds: topicOrder,
      homeGroupSize: topicOrder.length,
    });
    return toolSuccess({
      studentOrder,
      topicOrder,
      homeGroups: core.homeGroups.map((group) => group.split(",")),
      expertGroups: core.expertGroups.map((group, i) => ({
        topicId: topicOrder[i],
        studentIds: group.split(","),
      })),
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const jigsawLearningAssignmentExample = {
  input: {
    studentIds: ["A", "B", "C", "D", "E", "F"],
    topicIds: ["T1", "T2", "T3"],
    seed: 42,
  },
  output: {
    studentOrder: ["B", "A", "E", "F", "C", "D"],
    topicOrder: ["T3", "T1", "T2"],
    homeGroups: [
      ["B", "A", "E"],
      ["F", "C", "D"],
    ],
    expertGroups: [
      {
        topicId: "T3",
        studentIds: ["B", "F"],
      },
      {
        topicId: "T1",
        studentIds: ["A", "C"],
      },
      {
        topicId: "T2",
        studentIds: ["E", "D"],
      },
    ],
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<
  JigsawLearningAssignmentInput,
  JigsawLearningAssignmentOutput
>;
export const jigsawLearningAssignmentTool = createModelDefinition<
  JigsawLearningAssignmentInput,
  JigsawLearningAssignmentOutput
>({
  id: "random/jigsaw-learning-assignment",
  title: "Random Jigsaw Learning Assignment Generator",
  description:
    "Shuffle the supplied distinct learners and topics, delegate complete jigsaw home/expert grouping, and associate each expert group with its shuffled topic. There must be one topic per home-group member and complete home groups; comma-free learner IDs keep the core's serialized group format unambiguous.",
  inputSchema,
  outputSchema,
  execute: calculateJigsawLearningAssignment,
});
export const runJigsawLearningAssignment = jigsawLearningAssignmentTool.execute;
export default jigsawLearningAssignmentTool;
