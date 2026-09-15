import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch52-shared.js";
export type Input = Readonly<{
  readonly separationRad: number;
  readonly wavelengthM: number;
  readonly apertureM: number;
  readonly callerLambdaDMultiplier: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "separationRad", label: "Separation rad", kind: "number" },
  { id: "wavelengthM", label: "Wavelength m", kind: "number" },
  { id: "apertureM", label: "Aperture m", kind: "number" },
  {
    id: "callerLambdaDMultiplier",
    label: "Caller lambda d multiplier",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  nonnegative(i.separationRad, "separation");
  positive(i.wavelengthM, "wavelength");
  positive(i.apertureM, "aperture");
  positive(i.callerLambdaDMultiplier, "iwa");
  return {
    outsideOrAtCallerIwa:
      i.separationRad >=
      (i.callerLambdaDMultiplier * i.wavelengthM) / i.apertureM,
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: {
    separationRad: 2e-6,
    wavelengthM: 1e-6,
    apertureM: 1,
    callerLambdaDMultiplier: 2,
  },
  output: { result: { outsideOrAtCallerIwa: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrobiology/coronagraph-inner-working-angle-checker",
  title: "Inner Working Angle Coronagraph Separation lambda/D Check",
  description:
    "Angular separation compared to caller coronagraph IWA multiple of lambda/D; no contrast, throughput or successful imaging guarantee.",
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
