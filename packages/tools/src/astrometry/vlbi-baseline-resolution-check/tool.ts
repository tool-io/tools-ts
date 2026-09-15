import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch52-shared.js";
export type Input = Readonly<{
  readonly wavelengthM: number;
  readonly baselineM: number;
  readonly callerTargetMicroarcsec: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "wavelengthM", label: "Wavelength m", kind: "number" },
  { id: "baselineM", label: "Baseline m", kind: "number" },
  {
    id: "callerTargetMicroarcsec",
    label: "Caller target microarcsec",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  positive(i.wavelengthM, "wavelength");
  positive(i.baselineM, "baseline");
  positive(i.callerTargetMicroarcsec, "target");
  return {
    nominalResolutionMeetsTarget:
      (i.wavelengthM / i.baselineM) * 206264806247.09636 <=
      i.callerTargetMicroarcsec,
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: {
    wavelengthM: 1e-6,
    baselineM: 206264806247.09637,
    callerTargetMicroarcsec: 1e-6,
  },
  output: { result: { nominalResolutionMeetsTarget: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrometry/vlbi-baseline-resolution-check",
  title: "VLBI Baseline Microarcsecond Angular Resolution Check",
  description:
    "Nominal lambda/baseline angular resolution compared to caller target; no synthesized beam, atmosphere/uv coverage or astrometric precision guarantee.",
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
