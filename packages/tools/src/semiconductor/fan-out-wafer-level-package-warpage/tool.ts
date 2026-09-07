import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  mean,
  shape,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedFanoutSurfaceHeightsMicron: readonly (readonly number[])[];
  readonly callerMaximumPeakValleyWarpMicron: number;
}>;
export type Output = Readonly<{
  readonly observedFanoutPeakValleyWarpMicron: number;
  readonly observedFanoutSignedMeanHeightMicron: number;
  readonly exceedsCallerFanoutWarpBudget: boolean;
}>;
const inputFields = [
  {
    id: "observedFanoutSurfaceHeightsMicron",
    label: "Observed fanout surface heights micron",
    kind: "matrix",
  },
  {
    id: "callerMaximumPeakValleyWarpMicron",
    label: "Caller maximum peak valley warp micron",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(
    input.callerMaximumPeakValleyWarpMicron,
    "callerMaximumPeakValleyWarpMicron",
  );
  shape(input.observedFanoutSurfaceHeightsMicron, "heightMap");
  const z = input.observedFanoutSurfaceHeightsMicron.flat(),
    warp = Math.max(...z) - Math.min(...z);
  return {
    observedFanoutPeakValleyWarpMicron: warp,
    observedFanoutSignedMeanHeightMicron: mean(z),
    exceedsCallerFanoutWarpBudget:
      warp > input.callerMaximumPeakValleyWarpMicron,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedFanoutSurfaceHeightsMicron: [
    [0, 1],
    [2, 4],
  ],
  callerMaximumPeakValleyWarpMicron: 3,
} satisfies Input;
export const exampleOutput = {
  observedFanoutPeakValleyWarpMicron: 4,
  observedFanoutSignedMeanHeightMicron: 1.75,
  exceedsCallerFanoutWarpBudget: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/fan-out-wafer-level-package-warpage",
  title: "Semiconductor Fan Out Wafer Level Package Warpage Calculator",
  description:
    "Audit actual fan-out package height-map peak/valley and signed datum mean under caller budget, not radius-curvature sagitta or two supplied extrema; caller already removes fixture tilt.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedFanoutPeakValleyWarpMicron",
      label: "Observed fanout peak valley warp micron",
      kind: "number",
    },
    {
      id: "observedFanoutSignedMeanHeightMicron",
      label: "Observed fanout signed mean height micron",
      kind: "number",
    },
    {
      id: "exceedsCallerFanoutWarpBudget",
      label: "Exceeds caller fanout warp budget",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      observedFanoutSurfaceHeightsMicron:
        value.observedFanoutSurfaceHeightsMicron as readonly (readonly number[])[],
      callerMaximumPeakValleyWarpMicron:
        value.callerMaximumPeakValleyWarpMicron as number,
    }),
});
export const run = tool.execute;
export default tool;
