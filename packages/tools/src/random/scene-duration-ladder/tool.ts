import {
  createModelDefinition,
  matchesModelInput,
  nInput,
  nOutput,
  nArray,
  nObject,
  nId,
  nText,
  nInt,
  nSample,
  nGroups,
  nDistinct,
  nRun,
  simpleError,
  type NSeed,
  type NReplay,
  type ToolExecutionContext,
  type ToolResult,
  type ToolExample,
} from "../m500b-narrative-support.js";
export type SceneDurationLadderInput = NSeed & {
  readonly scenes: readonly { readonly id: string; readonly brief: string }[];
  readonly count: number;
  readonly baseSeconds: number;
  readonly incrementSeconds: number;
  readonly direction: "increasing" | "decreasing";
  readonly sessionLimitSeconds: number;
};
export type SceneDurationLadderOutput = NReplay & {
  readonly scenes: readonly {
    readonly id: string;
    readonly brief: string;
    readonly seconds: number;
    readonly startSecond: number;
    readonly endSecond: number;
    readonly timingLabel: string;
  }[];
  readonly rounds: readonly (readonly string[])[];
  readonly totalSeconds: number;
};
export const inputSchema = nInput({
  scenes: nArray(nObject({ id: nId, brief: nText }), 32, 1),
  count: nInt(1, 32),
  baseSeconds: nInt(1),
  incrementSeconds: nInt(1),
  direction: { type: "string", enum: ["increasing", "decreasing"] },
  sessionLimitSeconds: nInt(1),
});
export const outputSchema = nOutput({
  scenes: nArray(
    nObject({
      id: nId,
      brief: nText,
      seconds: nInt(1),
      startSecond: nInt(),
      endSecond: nInt(1),
      timingLabel: { type: "string" },
    }),
    32,
    1,
  ),
  rounds: nArray(nArray(nId, 2, 1), 16, 1),
  totalSeconds: nInt(1),
});
const isInput = (v: unknown): v is SceneDurationLadderInput =>
  matchesModelInput(v, inputSchema);
export const calculateSceneDurationLadder = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<SceneDurationLadderOutput> =>
  nRun(input, inputSchema, isInput, context, (x, r) => {
    nDistinct(
      x.scenes.map((s) => s.id),
      "scenes",
    );
    const base = BigInt(x.baseSeconds),
      step = BigInt(x.incrementSeconds),
      n = BigInt(x.count),
      sum = n * base + (n * (n - 1n) * step) / 2n;
    if (sum > BigInt(Number.MAX_SAFE_INTEGER))
      return simpleError(
        "incrementSeconds",
        "The complete duration ladder exceeds safe integer seconds.",
        "unsafe_aggregate",
      );
    if (sum > BigInt(x.sessionLimitSeconds))
      return simpleError(
        "sessionLimitSeconds",
        "The full duration ladder exceeds the session limit.",
        "session_limit_exceeded",
      );
    const durations = Array.from({ length: x.count }, (_, i) =>
      Number(base + BigInt(i) * step),
    );
    if (x.direction === "decreasing") durations.reverse();
    let clock = 0;
    const scenes = nSample(x.scenes, x.count, r).map((s, i) => {
      const seconds = durations[i];
      if (seconds === undefined) throw new Error("missing duration");
      const startSecond = clock;
      clock += seconds;
      return {
        ...s,
        seconds,
        startSecond,
        endSecond: clock,
        timingLabel: `${seconds} seconds`,
      };
    });
    return {
      scenes,
      rounds: nGroups(
        scenes.map((s) => s.id),
        2,
      ),
      totalSeconds: Number(sum),
    };
  });
export const sceneDurationLadderExample = {
  input: {
    scenes: [
      { id: "arrive", brief: "A ship arrives" },
      { id: "leave", brief: "A ship leaves" },
    ],
    count: 2,
    baseSeconds: 15,
    incrementSeconds: 10,
    direction: "decreasing",
    sessionLimitSeconds: 40,
    seed: 42,
  },
  output: {
    scenes: [
      {
        id: "leave",
        brief: "A ship leaves",
        seconds: 25,
        startSecond: 0,
        endSecond: 25,
        timingLabel: "25 seconds",
      },
      {
        id: "arrive",
        brief: "A ship arrives",
        seconds: 15,
        startSecond: 25,
        endSecond: 40,
        timingLabel: "15 seconds",
      },
    ],
    rounds: [["leave", "arrive"]],
    totalSeconds: 40,
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<SceneDurationLadderInput, SceneDurationLadderOutput>;
export const sceneDurationLadderTool = createModelDefinition<
  SceneDurationLadderInput,
  SceneDurationLadderOutput
>({
  id: "random/scene-duration-ladder",
  title: "Random Scene Duration Ladder Generator",
  description:
    "Assign supplied distinct scene briefs a strictly increasing or decreasing duration ladder with exact cumulative timing and a preflighted session limit.",
  inputSchema,
  outputSchema,
  execute: calculateSceneDurationLadder,
});
export const runSceneDurationLadder = sceneDurationLadderTool.execute;
export default sceneDurationLadderTool;
