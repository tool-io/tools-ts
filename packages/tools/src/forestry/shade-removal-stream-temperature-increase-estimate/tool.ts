import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  fraction,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly preHarvestShadeFractions: readonly number[];
  readonly postHarvestShadeFractions: readonly number[];
  readonly representedStreamLengthsM: readonly number[];
  readonly callerTemperatureCPerLostShadeFraction: number;
}>;
export type Output = Readonly<{
  readonly localSignedShadeLossFractions: readonly number[];
  readonly lengthWeightedShadeLossFraction: number;
  readonly modelTemperatureChangeC: number;
}>;
const inputFields = [
  {
    id: "preHarvestShadeFractions",
    label: "Pre harvest shade fractions",
    kind: "numberList",
  },
  {
    id: "postHarvestShadeFractions",
    label: "Post harvest shade fractions",
    kind: "numberList",
  },
  {
    id: "representedStreamLengthsM",
    label: "Represented stream lengths m",
    kind: "numberList",
  },
  {
    id: "callerTemperatureCPerLostShadeFraction",
    label: "Caller temperature c per lost shade fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.representedStreamLengthsM.forEach((v) =>
    positive(v, "representedStreamLengthsM"),
  );
  input.preHarvestShadeFractions.forEach((v) =>
    fraction(v, "preHarvestShadeFractions"),
  );
  input.postHarvestShadeFractions.forEach((v) =>
    fraction(v, "postHarvestShadeFractions"),
  );
  aligned(
    input.preHarvestShadeFractions,
    input.postHarvestShadeFractions,
    "preHarvestShadeFractions",
  );
  aligned(
    input.preHarvestShadeFractions,
    input.representedStreamLengthsM,
    "preHarvestShadeFractions",
  );
  const localSignedShadeLossFractions = input.preHarvestShadeFractions.map(
      (v, i) => v - input.postHarvestShadeFractions[i],
    ),
    total = input.representedStreamLengthsM.reduce((a, b) => a + b, 0),
    lengthWeightedShadeLossFraction = localSignedShadeLossFractions.reduce(
      (s, v, i) => s + (v * input.representedStreamLengthsM[i]) / total,
      0,
    );
  return {
    localSignedShadeLossFractions,
    lengthWeightedShadeLossFraction,
    modelTemperatureChangeC:
      lengthWeightedShadeLossFraction *
      input.callerTemperatureCPerLostShadeFraction,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  preHarvestShadeFractions: [0.8, 0.6],
  postHarvestShadeFractions: [0.4, 0.8],
  representedStreamLengthsM: [100, 200],
  callerTemperatureCPerLostShadeFraction: 5,
} satisfies Input;
export const exampleOutput = {
  localSignedShadeLossFractions: [0.4, -0.2],
  lengthWeightedShadeLossFraction: 0,
  modelTemperatureChangeC: 0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/shade-removal-stream-temperature-increase-estimate",
  title: "Shade Removal Stream Temperature Increase Estimator",
  description:
    "Apply caller linear shade-loss/stream-temperature calibration to matched shade observations weighted by represented stream length; signed shade gains/cooling remain, with no universal hydrological response.",
  inputs: inputFields,
  outputs: [
    {
      id: "localSignedShadeLossFractions",
      label: "Local signed shade loss fractions",
      kind: "numberList",
    },
    {
      id: "lengthWeightedShadeLossFraction",
      label: "Length weighted shade loss fraction",
      kind: "number",
    },
    {
      id: "modelTemperatureChangeC",
      label: "Model temperature change c",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      preHarvestShadeFractions:
        value.preHarvestShadeFractions as readonly number[],
      postHarvestShadeFractions:
        value.postHarvestShadeFractions as readonly number[],
      representedStreamLengthsM:
        value.representedStreamLengthsM as readonly number[],
      callerTemperatureCPerLostShadeFraction:
        value.callerTemperatureCPerLostShadeFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
