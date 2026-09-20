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
import {
  arraySchema,
  objectSchema,
  labelSchema,
  probabilitySchema,
  positiveSupportSchema,
  integerSchema,
  nullable,
  distinctLabels,
  pickItem,
} from "../m250-algorithms-common.js";
import {
  mineEvidence,
  miningEvidenceSchema,
  type MiningEvidence,
} from "../m250-algorithms-mining.js";

export type MarketBasketTransactionDatasetInput = {
  readonly items: readonly string[];
  readonly templates: readonly {
    readonly label: string;
    readonly items: readonly string[];
  }[];
  readonly transactionCount: number;
  readonly templateProbability: number;
  readonly backgroundProbability: number;
  readonly minimumSupport: number;
  readonly minimumConfidence: number;
  readonly maximumSize: number;
  readonly seed?: number;
};
export type MarketBasketTransactionDatasetOutput = {
  readonly transactions: readonly {
    readonly items: readonly string[];
    readonly plantedTemplate: string | null;
  }[];
  readonly mining: MiningEvidence;
  readonly randomness: GeneratorReplay;
};
const itemsSchema = arraySchema(labelSchema, 6, 1);
export const inputSchema = objectSchema(
  {
    items: itemsSchema,
    templates: arraySchema(
      objectSchema({ label: labelSchema, items: itemsSchema }),
      8,
      1,
    ),
    transactionCount: integerSchema(1, 128),
    templateProbability: probabilitySchema,
    backgroundProbability: probabilitySchema,
    minimumSupport: positiveSupportSchema,
    minimumConfidence: probabilitySchema,
    maximumSize: integerSchema(2, 3),
    seed: generatorSeedSchema,
  },
  [
    "items",
    "templates",
    "transactionCount",
    "templateProbability",
    "backgroundProbability",
    "minimumSupport",
    "minimumConfidence",
    "maximumSize",
  ],
);
export const outputSchema = objectSchema({
  transactions: arraySchema(
    objectSchema({
      items: itemsSchema,
      plantedTemplate: nullable(labelSchema),
    }),
    128,
    1,
  ),
  mining: miningEvidenceSchema,
  randomness: generatorReplaySchema,
});
const isInput = (
  input: unknown,
): input is MarketBasketTransactionDatasetInput =>
  matchesModelInput(input, inputSchema);
export const calculateMarketBasketTransactionDataset = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<MarketBasketTransactionDatasetOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    distinctLabels(input.items, "items");
    distinctLabels(
      input.templates.map((template) => template.label),
      "templates",
    );
    input.templates.forEach((template, i) => {
      distinctLabels(template.items, `templates.${i}.items`);
      if (template.items.some((item) => !input.items.includes(item)))
        simpleError(
          `templates.${i}.items`,
          "Template items must belong to the supplied item bank.",
          "unknown_template_item",
        );
    });
    const random = createGeneratorRandom(input.seed, context);
    const transactions = Array.from({ length: input.transactionCount }, () => {
      const template =
        random.unit() < input.templateProbability
          ? pickItem(input.templates, random)
          : null;
      const basket = new Set(template?.items ?? []);
      for (const item of input.items)
        if (random.unit() < input.backgroundProbability) basket.add(item);
      if (!basket.size) basket.add(pickItem(input.items, random));
      return {
        items: [...basket].sort(),
        plantedTemplate: template?.label ?? null,
      };
    });
    return toolSuccess({
      transactions,
      mining: mineEvidence(
        transactions.map((row) => row.items),
        input.minimumSupport,
        input.minimumConfidence,
        input.maximumSize,
      ),
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const marketBasketTransactionDatasetExample = {
  input: {
    items: ["bread", "milk"],
    templates: [{ label: "breakfast", items: ["bread", "milk"] }],
    transactionCount: 4,
    templateProbability: 0.5,
    backgroundProbability: 0.25,
    minimumSupport: 0.25,
    minimumConfidence: 0.5,
    maximumSize: 2,
    seed: 42,
  },
  output: {
    transactions: [
      { items: ["milk"], plantedTemplate: null },
      { items: ["bread", "milk"], plantedTemplate: "breakfast" },
      { items: ["milk"], plantedTemplate: null },
      { items: ["bread"], plantedTemplate: null },
    ],
    mining: {
      itemsets: [
        { items: ["bread"], count: 2, support: 0.5, coreSupport: 0.5 },
        { items: ["milk"], count: 3, support: 0.75, coreSupport: 0.75 },
        {
          items: ["bread", "milk"],
          count: 1,
          support: 0.25,
          coreSupport: 0.25,
        },
      ],
      rules: [
        {
          antecedent: ["bread"],
          consequent: ["milk"],
          support: 0.25,
          confidence: 0.5,
          lift: 0.6666666666666666,
          coreSupport: 0.25,
          coreConfidence: 0.5,
          coreLift: 0.666666666667,
        },
      ],
    },
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  MarketBasketTransactionDatasetInput,
  MarketBasketTransactionDatasetOutput
>;
export const marketBasketTransactionDatasetTool = createModelDefinition<
  MarketBasketTransactionDatasetInput,
  MarketBasketTransactionDatasetOutput
>({
  id: "random/market-basket-transaction-dataset",
  title: "Random Market Basket Transaction Dataset Generator",
  description:
    "Compose synthetic baskets from supplied co-purchase templates and independent background draws, retaining planted labels and delegated mining evidence with unrounded count metrics.",
  inputSchema,
  outputSchema,
  execute: calculateMarketBasketTransactionDataset,
});
export const runMarketBasketTransactionDataset =
  marketBasketTransactionDatasetTool.execute;
export default marketBasketTransactionDatasetTool;
