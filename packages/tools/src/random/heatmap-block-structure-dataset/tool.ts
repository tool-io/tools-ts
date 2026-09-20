import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import {
  createModelDefinition,
  matchesModelInput,
  modelInputIssues,
} from "../../core/model-definition.js";
import {
  invalidInput,
  toolSuccess,
  type ToolResult,
} from "../../core/result.js";
import { simpleError } from "../../core/simple.js";
import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSeedSchema,
  type GeneratorReplay,
} from "../generator-random.js";
import {
  object,
  array,
  integer,
  number,
  label,
  bool,
  core,
  finite,
  safe,
  distinct,
  sum,
  finish,
} from "../m500b-charts-math-graphs-support.js";
import { runSymmetryChecker } from "../../matrix/symmetry-checker/tool.js";

export type HeatmapBlockStructureDatasetInput = {
  readonly rowBlocks: readonly string[];
  readonly columnBlocks: readonly string[];
  readonly within: number;
  readonly between: number;
  readonly noise: number;
  readonly symmetric: boolean;
  readonly seed?: number;
};
export type HeatmapBlockStructureDatasetOutput = {
  readonly matrix: readonly (readonly number[])[];
  readonly sameBlock: readonly (readonly boolean[])[];
  readonly symmetric: boolean;
  readonly rowBlocks: readonly string[];
  readonly columnBlocks: readonly string[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = object(
  {
    rowBlocks: array(label, 12, 1),
    columnBlocks: array(label, 12, 1),
    within: integer,
    between: integer,
    noise: { type: "integer", minimum: 0, maximum: 1000000 },
    symmetric: bool,
    seed: generatorSeedSchema,
  },
  ["rowBlocks", "columnBlocks", "within", "between", "noise", "symmetric"],
);
export const outputSchema = object({
  matrix: array(array(integer, 12, 1), 12, 1),
  sameBlock: array(array(bool, 12, 1), 12, 1),
  symmetric: bool,
  rowBlocks: array(label, 12, 1),
  columnBlocks: array(label, 12, 1),
  randomness: generatorReplaySchema,
});
const isInput = (value: unknown): value is HeatmapBlockStructureDatasetInput =>
  matchesModelInput(value, inputSchema);
export const calculateHeatmapBlockStructureDataset = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<HeatmapBlockStructureDatasetOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const random = createGeneratorRandom(input.seed, context);
    if (
      input.symmetric &&
      (input.rowBlocks.length !== input.columnBlocks.length ||
        input.rowBlocks.some((x, i) => x !== input.columnBlocks[i]))
    )
      simpleError(
        "columnBlocks",
        "Symmetric generation requires identical row and column block labels.",
        "symmetry_mismatch",
      );
    for (const v of [input.within, input.between]) {
      safe(v - input.noise, "noise");
      safe(v + input.noise, "noise");
    }
    const matrix = input.rowBlocks.map(() =>
        Array<number>(input.columnBlocks.length).fill(0),
      ),
      sameBlock = input.rowBlocks.map((r) =>
        input.columnBlocks.map((c) => r === c),
      );
    for (let i = 0; i < matrix.length; i++)
      for (let j = 0; j < input.columnBlocks.length; j++) {
        if (input.symmetric && j < i) {
          matrix[i][j] = matrix[j][i];
          continue;
        }
        matrix[i][j] = safe(
          (sameBlock[i][j] ? input.within : input.between) +
            random.integer(-input.noise, input.noise),
        );
      }
    const symmetric =
      matrix.length === input.columnBlocks.length
        ? core(runSymmetryChecker({ matrix })).symmetric
        : false;
    const result = {
      matrix,
      sameBlock,
      symmetric,
      rowBlocks: [...input.rowBlocks],
      columnBlocks: [...input.columnBlocks],
    };
    return toolSuccess(
      finish({ ...result, randomness: generatorReplay(input.seed, context) }),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const heatmapBlockStructureDatasetExample = {
  input: {
    rowBlocks: ["a", "b"],
    columnBlocks: ["a", "b"],
    within: 5,
    between: 1,
    noise: 1,
    symmetric: true,
    seed: 42,
  },
  output: {
    matrix: [
      [5, 1],
      [1, 6],
    ],
    sameBlock: [
      [true, false],
      [false, true],
    ],
    symmetric: true,
    rowBlocks: ["a", "b"],
    columnBlocks: ["a", "b"],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  HeatmapBlockStructureDatasetInput,
  HeatmapBlockStructureDatasetOutput
>;
export const heatmapBlockStructureDatasetTool = createModelDefinition<
  HeatmapBlockStructureDatasetInput,
  HeatmapBlockStructureDatasetOutput
>({
  id: "random/heatmap-block-structure-dataset",
  title: "Random Heatmap Block Structure Dataset Generator",
  description:
    "Construct labeled heatmap blocks with bounded integer noise and optional mirrored symmetry, retaining the planted block mask.",
  inputSchema,
  outputSchema,
  execute: calculateHeatmapBlockStructureDataset,
});
export const runHeatmapBlockStructureDataset =
  heatmapBlockStructureDatasetTool.execute;
export default heatmapBlockStructureDatasetTool;
