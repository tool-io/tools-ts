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
  maximum,
  crossing,
} from "../shared.js";
export type Input = Readonly<{
  readonly profileOffsetsMm: readonly number[];
  readonly measuredSpecularProfile: readonly number[];
  readonly backgroundSignal: number;
}>;
export type Output = Readonly<{
  readonly observedSpecularFwhmMm: number;
  readonly backgroundCorrectedPeakSignal: number;
}>;
const inputFields = [
  { id: "profileOffsetsMm", label: "Profile offsets mm", kind: "numberList" },
  {
    id: "measuredSpecularProfile",
    label: "Measured specular profile",
    kind: "numberList",
  },
  { id: "backgroundSignal", label: "Background signal", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.measuredSpecularProfile.forEach((v) =>
    nonnegative(v, "measuredSpecularProfile"),
  );
  nonnegative(input.backgroundSignal, "backgroundSignal");
  ordered(input.profileOffsetsMm, "offsets");
  aligned(input.profileOffsetsMm, input.measuredSpecularProfile, "profile");
  const corrected = input.measuredSpecularProfile.map(
      (v) => v - input.backgroundSignal,
    ),
    peak = positive(maximum(corrected), "peak"),
    i = corrected.indexOf(peak);
  if (
    i === 0 ||
    i === corrected.length - 1 ||
    corrected.filter((v) => v === peak).length !== 1
  )
    simpleError("peak", "Unique interior specular peak required.");
  const half = peak / 2,
    left = crossing(
      input.profileOffsetsMm.slice(0, i + 1),
      corrected.slice(0, i + 1),
      half,
    ),
    right = crossing(input.profileOffsetsMm.slice(i), corrected.slice(i), half);
  return {
    observedSpecularFwhmMm: right - left,
    backgroundCorrectedPeakSignal: peak,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  profileOffsetsMm: [-2, -1, 0, 1, 2],
  measuredSpecularProfile: [0, 1, 2, 1, 0],
  backgroundSignal: 0,
} satisfies Input;
export const exampleOutput = {
  observedSpecularFwhmMm: 2,
  backgroundCorrectedPeakSignal: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "gemology/pearl-luster-rater",
  title: "Pearl Luster Grade Rater",
  description:
    "Measure unique specular highlight FWHM from observed calibrated profile and background, not total specular share or a universal pearl-luster grade; missing/multiple half-height crossings are not invented.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedSpecularFwhmMm",
      label: "Observed specular fwhm mm",
      kind: "number",
    },
    {
      id: "backgroundCorrectedPeakSignal",
      label: "Background corrected peak signal",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      profileOffsetsMm: value.profileOffsetsMm as readonly number[],
      measuredSpecularProfile:
        value.measuredSpecularProfile as readonly number[],
      backgroundSignal: value.backgroundSignal as number,
    }),
});
export const run = tool.execute;
export default tool;
