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
  nSample,
  nGroups,
  nDistinct,
  nSum,
  nRun,
  type NSeed,
  type NReplay,
  type ToolExecutionContext,
  type ToolResult,
  type ToolExample,
} from "../m500b-narrative-support.js";
export type PropOnlySceneChallengeInput = NSeed & {
  readonly props: readonly {
    readonly id: string;
    readonly description: string;
  }[];
  readonly objectives: readonly string[];
  readonly propCount: number;
  readonly turnSeconds: number;
};
export type PropOnlySceneChallengeOutput = NReplay & {
  readonly objective: string;
  readonly props: readonly {
    readonly id: string;
    readonly description: string;
  }[];
  readonly focusTurns: readonly {
    readonly propId: string;
    readonly startSecond: number;
    readonly endSecond: number;
  }[];
  readonly rounds: readonly (readonly string[])[];
  readonly noAdditionalProps: boolean;
  readonly callerReviewRequired: boolean;
};
const prop = nObject({ id: nId, description: nText });
export const inputSchema = nInput({
  props: nArray(prop, 16, 1),
  objectives: nStringList,
  propCount: nInt(1, 16),
  turnSeconds: nInt(1),
});
export const outputSchema = nOutput({
  objective: nText,
  props: nArray(prop, 16, 1),
  focusTurns: nArray(
    nObject({ propId: nId, startSecond: nInt(), endSecond: nInt(1) }),
    16,
    1,
  ),
  rounds: nArray(nArray(nId, 2, 1), 8, 1),
  noAdditionalProps: { type: "boolean", const: true },
  callerReviewRequired: { type: "boolean", const: true },
});
const isInput = (v: unknown): v is PropOnlySceneChallengeInput =>
  matchesModelInput(v, inputSchema);
export const calculatePropOnlySceneChallenge = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<PropOnlySceneChallengeOutput> =>
  nRun(input, inputSchema, isInput, context, (x, r) => {
    nDistinct(
      x.props.map((p) => p.id),
      "props",
    );
    nSum(
      Array.from({ length: x.propCount }, () => x.turnSeconds),
      "turnSeconds",
    );
    const props = nSample(x.props, x.propCount, r).map((p) => ({ ...p }));
    return {
      objective: nPick(x.objectives, r),
      props,
      focusTurns: props.map((p, i) => ({
        propId: p.id,
        startSecond: i * x.turnSeconds,
        endSecond: (i + 1) * x.turnSeconds,
      })),
      rounds: nGroups(
        props.map((p) => p.id),
        2,
      ),
      noAdditionalProps: true,
      callerReviewRequired: true,
    };
  });
export const propOnlySceneChallengeExample = {
  input: {
    props: [
      { id: "cloth", description: "Caller-approved cloth" },
      { id: "box", description: "Caller-approved box" },
    ],
    objectives: ["Hide an imaginary letter"],
    propCount: 2,
    turnSeconds: 20,
    seed: 42,
  },
  output: {
    objective: "Hide an imaginary letter",
    props: [
      { id: "box", description: "Caller-approved box" },
      { id: "cloth", description: "Caller-approved cloth" },
    ],
    focusTurns: [
      { propId: "box", startSecond: 0, endSecond: 20 },
      { propId: "cloth", startSecond: 20, endSecond: 40 },
    ],
    rounds: [["box", "cloth"]],
    noAdditionalProps: true,
    callerReviewRequired: true,
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  PropOnlySceneChallengeInput,
  PropOnlySceneChallengeOutput
>;
export const propOnlySceneChallengeTool = createModelDefinition<
  PropOnlySceneChallengeInput,
  PropOnlySceneChallengeOutput
>({
  id: "random/prop-only-scene-challenge",
  title: "Random Prop-Only Scene Challenge Generator",
  description:
    "Draw distinct supplied prop descriptions and a dramatic objective into timed focus briefs; callers review physical suitability and permitted handling.",
  inputSchema,
  outputSchema,
  execute: calculatePropOnlySceneChallenge,
});
export const runPropOnlySceneChallenge = propOnlySceneChallengeTool.execute;
export default propOnlySceneChallengeTool;
