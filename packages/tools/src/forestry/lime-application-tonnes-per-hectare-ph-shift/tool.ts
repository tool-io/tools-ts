import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  linearFit,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedAlreadyAppliedLimeTonnesHa: readonly number[];
  readonly observedBeforeSoilPh: readonly number[];
  readonly observedAfterSoilPh: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedPhResponsePerAppliedTonneHa: number;
  readonly responseFitRSquared: number;
}>;
const inputFields = [
  {
    id: "observedAlreadyAppliedLimeTonnesHa",
    label: "Observed already applied lime tonnes ha",
    kind: "numberList",
  },
  {
    id: "observedBeforeSoilPh",
    label: "Observed before soil ph",
    kind: "numberList",
  },
  {
    id: "observedAfterSoilPh",
    label: "Observed after soil ph",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedAlreadyAppliedLimeTonnesHa.forEach((v) =>
    nonnegative(v, "observedAlreadyAppliedLimeTonnesHa"),
  );
  aligned(
    input.observedBeforeSoilPh,
    input.observedAfterSoilPh,
    "observedBeforeSoilPh",
  );
  aligned(
    input.observedBeforeSoilPh,
    input.observedAlreadyAppliedLimeTonnesHa,
    "observedBeforeSoilPh",
  );
  if (
    [...input.observedBeforeSoilPh, ...input.observedAfterSoilPh].some(
      (v) => v < 0 || v > 14,
    )
  )
    simpleError("pH", "Observed pH0–14.");
  const f = linearFit(
    input.observedAlreadyAppliedLimeTonnesHa,
    input.observedAfterSoilPh.map((v, i) => v - input.observedBeforeSoilPh[i]),
  );
  return {
    observedPhResponsePerAppliedTonneHa: f.slope,
    responseFitRSquared: f.rSquared,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedAlreadyAppliedLimeTonnesHa: [0, 1, 2],
  observedBeforeSoilPh: [5, 5, 5],
  observedAfterSoilPh: [5, 5.2, 5.4],
} satisfies Input;
export const exampleOutput = {
  observedPhResponsePerAppliedTonneHa: 0.2,
  responseFitRSquared: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/lime-application-tonnes-per-hectare-ph-shift",
  title: "Lime Application Tonnes/ha pH Shift Calculator",
  description:
    "Extract observed lime trial dose/pH-change contrast from already applied material, not a lime prescription or causal buffering/soil-response guarantee. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedPhResponsePerAppliedTonneHa",
      label: "Observed ph response per applied tonne ha",
      kind: "number",
    },
    {
      id: "responseFitRSquared",
      label: "Response fit r squared",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedAlreadyAppliedLimeTonnesHa:
        value.observedAlreadyAppliedLimeTonnesHa as readonly number[],
      observedBeforeSoilPh: value.observedBeforeSoilPh as readonly number[],
      observedAfterSoilPh: value.observedAfterSoilPh as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
