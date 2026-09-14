import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  sum,
} from "../batch52-shared.js";
export type Input = Readonly<{
  readonly frequencyBinWidthsHz: readonly number[];
  readonly heaveDensityM2PerHz: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "frequencyBinWidthsHz",
    label: "Frequency bin widths hz",
    kind: "numberList",
  },
  {
    id: "heaveDensityM2PerHz",
    label: "Heave density m2 per hz",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  aligned(i.frequencyBinWidthsHz, i.heaveDensityM2PerHz, "bins");
  i.frequencyBinWidthsHz.forEach((v) => positive(v, "width"));
  i.heaveDensityM2PerHz.forEach((v) => nonnegative(v, "density"));
  const m0 = sum(
    i.frequencyBinWidthsHz.map((w, j) => w * i.heaveDensityM2PerHz[j]),
  );
  return { zerothMomentM2: m0, spectralSignificantHeightM: 4 * Math.sqrt(m0) };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { frequencyBinWidthsHz: [0.5, 0.5], heaveDensityM2PerHz: [1, 1] },
  output: { result: { zerothMomentM2: 1, spectralSignificantHeightM: 4 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "oceanography/wave-buoy-heave-spectrum-hs-estimate",
  title: "Wave Buoy Heave Spectrum HS Estimate Calculator",
  description:
    "Rectangular-bin spectral integration Hm0=4sqrt(m0) from actual calibrated one-sided heave PSD; does not perform buoy-response correction or FFT.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
