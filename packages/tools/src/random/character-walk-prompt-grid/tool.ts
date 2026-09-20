import {
  createModelDefinition,
  matchesModelInput,
  nInput,
  nOutput,
  nArray,
  nObject,
  nText,
  nStringList,
  nInt,
  nSample,
  nGroups,
  nDistinct,
  nWork,
  nRun,
  type NSeed,
  type NReplay,
  type ToolExecutionContext,
  type ToolResult,
  type ToolExample,
} from "../m500b-narrative-support.js";
export type CharacterWalkPromptGridInput = NSeed & {
  readonly movementAdjectives: readonly string[];
  readonly characterGoals: readonly string[];
  readonly rows: number;
  readonly columns: number;
};
type WalkCell = {
  readonly row: number;
  readonly column: number;
  readonly movement: string;
  readonly goal: string;
};
export type CharacterWalkPromptGridOutput = NReplay & {
  readonly grid: readonly (readonly WalkCell[])[];
  readonly callerReviewRequired: boolean;
  readonly policy: string;
};
export const inputSchema = nInput({
  movementAdjectives: nStringList,
  characterGoals: nStringList,
  rows: nInt(1, 16),
  columns: nInt(1, 16),
});
export const outputSchema = nOutput({
  grid: nArray(
    nArray(
      nObject({
        row: nInt(1, 16),
        column: nInt(1, 16),
        movement: nText,
        goal: nText,
      }),
      16,
      1,
    ),
    16,
    1,
  ),
  callerReviewRequired: { type: "boolean", const: true },
  policy: {
    type: "string",
    const:
      "caller-approved adjectives and fictional goals only; no choreography generated",
  },
});
const isInput = (v: unknown): v is CharacterWalkPromptGridInput =>
  matchesModelInput(v, inputSchema);
export const calculateCharacterWalkPromptGrid = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<CharacterWalkPromptGridOutput> =>
  nRun(input, inputSchema, isInput, context, (x, r) => {
    nDistinct(x.movementAdjectives, "movementAdjectives");
    nDistinct(x.characterGoals, "characterGoals");
    nWork(x.rows * x.columns, "rows");
    const pairs = x.movementAdjectives.flatMap((movement) =>
        x.characterGoals.map((goal) => ({ movement, goal })),
      ),
      cells = nSample(pairs, x.rows * x.columns, r).map((pair, i) => ({
        ...pair,
        row: Math.floor(i / x.columns) + 1,
        column: (i % x.columns) + 1,
      }));
    return {
      grid: nGroups(cells, x.columns),
      callerReviewRequired: true,
      policy:
        "caller-approved adjectives and fictional goals only; no choreography generated",
    };
  });
export const characterWalkPromptGridExample = {
  input: {
    movementAdjectives: ["slow", "steady"],
    characterGoals: ["seek", "rest"],
    rows: 1,
    columns: 2,
    seed: 42,
  },
  output: {
    grid: [
      [
        { movement: "steady", goal: "seek", row: 1, column: 1 },
        { movement: "slow", goal: "rest", row: 1, column: 2 },
      ],
    ],
    callerReviewRequired: true,
    policy:
      "caller-approved adjectives and fictional goals only; no choreography generated",
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  CharacterWalkPromptGridInput,
  CharacterWalkPromptGridOutput
>;
export const characterWalkPromptGridTool = createModelDefinition<
  CharacterWalkPromptGridInput,
  CharacterWalkPromptGridOutput
>({
  id: "random/character-walk-prompt-grid",
  title: "Random Character Walk Prompt Grid Generator",
  description:
    "Sample distinct combinations of caller-approved movement adjectives and fictional goals into a bounded prompt board; callers review physical suitability.",
  inputSchema,
  outputSchema,
  execute: calculateCharacterWalkPromptGrid,
});
export const runCharacterWalkPromptGrid = characterWalkPromptGridTool.execute;
export default characterWalkPromptGridTool;
