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
import { calculateCombinations } from "../../list/combinations/tool.js";
import {
  generatedPlainDateSchema,
  generatedPlainDateAddDays,
  generatedPlainDateTimestamp,
} from "../calendar-day-construction.js";

export type RoundRobinScheduleInput = {
  readonly participants: readonly string[];
  readonly startDate: string;
  readonly roundIntervalDays: number;
  readonly seed?: number;
};
export type RoundRobinScheduleOutput = {
  readonly shuffledParticipants: readonly string[];
  readonly rounds: readonly {
    readonly roundNumber: number;
    readonly constructionRound: number;
    readonly date: string;
    readonly matches: readonly {
      readonly first: string;
      readonly second: string;
    }[];
    readonly bye: string | null;
  }[];
  readonly totalMatches: number;
  readonly randomness: GeneratorReplay;
};
const identifier = { type: "string", minLength: 1, maxLength: 128 } as const;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    participants: {
      type: "array",
      minItems: 2,
      maxItems: 32,
      items: identifier,
    },
    startDate: generatedPlainDateSchema,
    roundIntervalDays: { type: "integer", minimum: 0 },
    seed: generatorSeedSchema,
  },
  required: ["participants", "startDate", "roundIntervalDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    shuffledParticipants: inputSchema.properties.participants,
    rounds: {
      type: "array",
      minItems: 1,
      maxItems: 31,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          roundNumber: { type: "integer", minimum: 1, maximum: 31 },
          constructionRound: { type: "integer", minimum: 1, maximum: 31 },
          date: generatedPlainDateSchema,
          matches: {
            type: "array",
            minItems: 1,
            maxItems: 16,
            items: {
              type: "object",
              additionalProperties: false,
              properties: { first: identifier, second: identifier },
              required: ["first", "second"],
            },
          },
          bye: { anyOf: [identifier, { type: "null" }] },
        },
        required: [
          "roundNumber",
          "constructionRound",
          "date",
          "matches",
          "bye",
        ],
      },
    },
    totalMatches: { type: "integer", minimum: 1, maximum: 496 },
    randomness: generatorReplaySchema,
  },
  required: ["shuffledParticipants", "rounds", "totalMatches", "randomness"],
} as const;

const isInput = (input: unknown): input is RoundRobinScheduleInput =>
  matchesModelInput(input, inputSchema);
export const calculateRoundRobinSchedule = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<RoundRobinScheduleOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    if (
      new Set(input.participants).size !== input.participants.length ||
      input.participants.some((id) => !id.trim())
    )
      simpleError(
        "participants",
        "Participant IDs must be distinct and nonblank.",
        "invalid_participant_ids",
      );
    generatedPlainDateTimestamp(input.startDate, "startDate");
    const count = input.participants.length,
      roundCount = count % 2 ? count : count - 1;
    generatedPlainDateAddDays(
      input.startDate,
      (roundCount - 1) * input.roundIntervalDays,
      "roundIntervalDays",
    );
    const random = createGeneratorRandom(input.seed, context),
      shuffledParticipants = random.shuffle(input.participants);
    let ring: (number | null)[] = Array.from({ length: count }, (_, i) => i);
    if (count % 2) ring.push(null);
    const construction: {
        constructionRound: number;
        matches: { first: string; second: string }[];
        bye: string | null;
      }[] = [],
      observed = new Set<string>();
    for (let round = 0; round < roundCount; round += 1) {
      const matches: { first: string; second: string }[] = [];
      let bye: string | null = null;
      for (let i = 0; i < ring.length / 2; i += 1) {
        const first = ring[i],
          second = ring[ring.length - 1 - i];
        if (first === null || second === null) {
          const present = first === null ? second : first;
          if (present === null)
            throw new Error("A circle round contains two byes.");
          bye = shuffledParticipants[present];
        } else {
          matches.push({
            first: shuffledParticipants[first],
            second: shuffledParticipants[second],
          });
          observed.add(Math.min(first, second) + "|" + Math.max(first, second));
        }
      }
      construction.push({ constructionRound: round + 1, matches, bye });
      ring = [ring[0], ring[ring.length - 1], ...ring.slice(1, -1)];
    }
    const expected = calculateCombinations({
      values: Array.from({ length: count }, (_, i) => i),
      size: 2,
    }).combinations;
    if (
      observed.size !== expected.length ||
      expected.some(([a, b]) => !observed.has(a + "|" + b))
    )
      throw new Error("Circle scheduling failed imported pair coverage.");
    const rounds = random.shuffle(construction).map((round, i) => ({
      ...round,
      roundNumber: i + 1,
      date: generatedPlainDateAddDays(
        input.startDate,
        i * input.roundIntervalDays,
        "roundIntervalDays",
      ),
    }));
    return toolSuccess({
      shuffledParticipants,
      rounds,
      totalMatches: expected.length,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const roundRobinScheduleExample = {
  input: {
    participants: ["Ada", "Grace", "Lin", "Hedy"],
    startDate: "2026-10-19",
    roundIntervalDays: 7,
    seed: 42,
  },
  output: {
    shuffledParticipants: ["Ada", "Hedy", "Grace", "Lin"],
    rounds: [
      {
        constructionRound: 2,
        matches: [
          {
            first: "Ada",
            second: "Grace",
          },
          {
            first: "Lin",
            second: "Hedy",
          },
        ],
        bye: null,
        roundNumber: 1,
        date: "2026-10-19",
      },
      {
        constructionRound: 1,
        matches: [
          {
            first: "Ada",
            second: "Lin",
          },
          {
            first: "Hedy",
            second: "Grace",
          },
        ],
        bye: null,
        roundNumber: 2,
        date: "2026-10-26",
      },
      {
        constructionRound: 3,
        matches: [
          {
            first: "Ada",
            second: "Hedy",
          },
          {
            first: "Grace",
            second: "Lin",
          },
        ],
        bye: null,
        roundNumber: 3,
        date: "2026-11-02",
      },
    ],
    totalMatches: 6,
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<RoundRobinScheduleInput, RoundRobinScheduleOutput>;
export const roundRobinScheduleTool = createModelDefinition<
  RoundRobinScheduleInput,
  RoundRobinScheduleOutput
>({
  id: "random/round-robin-schedule",
  title: "Random Round-Robin Schedule Generator",
  description:
    "Shuffle participants and circle-method rounds into a single all-pairs schedule with explicit Gregorian dates, odd-field byes and combination-verified coverage; no same-round clashes, home/away balance or federation ordering guarantee.",
  inputSchema,
  outputSchema,
  execute: calculateRoundRobinSchedule,
});
export const runRoundRobinSchedule = roundRobinScheduleTool.execute;
export default roundRobinScheduleTool;
