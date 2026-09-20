import { calculate as countLevels } from "../../dance/level-change-low-mid-high-distribution-counter/tool.js";
import {
  createModelDefinition,
  matchesModelInput,
  nInput,
  nOutput,
  nArray,
  nObject,
  nId,
  nInt,
  nAt,
  nPick,
  nSample,
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
export type MovementLevel = "low" | "mid" | "high";
export type MovementLevelBalancePlanInput = NSeed & {
  readonly movements: readonly {
    readonly id: string;
    readonly level: MovementLevel;
  }[];
  readonly lowQuota: number;
  readonly midQuota: number;
  readonly highQuota: number;
  readonly phraseCount: number;
};
export type MovementLevelBalancePlanOutput = NReplay & {
  readonly phrases: readonly {
    readonly phrase: number;
    readonly level: MovementLevel;
    readonly movementId: string;
    readonly remainingQuotas: readonly number[];
  }[];
  readonly lowMidHighCounts: readonly number[];
  readonly unknownCount: number;
  readonly balanceSpread: number;
  readonly callerReviewRequired: boolean;
};
const level = { type: "string", enum: ["low", "mid", "high"] } as const;
export const inputSchema = nInput({
  movements: nArray(nObject({ id: nId, level }), 16, 1),
  lowQuota: nInt(0, 32),
  midQuota: nInt(0, 32),
  highQuota: nInt(0, 32),
  phraseCount: nInt(1, 32),
});
export const outputSchema = nOutput({
  phrases: nArray(
    nObject({
      phrase: nInt(1, 32),
      level,
      movementId: nId,
      remainingQuotas: nArray(nInt(0, 32), 3, 3),
    }),
    32,
    1,
  ),
  lowMidHighCounts: nArray(nInt(0, 32), 3, 3),
  unknownCount: { type: "integer", const: 0 },
  balanceSpread: nInt(0, 32),
  callerReviewRequired: { type: "boolean", const: true },
});
const isInput = (v: unknown): v is MovementLevelBalancePlanInput =>
  matchesModelInput(v, inputSchema);
export const calculateMovementLevelBalancePlan = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<MovementLevelBalancePlanOutput> =>
  nRun(input, inputSchema, isInput, context, (x, r) => {
    nDistinct(
      x.movements.map((m) => m.id),
      "movements",
    );
    const levels: readonly MovementLevel[] = ["low", "mid", "high"],
      quotas = [x.lowQuota || 0, x.midQuota || 0, x.highQuota || 0];
    if (nSum(quotas, "quotas") !== x.phraseCount)
      return simpleError(
        "phraseCount",
        "Low/mid/high quotas must sum exactly to the phrase count.",
        "quota_mismatch",
      );
    levels.forEach((level, i) => {
      if (nAt(quotas, i) > 0 && !x.movements.some((m) => m.level === level))
        simpleError(
          "movements",
          "Every positive level quota needs a supplied movement.",
          "missing_level",
        );
    });
    // Tokens are distinct indices, so the duplicate level values retain exact multiplicity.
    const tokens = levels.flatMap((level, i) =>
        Array.from({ length: nAt(quotas, i) }, () => level),
      ),
      order = nSample(
        tokens.map((_, i) => i),
        tokens.length,
        r,
      ),
      remaining = [...quotas],
      phrases = order.map((index, i) => {
        const level = nAt(tokens, index),
          movement = nPick(
            x.movements.filter((m) => m.level === level),
            r,
          ),
          code = levels.indexOf(level);
        remaining[code] = nAt(remaining, code) - 1;
        return {
          phrase: i + 1,
          level,
          movementId: movement.id,
          remainingQuotas: [...remaining],
        };
      });
    const counted = countLevels({
      callerAnnotatedDancerLevelCodes: phrases.map((p) =>
        levels.indexOf(p.level),
      ),
      levelObservationFlags: phrases.map(() => 1),
    });
    if (
      counted.knownLowMidHighDancerCounts.some((v, i) => v !== nAt(quotas, i))
    )
      throw new Error("Constructed movement quotas did not conserve counts.");
    return {
      phrases,
      lowMidHighCounts: counted.knownLowMidHighDancerCounts,
      unknownCount: counted.unknownLevelDancerCount,
      balanceSpread: counted.knownLevelBalanceSpread,
      callerReviewRequired: true,
    };
  });
export const movementLevelBalancePlanExample = {
  input: {
    movements: [
      { id: "kneel", level: "low" },
      { id: "reach", level: "high" },
    ],
    lowQuota: 1,
    midQuota: 0,
    highQuota: 1,
    phraseCount: 2,
    seed: 42,
  },
  output: {
    phrases: [
      {
        phrase: 1,
        level: "high",
        movementId: "reach",
        remainingQuotas: [1, 0, 0],
      },
      {
        phrase: 2,
        level: "low",
        movementId: "kneel",
        remainingQuotas: [0, 0, 0],
      },
    ],
    lowMidHighCounts: [1, 0, 1],
    unknownCount: 0,
    balanceSpread: 1,
    callerReviewRequired: true,
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  MovementLevelBalancePlanInput,
  MovementLevelBalancePlanOutput
>;
export const movementLevelBalancePlanTool = createModelDefinition<
  MovementLevelBalancePlanInput,
  MovementLevelBalancePlanOutput
>({
  id: "random/movement-level-balance-plan",
  title: "Random Movement Level Balance Plan Generator",
  description:
    "Allocate supplied low/mid/high movement IDs under exact phrase quotas, retain remaining counts, and verify distribution through the level-counter core; actions remain caller-selected and reviewed.",
  inputSchema,
  outputSchema,
  execute: calculateMovementLevelBalancePlan,
});
export const runMovementLevelBalancePlan = movementLevelBalancePlanTool.execute;
export default movementLevelBalancePlanTool;
