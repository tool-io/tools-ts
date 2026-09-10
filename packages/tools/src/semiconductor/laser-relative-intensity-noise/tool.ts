import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualIntensityNoisePsdWattsSquaredPerHz: number;
  readonly matchedMeanOpticalPowerWatts: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualIntensityNoisePsdWattsSquaredPerHz",
    label: "Actual intensity noise psd watts squared per hz",
    kind: "number",
  },
  {
    id: "matchedMeanOpticalPowerWatts",
    label: "Matched mean optical power watts",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.actualIntensityNoisePsdWattsSquaredPerHz, "PSD");
  positive(input.matchedMeanOpticalPowerWatts, "meanpower");
  const r = positive(
    input.actualIntensityNoisePsdWattsSquaredPerHz /
      input.matchedMeanOpticalPowerWatts ** 2,
    "RIN",
  );
  return { observedRinPerHz: r, observedRinDbPerHz: 10 * Math.log10(r) };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualIntensityNoisePsdWattsSquaredPerHz: 2,
    matchedMeanOpticalPowerWatts: 4,
  },
  output: {
    result: { observedRinPerHz: 0.125, observedRinDbPerHz: -9.030899869919436 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/laser-relative-intensity-noise",
  title: "Semiconductor Laser Relative Intensity Noise Calculator",
  description:
    "Actual intensity-noise PSDnormalized by mean optical power squared. One-/two-sided PSDand shot/electronic-background conventions independently verified; not fractional power noise integrated over bandwidth.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
