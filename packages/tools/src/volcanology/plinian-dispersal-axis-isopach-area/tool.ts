import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  ordered,
  integral,
} from "../shared.js";
export type Input = Readonly<{
  readonly isopachSemiMajorAxesM: readonly number[];
  readonly isopachSemiMinorAxesM: readonly number[];
  readonly isopachThicknessesM: readonly number[];
  readonly innerPlateauThicknessM: number;
  readonly outerTailVolumeM3: number;
}>;
export type Output = Readonly<{
  readonly ellipticalContourAreasM2: readonly number[];
  readonly representedBulkVolumeM3: number;
}>;
const inputFields = [
  {
    id: "isopachSemiMajorAxesM",
    label: "Isopach semi major axes m",
    kind: "numberList",
  },
  {
    id: "isopachSemiMinorAxesM",
    label: "Isopach semi minor axes m",
    kind: "numberList",
  },
  {
    id: "isopachThicknessesM",
    label: "Isopach thicknesses m",
    kind: "numberList",
  },
  {
    id: "innerPlateauThicknessM",
    label: "Inner plateau thickness m",
    kind: "number",
  },
  { id: "outerTailVolumeM3", label: "Outer tail volume m3", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.isopachSemiMajorAxesM.forEach((v) =>
    positive(v, "isopachSemiMajorAxesM"),
  );
  input.isopachSemiMinorAxesM.forEach((v) =>
    positive(v, "isopachSemiMinorAxesM"),
  );
  input.isopachThicknessesM.forEach((v) =>
    nonnegative(v, "isopachThicknessesM"),
  );
  nonnegative(input.innerPlateauThicknessM, "innerPlateauThicknessM");
  nonnegative(input.outerTailVolumeM3, "outerTailVolumeM3");
  aligned(
    input.isopachSemiMajorAxesM,
    input.isopachSemiMinorAxesM,
    "isopachSemiMajorAxesM",
  );
  aligned(
    input.isopachSemiMajorAxesM,
    input.isopachThicknessesM,
    "isopachSemiMajorAxesM",
  );
  const ellipticalContourAreasM2 = input.isopachSemiMajorAxesM.map((a, i) => {
    if (a < input.isopachSemiMinorAxesM[i])
      simpleError("axes", "Major axis must be at least minor axis.");
    return Math.PI * a * input.isopachSemiMinorAxesM[i];
  });
  ordered(ellipticalContourAreasM2, "contourAreas");
  if (
    input.innerPlateauThicknessM < input.isopachThicknessesM[0] ||
    input.isopachThicknessesM.some(
      (v, i) => i > 0 && v > input.isopachThicknessesM[i - 1],
    )
  )
    simpleError("thickness", "Thickness cannot increase with contour area.");
  return {
    ellipticalContourAreasM2,
    representedBulkVolumeM3:
      ellipticalContourAreasM2[0] * input.innerPlateauThicknessM +
      integral(ellipticalContourAreasM2, input.isopachThicknessesM) +
      input.outerTailVolumeM3,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  isopachSemiMajorAxesM: [10, 20, 30],
  isopachSemiMinorAxesM: [5, 10, 15],
  isopachThicknessesM: [3, 2, 1],
  innerPlateauThicknessM: 4,
  outerTailVolumeM3: 100,
} satisfies Input;
export const exampleOutput = {
  ellipticalContourAreasM2: [
    157.07963267948966, 628.3185307179587, 1413.7166941154069,
  ],
  representedBulkVolumeM3: 3084.5130209103036,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "volcanology/plinian-dispersal-axis-isopach-area",
  title: "Plinian Dispersal Axis Isopach Area",
  description:
    "Estimate contour-volume from supplied elliptical axes, trapezoidal thickness-area annuli, caller inner plateau and independently supplied outer tail; no dispersal-axis coordinate extraction or infinite-tail extrapolation.",
  inputs: inputFields,
  outputs: [
    {
      id: "ellipticalContourAreasM2",
      label: "Elliptical contour areas m2",
      kind: "numberList",
    },
    {
      id: "representedBulkVolumeM3",
      label: "Represented bulk volume m3",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      isopachSemiMajorAxesM: value.isopachSemiMajorAxesM as readonly number[],
      isopachSemiMinorAxesM: value.isopachSemiMinorAxesM as readonly number[],
      isopachThicknessesM: value.isopachThicknessesM as readonly number[],
      innerPlateauThicknessM: value.innerPlateauThicknessM as number,
      outerTailVolumeM3: value.outerTailVolumeM3 as number,
    }),
});
export const run = tool.execute;
export default tool;
