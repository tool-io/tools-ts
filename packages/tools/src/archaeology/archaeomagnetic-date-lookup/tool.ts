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
  sum,
  shape,
  deg,
  vector3,
} from "../batch41-shared.js";
export type Input = Readonly<{
  readonly observedDirectionUnitVector: readonly number[];
  readonly callerCalibratedDatesYears: readonly number[];
  readonly callerCalibratedDirectionVectors: readonly (readonly number[])[];
  readonly callerAngularToleranceDegrees: number;
}>;
export type Output = Readonly<{
  readonly compatibleCallerSampledDatesYears: readonly number[];
  readonly sampleAngularDifferencesDegrees: readonly number[];
}>;
const inputFields = [
  {
    id: "observedDirectionUnitVector",
    label: "Observed direction unit vector",
    kind: "numberList",
  },
  {
    id: "callerCalibratedDatesYears",
    label: "Caller calibrated dates years",
    kind: "numberList",
  },
  {
    id: "callerCalibratedDirectionVectors",
    label: "Caller calibrated direction vectors",
    kind: "matrix",
  },
  {
    id: "callerAngularToleranceDegrees",
    label: "Caller angular tolerance degrees",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(
    input.callerAngularToleranceDegrees,
    "callerAngularToleranceDegrees",
  );
  aligned(
    input.callerCalibratedDatesYears,
    input.callerCalibratedDirectionVectors,
    "callerCalibratedDatesYears",
  );
  vector3(input.observedDirectionUnitVector, "observed direction");
  if (shape(input.callerCalibratedDirectionVectors, "directions") !== 3)
    simpleError(
      "directions",
      "Three independently same-frame directional components.",
    );
  const len = positive(
    Math.hypot(...input.observedDirectionUnitVector),
    "direction",
  );
  const a = input.callerCalibratedDirectionVectors.map((v) => {
    const m = positive(Math.hypot(...v), "reference direction");
    return deg(
      Math.acos(
        Math.max(
          -1,
          Math.min(
            1,
            sum(
              v.map(
                (x, i) =>
                  (x / m) * (input.observedDirectionUnitVector[i] / len),
              ),
            ),
          ),
        ),
      ),
    );
  });
  return {
    compatibleCallerSampledDatesYears: input.callerCalibratedDatesYears.filter(
      (_, i) => a[i] <= input.callerAngularToleranceDegrees,
    ),
    sampleAngularDifferencesDegrees: a,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedDirectionUnitVector: [1, 0, 0],
  callerCalibratedDatesYears: [100, 200],
  callerCalibratedDirectionVectors: [
    [1, 0, 0],
    [0, 1, 0],
  ],
  callerAngularToleranceDegrees: 10,
} satisfies Input;
export const exampleOutput = {
  compatibleCallerSampledDatesYears: [100],
  sampleAngularDifferencesDegrees: [0, 90],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archaeology/archaeomagnetic-date-lookup",
  title: "Archaeomagnetic Date Lookup",
  description:
    "Sampled archaeomagnetic direction compatibility against independently site/frame/edition-calibrated vectors; retains multi matches, not extrapolated dates, direction sign reversal or continuous age interval. Caller independently establishes sample/context/calibration applicability; not definitive chronology, provenance, taxonomy, disease or human identity.",
  inputs: inputFields,
  outputs: [
    {
      id: "compatibleCallerSampledDatesYears",
      label: "Compatible caller sampled dates years",
      kind: "numberList",
    },
    {
      id: "sampleAngularDifferencesDegrees",
      label: "Sample angular differences degrees",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedDirectionUnitVector:
        value.observedDirectionUnitVector as readonly number[],
      callerCalibratedDatesYears:
        value.callerCalibratedDatesYears as readonly number[],
      callerCalibratedDirectionVectors:
        value.callerCalibratedDirectionVectors as readonly (readonly number[])[],
      callerAngularToleranceDegrees:
        value.callerAngularToleranceDegrees as number,
    }),
});
export const run = tool.execute;
export default tool;
