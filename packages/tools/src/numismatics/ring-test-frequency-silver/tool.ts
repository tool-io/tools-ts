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
  mean,
  band,
} from "../batch34-shared.js";
export type Input = Readonly<{
  readonly observedMatchedCoinRingPeaksHz: readonly number[];
  readonly callerVerifiedMatchedSilverPeakRangeHz: readonly number[];
  readonly callerMatchedGeometryAndSupportVerified: boolean;
}>;
export type Output = Readonly<{
  readonly observedMeanRingPeakHz: number;
  readonly observedRingPeakSpreadHz: number;
  readonly ringObservationsWithinCallerMatchedSilverBand: boolean;
}>;
const inputFields = [
  {
    id: "observedMatchedCoinRingPeaksHz",
    label: "Observed matched coin ring peaks hz",
    kind: "numberList",
  },
  {
    id: "callerVerifiedMatchedSilverPeakRangeHz",
    label: "Caller verified matched silver peak range hz",
    kind: "numberList",
  },
  {
    id: "callerMatchedGeometryAndSupportVerified",
    label: "Caller matched geometry and support verified",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedMatchedCoinRingPeaksHz.forEach((v) =>
    positive(v, "observedMatchedCoinRingPeaksHz"),
  );
  input.callerVerifiedMatchedSilverPeakRangeHz.forEach((v) =>
    positive(v, "callerVerifiedMatchedSilverPeakRangeHz"),
  );
  if (
    input.callerVerifiedMatchedSilverPeakRangeHz.length !== 2 ||
    !input.observedMatchedCoinRingPeaksHz.length
  )
    simpleError(
      "ring",
      "Actual peaks and ordered two-limit matched reference required.",
    );
  const lo = input.callerVerifiedMatchedSilverPeakRangeHz[0],
    hi = input.callerVerifiedMatchedSilverPeakRangeHz[1];
  band(0, lo, hi);
  return {
    observedMeanRingPeakHz: mean(input.observedMatchedCoinRingPeaksHz),
    observedRingPeakSpreadHz:
      Math.max(...input.observedMatchedCoinRingPeaksHz) -
      Math.min(...input.observedMatchedCoinRingPeaksHz),
    ringObservationsWithinCallerMatchedSilverBand:
      input.callerMatchedGeometryAndSupportVerified &&
      input.observedMatchedCoinRingPeaksHz.every((v) => band(v, lo, hi) >= 0),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedMatchedCoinRingPeaksHz: [3000, 3020],
  callerVerifiedMatchedSilverPeakRangeHz: [2900, 3100],
  callerMatchedGeometryAndSupportVerified: true,
} satisfies Input;
export const exampleOutput = {
  observedMeanRingPeakHz: 3010,
  observedRingPeakSpreadHz: 20,
  ringObservationsWithinCallerMatchedSilverBand: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "numismatics/ring-test-frequency-silver",
  title: "Ring Test Frequency Silver Calculator",
  description:
    "Compare actual repeated noninvasively supplied ring spectra peaks with independently verified same-geometry/support silver reference band; no universal silver frequency, striking procedure, metallurgical composition or authentication proof.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedMeanRingPeakHz",
      label: "Observed mean ring peak hz",
      kind: "number",
    },
    {
      id: "observedRingPeakSpreadHz",
      label: "Observed ring peak spread hz",
      kind: "number",
    },
    {
      id: "ringObservationsWithinCallerMatchedSilverBand",
      label: "Ring observations within caller matched silver band",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      observedMatchedCoinRingPeaksHz:
        value.observedMatchedCoinRingPeaksHz as readonly number[],
      callerVerifiedMatchedSilverPeakRangeHz:
        value.callerVerifiedMatchedSilverPeakRangeHz as readonly number[],
      callerMatchedGeometryAndSupportVerified:
        value.callerMatchedGeometryAndSupportVerified as boolean,
    }),
});
export const run = tool.execute;
export default tool;
