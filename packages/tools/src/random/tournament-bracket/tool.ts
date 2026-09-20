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
import { runChunk } from "../../list/chunk/tool.js";
import { runPermutationCount } from "../../combinatorics/permutation-count/tool.js";

export type BracketSlot =
  | { readonly kind: "participant"; readonly participantId: string }
  | { readonly kind: "winner"; readonly matchId: string }
  | { readonly kind: "bye" };
export type BracketMatch = {
  readonly id: string;
  readonly left: BracketSlot;
  readonly right: BracketSlot;
  readonly automaticWinner: string | null;
};
export type TournamentBracketInput = {
  readonly participants: readonly string[];
  readonly seed?: number;
};
export type TournamentBracketOutput = {
  readonly shuffledParticipants: readonly string[];
  readonly slotCount: number;
  readonly byeCount: number;
  readonly competitiveGameCount: number;
  readonly rounds: readonly {
    readonly roundNumber: number;
    readonly matches: readonly BracketMatch[];
  }[];
  readonly participantOrderCount: {
    readonly value: number | null;
    readonly status: "exact-safe-integer" | "exceeds-core-safe-integer";
  };
  readonly randomness: GeneratorReplay;
};
const identifier = { type: "string", minLength: 1, maxLength: 128 } as const;
const slotSchema = {
  type: "object",
  additionalProperties: true,
  anyOf: [
    {
      type: "object",
      additionalProperties: false,
      properties: {
        kind: { type: "string", const: "participant" },
        participantId: identifier,
      },
      required: ["kind", "participantId"],
    },
    {
      type: "object",
      additionalProperties: false,
      properties: {
        kind: { type: "string", const: "winner" },
        matchId: identifier,
      },
      required: ["kind", "matchId"],
    },
    {
      type: "object",
      additionalProperties: false,
      properties: { kind: { type: "string", const: "bye" } },
      required: ["kind"],
    },
  ],
} as const;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    participants: {
      type: "array",
      minItems: 2,
      maxItems: 64,
      items: identifier,
    },
    seed: generatorSeedSchema,
  },
  required: ["participants"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    shuffledParticipants: inputSchema.properties.participants,
    slotCount: { type: "integer", minimum: 2, maximum: 64 },
    byeCount: { type: "integer", minimum: 0, maximum: 31 },
    competitiveGameCount: { type: "integer", minimum: 1, maximum: 63 },
    rounds: {
      type: "array",
      minItems: 1,
      maxItems: 6,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          roundNumber: { type: "integer", minimum: 1, maximum: 6 },
          matches: {
            type: "array",
            minItems: 1,
            maxItems: 32,
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                id: identifier,
                left: slotSchema,
                right: slotSchema,
                automaticWinner: { anyOf: [identifier, { type: "null" }] },
              },
              required: ["id", "left", "right", "automaticWinner"],
            },
          },
        },
        required: ["roundNumber", "matches"],
      },
    },
    participantOrderCount: {
      type: "object",
      additionalProperties: false,
      properties: {
        value: { anyOf: [{ type: "integer", minimum: 1 }, { type: "null" }] },
        status: {
          type: "string",
          enum: ["exact-safe-integer", "exceeds-core-safe-integer"],
        },
      },
      required: ["value", "status"],
    },
    randomness: generatorReplaySchema,
  },
  required: [
    "shuffledParticipants",
    "slotCount",
    "byeCount",
    "competitiveGameCount",
    "rounds",
    "participantOrderCount",
    "randomness",
  ],
} as const;

const isInput = (input: unknown): input is TournamentBracketInput =>
  matchesModelInput(input, inputSchema);
export const calculateTournamentBracket = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<TournamentBracketOutput> => {
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
    const random = createGeneratorRandom(input.seed, context),
      shuffledParticipants = random.shuffle(input.participants);
    const slotCount = 2 ** Math.ceil(Math.log2(input.participants.length)),
      byeCount = slotCount - input.participants.length;
    const entrant = (participantId: string): BracketSlot => ({
      kind: "participant",
      participantId,
    });
    const pairs: [BracketSlot, BracketSlot][] = shuffledParticipants
      .slice(0, byeCount)
      .map((id) => [entrant(id), { kind: "bye" }]);
    const chunked = runChunk({
      values: shuffledParticipants.slice(byeCount),
      size: 2,
    });
    if (!chunked.ok)
      throw new Error(
        "A validated even participant list could not be chunked.",
      );
    for (const pair of chunked.output.chunks.values) {
      if (pair.length !== 2)
        throw new Error("The draw left an unpaired participant.");
      pairs.push([entrant(pair[0]), entrant(pair[1])]);
    }
    const first: BracketMatch[] = random
      .shuffle(pairs)
      .map(([left, right], i) => ({
        id: "r1m" + (i + 1),
        left,
        right,
        automaticWinner:
          left.kind === "participant" && right.kind === "bye"
            ? left.participantId
            : null,
      }));
    const rounds: { roundNumber: number; matches: BracketMatch[] }[] = [
      { roundNumber: 1, matches: first },
    ];
    let previous = first,
      roundNumber = 2;
    while (previous.length > 1) {
      const matches: BracketMatch[] = Array.from(
        { length: previous.length / 2 },
        (_, i) => ({
          id: "r" + roundNumber + "m" + (i + 1),
          left: { kind: "winner", matchId: previous[2 * i].id },
          right: { kind: "winner", matchId: previous[2 * i + 1].id },
          automaticWinner: null,
        }),
      );
      rounds.push({ roundNumber, matches });
      previous = matches;
      roundNumber += 1;
    }
    let value: number | null = null;
    if (input.participants.length <= 18) {
      const counted = runPermutationCount({
        n: input.participants.length,
        k: input.participants.length,
      });
      if (!counted.ok)
        throw new Error(
          "A safe factorial was rejected by the permutation core.",
        );
      value = counted.output.permutations;
    }
    return toolSuccess({
      shuffledParticipants,
      slotCount,
      byeCount,
      competitiveGameCount: input.participants.length - 1,
      rounds,
      participantOrderCount: {
        value,
        status:
          value === null ? "exceeds-core-safe-integer" : "exact-safe-integer",
      },
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const tournamentBracketExample = {
  input: {
    participants: ["Ada", "Grace", "Lin", "Hedy", "Katherine"],
    seed: 42,
  },
  output: {
    shuffledParticipants: ["Ada", "Katherine", "Lin", "Grace", "Hedy"],
    slotCount: 8,
    byeCount: 3,
    competitiveGameCount: 4,
    rounds: [
      {
        roundNumber: 1,
        matches: [
          {
            id: "r1m1",
            left: {
              kind: "participant",
              participantId: "Lin",
            },
            right: {
              kind: "bye",
            },
            automaticWinner: "Lin",
          },
          {
            id: "r1m2",
            left: {
              kind: "participant",
              participantId: "Grace",
            },
            right: {
              kind: "participant",
              participantId: "Hedy",
            },
            automaticWinner: null,
          },
          {
            id: "r1m3",
            left: {
              kind: "participant",
              participantId: "Katherine",
            },
            right: {
              kind: "bye",
            },
            automaticWinner: "Katherine",
          },
          {
            id: "r1m4",
            left: {
              kind: "participant",
              participantId: "Ada",
            },
            right: {
              kind: "bye",
            },
            automaticWinner: "Ada",
          },
        ],
      },
      {
        roundNumber: 2,
        matches: [
          {
            id: "r2m1",
            left: {
              kind: "winner",
              matchId: "r1m1",
            },
            right: {
              kind: "winner",
              matchId: "r1m2",
            },
            automaticWinner: null,
          },
          {
            id: "r2m2",
            left: {
              kind: "winner",
              matchId: "r1m3",
            },
            right: {
              kind: "winner",
              matchId: "r1m4",
            },
            automaticWinner: null,
          },
        ],
      },
      {
        roundNumber: 3,
        matches: [
          {
            id: "r3m1",
            left: {
              kind: "winner",
              matchId: "r2m1",
            },
            right: {
              kind: "winner",
              matchId: "r2m2",
            },
            automaticWinner: null,
          },
        ],
      },
    ],
    participantOrderCount: {
      value: 120,
      status: "exact-safe-integer",
    },
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<TournamentBracketInput, TournamentBracketOutput>;
export const tournamentBracketTool = createModelDefinition<
  TournamentBracketInput,
  TournamentBracketOutput
>({
  id: "random/tournament-bracket",
  title: "Random Single-Elimination Tournament Bracket Generator",
  description:
    "Draw participants into a power-of-two single-elimination bracket with explicit first-round byes, automatic advances and winner references, delegating pair chunking; participant-order counts do not count equivalent bye layouts or establish competitive fairness.",
  inputSchema,
  outputSchema,
  execute: calculateTournamentBracket,
});
export const runTournamentBracket = tournamentBracketTool.execute;
export default tournamentBracketTool;
