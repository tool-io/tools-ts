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
import { calculateFifoLayerRemainingQuantityTracker } from "../../logistics/fifo-layer-remaining-quantity-tracker/tool.js";
import {
  orderedInstanceRange,
  exactInstanceSum,
  positiveInstanceIntegerSchema,
  nonnegativeInstanceIntegerSchema,
} from "../optimization-instance-integers.js";

export type FifoTraceLayer = {
  readonly layerId: string;
  readonly remainingUnits: number;
};
export type FifoInventoryTransactionTraceInput = {
  readonly initialQuantities: readonly number[];
  readonly minimumReceipt: number;
  readonly maximumReceipt: number;
  readonly receiptProbability: number;
  readonly eventCount: number;
  readonly seed?: number;
};
export type FifoInventoryTransactionTraceOutput = {
  readonly initialLayers: readonly FifoTraceLayer[];
  readonly events: readonly {
    readonly index: number;
    readonly kind: "receipt" | "issue";
    readonly quantity: number;
    readonly receiptLayerId: string | null;
    readonly stockBefore: number;
    readonly stockAfter: number;
    readonly consumption: readonly {
      readonly layerId: string;
      readonly units: number;
    }[];
    readonly layers: readonly FifoTraceLayer[];
  }[];
  readonly finalLayers: readonly FifoTraceLayer[];
  readonly randomness: GeneratorReplay;
};
const layerSchema = {
    type: "object",
    additionalProperties: false,
    properties: {
      layerId: { type: "string" },
      remainingUnits: positiveInstanceIntegerSchema,
    },
    required: ["layerId", "remainingUnits"],
  } as const,
  layersSchema = { type: "array", maxItems: 144, items: layerSchema } as const;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    initialQuantities: {
      type: "array",
      maxItems: 16,
      items: positiveInstanceIntegerSchema,
    },
    minimumReceipt: positiveInstanceIntegerSchema,
    maximumReceipt: positiveInstanceIntegerSchema,
    receiptProbability: { type: "number", minimum: 0, maximum: 1 },
    eventCount: { type: "integer", minimum: 1, maximum: 128 },
    seed: generatorSeedSchema,
  },
  required: [
    "initialQuantities",
    "minimumReceipt",
    "maximumReceipt",
    "receiptProbability",
    "eventCount",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    initialLayers: layersSchema,
    events: {
      type: "array",
      minItems: 1,
      maxItems: 128,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          index: { type: "integer", minimum: 1, maximum: 128 },
          kind: { type: "string", enum: ["receipt", "issue"] },
          quantity: positiveInstanceIntegerSchema,
          receiptLayerId: { anyOf: [{ type: "string" }, { type: "null" }] },
          stockBefore: nonnegativeInstanceIntegerSchema,
          stockAfter: nonnegativeInstanceIntegerSchema,
          consumption: {
            type: "array",
            maxItems: 144,
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                layerId: { type: "string" },
                units: positiveInstanceIntegerSchema,
              },
              required: ["layerId", "units"],
            },
          },
          layers: layersSchema,
        },
        required: [
          "index",
          "kind",
          "quantity",
          "receiptLayerId",
          "stockBefore",
          "stockAfter",
          "consumption",
          "layers",
        ],
      },
    },
    finalLayers: layersSchema,
    randomness: generatorReplaySchema,
  },
  required: ["initialLayers", "events", "finalLayers", "randomness"],
} as const;

const isInput = (input: unknown): input is FifoInventoryTransactionTraceInput =>
  matchesModelInput(input, inputSchema);
export const calculateFifoInventoryTransactionTrace = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<FifoInventoryTransactionTraceOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    orderedInstanceRange(
      input.minimumReceipt,
      input.maximumReceipt,
      "maximumReceipt",
    );
    exactInstanceSum(input.initialQuantities, "initialQuantities");
    const initialLayers = input.initialQuantities.map((remainingUnits, i) => ({
        layerId: "initial-" + (i + 1),
        remainingUnits,
      })),
      queue = initialLayers.map((layer) => ({ ...layer }));
    const random = createGeneratorRandom(input.seed, context);
    let receiptCount = 0;
    const events = Array.from(
      { length: input.eventCount },
      (_, i): FifoInventoryTransactionTraceOutput["events"][number] => {
        const stockBefore = exactInstanceSum(
            queue.map((layer) => layer.remainingUnits),
            "initialQuantities",
          ),
          receipt =
            stockBefore === 0 || random.unit() < input.receiptProbability,
          consumption: { layerId: string; units: number }[] = [];
        let quantity: number,
          receiptLayerId: string | null = null;
        if (receipt) {
          quantity = random.integer(input.minimumReceipt, input.maximumReceipt);
          exactInstanceSum([stockBefore, quantity], "maximumReceipt");
          receiptLayerId = "receipt-" + ++receiptCount;
          queue.push({ layerId: receiptLayerId, remainingUnits: quantity });
        } else {
          quantity = random.integer(1, stockBefore);
          let remainingIssue = quantity;
          while (remainingIssue > 0) {
            const oldest = queue[0];
            if (!oldest)
              throw new Error(
                "A stock-limited issue exhausted its FIFO queue.",
              );
            const core = calculateFifoLayerRemainingQuantityTracker({
              oldestLayerUnits: oldest.remainingUnits,
              totalUnitsShippedSinceLayerReceipt: remainingIssue,
            });
            consumption.push({
              layerId: oldest.layerId,
              units: oldest.remainingUnits - core.oldestLayerRemainingUnits,
            });
            oldest.remainingUnits = core.oldestLayerRemainingUnits;
            remainingIssue = core.unitsDrawnFromNewerLayers;
            if (core.oldestLayerDepleted) queue.shift();
          }
        }
        return {
          index: i + 1,
          kind: receipt ? "receipt" : "issue",
          quantity,
          receiptLayerId,
          stockBefore,
          stockAfter: exactInstanceSum(
            queue.map((layer) => layer.remainingUnits),
            "maximumReceipt",
          ),
          consumption,
          layers: queue.map((layer) => ({ ...layer })),
        };
      },
    );
    return toolSuccess({
      initialLayers,
      events,
      finalLayers: queue.map((layer) => ({ ...layer })),
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const fifoInventoryTransactionTraceExample = {
  input: {
    initialQuantities: [3, 2],
    minimumReceipt: 1,
    maximumReceipt: 4,
    receiptProbability: 0.4,
    eventCount: 6,
    seed: 42,
  },
  output: {
    initialLayers: [
      {
        layerId: "initial-1",
        remainingUnits: 3,
      },
      {
        layerId: "initial-2",
        remainingUnits: 2,
      },
    ],
    events: [
      {
        index: 1,
        kind: "issue",
        quantity: 3,
        receiptLayerId: null,
        stockBefore: 5,
        stockAfter: 2,
        consumption: [
          {
            layerId: "initial-1",
            units: 3,
          },
        ],
        layers: [
          {
            layerId: "initial-2",
            remainingUnits: 2,
          },
        ],
      },
      {
        index: 2,
        kind: "issue",
        quantity: 2,
        receiptLayerId: null,
        stockBefore: 2,
        stockAfter: 0,
        consumption: [
          {
            layerId: "initial-2",
            units: 2,
          },
        ],
        layers: [],
      },
      {
        index: 3,
        kind: "receipt",
        quantity: 1,
        receiptLayerId: "receipt-1",
        stockBefore: 0,
        stockAfter: 1,
        consumption: [],
        layers: [
          {
            layerId: "receipt-1",
            remainingUnits: 1,
          },
        ],
      },
      {
        index: 4,
        kind: "issue",
        quantity: 1,
        receiptLayerId: null,
        stockBefore: 1,
        stockAfter: 0,
        consumption: [
          {
            layerId: "receipt-1",
            units: 1,
          },
        ],
        layers: [],
      },
      {
        index: 5,
        kind: "receipt",
        quantity: 3,
        receiptLayerId: "receipt-2",
        stockBefore: 0,
        stockAfter: 3,
        consumption: [],
        layers: [
          {
            layerId: "receipt-2",
            remainingUnits: 3,
          },
        ],
      },
      {
        index: 6,
        kind: "issue",
        quantity: 2,
        receiptLayerId: null,
        stockBefore: 3,
        stockAfter: 1,
        consumption: [
          {
            layerId: "receipt-2",
            units: 2,
          },
        ],
        layers: [
          {
            layerId: "receipt-2",
            remainingUnits: 1,
          },
        ],
      },
    ],
    finalLayers: [
      {
        layerId: "receipt-2",
        remainingUnits: 1,
      },
    ],
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<
  FifoInventoryTransactionTraceInput,
  FifoInventoryTransactionTraceOutput
>;
export const fifoInventoryTransactionTraceTool = createModelDefinition<
  FifoInventoryTransactionTraceInput,
  FifoInventoryTransactionTraceOutput
>({
  id: "random/fifo-inventory-transaction-trace",
  title: "Random FIFO Inventory Transaction Trace Generator",
  description:
    "Generate chronological synthetic receipts and stock-limited issues, retain an explicit FIFO layer queue, and delegate consumption of each oldest layer. Empty stock forces a receipt without an event-type draw; no issues exceed stock, depleted layers disappear, and this quantity-only trace models neither prices nor real inventory transactions.",
  inputSchema,
  outputSchema,
  execute: calculateFifoInventoryTransactionTrace,
});
export const runFifoInventoryTransactionTrace =
  fifoInventoryTransactionTraceTool.execute;
export default fifoInventoryTransactionTraceTool;
