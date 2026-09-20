import {
  createModelDefinition,
  matchesModelInput,
  nInput,
  nOutput,
  nArray,
  nObject,
  nText,
  nId,
  nTags,
  nWidth,
  nWrapped,
  nWrap,
  nSample,
  nDistinct,
  nRefs,
  nTick,
  nRun,
  simpleError,
  type NSeed,
  type NReplay,
  type NWrapped,
  type ToolExecutionContext,
  type ToolResult,
  type ToolExample,
} from "../m500b-narrative-support.js";
export type CharacterSecretRevealPlanInput = NSeed & {
  readonly characters: readonly {
    readonly id: string;
    readonly known: readonly string[];
  }[];
  readonly secrets: readonly {
    readonly id: string;
    readonly text: string;
    readonly requires: readonly string[];
  }[];
  readonly beats: readonly {
    readonly id: string;
    readonly discovererIds: readonly string[];
  }[];
  readonly wrapWidth: number;
};
type Knowledge = {
  readonly characterId: string;
  readonly secrets: readonly string[];
};
type Reveal = {
  readonly beatId: string;
  readonly discovererId: string;
  readonly secretId: string;
  readonly body: NWrapped;
  readonly knownBefore: readonly string[];
  readonly knownAfter: readonly string[];
};
export type CharacterSecretRevealPlanOutput = NReplay & {
  readonly reveals: readonly Reveal[];
  readonly knowledge: readonly Knowledge[];
};
export const inputSchema = nInput({
  characters: nArray(nObject({ id: nId, known: nTags }), 16, 1),
  secrets: nArray(nObject({ id: nId, text: nText, requires: nTags }), 16, 1),
  beats: nArray(nObject({ id: nId, discovererIds: nArray(nId, 16, 1) }), 32, 1),
  wrapWidth: nWidth,
});
export const outputSchema = nOutput({
  reveals: nArray(
    nObject({
      beatId: nId,
      discovererId: nId,
      secretId: nId,
      body: nWrapped,
      knownBefore: nTags,
      knownAfter: nTags,
    }),
    32,
    1,
  ),
  knowledge: nArray(nObject({ characterId: nId, secrets: nTags }), 16, 1),
});
const isInput = (v: unknown): v is CharacterSecretRevealPlanInput =>
  matchesModelInput(v, inputSchema);
export const calculateCharacterSecretRevealPlan = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<CharacterSecretRevealPlanOutput> =>
  nRun(input, inputSchema, isInput, context, (x, r) => {
    const people = x.characters.map((c) => c.id),
      ids = x.secrets.map((s) => s.id);
    nDistinct(people, "characters");
    nDistinct(ids, "secrets");
    nDistinct(
      x.beats.map((b) => b.id),
      "beats",
    );
    for (const c of x.characters) nRefs(c.known, ids, "characters.known");
    for (const s of x.secrets) nRefs(s.requires, ids, "secrets.requires");
    for (const b of x.beats)
      nRefs(b.discovererIds, people, "beats.discovererIds");
    const known = new Map(x.characters.map((c) => [c.id, [...c.known]])),
      reveals: Reveal[] = [],
      tick = nTick();
    const search = (): boolean => {
      tick();
      const beat = x.beats[reveals.length];
      if (!beat) return true;
      const choices = beat.discovererIds.flatMap((discovererId) =>
        x.secrets
          .filter((s) => {
            const k = known.get(discovererId) ?? [];
            return (
              !k.includes(s.id) && s.requires.every((id) => k.includes(id))
            );
          })
          .map((secret) => ({ discovererId, secret })),
      );
      for (const choice of nSample(choices, choices.length, r)) {
        const before = [...(known.get(choice.discovererId) ?? [])],
          after = [...before, choice.secret.id];
        known.set(choice.discovererId, after);
        reveals.push({
          beatId: beat.id,
          discovererId: choice.discovererId,
          secretId: choice.secret.id,
          body: nWrap(choice.secret.text, x.wrapWidth),
          knownBefore: before,
          knownAfter: after,
        });
        if (search()) return true;
        reveals.pop();
        known.set(choice.discovererId, before);
      }
      return false;
    };
    if (!search())
      return simpleError(
        "beats",
        "No discovery plan satisfies prerequisite knowledge.",
        "infeasible_knowledge",
      );
    return {
      reveals,
      knowledge: x.characters.map((c) => ({
        characterId: c.id,
        secrets: [...(known.get(c.id) ?? [])],
      })),
    };
  });
export const characterSecretRevealPlanExample = {
  input: {
    characters: [
      { id: "m", known: ["key"] },
      { id: "i", known: [] },
    ],
    secrets: [
      { id: "key", text: "The key is brass.", requires: [] },
      { id: "vault", text: "The vault is below.", requires: ["key"] },
    ],
    beats: [
      { id: "b1", discovererIds: ["i"] },
      { id: "b2", discovererIds: ["i"] },
    ],
    wrapWidth: 80,
    seed: 42,
  },
  output: {
    reveals: [
      {
        beatId: "b1",
        discovererId: "i",
        secretId: "key",
        body: { text: "The key is brass.", lineCount: 1 },
        knownBefore: [],
        knownAfter: ["key"],
      },
      {
        beatId: "b2",
        discovererId: "i",
        secretId: "vault",
        body: { text: "The vault is below.", lineCount: 1 },
        knownBefore: ["key"],
        knownAfter: ["key", "vault"],
      },
    ],
    knowledge: [
      { characterId: "m", secrets: ["key"] },
      { characterId: "i", secrets: ["key", "vault"] },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  CharacterSecretRevealPlanInput,
  CharacterSecretRevealPlanOutput
>;
export const characterSecretRevealPlanTool = createModelDefinition<
  CharacterSecretRevealPlanInput,
  CharacterSecretRevealPlanOutput
>({
  id: "random/character-secret-reveal-plan",
  title: "Random Character Secret Reveal Plan Generator",
  description:
    "Construct supplied fictional secret discoveries with prerequisite knowledge, eligible discoverers, bounded backtracking, and a complete per-character reveal ledger.",
  inputSchema,
  outputSchema,
  execute: calculateCharacterSecretRevealPlan,
});
export const runCharacterSecretRevealPlan =
  characterSecretRevealPlanTool.execute;
export default characterSecretRevealPlanTool;
