import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  aligned,
  sum,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly soilLayerVolumesM3: readonly number[];
  readonly observedLayerBulkDensitiesKgM3: readonly number[];
  readonly callerMatchedParticleDensitiesKgM3: readonly number[];
}>;
export type Output = Readonly<{
  readonly layerSoilPorosities: readonly number[];
  readonly volumeWeightedSoilPorosity: number;
}>;
const inputFields = [
  {
    id: "soilLayerVolumesM3",
    label: "Soil layer volumes m3",
    kind: "numberList",
  },
  {
    id: "observedLayerBulkDensitiesKgM3",
    label: "Observed layer bulk densities kg m3",
    kind: "numberList",
  },
  {
    id: "callerMatchedParticleDensitiesKgM3",
    label: "Caller matched particle densities kg m3",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.soilLayerVolumesM3.forEach((v) => positive(v, "soilLayerVolumesM3"));
  input.callerMatchedParticleDensitiesKgM3.forEach((v) =>
    positive(v, "callerMatchedParticleDensitiesKgM3"),
  );
  input.observedLayerBulkDensitiesKgM3.forEach((v) =>
    nonnegative(v, "observedLayerBulkDensitiesKgM3"),
  );
  aligned(
    input.soilLayerVolumesM3,
    input.observedLayerBulkDensitiesKgM3,
    "soilLayerVolumesM3",
  );
  aligned(
    input.soilLayerVolumesM3,
    input.callerMatchedParticleDensitiesKgM3,
    "soilLayerVolumesM3",
  );
  const p = input.observedLayerBulkDensitiesKgM3.map((v, i) => {
    const q = 1 - v / input.callerMatchedParticleDensitiesKgM3[i];
    fraction(q, "resolved pore fraction");
    return q;
  });
  return {
    layerSoilPorosities: p,
    volumeWeightedSoilPorosity:
      sum(p.map((v, i) => v * input.soilLayerVolumesM3[i])) /
      sum(input.soilLayerVolumesM3),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  soilLayerVolumesM3: [1, 2],
  observedLayerBulkDensitiesKgM3: [1000, 1500],
  callerMatchedParticleDensitiesKgM3: [2000, 2000],
} satisfies Input;
export const exampleOutput = {
  layerSoilPorosities: [0.5, 0.25],
  volumeWeightedSoilPorosity: 0.3333333333333333,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "agriculture/soil-porosity",
  title: "Agriculture Soil Porosity Calculator",
  description:
    "Layer-specific matched particle/bulk densities and volume-weighted porosity, not universal mineral particle density. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "layerSoilPorosities",
      label: "Layer soil porosities",
      kind: "numberList",
    },
    {
      id: "volumeWeightedSoilPorosity",
      label: "Volume weighted soil porosity",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      soilLayerVolumesM3: value.soilLayerVolumesM3 as readonly number[],
      observedLayerBulkDensitiesKgM3:
        value.observedLayerBulkDensitiesKgM3 as readonly number[],
      callerMatchedParticleDensitiesKgM3:
        value.callerMatchedParticleDensitiesKgM3 as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
