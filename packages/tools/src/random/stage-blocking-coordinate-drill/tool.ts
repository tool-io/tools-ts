import {
  createModelDefinition,
  matchesModelInput,
  nInput,
  nOutput,
  nArray,
  nObject,
  nId,
  nInt,
  nPick,
  nGroups,
  nDistinct,
  nSum,
  nWork,
  nRun,
  simpleError,
  type NSeed,
  type NReplay,
  type ToolExecutionContext,
  type ToolResult,
  type ToolExample,
} from "../m500b-narrative-support.js";
export type StageBlockingCoordinateDrillInput = NSeed & {
  readonly performers: readonly string[];
  readonly marks: readonly {
    readonly id: string;
    readonly x: number;
    readonly y: number;
    readonly capacity: number;
  }[];
  readonly cueCount: number;
};
export type StageBlockingCoordinateDrillOutput = NReplay & {
  readonly cues: readonly {
    readonly cue: number;
    readonly assignments: readonly {
      readonly performerId: string;
      readonly fromMarkId: string | null;
      readonly toMarkId: string;
      readonly x: number;
      readonly y: number;
    }[];
    readonly occupancy: readonly {
      readonly markId: string;
      readonly count: number;
    }[];
  }[];
  readonly cueGroups: readonly (readonly number[])[];
  readonly motionPlanning: string;
};
export const inputSchema = nInput({
  performers: nArray(nId, 16, 1),
  marks: nArray(
    nObject({
      id: nId,
      x: { type: "number" },
      y: { type: "number" },
      capacity: nInt(0, 16),
    }),
    16,
    1,
  ),
  cueCount: nInt(1, 32),
});
export const outputSchema = nOutput({
  cues: nArray(
    nObject({
      cue: nInt(1, 32),
      assignments: nArray(
        nObject({
          performerId: nId,
          fromMarkId: { anyOf: [nId, { type: "null" }] },
          toMarkId: nId,
          x: { type: "number" },
          y: { type: "number" },
        }),
        16,
        1,
      ),
      occupancy: nArray(nObject({ markId: nId, count: nInt(0, 16) }), 16, 1),
    }),
    32,
    1,
  ),
  cueGroups: nArray(nArray(nInt(1, 32), 4, 1), 8, 1),
  motionPlanning: {
    type: "string",
    const:
      "simultaneous mark occupancy only; paths and physical suitability are caller-reviewed",
  },
});
const isInput = (v: unknown): v is StageBlockingCoordinateDrillInput =>
  matchesModelInput(v, inputSchema);
export const calculateStageBlockingCoordinateDrill = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<StageBlockingCoordinateDrillOutput> =>
  nRun(input, inputSchema, isInput, context, (x, r) => {
    nDistinct(x.performers, "performers");
    nDistinct(
      x.marks.map((m) => m.id),
      "marks",
    );
    nWork(x.performers.length * x.cueCount, "cueCount");
    if (
      nSum(
        x.marks.map((m) => m.capacity),
        "marks.capacity",
      ) < x.performers.length
    )
      return simpleError(
        "marks",
        "Approved mark capacities cannot fit all performers.",
        "infeasible_capacity",
      );
    const previous = new Map<string, string>(),
      cues = Array.from({ length: x.cueCount }, (_, i) => {
        const used = new Map<string, number>(),
          assignments = x.performers.map((performerId) => {
            const mark = nPick(
                x.marks.filter((m) => (used.get(m.id) ?? 0) < m.capacity),
                r,
              ),
              fromMarkId = previous.get(performerId) ?? null;
            used.set(mark.id, (used.get(mark.id) ?? 0) + 1);
            previous.set(performerId, mark.id);
            return {
              performerId,
              fromMarkId,
              toMarkId: mark.id,
              x: mark.x || 0,
              y: mark.y || 0,
            };
          });
        return {
          cue: i + 1,
          assignments,
          occupancy: x.marks.map((m) => ({
            markId: m.id,
            count: used.get(m.id) ?? 0,
          })),
        };
      });
    return {
      cues,
      cueGroups: nGroups(
        cues.map((c) => c.cue),
        4,
      ),
      motionPlanning:
        "simultaneous mark occupancy only; paths and physical suitability are caller-reviewed",
    };
  });
export const stageBlockingCoordinateDrillExample = {
  input: {
    performers: ["a", "b"],
    marks: [
      { id: "l", x: -2, y: 0, capacity: 1 },
      { id: "r", x: 2, y: 0, capacity: 1 },
    ],
    cueCount: 2,
    seed: 42,
  },
  output: {
    cues: [
      {
        cue: 1,
        assignments: [
          { performerId: "a", fromMarkId: null, toMarkId: "r", x: 2, y: 0 },
          { performerId: "b", fromMarkId: null, toMarkId: "l", x: -2, y: 0 },
        ],
        occupancy: [
          { markId: "l", count: 1 },
          { markId: "r", count: 1 },
        ],
      },
      {
        cue: 2,
        assignments: [
          { performerId: "a", fromMarkId: "r", toMarkId: "r", x: 2, y: 0 },
          { performerId: "b", fromMarkId: "l", toMarkId: "l", x: -2, y: 0 },
        ],
        occupancy: [
          { markId: "l", count: 1 },
          { markId: "r", count: 1 },
        ],
      },
    ],
    cueGroups: [[1, 2]],
    motionPlanning:
      "simultaneous mark occupancy only; paths and physical suitability are caller-reviewed",
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  StageBlockingCoordinateDrillInput,
  StageBlockingCoordinateDrillOutput
>;
export const stageBlockingCoordinateDrillTool = createModelDefinition<
  StageBlockingCoordinateDrillInput,
  StageBlockingCoordinateDrillOutput
>({
  id: "random/stage-blocking-coordinate-drill",
  title: "Random Stage Blocking Coordinate Drill Generator",
  description:
    "Draw simultaneous positions from caller-approved stage marks under capacity limits and retain from/to cue traces; repeated holds are allowed and paths are not collision planned.",
  inputSchema,
  outputSchema,
  execute: calculateStageBlockingCoordinateDrill,
});
export const runStageBlockingCoordinateDrill =
  stageBlockingCoordinateDrillTool.execute;
export default stageBlockingCoordinateDrillTool;
