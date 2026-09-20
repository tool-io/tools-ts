import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
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
  text,
  label,
  id,
  bool,
  number,
  integer,
  list,
  object,
  enumeration,
  nullable,
  markup,
  parsedSchema,
  choose,
  preview,
  distinct,
  work,
  finite,
  escape,
  parse,
  finish,
} from "../m500b-ui-accessibility-support.js";

export type Input = {
  readonly labels: readonly string[];
  readonly bodies: readonly string[];
  readonly count: number;
  readonly minimumGap: number;
  readonly maximumGap: number;
  readonly order: "ascending" | "reverse" | "swap";
  readonly seed?: number;
};
export type Output = {
  readonly cards: readonly {
    readonly id: string;
    readonly tick: number;
    readonly label: string;
    readonly preview: string;
    readonly body: string | null;
  }[];
  readonly inversionIndices: readonly number[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = object(
  {
    labels: list(label),
    bodies: list(text),
    count: integer(1, 32),
    minimumGap: integer(),
    maximumGap: integer(),
    order: enumeration(["ascending", "reverse", "swap"]),
    seed: generatorSeedSchema,
  },
  ["labels", "bodies", "count", "minimumGap", "maximumGap", "order"],
);
export const outputSchema = object({
  cards: list(
    object({ id, tick: integer(), label, preview: text, body: nullable(text) }),
  ),
  inversionIndices: list(integer(1, 31), 31, 0),
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is Input =>
  matchesModelInput(input, inputSchema);
export const calculateTimelineCardContentFixture = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<Output> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    if (input.minimumGap > input.maximumGap)
      return simpleError(
        "maximumGap",
        "Gap bounds must be ordered.",
        "invalid_gap_range",
      );
    if (
      BigInt(input.maximumGap) * BigInt(input.count) >
      BigInt(Number.MAX_SAFE_INTEGER)
    )
      return simpleError(
        "maximumGap",
        "Worst-case elapsed ticks must remain a safe integer.",
        "unsafe_timeline",
      );
    if (
      BigInt(input.maximumGap) - BigInt(input.minimumGap) + 1n >
      BigInt(Number.MAX_SAFE_INTEGER)
    )
      return simpleError(
        "maximumGap",
        "The inclusive gap range must fit the integer sampler.",
        "unsafe_sampling_range",
      );
    if (input.order === "swap" && input.count < 2)
      return simpleError(
        "count",
        "A swap requires two cards.",
        "insufficient_cards",
      );
    const random = createGeneratorRandom(input.seed, context);
    let tick = 0;
    const cards = Array.from({ length: input.count }, (_, i) => {
      const label = choose(input.labels, random);
      tick += random.integer(input.minimumGap, input.maximumGap);
      const body = random.unit() < 0.5 ? choose(input.bodies, random) : null;
      return {
        id: "card-" + i,
        tick,
        label,
        preview: preview(label, 32),
        body,
      };
    });
    if (input.order === "reverse") cards.reverse();
    if (input.order === "swap") {
      const i = random.integer(0, cards.length - 2),
        a = cards[i],
        b = cards[i + 1];
      if (!a || !b) throw new Error("Timeline swap missing cards");
      cards[i] = b;
      cards[i + 1] = a;
    }
    const inversionIndices = cards.flatMap((card, i) =>
      i > 0 && card.tick < (cards[i - 1]?.tick ?? 0) ? [i] : [],
    );
    return toolSuccess(
      finish({
        cards,
        inversionIndices,
        randomness: generatorReplay(input.seed, context),
      }),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const timelineCardContentFixtureExample = {
  input: {
    labels: ["Alpha", "Beta"],
    bodies: ["Body"],
    count: 3,
    minimumGap: 2,
    maximumGap: 2,
    order: "reverse",
    seed: 42,
  },
  output: {
    cards: [
      { id: "card-2", tick: 6, label: "Alpha", preview: "Alpha", body: null },
      { id: "card-1", tick: 4, label: "Beta", preview: "Beta", body: null },
      { id: "card-0", tick: 2, label: "Beta", preview: "Beta", body: null },
    ],
    inversionIndices: [1, 2],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<Input, Output>;
export const timelineCardContentFixtureTool = createModelDefinition<
  Input,
  Output
>({
  id: "random/timeline-card-content-fixture",
  title: "Random Timeline Card Content Fixture Generator",
  description:
    "Construct fictional event cards with elapsed integer ticks, optional supplied bodies and explicit reverse/swap chronology controls, reporting actual adjacent inversions.",
  inputSchema,
  outputSchema,
  execute: calculateTimelineCardContentFixture,
});
export const runTimelineCardContentFixture =
  timelineCardContentFixtureTool.execute;
export default timelineCardContentFixtureTool;
