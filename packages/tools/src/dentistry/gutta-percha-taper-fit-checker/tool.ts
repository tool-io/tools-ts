import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  nonnegative,
} from "../batch47-shared.js";
export type Input = Readonly<{
  readonly actualMeasuredGuttaPerchaDiametersMm: readonly number[];
  readonly matchedIndependentlyMeasuredPreparedCanalDiametersMm: readonly number[];
  readonly callerClinicianApplicableAbsoluteToleranceMm: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualMeasuredGuttaPerchaDiametersMm",
    label: "Actual measured gutta percha diameters mm",
    kind: "numberList",
  },
  {
    id: "matchedIndependentlyMeasuredPreparedCanalDiametersMm",
    label: "Matched independently measured prepared canal diameters mm",
    kind: "numberList",
  },
  {
    id: "callerClinicianApplicableAbsoluteToleranceMm",
    label: "Caller clinician applicable absolute tolerance mm",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  aligned(
    input.actualMeasuredGuttaPerchaDiametersMm,
    input.matchedIndependentlyMeasuredPreparedCanalDiametersMm,
    "positions",
  );
  [
    input.actualMeasuredGuttaPerchaDiametersMm,
    input.matchedIndependentlyMeasuredPreparedCanalDiametersMm,
  ].forEach((v) => v.forEach((x) => nonnegative(x, "diameter")));
  nonnegative(input.callerClinicianApplicableAbsoluteToleranceMm, "tolerance");
  const d = input.actualMeasuredGuttaPerchaDiametersMm.map(
    (v, i) => v - input.matchedIndependentlyMeasuredPreparedCanalDiametersMm[i],
  );
  return {
    signedConeMinusCanalMm: d,
    withinCallerToleranceFlags: d.map((v) =>
      Math.abs(v) <= input.callerClinicianApplicableAbsoluteToleranceMm + 1e-12
        ? 1
        : 0,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualMeasuredGuttaPerchaDiametersMm: [0.3, 0.5],
    matchedIndependentlyMeasuredPreparedCanalDiametersMm: [0.4, 0.4],
    callerClinicianApplicableAbsoluteToleranceMm: 0.1,
  },
  output: {
    result: {
      signedConeMinusCanalMm: [-0.1, 0.1],
      withinCallerToleranceFlags: [1, 1],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dentistry/gutta-percha-taper-fit-checker",
  title: "Gutta-Percha Taper Fit Checker",
  description:
    "Actual same-position cone/canal diameter discrepancies against independently applicable geometric tolerance. Not establish three-dimensional fit, tug-back, apical seal, obturation quality or safe insertion.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
