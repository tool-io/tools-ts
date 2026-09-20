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
  nPick,
  nSample,
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
export type ImprovStatusReversalInput = NSeed & {
  readonly roles: readonly string[];
  readonly cuePairs: readonly {
    readonly id: string;
    readonly high: string;
    readonly low: string;
  }[];
  readonly sceneCount: number;
  readonly segmentSeconds: number;
};
type StatusSegment = {
  readonly startSecond: number;
  readonly endSecond: number;
  readonly highRole: string;
  readonly lowRole: string;
  readonly highCue: string;
  readonly lowCue: string;
};
export type ImprovStatusReversalOutput = NReplay & {
  readonly scenes: readonly {
    readonly id: number;
    readonly cuePairId: string;
    readonly segments: readonly StatusSegment[];
  }[];
  readonly rounds: readonly (readonly number[])[];
  readonly totalSeconds: number;
};
const segment = nObject({
  startSecond: nInt(),
  endSecond: nInt(),
  highRole: nId,
  lowRole: nId,
  highCue: nText,
  lowCue: nText,
});
export const inputSchema = nInput({
  roles: nArray(nId, 16, 2),
  cuePairs: nArray(nObject({ id: nId, high: nText, low: nText }), 16, 1),
  sceneCount: nInt(1, 32),
  segmentSeconds: nInt(1),
});
export const outputSchema = nOutput({
  scenes: nArray(
    nObject({
      id: nInt(1, 32),
      cuePairId: nId,
      segments: nArray(segment, 2, 2),
    }),
    32,
    1,
  ),
  rounds: nArray(nArray(nInt(1, 32), 2, 1), 16, 1),
  totalSeconds: nInt(1),
});
const isInput = (v: unknown): v is ImprovStatusReversalInput =>
  matchesModelInput(v, inputSchema);
export const calculateImprovStatusReversal = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<ImprovStatusReversalOutput> =>
  nRun(input, inputSchema, isInput, context, (x, r) => {
    nDistinct(x.roles, "roles");
    nDistinct(
      x.cuePairs.map((c) => c.id),
      "cuePairs",
    );
    if (x.cuePairs.some((c) => c.high === c.low))
      return simpleError(
        "cuePairs",
        "High and low cues must differ.",
        "identical_status_cues",
      );
    const totalSeconds = nSum(
      Array.from({ length: 2 * x.sceneCount }, () => x.segmentSeconds),
      "segmentSeconds",
    );
    const scenes = Array.from({ length: x.sceneCount }, (_, i) => {
      const roles = nSample(x.roles, 2, r),
        highRole = roles[0],
        lowRole = roles[1];
      if (highRole === undefined || lowRole === undefined)
        throw new Error("missing roles");
      const cue = nPick(x.cuePairs, r),
        start = i * 2 * x.segmentSeconds,
        mid = start + x.segmentSeconds;
      return {
        id: i + 1,
        cuePairId: cue.id,
        segments: [
          {
            startSecond: start,
            endSecond: mid,
            highRole,
            lowRole,
            highCue: cue.high,
            lowCue: cue.low,
          },
          {
            startSecond: mid,
            endSecond: mid + x.segmentSeconds,
            highRole: lowRole,
            lowRole: highRole,
            highCue: cue.high,
            lowCue: cue.low,
          },
        ],
      };
    });
    return {
      scenes,
      rounds: nGroups(
        scenes.map((s) => s.id),
        2,
      ),
      totalSeconds,
    };
  });
export const improvStatusReversalExample = {
  input: {
    roles: ["captain", "porter"],
    cuePairs: [{ id: "lead", high: "Leads", low: "Follows" }],
    sceneCount: 1,
    segmentSeconds: 15,
    seed: 42,
  },
  output: {
    scenes: [
      {
        id: 1,
        cuePairId: "lead",
        segments: [
          {
            startSecond: 0,
            endSecond: 15,
            highRole: "porter",
            lowRole: "captain",
            highCue: "Leads",
            lowCue: "Follows",
          },
          {
            startSecond: 15,
            endSecond: 30,
            highRole: "captain",
            lowRole: "porter",
            highCue: "Leads",
            lowCue: "Follows",
          },
        ],
      },
    ],
    rounds: [[1]],
    totalSeconds: 30,
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<ImprovStatusReversalInput, ImprovStatusReversalOutput>;
export const improvStatusReversalTool = createModelDefinition<
  ImprovStatusReversalInput,
  ImprovStatusReversalOutput
>({
  id: "random/improv-status-reversal",
  title: "Random Improv Status Reversal Exercise Generator",
  description:
    "Pair supplied fictional roles with contrasting status cues and explicitly reverse their assignments at each scene midpoint; no personal traits are inferred.",
  inputSchema,
  outputSchema,
  execute: calculateImprovStatusReversal,
});
export const runImprovStatusReversal = improvStatusReversalTool.execute;
export default improvStatusReversalTool;
