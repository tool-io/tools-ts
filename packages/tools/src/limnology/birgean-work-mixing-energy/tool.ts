import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  nonnegative,
  sum,
  aligned,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualDepthCentersBelowSurfaceMeters: readonly number[];
  readonly actualNonoverlappingLayerVolumesM3: readonly number[];
  readonly actualDensityKgPerM3: readonly number[];
  readonly callerGravity: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualDepthCentersBelowSurfaceMeters",
    label: "Actual depth centers below surface meters",
    kind: "numberList",
  },
  {
    id: "actualNonoverlappingLayerVolumesM3",
    label: "Actual nonoverlapping layer volumes m3",
    kind: "numberList",
  },
  {
    id: "actualDensityKgPerM3",
    label: "Actual density kg per m3",
    kind: "numberList",
  },
  { id: "callerGravity", label: "Caller gravity", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  aligned(
    input.actualDepthCentersBelowSurfaceMeters,
    input.actualNonoverlappingLayerVolumesM3,
    "layers",
  );
  aligned(
    input.actualDepthCentersBelowSurfaceMeters,
    input.actualDensityKgPerM3,
    "layers",
  );
  input.actualDepthCentersBelowSurfaceMeters.forEach((v) =>
    nonnegative(v, "depth"),
  );
  input.actualNonoverlappingLayerVolumesM3.forEach((v) => positive(v, "V"));
  input.actualDensityKgPerM3.forEach((v) => positive(v, "ρ"));
  positive(input.callerGravity, "g");
  const V = sum(input.actualNonoverlappingLayerVolumesM3),
    rho =
      sum(
        input.actualDensityKgPerM3.map(
          (v, i) => v * input.actualNonoverlappingLayerVolumesM3[i],
        ),
      ) / V,
    work =
      input.callerGravity *
      sum(
        input.actualDensityKgPerM3.map(
          (v, i) =>
            (v - rho) *
            input.actualNonoverlappingLayerVolumesM3[i] *
            input.actualDepthCentersBelowSurfaceMeters[i],
        ),
      );
  if (work < -1e-10)
    simpleError(
      "stability",
      "Actualdiscretelayersneedstablepositiveidealwork;negativeprofileisnotpositivebarrier.",
    );
  return { requiredIdealMixingWorkJ: Math.max(0, work) };
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
    actualDepthCentersBelowSurfaceMeters: [0.5, 1.5],
    actualNonoverlappingLayerVolumesM3: [1, 1],
    actualDensityKgPerM3: [1, 2],
    callerGravity: 1,
  },
  output: { result: { requiredIdealMixingWorkJ: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "limnology/birgean-work-mixing-energy",
  title: "Birgean Work Mixing Energy Calculator",
  description:
    "DiscreteidealBirgeanpotentialenergychangehomogeneousmixingusingactuallayerdepthcenters/volumes/massdensity,not turbulent energy efficiency or normalized lake stability. Actual independent model/unit/frame/epoch/calibration and applicable measurement established;not precise ephemeris,forecast,geodesy operation,identity or safety approval.",
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
