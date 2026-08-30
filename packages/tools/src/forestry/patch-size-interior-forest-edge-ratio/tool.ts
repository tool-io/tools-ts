import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly rectangularPatchLengthsM: readonly number[];
  readonly rectangularPatchWidthsM: readonly number[];
  readonly callerEdgeInfluenceDepthM: number;
}>;
export type Output = Readonly<{
  readonly interiorPatchAreasM2: readonly number[];
  readonly pooledInteriorAreaFraction: number;
  readonly pooledEdgeToInteriorAreaRatio: number;
}>;
const inputFields = [
  {
    id: "rectangularPatchLengthsM",
    label: "Rectangular patch lengths m",
    kind: "numberList",
  },
  {
    id: "rectangularPatchWidthsM",
    label: "Rectangular patch widths m",
    kind: "numberList",
  },
  {
    id: "callerEdgeInfluenceDepthM",
    label: "Caller edge influence depth m",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.rectangularPatchLengthsM.forEach((v) =>
    positive(v, "rectangularPatchLengthsM"),
  );
  input.rectangularPatchWidthsM.forEach((v) =>
    positive(v, "rectangularPatchWidthsM"),
  );
  nonnegative(input.callerEdgeInfluenceDepthM, "callerEdgeInfluenceDepthM");
  aligned(
    input.rectangularPatchLengthsM,
    input.rectangularPatchWidthsM,
    "rectangularPatchLengthsM",
  );
  const total = input.rectangularPatchLengthsM.reduce(
      (s, l, i) => s + l * input.rectangularPatchWidthsM[i],
      0,
    ),
    interiorPatchAreasM2 = input.rectangularPatchLengthsM.map(
      (l, i) =>
        Math.max(0, l - 2 * input.callerEdgeInfluenceDepthM) *
        Math.max(
          0,
          input.rectangularPatchWidthsM[i] -
            2 * input.callerEdgeInfluenceDepthM,
        ),
    ),
    interior = positive(
      interiorPatchAreasM2.reduce((a, b) => a + b, 0),
      "interiorArea",
    );
  return {
    interiorPatchAreasM2,
    pooledInteriorAreaFraction: interior / total,
    pooledEdgeToInteriorAreaRatio: (total - interior) / interior,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  rectangularPatchLengthsM: [100, 50],
  rectangularPatchWidthsM: [100, 20],
  callerEdgeInfluenceDepthM: 10,
} satisfies Input;
export const exampleOutput = {
  interiorPatchAreasM2: [6400, 0],
  pooledInteriorAreaFraction: 0.5818181818181818,
  pooledEdgeToInteriorAreaRatio: 0.71875,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/patch-size-interior-forest-edge-ratio",
  title: "Interior Forest Edge Ratio From Patch Size",
  description:
    "Evaluate rectangular patch interior/edge areas under a caller uniform inward edge-depth model; no coordinate buffers, patch shape inference or biodiversity outcome; absent interior makes edge/interior ratio undefined.",
  inputs: inputFields,
  outputs: [
    {
      id: "interiorPatchAreasM2",
      label: "Interior patch areas m2",
      kind: "numberList",
    },
    {
      id: "pooledInteriorAreaFraction",
      label: "Pooled interior area fraction",
      kind: "number",
    },
    {
      id: "pooledEdgeToInteriorAreaRatio",
      label: "Pooled edge to interior area ratio",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      rectangularPatchLengthsM:
        value.rectangularPatchLengthsM as readonly number[],
      rectangularPatchWidthsM:
        value.rectangularPatchWidthsM as readonly number[],
      callerEdgeInfluenceDepthM: value.callerEdgeInfluenceDepthM as number,
    }),
});
export const run = tool.execute;
export default tool;
