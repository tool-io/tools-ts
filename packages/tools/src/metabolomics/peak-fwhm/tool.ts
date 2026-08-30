import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly timesMinutes: readonly number[];
  readonly intensities: readonly number[];
}>;
export type Output = Readonly<{
  readonly peakTimeMinutes: number;
  readonly leftHalfHeightMinute: number;
  readonly rightHalfHeightMinute: number;
  readonly fwhmMinutes: number;
}>;
export const calculate = (input: Input): Output => {
  const t = input.timesMinutes,
    y = input.intensities,
    n = t.length;
  if (n < 3 || n !== y.length || t.some((v, i) => i > 0 && v <= t[i - 1]))
    simpleError(
      "timesMinutes",
      "Aligned strictly increasing chromatogram samples required.",
    );
  const peak = Math.max(...y),
    index = y.indexOf(peak),
    half = peak / 2;
  if (index === 0 || index === n - 1 || peak <= 0)
    simpleError("intensities", "Interior positive peak required.");
  let left = index - 1;
  while (left > 0 && y[left] > half) left--;
  let right = index + 1;
  while (right < n - 1 && y[right] > half) right++;
  if (
    y[left] > half ||
    y[right] > half ||
    y[left + 1] === y[left] ||
    y[right] === y[right - 1]
  )
    simpleError("intensities", "Half-height crossings not found.");
  const leftHalfHeightMinute =
      t[left] +
      ((half - y[left]) / (y[left + 1] - y[left])) * (t[left + 1] - t[left]),
    rightHalfHeightMinute =
      t[right - 1] +
      ((half - y[right - 1]) / (y[right] - y[right - 1])) *
        (t[right] - t[right - 1]);
  return {
    peakTimeMinutes: t[index],
    leftHalfHeightMinute,
    rightHalfHeightMinute,
    fwhmMinutes: rightHalfHeightMinute - leftHalfHeightMinute,
  };
};
export const exampleInput = {
  timesMinutes: [0, 1, 2, 3, 4],
  intensities: [0, 5, 10, 5, 0],
} satisfies Input;
export const exampleOutput = {
  peakTimeMinutes: 2,
  leftHalfHeightMinute: 1,
  rightHalfHeightMinute: 3,
  fwhmMinutes: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/peak-fwhm",
  title: "Peak FWHM",
  description: "Interpolate chromatographic full width at half maximum.",
  inputs: [
    { id: "timesMinutes", kind: "numberList", label: "Times minutes" },
    { id: "intensities", kind: "numberList", label: "Intensities" },
  ],
  outputs: [
    { id: "peakTimeMinutes", kind: "number", label: "Peak time minutes" },
    {
      id: "leftHalfHeightMinute",
      kind: "number",
      label: "Left half height minute",
    },
    {
      id: "rightHalfHeightMinute",
      kind: "number",
      label: "Right half height minute",
    },
    { id: "fwhmMinutes", kind: "number", label: "Fwhm minutes" },
  ],
  calculate: (value) =>
    calculate({
      timesMinutes: value.timesMinutes as readonly number[],
      intensities: value.intensities as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
