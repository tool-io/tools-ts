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
import { calculateShrinkagePercentInventoryLoss } from "../../logistics/shrinkage-percent-inventory-loss/tool.js";
import {
  orderedInstanceRange,
  nonnegativeInstanceIntegerSchema,
} from "../optimization-instance-integers.js";

export type InventoryShrinkageAuditDatasetInput = {
  readonly minimumBookUnits: number;
  readonly maximumBookUnits: number;
  readonly minimumDelta: number;
  readonly maximumDelta: number;
  readonly count: number;
  readonly seed?: number;
};
export type InventoryShrinkageAuditDatasetOutput = {
  readonly rows: readonly {
    readonly id: string;
    readonly bookInventoryUnits: number;
    readonly requestedDelta: number;
    readonly physicalCountUnits: number;
    readonly clampedAtZero: boolean;
    readonly unitsLost: number;
    readonly shrinkagePercent: number | null;
    readonly undefinedReason: "zero-book-inventory" | null;
  }[];
  readonly randomness: GeneratorReplay;
};
const signedSchema = {
  type: "integer",
  minimum: -Number.MAX_SAFE_INTEGER,
  maximum: Number.MAX_SAFE_INTEGER,
} as const;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    minimumBookUnits: nonnegativeInstanceIntegerSchema,
    maximumBookUnits: nonnegativeInstanceIntegerSchema,
    minimumDelta: signedSchema,
    maximumDelta: signedSchema,
    count: { type: "integer", minimum: 1, maximum: 128 },
    seed: generatorSeedSchema,
  },
  required: [
    "minimumBookUnits",
    "maximumBookUnits",
    "minimumDelta",
    "maximumDelta",
    "count",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rows: {
      type: "array",
      minItems: 1,
      maxItems: 128,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          id: { type: "string" },
          bookInventoryUnits: nonnegativeInstanceIntegerSchema,
          requestedDelta: signedSchema,
          physicalCountUnits: nonnegativeInstanceIntegerSchema,
          clampedAtZero: { type: "boolean" },
          unitsLost: signedSchema,
          shrinkagePercent: { anyOf: [{ type: "number" }, { type: "null" }] },
          undefinedReason: {
            anyOf: [
              { type: "string", const: "zero-book-inventory" },
              { type: "null" },
            ],
          },
        },
        required: [
          "id",
          "bookInventoryUnits",
          "requestedDelta",
          "physicalCountUnits",
          "clampedAtZero",
          "unitsLost",
          "shrinkagePercent",
          "undefinedReason",
        ],
      },
    },
    randomness: generatorReplaySchema,
  },
  required: ["rows", "randomness"],
} as const;

const isInput = (
  input: unknown,
): input is InventoryShrinkageAuditDatasetInput =>
  matchesModelInput(input, inputSchema);
export const calculateInventoryShrinkageAuditDataset = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<InventoryShrinkageAuditDatasetOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    orderedInstanceRange(
      input.minimumBookUnits,
      input.maximumBookUnits,
      "maximumBookUnits",
    );
    orderedInstanceRange(
      input.minimumDelta,
      input.maximumDelta,
      "maximumDelta",
    );
    const random = createGeneratorRandom(input.seed, context),
      rows = Array.from({ length: input.count }, (_, i) => {
        const bookInventoryUnits = random.integer(
            input.minimumBookUnits,
            input.maximumBookUnits,
          ),
          requestedDelta = random.integer(
            input.minimumDelta,
            input.maximumDelta,
          ),
          raw = BigInt(bookInventoryUnits) + BigInt(requestedDelta);
        if (raw > BigInt(Number.MAX_SAFE_INTEGER))
          simpleError(
            "maximumDelta",
            "A generated physical count exceeds the safe integer domain.",
            "count_overflow",
          );
        const physicalCountUnits = raw < 0n ? 0 : Number(raw),
          clampedAtZero = raw < 0n;
        const result =
          bookInventoryUnits > 0
            ? calculateShrinkagePercentInventoryLoss({
                bookInventoryUnits,
                physicalCountUnits,
              })
            : { unitsLost: -physicalCountUnits, shrinkagePercent: null };
        return {
          id: "count-" + (i + 1),
          bookInventoryUnits,
          requestedDelta,
          physicalCountUnits,
          clampedAtZero,
          unitsLost: result.unitsLost === 0 ? 0 : result.unitsLost,
          shrinkagePercent: result.shrinkagePercent,
          undefinedReason:
            bookInventoryUnits > 0 ? null : ("zero-book-inventory" as const),
        };
      });
    return toolSuccess({
      rows,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const inventoryShrinkageAuditDatasetExample = {
  input: {
    minimumBookUnits: 0,
    maximumBookUnits: 3,
    minimumDelta: -3,
    maximumDelta: 5,
    count: 4,
    seed: 42,
  },
  output: {
    rows: [
      {
        id: "count-1",
        bookInventoryUnits: 2,
        requestedDelta: 1,
        physicalCountUnits: 3,
        clampedAtZero: false,
        unitsLost: -1,
        shrinkagePercent: -50,
        undefinedReason: null,
      },
      {
        id: "count-2",
        bookInventoryUnits: 3,
        requestedDelta: 3,
        physicalCountUnits: 6,
        clampedAtZero: false,
        unitsLost: -3,
        shrinkagePercent: -100,
        undefinedReason: null,
      },
      {
        id: "count-3",
        bookInventoryUnits: 0,
        requestedDelta: 1,
        physicalCountUnits: 1,
        clampedAtZero: false,
        unitsLost: -1,
        shrinkagePercent: null,
        undefinedReason: "zero-book-inventory",
      },
      {
        id: "count-4",
        bookInventoryUnits: 1,
        requestedDelta: 2,
        physicalCountUnits: 3,
        clampedAtZero: false,
        unitsLost: -2,
        shrinkagePercent: -200,
        undefinedReason: null,
      },
    ],
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<
  InventoryShrinkageAuditDatasetInput,
  InventoryShrinkageAuditDatasetOutput
>;
export const inventoryShrinkageAuditDatasetTool = createModelDefinition<
  InventoryShrinkageAuditDatasetInput,
  InventoryShrinkageAuditDatasetOutput
>({
  id: "random/inventory-shrinkage-audit-dataset",
  title: "Random Inventory Shrinkage Audit Dataset Generator",
  description:
    "Generate synthetic book quantities and signed count deltas, clamp negative physical counts explicitly at zero, and delegate inventory-loss units and percentages. Overage remains negative shrinkage; zero book quantity has an undefined percentage with an explicit reason, not a fabricated zero, and values are not evidence about actual inventory.",
  inputSchema,
  outputSchema,
  execute: calculateInventoryShrinkageAuditDataset,
});
export const runInventoryShrinkageAuditDataset =
  inventoryShrinkageAuditDatasetTool.execute;
export default inventoryShrinkageAuditDatasetTool;
