import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly callerDownstreamOperatingTimesSeconds: readonly number[];
  readonly callerUpstreamOperatingTimesSeconds: readonly number[];
  readonly callerVerifiedCoordinationMarginsSeconds: readonly number[];
}>;
export type Output = Readonly<{
  readonly signedCoordinationReserveSeconds: readonly number[];
  readonly knownCoordinationReviewIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "callerDownstreamOperatingTimesSeconds",
    label: "Caller downstream operating times seconds",
    kind: "numberList",
  },
  {
    id: "callerUpstreamOperatingTimesSeconds",
    label: "Caller upstream operating times seconds",
    kind: "numberList",
  },
  {
    id: "callerVerifiedCoordinationMarginsSeconds",
    label: "Caller verified coordination margins seconds",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerDownstreamOperatingTimesSeconds.forEach((v) =>
    nonnegative(v, "callerDownstreamOperatingTimesSeconds"),
  );
  input.callerUpstreamOperatingTimesSeconds.forEach((v) =>
    nonnegative(v, "callerUpstreamOperatingTimesSeconds"),
  );
  input.callerVerifiedCoordinationMarginsSeconds.forEach((v) =>
    nonnegative(v, "callerVerifiedCoordinationMarginsSeconds"),
  );
  aligned(
    input.callerDownstreamOperatingTimesSeconds,
    input.callerUpstreamOperatingTimesSeconds,
    "callerDownstreamOperatingTimesSeconds",
  );
  aligned(
    input.callerDownstreamOperatingTimesSeconds,
    input.callerVerifiedCoordinationMarginsSeconds,
    "callerDownstreamOperatingTimesSeconds",
  );
  const reserves = input.callerDownstreamOperatingTimesSeconds.map(
    (v, i) =>
      input.callerUpstreamOperatingTimesSeconds[i] -
      v -
      input.callerVerifiedCoordinationMarginsSeconds[i],
  );
  return {
    signedCoordinationReserveSeconds: reserves,
    knownCoordinationReviewIndices: reserves.flatMap((v, i) =>
      v < 0 ? [i] : [],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerDownstreamOperatingTimesSeconds: [0.1, 0.2],
  callerUpstreamOperatingTimesSeconds: [0.3, 0.25],
  callerVerifiedCoordinationMarginsSeconds: [0.1, 0.1],
} satisfies Input;
export const exampleOutput = {
  signedCoordinationReserveSeconds: [0.1, -0.05],
  knownCoordinationReviewIndices: [1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/protection-coordination-time",
  title: "Protection Coordination Time Calculator",
  description:
    "Audit independently established same-fault protection operating-time pairs and caller margins, no relay settings or verified selectivity. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedCoordinationReserveSeconds",
      label: "Signed coordination reserve seconds",
      kind: "numberList",
    },
    {
      id: "knownCoordinationReviewIndices",
      label: "Known coordination review indices",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerDownstreamOperatingTimesSeconds:
        value.callerDownstreamOperatingTimesSeconds as readonly number[],
      callerUpstreamOperatingTimesSeconds:
        value.callerUpstreamOperatingTimesSeconds as readonly number[],
      callerVerifiedCoordinationMarginsSeconds:
        value.callerVerifiedCoordinationMarginsSeconds as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
