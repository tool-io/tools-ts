import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  curve,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedSicBodyDiodeCurrentAmps: readonly number[];
  readonly observedMatchedSicBodyDiodeForwardV: readonly number[];
  readonly querySicBodyDiodeAmps: number;
}>;
export type Output = Readonly<{
  readonly interpolatedSicBodyDiodeForwardV: number;
  readonly localMeasuredResponseDerivative: number;
}>;
const inputFields = [
  {
    id: "observedSicBodyDiodeCurrentAmps",
    label: "Observed sic body diode current amps",
    kind: "numberList",
  },
  {
    id: "observedMatchedSicBodyDiodeForwardV",
    label: "Observed matched sic body diode forward v",
    kind: "numberList",
  },
  {
    id: "querySicBodyDiodeAmps",
    label: "Query sic body diode amps",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedMatchedSicBodyDiodeForwardV.forEach((v) =>
    positive(v, "observedMatchedSicBodyDiodeForwardV"),
  );
  input.observedSicBodyDiodeCurrentAmps.forEach((v) =>
    nonnegative(v, "observedSicBodyDiodeCurrentAmps"),
  );
  nonnegative(input.querySicBodyDiodeAmps, "querySicBodyDiodeAmps");
  const result = curve(
    input.observedSicBodyDiodeCurrentAmps,
    input.observedMatchedSicBodyDiodeForwardV,
    input.querySicBodyDiodeAmps,
  );
  return {
    interpolatedSicBodyDiodeForwardV: result.value,
    localMeasuredResponseDerivative: result.slope,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedSicBodyDiodeCurrentAmps: [1, 2, 3],
  observedMatchedSicBodyDiodeForwardV: [2, 4, 8],
  querySicBodyDiodeAmps: 2.5,
} satisfies Input;
export const exampleOutput = {
  interpolatedSicBodyDiodeForwardV: 6,
  localMeasuredResponseDerivative: 4,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/sic-mosfet-body-diode-forward-voltage",
  title: "Semiconductor Sic Mosfet Body Diode Forward Voltage Calculator",
  description:
    "Read actual same-temperature SiC body-diode current/voltage calibration, not ideal Shockley diode parameter inference. Independently matched measured piecewise-linear curve only, local slope retained; no extrapolation, invented material constants, process recipe or safety claim.",
  inputs: inputFields,
  outputs: [
    {
      id: "interpolatedSicBodyDiodeForwardV",
      label: "Interpolated sic body diode forward v",
      kind: "number",
    },
    {
      id: "localMeasuredResponseDerivative",
      label: "Local measured response derivative",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedSicBodyDiodeCurrentAmps:
        value.observedSicBodyDiodeCurrentAmps as readonly number[],
      observedMatchedSicBodyDiodeForwardV:
        value.observedMatchedSicBodyDiodeForwardV as readonly number[],
      querySicBodyDiodeAmps: value.querySicBodyDiodeAmps as number,
    }),
});
export const run = tool.execute;
export default tool;
