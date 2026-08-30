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
  aligned,
  ordered,
} from "../shared.js";
export type Input = Readonly<{
  readonly depthsM: readonly number[];
  readonly areasM2: readonly number[];
}>;
export type Output = Readonly<{
  readonly cumulativeVolumesAboveDepthM3: readonly number[];
  readonly totalModeledVolumeM3: number;
  readonly meanDepthM: number;
}>;
const inputFields = [
  { id: "depthsM", label: "Depths m", kind: "numberList" },
  { id: "areasM2", label: "Areas m2", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.areasM2.forEach((v) => nonnegative(v, "areasM2"));
  aligned(input.depthsM, input.areasM2, "depthsM");
  ordered(input.depthsM, "depthsM");
  if (
    input.depthsM[0] !== 0 ||
    input.areasM2[0] <= 0 ||
    input.areasM2.some((v, i) => i > 0 && v > input.areasM2[i - 1])
  )
    simpleError(
      "areasM2",
      "Surface-positive nonincreasing area-depth curve beginning at zero depth required.",
    );
  let volume = 0;
  const cumulativeVolumesAboveDepthM3 = [0];
  for (let i = 1; i < input.depthsM.length; i++) {
    volume +=
      ((input.depthsM[i] - input.depthsM[i - 1]) *
        (input.areasM2[i] + input.areasM2[i - 1])) /
      2;
    cumulativeVolumesAboveDepthM3.push(volume);
  }
  return {
    cumulativeVolumesAboveDepthM3,
    totalModeledVolumeM3: volume,
    meanDepthM: volume / input.areasM2[0],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  depthsM: [0, 10, 20],
  areasM2: [100, 50, 0],
} satisfies Input;
export const exampleOutput = {
  cumulativeVolumesAboveDepthM3: [0, 750, 1000],
  totalModeledVolumeM3: 1000,
  meanDepthM: 10,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "limnology/hypsographic-curve-integration",
  title: "Hypsographic Curve Integration",
  description:
    "Integrate observed hypsographic area-depth contours into a cumulative volume curve with trapezoids; contour geometry is supplied and only the measured depth range is represented.",
  inputs: inputFields,
  outputs: [
    {
      id: "cumulativeVolumesAboveDepthM3",
      label: "Cumulative volumes above depth m3",
      kind: "numberList",
    },
    {
      id: "totalModeledVolumeM3",
      label: "Total modeled volume m3",
      kind: "number",
    },
    { id: "meanDepthM", label: "Mean depth m", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      depthsM: value.depthsM as readonly number[],
      areasM2: value.areasM2 as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
