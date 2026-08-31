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
  strictlyIncreasing,
  interpolate,
  integral,
} from "../batch32-shared.js";
export type Input = Readonly<{
  readonly depthContoursM: readonly number[];
  readonly contourAreasM2: readonly number[];
  readonly initialWaterDepthM: number;
  readonly finalWaterDepthM: number;
}>;
export type Output = Readonly<{
  readonly initialLakeStorageM3: number;
  readonly finalLakeStorageM3: number;
  readonly signedOutburstReleasedVolumeM3: number;
}>;
const inputFields = [
  { id: "depthContoursM", label: "Depth contours m", kind: "numberList" },
  { id: "contourAreasM2", label: "Contour areas m2", kind: "numberList" },
  { id: "initialWaterDepthM", label: "Initial water depth m", kind: "number" },
  { id: "finalWaterDepthM", label: "Final water depth m", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.depthContoursM.forEach((v) => nonnegative(v, "depthContoursM"));
  input.contourAreasM2.forEach((v) => nonnegative(v, "contourAreasM2"));
  nonnegative(input.initialWaterDepthM, "initialWaterDepthM");
  nonnegative(input.finalWaterDepthM, "finalWaterDepthM");
  aligned(input.depthContoursM, input.contourAreasM2, "depthContoursM");
  strictlyIncreasing(input.depthContoursM, "depth");
  if (
    input.depthContoursM[0] !== 0 ||
    input.contourAreasM2.some(
      (v, i) => i > 0 && v > input.contourAreasM2[i - 1],
    )
  )
    simpleError(
      "contours",
      "Surface-zero depth and nonincreasing observed area with depth required.",
    );
  const bottom = input.depthContoursM.at(-1)!;
  if (input.initialWaterDepthM > bottom || input.finalWaterDepthM > bottom)
    simpleError("water", "Water columns exceed supplied basin depth.");
  const storage = (h: number) => {
    const level = bottom - h;
    const x = [level, ...input.depthContoursM.filter((d) => d > level)],
      y = x.map((d) =>
        interpolate(input.depthContoursM, input.contourAreasM2, d),
      );
    return x.length < 2 ? 0 : integral(x, y);
  };
  const initial = storage(input.initialWaterDepthM),
    final = storage(input.finalWaterDepthM);
  return {
    initialLakeStorageM3: initial,
    finalLakeStorageM3: final,
    signedOutburstReleasedVolumeM3: initial - final,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  depthContoursM: [0, 10, 20],
  contourAreasM2: [100, 50, 0],
  initialWaterDepthM: 15,
  finalWaterDepthM: 5,
} satisfies Input;
export const exampleOutput = {
  initialLakeStorageM3: 562.5,
  finalLakeStorageM3: 62.5,
  signedOutburstReleasedVolumeM3: 500,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glaciology/glacier-lake-outburst-volume",
  title: "Glacier Lake Outburst Volume Calculator",
  description:
    "Reconcile initial/final water-column lake storage using supplied area-depth contours, not peak-discharge envelope or duplicate entire-basin integration; assumes fixed basin, no outburst hydrograph/dam stability prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "initialLakeStorageM3",
      label: "Initial lake storage m3",
      kind: "number",
    },
    {
      id: "finalLakeStorageM3",
      label: "Final lake storage m3",
      kind: "number",
    },
    {
      id: "signedOutburstReleasedVolumeM3",
      label: "Signed outburst released volume m3",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      depthContoursM: value.depthContoursM as readonly number[],
      contourAreasM2: value.contourAreasM2 as readonly number[],
      initialWaterDepthM: value.initialWaterDepthM as number,
      finalWaterDepthM: value.finalWaterDepthM as number,
    }),
});
export const run = tool.execute;
export default tool;
