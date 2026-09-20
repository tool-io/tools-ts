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
import { calculate as calculateCoverage } from "../../pedagogy/assessment-blueprint-coverage/tool.js";
import { generatorSampleIndices } from "../generator-random.js";

export type AssessmentBankItem = {
  readonly id: string;
  readonly objectiveId: string;
  readonly prompt: string;
  readonly answer: string;
};
export type AssessmentItemSamplerInput = {
  readonly bank: readonly AssessmentBankItem[];
  readonly objectives: readonly {
    readonly id: string;
    readonly count: number;
  }[];
  readonly minimumItemsPerObjective: number;
  readonly seed?: number;
};
export type AssessmentItemSamplerOutput = {
  readonly items: readonly AssessmentBankItem[];
  readonly coverage: {
    readonly objectiveIds: readonly string[];
    readonly itemCounts: readonly number[];
    readonly uncoveredObjectiveIds: readonly string[];
    readonly coveragePercent: number;
  };
  readonly randomness: GeneratorReplay;
};
const idSchema = { type: "string", minLength: 1, maxLength: 128 } as const,
  itemSchema = {
    type: "object",
    additionalProperties: false,
    properties: {
      id: idSchema,
      objectiveId: idSchema,
      prompt: { type: "string", minLength: 1, maxLength: 2048 },
      answer: { type: "string", maxLength: 4096 },
    },
    required: ["id", "objectiveId", "prompt", "answer"],
  } as const;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bank: { type: "array", minItems: 1, maxItems: 256, items: itemSchema },
    objectives: {
      type: "array",
      minItems: 1,
      maxItems: 32,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          id: idSchema,
          count: { type: "integer", minimum: 0, maximum: 32 },
        },
        required: ["id", "count"],
      },
    },
    minimumItemsPerObjective: { type: "integer", minimum: 1, maximum: 32 },
    seed: generatorSeedSchema,
  },
  required: ["bank", "objectives", "minimumItemsPerObjective"],
} as const;
const objectiveIdsSchema = {
  type: "array",
  maxItems: 32,
  items: idSchema,
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    items: { type: "array", minItems: 1, maxItems: 128, items: itemSchema },
    coverage: {
      type: "object",
      additionalProperties: false,
      properties: {
        objectiveIds: objectiveIdsSchema,
        itemCounts: {
          type: "array",
          minItems: 1,
          maxItems: 32,
          items: { type: "integer", minimum: 0, maximum: 32 },
        },
        uncoveredObjectiveIds: objectiveIdsSchema,
        coveragePercent: { type: "number", minimum: 0, maximum: 100 },
      },
      required: [
        "objectiveIds",
        "itemCounts",
        "uncoveredObjectiveIds",
        "coveragePercent",
      ],
    },
    randomness: generatorReplaySchema,
  },
  required: ["items", "coverage", "randomness"],
} as const;

const isInput = (input: unknown): input is AssessmentItemSamplerInput =>
  matchesModelInput(input, inputSchema);
export const calculateAssessmentItemSampler = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<AssessmentItemSamplerOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const objectiveIds = input.objectives.map((objective) => objective.id);
    if (new Set(objectiveIds).size !== objectiveIds.length)
      simpleError(
        "objectives",
        "Objective IDs must be distinct.",
        "duplicate_objective",
      );
    if (new Set(input.bank.map((item) => item.id)).size !== input.bank.length)
      simpleError(
        "bank",
        "Question IDs must be globally distinct.",
        "duplicate_item",
      );
    const total = input.objectives.reduce(
      (sum, objective) => sum + objective.count,
      0,
    );
    if (total < 1 || total > 128)
      simpleError(
        "objectives",
        "Request 1 to 128 total items.",
        "invalid_total_count",
      );
    const pools = input.objectives.map((objective) => {
      const items = input.bank.filter(
        (item) => item.objectiveId === objective.id,
      );
      if (items.length < objective.count)
        simpleError(
          "bank",
          "An objective has fewer distinct supplied items than requested.",
          "insufficient_objective_items",
        );
      return items;
    });
    const random = createGeneratorRandom(input.seed, context),
      selected = input.objectives.flatMap((objective, i) =>
        generatorSampleIndices(pools[i].length, objective.count, random).map(
          (index) => pools[i][index],
        ),
      ),
      items = random.shuffle(selected);
    const core = calculateCoverage({
      objectiveIds,
      itemObjectiveIds: items.map((item) => item.objectiveId),
      minimumItemsPerObjective: input.minimumItemsPerObjective,
    });
    return toolSuccess({
      items,
      coverage: { objectiveIds, ...core },
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const assessmentItemSamplerExample = {
  input: {
    bank: [
      {
        id: "a",
        objectiveId: "O1",
        prompt: "1 + 1",
        answer: "2",
      },
      {
        id: "b",
        objectiveId: "O1",
        prompt: "2 + 2",
        answer: "4",
      },
      {
        id: "c",
        objectiveId: "O1",
        prompt: "3 + 3",
        answer: "6",
      },
      {
        id: "d",
        objectiveId: "O2",
        prompt: "4 - 1",
        answer: "3",
      },
      {
        id: "e",
        objectiveId: "O2",
        prompt: "5 - 2",
        answer: "3",
      },
    ],
    objectives: [
      {
        id: "O1",
        count: 2,
      },
      {
        id: "O2",
        count: 1,
      },
      {
        id: "O3",
        count: 0,
      },
    ],
    minimumItemsPerObjective: 1,
    seed: 42,
  },
  output: {
    items: [
      {
        id: "a",
        objectiveId: "O1",
        prompt: "1 + 1",
        answer: "2",
      },
      {
        id: "b",
        objectiveId: "O1",
        prompt: "2 + 2",
        answer: "4",
      },
      {
        id: "e",
        objectiveId: "O2",
        prompt: "5 - 2",
        answer: "3",
      },
    ],
    coverage: {
      objectiveIds: ["O1", "O2", "O3"],
      itemCounts: [2, 1, 0],
      uncoveredObjectiveIds: ["O3"],
      coveragePercent: 66.66666666666666,
    },
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<
  AssessmentItemSamplerInput,
  AssessmentItemSamplerOutput
>;
export const assessmentItemSamplerTool = createModelDefinition<
  AssessmentItemSamplerInput,
  AssessmentItemSamplerOutput
>({
  id: "random/assessment-item-sampler",
  title: "Random Assessment Item Sampler Generator",
  description:
    "Sample distinct existing question records without replacement within each requested objective count, shuffle the combined paper, and delegate coverage auditing against a caller-selected minimum. Entire supplied prompts and answers are retained unchanged; extra bank objectives are ignored, shortages fail explicitly, and no assessment-validity or difficulty claim is made.",
  inputSchema,
  outputSchema,
  execute: calculateAssessmentItemSampler,
});
export const runAssessmentItemSampler = assessmentItemSamplerTool.execute;
export default assessmentItemSamplerTool;
