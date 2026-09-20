import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createModelDefinition } from "../../core/model-definition.js";
import { simpleError } from "../../core/simple.js";
import {
  fcArray,
  fcFinite,
  fcId,
  fcInput,
  fcInteger,
  fcNumber,
  fcObject,
  fcOutput,
  fcPick,
  fcRun,
  fcText,
  fcUnique,
  matchesModelInput,
  type FcReplay,
  type FcSeed,
} from "../m250-fiction-craft-common.js";
export type TavernMenuItem = {
  readonly id: string;
  readonly kind: "dish" | "drink";
  readonly description: string;
  readonly minimumPrice: number;
  readonly maximumPrice: number;
};
export type FantasyTavernMenuCardInput = FcSeed & {
  readonly venues: readonly string[];
  readonly currency: string;
  readonly count: number;
  readonly items: readonly TavernMenuItem[];
};
export type FantasyTavernMenuCardOutput = FcReplay & {
  readonly fictional: boolean;
  readonly venue: string;
  readonly currency: string;
  readonly items: readonly {
    readonly id: string;
    readonly kind: "dish" | "drink";
    readonly description: string;
    readonly price: number;
  }[];
};
const kind = { type: "string", enum: ["dish", "drink"] } as const,
  price = { type: "number", minimum: 0 } as const;
export const inputSchema = fcInput({
  venues: fcArray(fcText, 32, 1),
  currency: { type: "string", minLength: 1, maxLength: 64 },
  count: fcInteger(1, 32),
  items: fcArray(
    fcObject({
      id: fcId,
      kind,
      description: fcText,
      minimumPrice: price,
      maximumPrice: price,
    }),
    64,
    1,
  ),
});
export const outputSchema = fcOutput({
  fictional: { type: "boolean", const: true },
  venue: fcText,
  currency: { type: "string", minLength: 1, maxLength: 64 },
  items: fcArray(
    fcObject({ id: fcId, kind, description: fcText, price: fcNumber }),
    32,
    1,
  ),
});
const isInput = (v: unknown): v is FantasyTavernMenuCardInput =>
  matchesModelInput(v, inputSchema);
export const calculateFantasyTavernMenuCard = (
  input: unknown,
  context?: ToolExecutionContext,
) =>
  fcRun(
    input,
    inputSchema,
    isInput,
    context,
    (x, random): Omit<FantasyTavernMenuCardOutput, "randomness"> => {
      fcUnique(
        x.items.map((v) => v.id),
        "items",
      );
      fcUnique(x.venues, "venues");
      if (x.count > x.items.length)
        simpleError(
          "count",
          "The menu requires enough distinct supplied items.",
          "infeasible_item_count",
        );
      if (x.items.some((v) => v.maximumPrice < v.minimumPrice))
        simpleError(
          "items",
          "Each price interval must be ordered.",
          "invalid_price_range",
        );
      const venue = fcPick(x.venues, random),
        pool = [...x.items];
      const items = Array.from({ length: x.count }, () => {
        const item = fcPick(pool, random);
        pool.splice(pool.indexOf(item), 1);
        const u = random.unit();
        return {
          id: item.id,
          kind: item.kind,
          description: item.description,
          price: fcFinite(
            item.minimumPrice + (item.maximumPrice - item.minimumPrice) * u,
            "items",
          ),
        };
      });
      return { fictional: true, venue, currency: x.currency, items };
    },
  );
export const fantasyTavernMenuCardExample = {
  input: {
    venues: ["The Copper Moon", "The Quiet Anchor"],
    currency: "silver pieces",
    count: 2,
    items: [
      {
        id: "stew",
        kind: "dish",
        description: "Harbor vegetable stew",
        minimumPrice: 3,
        maximumPrice: 3,
      },
      {
        id: "tea",
        kind: "drink",
        description: "Orchard leaf tea",
        minimumPrice: 1,
        maximumPrice: 3,
      },
    ],
    seed: 42,
  },
  output: {
    fictional: true,
    venue: "The Quiet Anchor",
    currency: "silver pieces",
    items: [
      {
        id: "stew",
        kind: "dish",
        description: "Harbor vegetable stew",
        price: 3,
      },
      {
        id: "tea",
        kind: "drink",
        description: "Orchard leaf tea",
        price: 1.3496277974918485,
      },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} as const satisfies ToolExample<
  FantasyTavernMenuCardInput,
  FantasyTavernMenuCardOutput
>;
export const fantasyTavernMenuCardTool = createModelDefinition<
  FantasyTavernMenuCardInput,
  FantasyTavernMenuCardOutput
>({
  id: "random/fantasy-tavern-menu-card",
  title: "Random Fantasy Tavern Menu Card Generator",
  description:
    "Compose a fictional venue and distinct supplied dishes or drinks with unrounded synthetic prices in an explicit currency.",
  inputSchema,
  outputSchema,
  execute: calculateFantasyTavernMenuCard,
});
export const runFantasyTavernMenuCard = fantasyTavernMenuCardTool.execute;
export default fantasyTavernMenuCardTool;
