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
  nBool,
  nPick,
  nGroups,
  nSum,
  nRun,
  type NSeed,
  type NReplay,
  type ToolExecutionContext,
  type ToolResult,
  type ToolExample,
} from "../m500b-narrative-support.js";
export type SilentSceneConstraintInput = NSeed & {
  readonly objectives: readonly string[];
  readonly locations: readonly string[];
  readonly constraints: readonly string[];
  readonly count: number;
  readonly seconds: number;
  readonly roundSize: number;
};
export type SilentSceneConstraintOutput = NReplay & {
  readonly cards: readonly {
    readonly id: number;
    readonly objective: string;
    readonly location: string;
    readonly constraint: string;
    readonly startSecond: number;
    readonly endSecond: number;
    readonly spokenWordsAllowed: boolean;
  }[];
  readonly rounds: readonly (readonly number[])[];
  readonly totalSeconds: number;
};
export const inputSchema = nInput({
  objectives: nStringList,
  locations: nStringList,
  constraints: nStringList,
  count: nInt(1, 32),
  seconds: nInt(1),
  roundSize: nInt(1, 32),
});
export const outputSchema = nOutput({
  cards: nArray(
    nObject({
      id: nInt(1, 32),
      objective: nText,
      location: nText,
      constraint: nText,
      startSecond: nInt(),
      endSecond: nInt(1),
      spokenWordsAllowed: { ...nBool, const: false },
    }),
    32,
    1,
  ),
  rounds: nArray(nArray(nInt(1, 32), 32, 1), 32, 1),
  totalSeconds: nInt(1),
});
const isInput = (v: unknown): v is SilentSceneConstraintInput =>
  matchesModelInput(v, inputSchema);
export const calculateSilentSceneConstraint = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<SilentSceneConstraintOutput> =>
  nRun(input, inputSchema, isInput, context, (x, r) => {
    const totalSeconds = nSum(
        Array.from({ length: x.count }, () => x.seconds),
        "seconds",
      ),
      cards = Array.from({ length: x.count }, (_, i) => ({
        id: i + 1,
        objective: nPick(x.objectives, r),
        location: nPick(x.locations, r),
        constraint: nPick(x.constraints, r),
        startSecond: i * x.seconds,
        endSecond: (i + 1) * x.seconds,
        spokenWordsAllowed: false,
      }));
    return {
      cards,
      rounds: nGroups(
        cards.map((c) => c.id),
        x.roundSize,
      ),
      totalSeconds,
    };
  });
export const silentSceneConstraintExample = {
  input: {
    objectives: ["Deliver a letter"],
    locations: ["Dock"],
    constraints: ["Use eye contact"],
    count: 2,
    seconds: 30,
    roundSize: 2,
    seed: 42,
  },
  output: {
    cards: [
      {
        id: 1,
        objective: "Deliver a letter",
        location: "Dock",
        constraint: "Use eye contact",
        startSecond: 0,
        endSecond: 30,
        spokenWordsAllowed: false,
      },
      {
        id: 2,
        objective: "Deliver a letter",
        location: "Dock",
        constraint: "Use eye contact",
        startSecond: 30,
        endSecond: 60,
        spokenWordsAllowed: false,
      },
    ],
    rounds: [[1, 2]],
    totalSeconds: 60,
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  SilentSceneConstraintInput,
  SilentSceneConstraintOutput
>;
export const silentSceneConstraintTool = createModelDefinition<
  SilentSceneConstraintInput,
  SilentSceneConstraintOutput
>({
  id: "random/silent-scene-constraint",
  title: "Random Silent Scene Constraint Cards Generator",
  description:
    "Combine supplied objectives, locations, and nonverbal constraints into timed scene cards with explicit forbidden spoken-word rules and chunked rounds.",
  inputSchema,
  outputSchema,
  execute: calculateSilentSceneConstraint,
});
export const runSilentSceneConstraint = silentSceneConstraintTool.execute;
export default silentSceneConstraintTool;
