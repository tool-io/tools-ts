import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  nonnegative,
  aligned,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualIncreasingDepthContoursMeters: readonly number[];
  readonly actualContourEnclosedAreasM2: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualIncreasingDepthContoursMeters",
    label: "Actual increasing depth contours meters",
    kind: "numberList",
  },
  {
    id: "actualContourEnclosedAreasM2",
    label: "Actual contour enclosed areas m2",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  aligned(
    input.actualIncreasingDepthContoursMeters,
    input.actualContourEnclosedAreasM2,
    "contours",
  );
  if (
    input.actualIncreasingDepthContoursMeters[0] !== 0 ||
    input.actualContourEnclosedAreasM2.at(-1) !== 0
  )
    simpleError(
      "endpoints",
      "Surface0andactualzeroareabottom,completecoverage.",
    );
  input.actualContourEnclosedAreasM2.forEach((v, i) => {
    nonnegative(v, "area");
    if (
      i &&
      (v > input.actualContourEnclosedAreasM2[i - 1] ||
        input.actualIncreasingDepthContoursMeters[i] <=
          input.actualIncreasingDepthContoursMeters[i - 1])
    )
      simpleError("contours", "Increasingdepth/nonincreasingarea.");
  });
  let V = 0;
  for (let i = 1; i < input.actualIncreasingDepthContoursMeters.length; i++)
    V +=
      ((input.actualIncreasingDepthContoursMeters[i] -
        input.actualIncreasingDepthContoursMeters[i - 1]) *
        (input.actualContourEnclosedAreasM2[i] +
          input.actualContourEnclosedAreasM2[i - 1])) /
      2;
  return { piecewiseLinearBathymetricVolumeM3: V };
};
export const calculate = (
  input: Input,
  context?: ToolExecutionContext,
): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: {
    actualIncreasingDepthContoursMeters: [0, 1, 2],
    actualContourEnclosedAreasM2: [4, 2, 0],
  },
  output: { result: { piecewiseLinearBathymetricVolumeM3: 4 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "limnology/volume-from-bathymetric-contours",
  title: "Volume From Bathymetric Contours Calculator",
  description:
    "Actualcontourarea-depthtrapezoidvolumecompletebottomcoverage,not stageinterpolationonly/mesh exactintegration. Actual independent model/unit/frame/epoch/calibration and applicable measurement established;not precise ephemeris,forecast,geodesy operation,identity or safety approval.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
