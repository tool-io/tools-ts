import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  sequence,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly callerJackingPrestressPa: number;
  readonly observedCumulativeTendonAnglesRad: readonly number[];
  readonly observedCumulativeTendonLengthsM: readonly number[];
  readonly callerFrictionCoefficient: number;
  readonly callerWobblePerM: number;
}>;
export type Output = Readonly<{
  readonly frictionRetainedPrestressPa: readonly number[];
}>;
const inputFields = [
  {
    id: "callerJackingPrestressPa",
    label: "Caller jacking prestress pa",
    kind: "number",
  },
  {
    id: "observedCumulativeTendonAnglesRad",
    label: "Observed cumulative tendon angles rad",
    kind: "numberList",
  },
  {
    id: "observedCumulativeTendonLengthsM",
    label: "Observed cumulative tendon lengths m",
    kind: "numberList",
  },
  {
    id: "callerFrictionCoefficient",
    label: "Caller friction coefficient",
    kind: "number",
  },
  { id: "callerWobblePerM", label: "Caller wobble per m", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.callerJackingPrestressPa, "callerJackingPrestressPa");
  input.observedCumulativeTendonAnglesRad.forEach((v) =>
    nonnegative(v, "observedCumulativeTendonAnglesRad"),
  );
  input.observedCumulativeTendonLengthsM.forEach((v) =>
    nonnegative(v, "observedCumulativeTendonLengthsM"),
  );
  nonnegative(input.callerFrictionCoefficient, "callerFrictionCoefficient");
  nonnegative(input.callerWobblePerM, "callerWobblePerM");
  aligned(
    input.observedCumulativeTendonAnglesRad,
    input.observedCumulativeTendonLengthsM,
    "observedCumulativeTendonAnglesRad",
  );
  sequence(input.observedCumulativeTendonAnglesRad, "absolute angular change");
  sequence(input.observedCumulativeTendonLengthsM, "length");
  return {
    frictionRetainedPrestressPa: input.observedCumulativeTendonAnglesRad.map(
      (v, i) =>
        input.callerJackingPrestressPa *
        Math.exp(
          -input.callerFrictionCoefficient * v -
            input.callerWobblePerM * input.observedCumulativeTendonLengthsM[i],
        ),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerJackingPrestressPa: 100,
  observedCumulativeTendonAnglesRad: [0, 1, 2],
  observedCumulativeTendonLengthsM: [0, 10, 20],
  callerFrictionCoefficient: 0.1,
  callerWobblePerM: 0.01,
} satisfies Input;
export const exampleOutput = {
  frictionRetainedPrestressPa: [100, 81.87307530779819, 67.03200460356393],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/prestressed-losses-friction",
  title: "Friction Prestress Losses Calculator",
  description:
    "One-end prestress P=P0 exp(−μα−kx), α cumulative ABSOLUTE angular change, no two-end jacking/slip interactions. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "frictionRetainedPrestressPa",
      label: "Friction retained prestress pa",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerJackingPrestressPa: value.callerJackingPrestressPa as number,
      observedCumulativeTendonAnglesRad:
        value.observedCumulativeTendonAnglesRad as readonly number[],
      observedCumulativeTendonLengthsM:
        value.observedCumulativeTendonLengthsM as readonly number[],
      callerFrictionCoefficient: value.callerFrictionCoefficient as number,
      callerWobblePerM: value.callerWobblePerM as number,
    }),
});
export const run = tool.execute;
export default tool;
