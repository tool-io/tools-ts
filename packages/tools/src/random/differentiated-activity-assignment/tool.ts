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
  calculate as calculateTiers,
  type Output as TierOutput,
} from "../../pedagogy/readiness-tier-assignments/tool.js";

export type ActivityReadinessTier = "foundation" | "intermediate" | "advanced";
export type DifferentiatedActivityAssignmentInput = {
  readonly students: readonly {
    readonly id: string;
    readonly readinessScore: number;
  }[];
  readonly intermediateCutoff: number;
  readonly advancedCutoff: number;
  readonly activities: {
    readonly foundation: readonly string[];
    readonly intermediate: readonly string[];
    readonly advanced: readonly string[];
  };
  readonly seed?: number;
};
export type DifferentiatedActivityAssignmentOutput = {
  readonly assignments: readonly {
    readonly studentId: string;
    readonly readinessScore: number;
    readonly tier: ActivityReadinessTier;
    readonly activityId: string;
  }[];
  readonly tiers: TierOutput;
  readonly randomness: GeneratorReplay;
};
const idSchema = { type: "string", minLength: 1, maxLength: 128 } as const,
  bankSchema = { type: "array", maxItems: 64, items: idSchema } as const,
  tierNames = ["foundation", "intermediate", "advanced"] as const;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    students: {
      type: "array",
      minItems: 1,
      maxItems: 128,
      items: {
        type: "object",
        additionalProperties: false,
        properties: { id: idSchema, readinessScore: { type: "number" } },
        required: ["id", "readinessScore"],
      },
    },
    intermediateCutoff: { type: "number" },
    advancedCutoff: { type: "number" },
    activities: {
      type: "object",
      additionalProperties: false,
      properties: {
        foundation: bankSchema,
        intermediate: bankSchema,
        advanced: bankSchema,
      },
      required: tierNames,
    },
    seed: generatorSeedSchema,
  },
  required: ["students", "intermediateCutoff", "advancedCutoff", "activities"],
} as const;
const tierIds = { type: "array", maxItems: 128, items: idSchema } as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    assignments: {
      type: "array",
      minItems: 1,
      maxItems: 128,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          studentId: idSchema,
          readinessScore: { type: "number" },
          tier: { type: "string", enum: tierNames },
          activityId: idSchema,
        },
        required: ["studentId", "readinessScore", "tier", "activityId"],
      },
    },
    tiers: {
      type: "object",
      additionalProperties: false,
      properties: {
        foundationIds: tierIds,
        intermediateIds: tierIds,
        advancedIds: tierIds,
      },
      required: ["foundationIds", "intermediateIds", "advancedIds"],
    },
    randomness: generatorReplaySchema,
  },
  required: ["assignments", "tiers", "randomness"],
} as const;

const isInput = (
  input: unknown,
): input is DifferentiatedActivityAssignmentInput =>
  matchesModelInput(input, inputSchema);
export const calculateDifferentiatedActivityAssignment = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<DifferentiatedActivityAssignmentOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    if (
      Object.values(input.activities).some(
        (bank) => new Set(bank).size !== bank.length,
      )
    )
      simpleError(
        "activities",
        "Activity IDs must be distinct within each tier bank.",
        "duplicate_entries",
      );
    const studentIds = input.students.map((student) => student.id),
      readinessScores = input.students.map((student) => student.readinessScore);
    const tiers = calculateTiers({
      studentIds,
      readinessScores,
      intermediateCutoff: input.intermediateCutoff,
      advancedCutoff: input.advancedCutoff,
    });
    const tierById = new Map<string, ActivityReadinessTier>();
    for (const [tier, ids] of [
      ["foundation", tiers.foundationIds],
      ["intermediate", tiers.intermediateIds],
      ["advanced", tiers.advancedIds],
    ] as const) {
      if (ids.length && !input.activities[tier].length)
        simpleError(
          "activities",
          "Each occupied tier requires at least one supplied activity.",
          "empty_tier_bank",
        );
      ids.forEach((id) => tierById.set(id, tier));
    }
    const random = createGeneratorRandom(input.seed, context),
      assignments = input.students.map((student) => {
        const tier = tierById.get(student.id);
        if (tier === undefined)
          throw new Error("A supplied learner was not classified.");
        return {
          studentId: student.id,
          readinessScore: student.readinessScore,
          tier,
          activityId: random.pick(input.activities[tier]),
        };
      });
    return toolSuccess({
      assignments,
      tiers,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const differentiatedActivityAssignmentExample = {
  input: {
    students: [
      {
        id: "A",
        readinessScore: 20,
      },
      {
        id: "B",
        readinessScore: 40,
      },
      {
        id: "C",
        readinessScore: 80,
      },
    ],
    intermediateCutoff: 40,
    advancedCutoff: 80,
    activities: {
      foundation: ["F1", "F2"],
      intermediate: ["I1", "I2"],
      advanced: ["A1", "A2"],
    },
    seed: 42,
  },
  output: {
    assignments: [
      {
        studentId: "A",
        readinessScore: 20,
        tier: "foundation",
        activityId: "F2",
      },
      {
        studentId: "B",
        readinessScore: 40,
        tier: "intermediate",
        activityId: "I1",
      },
      {
        studentId: "C",
        readinessScore: 80,
        tier: "advanced",
        activityId: "A2",
      },
    ],
    tiers: {
      foundationIds: ["A"],
      intermediateIds: ["B"],
      advancedIds: ["C"],
    },
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<
  DifferentiatedActivityAssignmentInput,
  DifferentiatedActivityAssignmentOutput
>;
export const differentiatedActivityAssignmentTool = createModelDefinition<
  DifferentiatedActivityAssignmentInput,
  DifferentiatedActivityAssignmentOutput
>({
  id: "random/differentiated-activity-assignment",
  title: "Random Differentiated Activity Assignment Generator",
  description:
    "Delegate tier classification from the actual supplied readiness scores, then independently sample an activity ID only from each learner's matching bank. Intermediate and advanced cutoffs are inclusive lower bounds; scores are never randomized, activities may repeat, and tier labels do not establish instructional suitability.",
  inputSchema,
  outputSchema,
  execute: calculateDifferentiatedActivityAssignment,
});
export const runDifferentiatedActivityAssignment =
  differentiatedActivityAssignmentTool.execute;
export default differentiatedActivityAssignmentTool;
