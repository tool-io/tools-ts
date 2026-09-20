import {
  createModelDefinition,
  matchesModelInput,
  nInput,
  nOutput,
  nArray,
  nObject,
  nId,
  nText,
  nStringList,
  nInt,
  nPick,
  nGroups,
  nDistinct,
  nSum,
  nRun,
  simpleError,
  type NSeed,
  type NReplay,
  type ToolExecutionContext,
  type ToolResult,
  type ToolExample,
} from "../m500b-narrative-support.js";
export type ImprovGenreTransitionInput = NSeed & {
  readonly genres: readonly {
    readonly id: string;
    readonly conventions: readonly string[];
  }[];
  readonly transitionPrompts: readonly string[];
  readonly segmentCount: number;
  readonly segmentSeconds: number;
};
export type ImprovGenreTransitionOutput = NReplay & {
  readonly segments: readonly {
    readonly genreId: string;
    readonly conventions: readonly string[];
    readonly transitionPrompt: string | null;
    readonly startSecond: number;
    readonly endSecond: number;
  }[];
  readonly rounds: readonly (readonly string[])[];
  readonly totalSeconds: number;
};
export const inputSchema = nInput({
  genres: nArray(nObject({ id: nId, conventions: nStringList }), 16, 1),
  transitionPrompts: nStringList,
  segmentCount: nInt(1, 32),
  segmentSeconds: nInt(1),
});
export const outputSchema = nOutput({
  segments: nArray(
    nObject({
      genreId: nId,
      conventions: nStringList,
      transitionPrompt: { anyOf: [nText, { type: "null" }] },
      startSecond: nInt(),
      endSecond: nInt(1),
    }),
    32,
    1,
  ),
  rounds: nArray(nArray(nId, 4, 1), 8, 1),
  totalSeconds: nInt(1),
});
const isInput = (v: unknown): v is ImprovGenreTransitionInput =>
  matchesModelInput(v, inputSchema);
export const calculateImprovGenreTransition = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<ImprovGenreTransitionOutput> =>
  nRun(input, inputSchema, isInput, context, (x, r) => {
    nDistinct(
      x.genres.map((g) => g.id),
      "genres",
    );
    if (x.segmentCount > 1 && x.genres.length < 2)
      return simpleError(
        "genres",
        "Multiple segments need at least two genres to change conventions.",
        "infeasible_genre_transition",
      );
    const totalSeconds = nSum(
      Array.from({ length: x.segmentCount }, () => x.segmentSeconds),
      "segmentSeconds",
    );
    let previous = "";
    const segments = Array.from({ length: x.segmentCount }, (_, i) => {
      const genre = nPick(
        x.genres.filter((g) => g.id !== previous),
        r,
      );
      previous = genre.id;
      return {
        genreId: genre.id,
        conventions: [...genre.conventions],
        transitionPrompt: i ? nPick(x.transitionPrompts, r) : null,
        startSecond: i * x.segmentSeconds,
        endSecond: (i + 1) * x.segmentSeconds,
      };
    });
    return {
      segments,
      rounds: nGroups(
        segments.map((s) => s.genreId),
        4,
      ),
      totalSeconds,
    };
  });
export const improvGenreTransitionExample = {
  input: {
    genres: [
      { id: "noir", conventions: ["Mystery"] },
      { id: "wonder", conventions: ["Curiosity"] },
    ],
    transitionPrompts: ["Turn the scene"],
    segmentCount: 2,
    segmentSeconds: 20,
    seed: 42,
  },
  output: {
    segments: [
      {
        genreId: "wonder",
        conventions: ["Curiosity"],
        transitionPrompt: null,
        startSecond: 0,
        endSecond: 20,
      },
      {
        genreId: "noir",
        conventions: ["Mystery"],
        transitionPrompt: "Turn the scene",
        startSecond: 20,
        endSecond: 40,
      },
    ],
    rounds: [["wonder", "noir"]],
    totalSeconds: 40,
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  ImprovGenreTransitionInput,
  ImprovGenreTransitionOutput
>;
export const improvGenreTransitionTool = createModelDefinition<
  ImprovGenreTransitionInput,
  ImprovGenreTransitionOutput
>({
  id: "random/improv-genre-transition",
  title: "Random Improv Genre Transition Cards Generator",
  description:
    "Schedule supplied genre conventions without adjacent repeats and attach caller-reviewed transition prompts to timed segments; no script is generated.",
  inputSchema,
  outputSchema,
  execute: calculateImprovGenreTransition,
});
export const runImprovGenreTransition = improvGenreTransitionTool.execute;
export default improvGenreTransitionTool;
