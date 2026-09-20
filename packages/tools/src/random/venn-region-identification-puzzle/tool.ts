import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  createModelDefinition,
  matchesModelInput,
} from "../../core/model-definition.js";
import { toolSuccess, type ToolResult } from "../../core/result.js";
import { calculateVennTwoSetRegionMapper } from "../../logic/venn-two-set-region-mapper/tool.js";
import { calculateVennThreeSetRegionMapper } from "../../logic/venn-three-set-region-mapper/tool.js";
import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSeedSchema,
  type GeneratorReplay,
} from "../generator-random.js";
import {
  puzzleArray,
  puzzleBoolean,
  puzzleCount,
  puzzleExecutor,
  puzzleFreeze,
  puzzleInteger,
  puzzleObject,
  puzzleUnwrap,
  puzzleValidate,
} from "../m250-puzzles-logic-support.js";
export type VennRegionIdentificationPuzzleInput = {
  readonly setCount: 2 | 3;
  readonly count: number;
  readonly seed?: number;
};
export type VennRegionIdentificationPuzzleOutput = {
  readonly cases: readonly {
    readonly memberships: readonly boolean[];
    readonly regionIndex: number;
    readonly region: string;
    readonly memberOf: readonly string[];
  }[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = puzzleObject(
  {
    setCount: { type: "integer", enum: [2, 3] },
    count: puzzleCount,
    seed: generatorSeedSchema,
  },
  ["setCount", "count"],
);
export const outputSchema = puzzleObject({
  cases: puzzleArray(
    puzzleObject({
      memberships: puzzleArray(puzzleBoolean, 3, 2),
      regionIndex: puzzleInteger,
      region: { type: "string" },
      memberOf: puzzleArray({ type: "string", enum: ["A", "B", "C"] }, 3),
    }),
    64,
    1,
  ),
  randomness: generatorReplaySchema,
});
export const calculateVennRegionIdentificationPuzzle = (
  input: VennRegionIdentificationPuzzleInput,
  context?: ToolExecutionContext,
): ToolResult<VennRegionIdentificationPuzzleOutput> => {
  try {
    puzzleValidate(input, inputSchema);
    const random = createGeneratorRandom(input.seed, context),
      cases = Array.from({ length: input.count }, () => {
        const memberships = Array.from(
            { length: input.setCount },
            () => random.integer(0, 1) === 1,
          ),
          [inA, inB, inC] = memberships;
        if (input.setCount === 2) {
          const core = puzzleUnwrap(
            calculateVennTwoSetRegionMapper({ inA, inB }),
          );
          return {
            memberships,
            regionIndex: core.regionIndex,
            region: core.region,
            memberOf: ["A", "B"].filter((_, i) => memberships[i]),
          };
        }
        const core = puzzleUnwrap(
          calculateVennThreeSetRegionMapper({ inA, inB, inC }),
        );
        return {
          memberships,
          regionIndex: core.regionIndex,
          region: core.membershipBits,
          memberOf: core.memberOf,
        };
      });
    return toolSuccess({
      cases,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const vennRegionIdentificationPuzzleExample = puzzleFreeze({
  input: { setCount: 2, count: 2, seed: 42 },
  output: {
    cases: [
      {
        memberships: [true, false],
        regionIndex: 2,
        region: "a-only",
        memberOf: ["A"],
      },
      {
        memberships: [true, true],
        regionIndex: 3,
        region: "intersection",
        memberOf: ["A", "B"],
      },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} as const satisfies ToolExample<
  VennRegionIdentificationPuzzleInput,
  VennRegionIdentificationPuzzleOutput
>);
const isInput = (
  input: unknown,
): input is VennRegionIdentificationPuzzleInput =>
  matchesModelInput(input, inputSchema);
export const vennRegionIdentificationPuzzleTool = createModelDefinition<
  VennRegionIdentificationPuzzleInput,
  VennRegionIdentificationPuzzleOutput
>({
  id: "random/venn-region-identification-puzzle",
  title: "Random Venn Region Identification Puzzle Generator",
  description:
    "Draw two- or three-set membership combinations and delegate region answers with A as the most significant bit, without area or probability assumptions.",
  inputSchema,
  outputSchema,
  execute: puzzleExecutor(
    isInput,
    inputSchema,
    calculateVennRegionIdentificationPuzzle,
  ),
});
export const runVennRegionIdentificationPuzzle =
  vennRegionIdentificationPuzzleTool.execute;
export default vennRegionIdentificationPuzzleTool;
