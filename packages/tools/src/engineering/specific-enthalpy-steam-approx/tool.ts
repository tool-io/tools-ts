import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, aligned, curve } from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedSteamEnthalpyCoordinates: readonly number[];
  readonly callerVerifiedSteamEnthalpyResponses: readonly number[];
  readonly querySteamEnthalpyCoordinate: number;
}>;
export type Output = Readonly<{
  readonly interpolatedMatchedResponse: number;
  readonly localObservedSlope: number;
}>;
const inputFields = [
  {
    id: "observedSteamEnthalpyCoordinates",
    label: "Observed steam enthalpy coordinates",
    kind: "numberList",
  },
  {
    id: "callerVerifiedSteamEnthalpyResponses",
    label: "Caller verified steam enthalpy responses",
    kind: "numberList",
  },
  {
    id: "querySteamEnthalpyCoordinate",
    label: "Query steam enthalpy coordinate",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.observedSteamEnthalpyCoordinates,
    input.callerVerifiedSteamEnthalpyResponses,
    "observedSteamEnthalpyCoordinates",
  );
  const v = curve(
    input.observedSteamEnthalpyCoordinates,
    input.callerVerifiedSteamEnthalpyResponses,
    input.querySteamEnthalpyCoordinate,
  );
  return { interpolatedMatchedResponse: v.value, localObservedSlope: v.slope };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedSteamEnthalpyCoordinates: [1, 2, 3],
  callerVerifiedSteamEnthalpyResponses: [2, 4, 8],
  querySteamEnthalpyCoordinate: 2.5,
} satisfies Input;
export const exampleOutput = {
  interpolatedMatchedResponse: 6,
  localObservedSlope: 4.0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/specific-enthalpy-steam-approx",
  title: "Steam Specific Enthalpy Approx Calculator",
  description:
    "Read independently matched steam pressure/phase temperature–enthalpy calibration, no ideal gas assumption. Independently matched piecewise-linear calibration, no extrapolation. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "interpolatedMatchedResponse",
      label: "Interpolated matched response",
      kind: "number",
    },
    { id: "localObservedSlope", label: "Local observed slope", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      observedSteamEnthalpyCoordinates:
        value.observedSteamEnthalpyCoordinates as readonly number[],
      callerVerifiedSteamEnthalpyResponses:
        value.callerVerifiedSteamEnthalpyResponses as readonly number[],
      querySteamEnthalpyCoordinate:
        value.querySteamEnthalpyCoordinate as number,
    }),
});
export const run = tool.execute;
export default tool;
