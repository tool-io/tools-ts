import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedBitUpstreamPressurePa: readonly number[];
  readonly observedBitDownstreamPressurePa: readonly number[];
  readonly observedIndependentNonNozzleLossPa: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedResidualNozzlePressureDropsPa: readonly number[];
}>;
const inputFields = [
  {
    id: "observedBitUpstreamPressurePa",
    label: "Observed bit upstream pressure pa",
    kind: "numberList",
  },
  {
    id: "observedBitDownstreamPressurePa",
    label: "Observed bit downstream pressure pa",
    kind: "numberList",
  },
  {
    id: "observedIndependentNonNozzleLossPa",
    label: "Observed independent non nozzle loss pa",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedIndependentNonNozzleLossPa.forEach((v) =>
    nonnegative(v, "observedIndependentNonNozzleLossPa"),
  );
  aligned(
    input.observedBitUpstreamPressurePa,
    input.observedBitDownstreamPressurePa,
    "observedBitUpstreamPressurePa",
  );
  aligned(
    input.observedBitUpstreamPressurePa,
    input.observedIndependentNonNozzleLossPa,
    "observedBitUpstreamPressurePa",
  );
  return {
    observedResidualNozzlePressureDropsPa:
      input.observedBitUpstreamPressurePa.map(
        (v, i) =>
          v -
          input.observedBitDownstreamPressurePa[i] -
          input.observedIndependentNonNozzleLossPa[i],
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedBitUpstreamPressurePa: [100, 200],
  observedBitDownstreamPressurePa: [20, 40],
  observedIndependentNonNozzleLossPa: [10, 20],
} satisfies Input;
export const exampleOutput = {
  observedResidualNozzlePressureDropsPa: [70, 140],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "petroleum/nozzle-pressure-drop",
  title: "Petroleum Nozzle Pressure Drop Calculator",
  description:
    "Audit actual bit pressure differential after independent non-nozzle loss subtraction, signed instrumentation mismatch retained; not Bernoulli or discharge coefficient nozzle model. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedResidualNozzlePressureDropsPa",
      label: "Observed residual nozzle pressure drops pa",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedBitUpstreamPressurePa:
        value.observedBitUpstreamPressurePa as readonly number[],
      observedBitDownstreamPressurePa:
        value.observedBitDownstreamPressurePa as readonly number[],
      observedIndependentNonNozzleLossPa:
        value.observedIndependentNonNozzleLossPa as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
