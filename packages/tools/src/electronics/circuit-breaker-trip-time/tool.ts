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
  interpolateLog,
} from "../batch32-shared.js";
export type Input = Readonly<{
  readonly callerCurveCurrentMultiples: readonly number[];
  readonly callerCurveMinimumTripSeconds: readonly number[];
  readonly callerCurveMaximumTripSeconds: readonly number[];
  readonly observedCurrentMultiple: number;
}>;
export type Output = Readonly<{
  readonly curveMinimumTripSeconds: number;
  readonly curveMaximumTripSeconds: number;
}>;
const inputFields = [
  {
    id: "callerCurveCurrentMultiples",
    label: "Caller curve current multiples",
    kind: "numberList",
  },
  {
    id: "callerCurveMinimumTripSeconds",
    label: "Caller curve minimum trip seconds",
    kind: "numberList",
  },
  {
    id: "callerCurveMaximumTripSeconds",
    label: "Caller curve maximum trip seconds",
    kind: "numberList",
  },
  {
    id: "observedCurrentMultiple",
    label: "Observed current multiple",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerCurveCurrentMultiples.forEach((v) =>
    positive(v, "callerCurveCurrentMultiples"),
  );
  input.callerCurveMinimumTripSeconds.forEach((v) =>
    positive(v, "callerCurveMinimumTripSeconds"),
  );
  input.callerCurveMaximumTripSeconds.forEach((v) =>
    positive(v, "callerCurveMaximumTripSeconds"),
  );
  positive(input.observedCurrentMultiple, "observedCurrentMultiple");
  aligned(
    input.callerCurveCurrentMultiples,
    input.callerCurveMinimumTripSeconds,
    "callerCurveCurrentMultiples",
  );
  aligned(
    input.callerCurveCurrentMultiples,
    input.callerCurveMaximumTripSeconds,
    "callerCurveCurrentMultiples",
  );
  if (
    input.callerCurveMinimumTripSeconds.some(
      (v, i) => v > input.callerCurveMaximumTripSeconds[i],
    )
  )
    simpleError("curve", "Ordered supplied time-current envelope required.");
  const x = input.callerCurveCurrentMultiples,
    lo = Math.exp(
      interpolateLog(
        x,
        input.callerCurveMinimumTripSeconds.map(Math.log),
        input.observedCurrentMultiple,
      ),
    ),
    hi = Math.exp(
      interpolateLog(
        x,
        input.callerCurveMaximumTripSeconds.map(Math.log),
        input.observedCurrentMultiple,
      ),
    );
  return { curveMinimumTripSeconds: lo, curveMaximumTripSeconds: hi };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerCurveCurrentMultiples: [2, 4, 8],
  callerCurveMinimumTripSeconds: [10, 2, 1],
  callerCurveMaximumTripSeconds: [20, 4, 2],
  observedCurrentMultiple: 4,
} satisfies Input;
export const exampleOutput = {
  curveMinimumTripSeconds: 2,
  curveMaximumTripSeconds: 4,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "electronics/circuit-breaker-trip-time",
  title: "Circuit Breaker Trip Time Calculator",
  description:
    "Read actual caller breaker time-current envelope using log-log interpolation only inside supplied observed/rated curve; no invented trip family, fault clearing guarantee, certified protection coordination or conducting a test.",
  inputs: inputFields,
  outputs: [
    {
      id: "curveMinimumTripSeconds",
      label: "Curve minimum trip seconds",
      kind: "number",
    },
    {
      id: "curveMaximumTripSeconds",
      label: "Curve maximum trip seconds",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerCurveCurrentMultiples:
        value.callerCurveCurrentMultiples as readonly number[],
      callerCurveMinimumTripSeconds:
        value.callerCurveMinimumTripSeconds as readonly number[],
      callerCurveMaximumTripSeconds:
        value.callerCurveMaximumTripSeconds as readonly number[],
      observedCurrentMultiple: value.observedCurrentMultiple as number,
    }),
});
export const run = tool.execute;
export default tool;
