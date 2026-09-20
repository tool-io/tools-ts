import {
  createModelDefinition,
  matchesModelInput,
  nInput,
  nOutput,
  nArray,
  nObject,
  nId,
  nText,
  nTags,
  nWidth,
  nWrapped,
  nWrap,
  nSample,
  nDistinct,
  nRefs,
  nRun,
  simpleError,
  type NSeed,
  type NReplay,
  type NWrapped,
  type ToolExecutionContext,
  type ToolResult,
  type ToolExample,
} from "../m500b-narrative-support.js";
export type CharacterObjectiveConflictInput = NSeed & {
  readonly characters: readonly string[];
  readonly objectives: readonly {
    readonly id: string;
    readonly text: string;
  }[];
  readonly incompatibilities: readonly {
    readonly left: string;
    readonly right: string;
    readonly tags: readonly string[];
    readonly resolution: string;
  }[];
  readonly wrapWidth: number;
};
export type CharacterObjectiveConflictOutput = NReplay & {
  readonly assignments: readonly {
    readonly characterId: string;
    readonly objectiveId: string;
    readonly objective: NWrapped;
  }[];
  readonly matrix: readonly (readonly boolean[])[];
  readonly conflicts: readonly {
    readonly characters: readonly string[];
    readonly objectives: readonly string[];
    readonly tags: readonly string[];
    readonly resolution: NWrapped;
  }[];
};
export const inputSchema = nInput({
  characters: nArray(nId, 16, 2),
  objectives: nArray(nObject({ id: nId, text: nText }), 16, 2),
  incompatibilities: nArray(
    nObject({ left: nId, right: nId, tags: nTags, resolution: nText }),
    120,
  ),
  wrapWidth: nWidth,
});
export const outputSchema = nOutput({
  assignments: nArray(
    nObject({ characterId: nId, objectiveId: nId, objective: nWrapped }),
    16,
    2,
  ),
  matrix: nArray(nArray({ type: "boolean" }, 16, 2), 16, 2),
  conflicts: nArray(
    nObject({
      characters: nArray(nId, 2, 2),
      objectives: nArray(nId, 2, 2),
      tags: nTags,
      resolution: nWrapped,
    }),
    120,
  ),
});
const isInput = (v: unknown): v is CharacterObjectiveConflictInput =>
  matchesModelInput(v, inputSchema);
export const calculateCharacterObjectiveConflict = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<CharacterObjectiveConflictOutput> =>
  nRun(input, inputSchema, isInput, context, (x, r) => {
    nDistinct(x.characters, "characters");
    const ids = x.objectives.map((o) => o.id);
    nDistinct(ids, "objectives");
    const keys: string[] = [];
    for (const c of x.incompatibilities) {
      nRefs([c.left, c.right], ids, "incompatibilities");
      nDistinct(c.tags, "incompatibilities.tags");
      keys.push([c.left, c.right].sort().join("/"));
    }
    nDistinct(keys, "incompatibilities");
    const chosen = nSample(x.objectives, x.characters.length, r),
      assignments = x.characters.map((characterId, i) => {
        const o = chosen[i];
        if (!o) throw new Error("missing assigned objective");
        return {
          characterId,
          objectiveId: o.id,
          objective: nWrap(o.text, x.wrapWidth),
        };
      });
    const matrix = assignments.map(() => assignments.map(() => false)),
      conflicts: CharacterObjectiveConflictOutput["conflicts"][number][] = [];
    assignments.forEach((a, i) =>
      assignments.forEach((b, j) => {
        if (j <= i) return;
        const c = x.incompatibilities.find(
          (c) =>
            (c.left === a.objectiveId && c.right === b.objectiveId) ||
            (c.right === a.objectiveId && c.left === b.objectiveId),
        );
        if (c) {
          const row = matrix[i],
            other = matrix[j];
          if (!row || !other) throw new Error("missing conflict row");
          row[j] = true;
          other[i] = true;
          conflicts.push({
            characters: [a.characterId, b.characterId],
            objectives: [a.objectiveId, b.objectiveId],
            tags: [...c.tags],
            resolution: nWrap(c.resolution, x.wrapWidth),
          });
        }
      }),
    );
    return { assignments, matrix, conflicts };
  });
export const characterObjectiveConflictExample = {
  input: {
    characters: ["m", "i"],
    objectives: [
      { id: "keep", text: "Keep the map." },
      { id: "share", text: "Share the map." },
    ],
    incompatibilities: [
      {
        left: "keep",
        right: "share",
        tags: ["ownership"],
        resolution: "Make a copy.",
      },
    ],
    wrapWidth: 80,
    seed: 42,
  },
  output: {
    assignments: [
      {
        characterId: "m",
        objectiveId: "share",
        objective: { text: "Share the map.", lineCount: 1 },
      },
      {
        characterId: "i",
        objectiveId: "keep",
        objective: { text: "Keep the map.", lineCount: 1 },
      },
    ],
    matrix: [
      [false, true],
      [true, false],
    ],
    conflicts: [
      {
        characters: ["m", "i"],
        objectives: ["share", "keep"],
        tags: ["ownership"],
        resolution: { text: "Make a copy.", lineCount: 1 },
      },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  CharacterObjectiveConflictInput,
  CharacterObjectiveConflictOutput
>;
export const characterObjectiveConflictTool = createModelDefinition<
  CharacterObjectiveConflictInput,
  CharacterObjectiveConflictOutput
>({
  id: "random/character-objective-conflict",
  title: "Random Character Objective Conflict Matrix Generator",
  description:
    "Assign distinct supplied fictional objectives and construct a symmetric conflict matrix from explicit incompatibility tags and caller-provided resolutions.",
  inputSchema,
  outputSchema,
  execute: calculateCharacterObjectiveConflict,
});
export const runCharacterObjectiveConflict =
  characterObjectiveConflictTool.execute;
export default characterObjectiveConflictTool;
