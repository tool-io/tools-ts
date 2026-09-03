import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch41-shared.js";
export type Input = Readonly<{
  readonly soilConductivityWPerMeterK: number;
  readonly callerSurfaceThawingDegreeDays: number;
  readonly callerVolumetricLatentHeatJPerM3: number;
}>;
export type Output = Readonly<{ readonly stefanIdealThawDepthMeters: number }>;
const inputFields = [
  {
    id: "soilConductivityWPerMeterK",
    label: "Soil conductivity w per meter k",
    kind: "number",
  },
  {
    id: "callerSurfaceThawingDegreeDays",
    label: "Caller surface thawing degree days",
    kind: "number",
  },
  {
    id: "callerVolumetricLatentHeatJPerM3",
    label: "Caller volumetric latent heat j per m3",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.soilConductivityWPerMeterK, "soilConductivityWPerMeterK");
  positive(
    input.callerVolumetricLatentHeatJPerM3,
    "callerVolumetricLatentHeatJPerM3",
  );
  nonnegative(
    input.callerSurfaceThawingDegreeDays,
    "callerSurfaceThawingDegreeDays",
  );
  return {
    stefanIdealThawDepthMeters: Math.sqrt(
      (2 *
        input.soilConductivityWPerMeterK *
        input.callerSurfaceThawingDegreeDays *
        86400) /
        input.callerVolumetricLatentHeatJPerM3,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  soilConductivityWPerMeterK: 1,
  callerSurfaceThawingDegreeDays: 1,
  callerVolumetricLatentHeatJPerM3: 172800,
} satisfies Input;
export const exampleOutput = { stefanIdealThawDepthMeters: 1 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "climatology/stefan-active-layer",
  title: "Permafrost Active Layer Stefan Solution Calculator",
  description:
    "Ideal soil Stefan sharp-front thaw depth using independently verified volumetric latent heat and SURFACE thaw index; no snow/groundn-factor inferred, not lake ice growth or real active-layer forecast. Caller independently establishes homogeneous observation coverage and model/reference applicability; not observed future climate, crop suitability or validated drought severity.",
  inputs: inputFields,
  outputs: [
    {
      id: "stefanIdealThawDepthMeters",
      label: "Stefan ideal thaw depth meters",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      soilConductivityWPerMeterK: value.soilConductivityWPerMeterK as number,
      callerSurfaceThawingDegreeDays:
        value.callerSurfaceThawingDegreeDays as number,
      callerVolumetricLatentHeatJPerM3:
        value.callerVolumetricLatentHeatJPerM3 as number,
    }),
});
export const run = tool.execute;
export default tool;
