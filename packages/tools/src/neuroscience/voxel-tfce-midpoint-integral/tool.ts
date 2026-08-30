import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  count,
  dimensions,
  components,
} from "../shared.js";
export type Input = Readonly<{
  readonly voxelStatistics: readonly number[];
  readonly dimensions: readonly number[];
  readonly extentExponent: number;
  readonly heightExponent: number;
  readonly integrationSteps: number;
}>;
export type Output = Readonly<{
  readonly tfceScores: readonly number[];
  readonly heightStep: number;
}>;
const inputFields = [
  { id: "voxelStatistics", label: "Voxel statistics", kind: "numberList" },
  { id: "dimensions", label: "Dimensions", kind: "numberList" },
  { id: "extentExponent", label: "Extent exponent", kind: "number" },
  { id: "heightExponent", label: "Height exponent", kind: "number" },
  { id: "integrationSteps", label: "Integration steps", kind: "integer" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  dimensions(input.dimensions, input.voxelStatistics.length, 4096);
  input.voxelStatistics.forEach((v) => nonnegative(v, "voxelStatistics"));
  nonnegative(input.extentExponent, "extentExponent");
  nonnegative(input.heightExponent, "heightExponent");
  count(input.integrationSteps, "integrationSteps", 1);
  if (
    input.integrationSteps > 128 ||
    input.integrationSteps * input.voxelStatistics.length > 100000
  )
    simpleError(
      "integrationSteps",
      "At most 128 bounded TFCE integration levels supported.",
    );
  const maximum = Math.max(...input.voxelStatistics),
    heightStep = maximum / input.integrationSteps,
    tfceScores = input.voxelStatistics.map(() => 0);
  if (maximum > 0)
    for (let k = 0; k < input.integrationSteps; k++) {
      const h = (k + 0.5) * heightStep;
      for (const cluster of components(
        input.voxelStatistics,
        input.dimensions,
        h,
      )) {
        const increment =
          cluster.length ** input.extentExponent *
          h ** input.heightExponent *
          heightStep;
        for (const index of cluster) tfceScores[index] += increment;
      }
    }
  return { tfceScores, heightStep };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  voxelStatistics: [2, 2],
  dimensions: [2, 1, 1],
  extentExponent: 1,
  heightExponent: 0,
  integrationSteps: 2,
} satisfies Input;
export const exampleOutput = {
  tfceScores: [4, 4],
  heightStep: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/voxel-tfce-midpoint-integral",
  title: "TFCE Value",
  description:
    "Approximate nonnegative TFCE by bounded midpoint height integration over face-connected voxel clusters; extent is voxel count, not physical volume, and inference requires an external permutation null.",
  inputs: inputFields,
  outputs: [
    { id: "tfceScores", label: "Tfce scores", kind: "numberList" },
    { id: "heightStep", label: "Height step", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      voxelStatistics: value.voxelStatistics as readonly number[],
      dimensions: value.dimensions as readonly number[],
      extentExponent: value.extentExponent as number,
      heightExponent: value.heightExponent as number,
      integrationSteps: value.integrationSteps as number,
    }),
});
export const run = tool.execute;
export default tool;
