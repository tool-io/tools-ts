import {
  createModelDefinition,
  matchesModelInput,
  nInput,
  nOutput,
  nArray,
  nObject,
  nId,
  nInt,
  nSample,
  nGroups,
  nDistinct,
  nRefs,
  nWork,
  nRun,
  simpleError,
  type NSeed,
  type NReplay,
  type ToolExecutionContext,
  type ToolResult,
  type ToolExample,
} from "../m500b-narrative-support.js";
export type CharacterExitEntryCuesInput = NSeed & {
  readonly cast: readonly {
    readonly roleId: string;
    readonly performerId: string;
  }[];
  readonly scenes: readonly {
    readonly id: string;
    readonly requiredRoleIds: readonly string[];
  }[];
  readonly maximumSimultaneousPerformers: number;
};
export type CharacterExitEntryCuesOutput = NReplay & {
  readonly scenes: readonly {
    readonly sceneId: string;
    readonly before: readonly string[];
    readonly cues: readonly {
      readonly kind: "exit" | "enter";
      readonly roleId: string;
      readonly performerId: string;
      readonly presentAfter: readonly string[];
    }[];
    readonly after: readonly string[];
  }[];
  readonly finalPresence: readonly string[];
  readonly rehearsalGroups: readonly (readonly string[])[];
};
export const inputSchema = nInput({
  cast: nArray(nObject({ roleId: nId, performerId: nId }), 32, 1),
  scenes: nArray(nObject({ id: nId, requiredRoleIds: nArray(nId, 32) }), 32, 1),
  maximumSimultaneousPerformers: nInt(1, 32),
});
export const outputSchema = nOutput({
  scenes: nArray(
    nObject({
      sceneId: nId,
      before: nArray(nId, 32),
      cues: nArray(
        nObject({
          kind: { type: "string", enum: ["exit", "enter"] },
          roleId: nId,
          performerId: nId,
          presentAfter: nArray(nId, 32),
        }),
        64,
      ),
      after: nArray(nId, 32),
    }),
    32,
    1,
  ),
  finalPresence: nArray(nId, 32),
  rehearsalGroups: nArray(nArray(nId, 4, 1), 8, 1),
});
const isInput = (v: unknown): v is CharacterExitEntryCuesInput =>
  matchesModelInput(v, inputSchema);
export const calculateCharacterExitEntryCues = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<CharacterExitEntryCuesOutput> =>
  nRun(input, inputSchema, isInput, context, (x, r) => {
    const ids = x.cast.map((c) => c.roleId);
    nDistinct(ids, "cast");
    nDistinct(
      x.scenes.map((s) => s.id),
      "scenes",
    );
    let previous: readonly string[] = [],
      cueCount = 0;
    for (const s of x.scenes) {
      nRefs(s.requiredRoleIds, ids, "scenes.requiredRoleIds");
      const actors = s.requiredRoleIds.map((id) => {
        const c = x.cast.find((c) => c.roleId === id);
        if (!c) throw new Error("missing cast");
        return c.performerId;
      });
      if (new Set(actors).size !== actors.length)
        return simpleError(
          "scenes",
          "A performer cannot play simultaneous required roles.",
          "simultaneous_role_conflict",
        );
      if (actors.length > x.maximumSimultaneousPerformers)
        return simpleError(
          "maximumSimultaneousPerformers",
          "A scene exceeds the simultaneous performer limit.",
          "infeasible_capacity",
        );
      cueCount +=
        previous.filter((id) => !s.requiredRoleIds.includes(id)).length +
        s.requiredRoleIds.filter((id) => !previous.includes(id)).length;
      previous = s.requiredRoleIds;
    }
    nWork(cueCount, "scenes");
    let present: string[] = [];
    const scenes = x.scenes.map((s) => {
      const before = [...present],
        cues: CharacterExitEntryCuesOutput["scenes"][number]["cues"][number][] =
          [];
      for (const kind of ["exit", "enter"] as const) {
        const roles =
          kind === "exit"
            ? present.filter((id) => !s.requiredRoleIds.includes(id))
            : s.requiredRoleIds.filter((id) => !present.includes(id));
        for (const roleId of nSample(roles, roles.length, r)) {
          const c = x.cast.find((c) => c.roleId === roleId);
          if (!c) throw new Error("missing cast");
          present =
            kind === "exit"
              ? present.filter((id) => id !== roleId)
              : [...present, roleId];
          cues.push({
            kind,
            roleId,
            performerId: c.performerId,
            presentAfter: [...present],
          });
        }
      }
      return { sceneId: s.id, before, cues, after: [...present] };
    });
    return {
      scenes,
      finalPresence: [...present],
      rehearsalGroups: nGroups(
        x.scenes.map((s) => s.id),
        4,
      ),
    };
  });
export const characterExitEntryCuesExample = {
  input: {
    cast: [
      { roleId: "m", performerId: "a" },
      { roleId: "i", performerId: "b" },
    ],
    scenes: [
      { id: "s1", requiredRoleIds: ["m"] },
      { id: "s2", requiredRoleIds: ["i"] },
    ],
    maximumSimultaneousPerformers: 1,
    seed: 42,
  },
  output: {
    scenes: [
      {
        sceneId: "s1",
        before: [],
        cues: [
          { kind: "enter", roleId: "m", performerId: "a", presentAfter: ["m"] },
        ],
        after: ["m"],
      },
      {
        sceneId: "s2",
        before: ["m"],
        cues: [
          { kind: "exit", roleId: "m", performerId: "a", presentAfter: [] },
          { kind: "enter", roleId: "i", performerId: "b", presentAfter: ["i"] },
        ],
        after: ["i"],
      },
    ],
    finalPresence: ["i"],
    rehearsalGroups: [["s1", "s2"]],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  CharacterExitEntryCuesInput,
  CharacterExitEntryCuesOutput
>;
export const characterExitEntryCuesTool = createModelDefinition<
  CharacterExitEntryCuesInput,
  CharacterExitEntryCuesOutput
>({
  id: "random/character-exit-entry-cues",
  title: "Random Character Entry and Exit Cue Plan Generator",
  description:
    "Build fictional cast-presence traces with exits before entries, role-doubling checks, simultaneous performer limits, and complete cue ledgers.",
  inputSchema,
  outputSchema,
  execute: calculateCharacterExitEntryCues,
});
export const runCharacterExitEntryCues = characterExitEntryCuesTool.execute;
export default characterExitEntryCuesTool;
