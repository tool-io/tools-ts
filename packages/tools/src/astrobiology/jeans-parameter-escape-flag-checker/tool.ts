import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch52-shared.js";
export type Input = Readonly<{
  readonly bodyMassKg: number;
  readonly exobaseRadiusM: number;
  readonly particleMassKg: number;
  readonly exobaseTemperatureK: number;
  readonly callerReviewLambda: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "bodyMassKg", label: "Body mass kg", kind: "number" },
  { id: "exobaseRadiusM", label: "Exobase radius m", kind: "number" },
  { id: "particleMassKg", label: "Particle mass kg", kind: "number" },
  { id: "exobaseTemperatureK", label: "Exobase temperature k", kind: "number" },
  { id: "callerReviewLambda", label: "Caller review lambda", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  [
    i.bodyMassKg,
    i.exobaseRadiusM,
    i.particleMassKg,
    i.exobaseTemperatureK,
    i.callerReviewLambda,
  ].forEach((v) => positive(v, "parameter"));
  const l =
    (6.6743e-11 * i.bodyMassKg * i.particleMassKg) /
    (1.380649e-23 * i.exobaseTemperatureK * i.exobaseRadiusM);
  return { jeansParameter: l, callerLowLambdaReview: l < i.callerReviewLambda };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: {
    bodyMassKg: 1e20,
    exobaseRadiusM: 1000000.0,
    particleMassKg: 1e-27,
    exobaseTemperatureK: 100,
    callerReviewLambda: 10,
  },
  output: {
    result: {
      jeansParameter: 0.004834175811520523,
      callerLowLambdaReview: true,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrobiology/jeans-parameter-escape-flag-checker",
  title: "Atmospheric Escape Jeans Parameter Escape Flag Checker",
  description:
    "Exobase Jeans binding parameter for actual particle mass/temperature, caller low-lambda flag; not atmospheric-loss lifetime or habitability determination.",
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
