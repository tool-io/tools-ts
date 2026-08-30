import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  fraction,
  aligned,
  ordered,
} from "../shared.js";
export type Input = Readonly<{
  readonly measuredAcrossWaistPositionsMm: readonly number[];
  readonly measuredNormalizedBrightness: readonly number[];
  readonly callerDarkBrightnessUpperThreshold: number;
}>;
export type Output = Readonly<{
  readonly observedCentralDarkBandWidthMm: number;
  readonly centralDarkBandObserved: boolean;
}>;
const inputFields = [
  {
    id: "measuredAcrossWaistPositionsMm",
    label: "Measured across waist positions mm",
    kind: "numberList",
  },
  {
    id: "measuredNormalizedBrightness",
    label: "Measured normalized brightness",
    kind: "numberList",
  },
  {
    id: "callerDarkBrightnessUpperThreshold",
    label: "Caller dark brightness upper threshold",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.measuredNormalizedBrightness.forEach((v) =>
    fraction(v, "measuredNormalizedBrightness"),
  );
  fraction(
    input.callerDarkBrightnessUpperThreshold,
    "callerDarkBrightnessUpperThreshold",
  );
  ordered(input.measuredAcrossWaistPositionsMm, "positions");
  aligned(
    input.measuredAcrossWaistPositionsMm,
    input.measuredNormalizedBrightness,
    "profile",
  );
  const center = input.measuredAcrossWaistPositionsMm.indexOf(0);
  if (center < 0)
    simpleError(
      "center",
      "Caller aligned waist profile requires measured center at zero.",
    );
  if (
    input.measuredNormalizedBrightness[center] >=
    input.callerDarkBrightnessUpperThreshold
  )
    return {
      observedCentralDarkBandWidthMm: 0,
      centralDarkBandObserved: false,
    };
  let lo = center,
    hi = center;
  while (
    lo > 0 &&
    input.measuredNormalizedBrightness[lo - 1] <
      input.callerDarkBrightnessUpperThreshold
  )
    lo--;
  while (
    hi + 1 < input.measuredNormalizedBrightness.length &&
    input.measuredNormalizedBrightness[hi + 1] <
      input.callerDarkBrightnessUpperThreshold
  )
    hi++;
  return {
    observedCentralDarkBandWidthMm:
      input.measuredAcrossWaistPositionsMm[hi] -
      input.measuredAcrossWaistPositionsMm[lo],
    centralDarkBandObserved: true,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  measuredAcrossWaistPositionsMm: [-2, -1, 0, 1, 2],
  measuredNormalizedBrightness: [1, 0.2, 0.1, 0.2, 1],
  callerDarkBrightnessUpperThreshold: 0.3,
} satisfies Input;
export const exampleOutput = {
  observedCentralDarkBandWidthMm: 2,
  centralDarkBandObserved: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "gemology/bow-tie-predictor",
  title: "Bow-Tie Width Predictor Fancy Shapes",
  description:
    "Measure sampled central dark-band span on aligned waist brightness profile under caller threshold, rather than predict a bow-tie from cut dimensions; unresolved band edges are only observed sample brackets, not optical causation.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedCentralDarkBandWidthMm",
      label: "Observed central dark band width mm",
      kind: "number",
    },
    {
      id: "centralDarkBandObserved",
      label: "Central dark band observed",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      measuredAcrossWaistPositionsMm:
        value.measuredAcrossWaistPositionsMm as readonly number[],
      measuredNormalizedBrightness:
        value.measuredNormalizedBrightness as readonly number[],
      callerDarkBrightnessUpperThreshold:
        value.callerDarkBrightnessUpperThreshold as number,
    }),
});
export const run = tool.execute;
export default tool;
