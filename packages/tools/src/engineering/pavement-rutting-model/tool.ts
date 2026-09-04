import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  sum,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly callerRuttingLayerThicknessM: readonly number[];
  readonly callerMatchedPermanentLayerStrainFractions: readonly number[];
}>;
export type Output = Readonly<{
  readonly layerPermanentRutDepthsM: readonly number[];
  readonly totalPermanentRutDepthM: number;
}>;
const inputFields = [
  {
    id: "callerRuttingLayerThicknessM",
    label: "Caller rutting layer thickness m",
    kind: "numberList",
  },
  {
    id: "callerMatchedPermanentLayerStrainFractions",
    label: "Caller matched permanent layer strain fractions",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerRuttingLayerThicknessM.forEach((v) =>
    positive(v, "callerRuttingLayerThicknessM"),
  );
  input.callerMatchedPermanentLayerStrainFractions.forEach((v) =>
    nonnegative(v, "callerMatchedPermanentLayerStrainFractions"),
  );
  aligned(
    input.callerRuttingLayerThicknessM,
    input.callerMatchedPermanentLayerStrainFractions,
    "callerRuttingLayerThicknessM",
  );
  const layers = input.callerRuttingLayerThicknessM.map(
    (v, i) => v * input.callerMatchedPermanentLayerStrainFractions[i],
  );
  return {
    layerPermanentRutDepthsM: layers,
    totalPermanentRutDepthM: sum(layers),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerRuttingLayerThicknessM: [1, 2],
  callerMatchedPermanentLayerStrainFractions: [0.01, 0.02],
} satisfies Input;
export const exampleOutput = {
  layerPermanentRutDepthsM: [0.01, 0.04],
  totalPermanentRutDepthM: 0.05,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/pavement-rutting-model",
  title: "Pavement Rutting Model Calculator",
  description:
    "Explicit independently established permanent layer strains integrated to rut depth, no repetitions/temperature rutting coefficients invented. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "layerPermanentRutDepthsM",
      label: "Layer permanent rut depths m",
      kind: "numberList",
    },
    {
      id: "totalPermanentRutDepthM",
      label: "Total permanent rut depth m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerRuttingLayerThicknessM:
        value.callerRuttingLayerThicknessM as readonly number[],
      callerMatchedPermanentLayerStrainFractions:
        value.callerMatchedPermanentLayerStrainFractions as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
