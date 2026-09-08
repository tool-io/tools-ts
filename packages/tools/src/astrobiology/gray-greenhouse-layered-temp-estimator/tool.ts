import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded, positive } from "../batch46-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedEffectiveEmissionTemperatureKelvin: number;
  readonly idealInfraredOpaqueAtmosphericLayerCount: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerVerifiedEffectiveEmissionTemperatureKelvin",
    label: "Caller verified effective emission temperature kelvin",
    kind: "number",
  },
  {
    id: "idealInfraredOpaqueAtmosphericLayerCount",
    label: "Ideal infrared opaque atmospheric layer count",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(
    input.callerVerifiedEffectiveEmissionTemperatureKelvin,
    "effective-temperature",
  );
  bounded(input.idealInfraredOpaqueAtmosphericLayerCount, "layers", 0, 32);
  const f = Math.pow(input.idealInfraredOpaqueAtmosphericLayerCount + 1, 0.25);
  return {
    conditionalIdealSurfaceTemperatureKelvin:
      input.callerVerifiedEffectiveEmissionTemperatureKelvin * f,
    conditionalSurfaceToEffectiveTemperatureRatio: f,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerVerifiedEffectiveEmissionTemperatureKelvin: 200,
    idealInfraredOpaqueAtmosphericLayerCount: 1,
  },
  output: {
    result: {
      conditionalIdealSurfaceTemperatureKelvin: 237.8414230005442,
      conditionalSurfaceToEffectiveTemperatureRatio: 1.189207115002721,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrobiology/gray-greenhouse-layered-temp-estimator",
  title: "Gray-Greenhouse Simple Layered Atmosphere Temp Estimator",
  description:
    "Ideal radiative-equilibrium N-layer atmosphere: transparent to incoming shortwave, each layer completely opaque/emissive to thermal radiation, no convection; Ts=(N+1)^(1/4) Te. A deliberately restrictive all-black-layer model, not arbitrary gray emissivity, real lapse rate, planet habitability or observed surface prediction.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
