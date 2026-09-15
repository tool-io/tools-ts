import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  simpleError,
} from "../batch52-shared.js";
export type Input = Readonly<{
  readonly lensMassKg: number;
  readonly lensDistanceM: number;
  readonly sourceDistanceM: number;
  readonly transverseSpeedMPerS: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "lensMassKg", label: "Lens mass kg", kind: "number" },
  { id: "lensDistanceM", label: "Lens distance m", kind: "number" },
  { id: "sourceDistanceM", label: "Source distance m", kind: "number" },
  {
    id: "transverseSpeedMPerS",
    label: "Transverse speed m per s",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  [
    i.lensMassKg,
    i.lensDistanceM,
    i.sourceDistanceM,
    i.transverseSpeedMPerS,
  ].forEach((v) => positive(v, "parameter"));
  if (i.lensDistanceM >= i.sourceDistanceM)
    simpleError("distance", "Lens strictly foreground.");
  return {
    einsteinCrossingDays:
      Math.sqrt(
        ((4 * 6.6743e-11 * i.lensMassKg) / 299792458 ** 2) *
          i.lensDistanceM *
          (1 - i.lensDistanceM / i.sourceDistanceM),
      ) /
      i.transverseSpeedMPerS /
      86400,
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: {
    lensMassKg: 1e30,
    lensDistanceM: 1e18,
    sourceDistanceM: 2e18,
    transverseSpeedMPerS: 100000.0,
  },
  output: { result: { einsteinCrossingDays: 4.4604986704467 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrobiology/microlensing-einstein-crossing-time-days",
  title: "Microlensing Einstein Radius Crossing Time Days Calculator",
  description:
    "Point-lens Einstein-radius crossing time, geometric distances and effective transverse speed supplied; no event duration at a magnification threshold.",
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
