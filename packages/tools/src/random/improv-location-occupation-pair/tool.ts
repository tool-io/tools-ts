import {
  createModelDefinition,
  matchesModelInput,
  nInput,
  nOutput,
  nArray,
  nObject,
  nId,
  nTags,
  nInt,
  nPick,
  nSample,
  nGroups,
  nDistinct,
  nRefs,
  nRun,
  simpleError,
  type NSeed,
  type NReplay,
  type ToolExecutionContext,
  type ToolResult,
  type ToolExample,
} from "../m500b-narrative-support.js";
export type ImprovLocationOccupationPairInput = NSeed & {
  readonly locations: readonly {
    readonly id: string;
    readonly toneTags: readonly string[];
  }[];
  readonly occupations: readonly {
    readonly id: string;
    readonly toneTags: readonly string[];
    readonly allowedLocationIds: readonly string[];
  }[];
  readonly tone: string;
  readonly count: number;
  readonly repetition: "allow" | "forbid";
};
export type ImprovLocationOccupationPairOutput = NReplay & {
  readonly cards: readonly {
    readonly id: number;
    readonly locationId: string;
    readonly occupationId: string;
    readonly tone: string;
  }[];
  readonly pairUsage: readonly {
    readonly locationId: string;
    readonly occupationId: string;
    readonly count: number;
  }[];
  readonly rounds: readonly (readonly number[])[];
};
export const inputSchema = nInput({
  locations: nArray(nObject({ id: nId, toneTags: nTags }), 16, 1),
  occupations: nArray(
    nObject({ id: nId, toneTags: nTags, allowedLocationIds: nArray(nId, 16) }),
    16,
    1,
  ),
  tone: nId,
  count: nInt(1, 32),
  repetition: { type: "string", enum: ["allow", "forbid"] },
});
export const outputSchema = nOutput({
  cards: nArray(
    nObject({ id: nInt(1, 32), locationId: nId, occupationId: nId, tone: nId }),
    32,
    1,
  ),
  pairUsage: nArray(
    nObject({ locationId: nId, occupationId: nId, count: nInt(1, 32) }),
    32,
    1,
  ),
  rounds: nArray(nArray(nInt(1, 32), 2, 1), 16, 1),
});
const isInput = (v: unknown): v is ImprovLocationOccupationPairInput =>
  matchesModelInput(v, inputSchema);
export const calculateImprovLocationOccupationPair = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<ImprovLocationOccupationPairOutput> =>
  nRun(input, inputSchema, isInput, context, (x, r) => {
    const ids = x.locations.map((l) => l.id);
    nDistinct(ids, "locations");
    nDistinct(
      x.occupations.map((o) => o.id),
      "occupations",
    );
    for (const l of x.locations) nDistinct(l.toneTags, "locations.toneTags");
    for (const o of x.occupations) {
      nDistinct(o.toneTags, "occupations.toneTags");
      nRefs(o.allowedLocationIds, ids, "occupations.allowedLocationIds");
    }
    const pairs = x.locations
      .filter((l) => l.toneTags.includes(x.tone))
      .flatMap((l) =>
        x.occupations
          .filter(
            (o) =>
              o.toneTags.includes(x.tone) &&
              o.allowedLocationIds.includes(l.id),
          )
          .map((o) => ({ locationId: l.id, occupationId: o.id })),
      );
    if (!pairs.length)
      return simpleError(
        "tone",
        "No supplied pairing meets tone and location compatibility.",
        "infeasible_pairing",
      );
    const chosen =
        x.repetition === "forbid"
          ? nSample(pairs, x.count, r)
          : Array.from({ length: x.count }, () => nPick(pairs, r)),
      cards = chosen.map((p, i) => ({ ...p, id: i + 1, tone: x.tone }));
    return {
      cards,
      pairUsage: pairs
        .filter((p) => chosen.includes(p))
        .map((p) => ({ ...p, count: chosen.filter((c) => c === p).length })),
      rounds: nGroups(
        cards.map((c) => c.id),
        2,
      ),
    };
  });
export const improvLocationOccupationPairExample = {
  input: {
    locations: [{ id: "dock", toneTags: ["playful"] }],
    occupations: [
      { id: "porter", toneTags: ["playful"], allowedLocationIds: ["dock"] },
    ],
    tone: "playful",
    count: 2,
    repetition: "allow",
    seed: 42,
  },
  output: {
    cards: [
      { locationId: "dock", occupationId: "porter", id: 1, tone: "playful" },
      { locationId: "dock", occupationId: "porter", id: 2, tone: "playful" },
    ],
    pairUsage: [{ locationId: "dock", occupationId: "porter", count: 2 }],
    rounds: [[1, 2]],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  ImprovLocationOccupationPairInput,
  ImprovLocationOccupationPairOutput
>;
export const improvLocationOccupationPairTool = createModelDefinition<
  ImprovLocationOccupationPairInput,
  ImprovLocationOccupationPairOutput
>({
  id: "random/improv-location-occupation-pair",
  title: "Random Improv Location and Occupation Pairings Generator",
  description:
    "Draw compatible supplied fictional locations and occupations with explicit tone filtering, pair repetition policy, and occurrence counts.",
  inputSchema,
  outputSchema,
  execute: calculateImprovLocationOccupationPair,
});
export const runImprovLocationOccupationPair =
  improvLocationOccupationPairTool.execute;
export default improvLocationOccupationPairTool;
