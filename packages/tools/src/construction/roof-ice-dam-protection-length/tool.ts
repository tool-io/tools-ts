import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedExteriorWallInsetHorizontalM: readonly number[];
  readonly callerVerifiedInteriorProtectionHorizontalM: readonly number[];
  readonly callerRoofRiseRunRatios: readonly number[];
}>;
export type Output = Readonly<{
  readonly callerSlopedIceBarrierLengthsM: readonly number[];
}>;
const inputFields = [
  {
    id: "observedExteriorWallInsetHorizontalM",
    label: "Observed exterior wall inset horizontal m",
    kind: "numberList",
  },
  {
    id: "callerVerifiedInteriorProtectionHorizontalM",
    label: "Caller verified interior protection horizontal m",
    kind: "numberList",
  },
  {
    id: "callerRoofRiseRunRatios",
    label: "Caller roof rise run ratios",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedExteriorWallInsetHorizontalM.forEach((v) =>
    nonnegative(v, "observedExteriorWallInsetHorizontalM"),
  );
  input.callerVerifiedInteriorProtectionHorizontalM.forEach((v) =>
    nonnegative(v, "callerVerifiedInteriorProtectionHorizontalM"),
  );
  input.callerRoofRiseRunRatios.forEach((v) =>
    nonnegative(v, "callerRoofRiseRunRatios"),
  );
  aligned(
    input.observedExteriorWallInsetHorizontalM,
    input.callerVerifiedInteriorProtectionHorizontalM,
    "observedExteriorWallInsetHorizontalM",
  );
  aligned(
    input.observedExteriorWallInsetHorizontalM,
    input.callerRoofRiseRunRatios,
    "observedExteriorWallInsetHorizontalM",
  );
  return {
    callerSlopedIceBarrierLengthsM:
      input.observedExteriorWallInsetHorizontalM.map(
        (v, i) =>
          (v + input.callerVerifiedInteriorProtectionHorizontalM[i]) *
          Math.hypot(1, input.callerRoofRiseRunRatios[i]),
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedExteriorWallInsetHorizontalM: [1, 2],
  callerVerifiedInteriorProtectionHorizontalM: [0.5, 0.5],
  callerRoofRiseRunRatios: [0.75, 0],
} satisfies Input;
export const exampleOutput = {
  callerSlopedIceBarrierLengthsM: [1.875, 2.5],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "construction/roof-ice-dam-protection-length",
  title: "Ice Dam Protection Length Calculator",
  description:
    "Actual eave-to-wall horizontal inset plus independently verified interior protection extent converted along each roof slope, not entire roof area or ice-dam prevention guarantee. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerSlopedIceBarrierLengthsM",
      label: "Caller sloped ice barrier lengths m",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedExteriorWallInsetHorizontalM:
        value.observedExteriorWallInsetHorizontalM as readonly number[],
      callerVerifiedInteriorProtectionHorizontalM:
        value.callerVerifiedInteriorProtectionHorizontalM as readonly number[],
      callerRoofRiseRunRatios:
        value.callerRoofRiseRunRatios as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
