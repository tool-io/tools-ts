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
  aligned,
  ordered,
  mean,
} from "../shared.js";
export type Input = Readonly<{
  readonly timesSeconds: readonly number[];
  readonly voltageMv: readonly number[];
  readonly currentNa: readonly number[];
  readonly frequencyHz: number;
}>;
export type Output = Readonly<{
  readonly voltageAmplitudeMv: number;
  readonly currentAmplitudeNa: number;
  readonly impedanceMagnitudeMohm: number;
  readonly phaseDegrees: number;
}>;
const inputFields = [
  { id: "timesSeconds", label: "Times seconds", kind: "numberList" },
  { id: "voltageMv", label: "Voltage mv", kind: "numberList" },
  { id: "currentNa", label: "Current na", kind: "numberList" },
  { id: "frequencyHz", label: "Frequency hz", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(input.timesSeconds, input.voltageMv, "timesSeconds");
  aligned(input.timesSeconds, input.currentNa, "timesSeconds");
  ordered(input.timesSeconds, "timesSeconds");
  positive(input.frequencyHz, "frequencyHz");
  if (input.timesSeconds.length < 4)
    simpleError("timesSeconds", "At least four samples required.");
  const fit = (y: readonly number[]) => {
    const sine = input.timesSeconds.map((t) =>
        Math.sin(2 * Math.PI * input.frequencyHz * t),
      ),
      cosine = input.timesSeconds.map((t) =>
        Math.cos(2 * Math.PI * input.frequencyHz * t),
      ),
      s = mean(sine),
      c = mean(cosine),
      m = mean(y),
      ss = sine.reduce((a, v) => a + (v - s) ** 2, 0),
      cc = cosine.reduce((a, v) => a + (v - c) ** 2, 0),
      sc = sine.reduce((a, v, i) => a + (v - s) * (cosine[i] - c), 0),
      sy = sine.reduce((a, v, i) => a + (v - s) * (y[i] - m), 0),
      cy = cosine.reduce((a, v, i) => a + (v - c) * (y[i] - m), 0),
      det = positive(ss * cc - sc * sc, "timesSeconds"),
      A = (sy * cc - cy * sc) / det,
      B = (cy * ss - sy * sc) / det;
    return { amplitude: Math.hypot(A, B), phase: Math.atan2(B, A) };
  };
  const v = fit(input.voltageMv),
    i = fit(input.currentNa),
    currentAmplitudeNa = positive(i.amplitude, "currentNa");
  positive(v.amplitude, "voltageMv");
  const phaseDegrees =
    ((((v.phase - i.phase) * 180) / Math.PI + 540) % 360) - 180;
  return {
    voltageAmplitudeMv: v.amplitude,
    currentAmplitudeNa,
    impedanceMagnitudeMohm: v.amplitude / currentAmplitudeNa,
    phaseDegrees,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  timesSeconds: [0, 0.25, 0.5, 0.75],
  voltageMv: [0, 2, 0, -2],
  currentNa: [0, 1, 0, -1],
  frequencyHz: 1,
} satisfies Input;
export const exampleOutput = {
  voltageAmplitudeMv: 2,
  currentAmplitudeNa: 1,
  impedanceMagnitudeMohm: 2,
  phaseDegrees: 0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/sinusoidal-neuronal-impedance",
  title: "Impedance Amplitude",
  description:
    "Fit sine/cosine components with a DC intercept to simultaneous voltage/current samples at a supplied injection frequency and derive complex impedance magnitude/phase; no FFT leakage assumption is needed.",
  inputs: inputFields,
  outputs: [
    { id: "voltageAmplitudeMv", label: "Voltage amplitude mv", kind: "number" },
    { id: "currentAmplitudeNa", label: "Current amplitude na", kind: "number" },
    {
      id: "impedanceMagnitudeMohm",
      label: "Impedance magnitude mohm",
      kind: "number",
    },
    { id: "phaseDegrees", label: "Phase degrees", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      timesSeconds: value.timesSeconds as readonly number[],
      voltageMv: value.voltageMv as readonly number[],
      currentNa: value.currentNa as readonly number[],
      frequencyHz: value.frequencyHz as number,
    }),
});
export const run = tool.execute;
export default tool;
