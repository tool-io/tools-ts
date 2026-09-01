import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedDesignWastewaterLitersDay: number;
  readonly callerIndependentlyVerifiedSoilLoadingLitersM2Day: number;
  readonly callerReservedReplacementAreaFraction: number;
}>;
export type Output = Readonly<{
  readonly requiredActiveDrainFieldAreaM2: number;
  readonly requiredDrainFieldAreaIncludingReserveM2: number;
}>;
const inputFields = [
  {
    id: "observedDesignWastewaterLitersDay",
    label: "Observed design wastewater liters day",
    kind: "number",
  },
  {
    id: "callerIndependentlyVerifiedSoilLoadingLitersM2Day",
    label: "Caller independently verified soil loading liters m2 day",
    kind: "number",
  },
  {
    id: "callerReservedReplacementAreaFraction",
    label: "Caller reserved replacement area fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.callerIndependentlyVerifiedSoilLoadingLitersM2Day,
    "callerIndependentlyVerifiedSoilLoadingLitersM2Day",
  );
  nonnegative(
    input.observedDesignWastewaterLitersDay,
    "observedDesignWastewaterLitersDay",
  );
  nonnegative(
    input.callerReservedReplacementAreaFraction,
    "callerReservedReplacementAreaFraction",
  );
  const active =
    input.observedDesignWastewaterLitersDay /
    input.callerIndependentlyVerifiedSoilLoadingLitersM2Day;
  return {
    requiredActiveDrainFieldAreaM2: active,
    requiredDrainFieldAreaIncludingReserveM2:
      active * (1 + input.callerReservedReplacementAreaFraction),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedDesignWastewaterLitersDay: 600,
  callerIndependentlyVerifiedSoilLoadingLitersM2Day: 20,
  callerReservedReplacementAreaFraction: 0.5,
} satisfies Input;
export const exampleOutput = {
  requiredActiveDrainFieldAreaM2: 30,
  requiredDrainFieldAreaIncludingReserveM2: 45,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/septic-drain-field-area",
  title: "Plumbing Septic Drain Field Area Calculator",
  description:
    "Budget actual design wastewater over independently justified soil loading with explicit extra replacement reserve; not automatic percolation-test→soil loading, treatment approval or universal drain-field standard.",
  inputs: inputFields,
  outputs: [
    {
      id: "requiredActiveDrainFieldAreaM2",
      label: "Required active drain field area m2",
      kind: "number",
    },
    {
      id: "requiredDrainFieldAreaIncludingReserveM2",
      label: "Required drain field area including reserve m2",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedDesignWastewaterLitersDay:
        value.observedDesignWastewaterLitersDay as number,
      callerIndependentlyVerifiedSoilLoadingLitersM2Day:
        value.callerIndependentlyVerifiedSoilLoadingLitersM2Day as number,
      callerReservedReplacementAreaFraction:
        value.callerReservedReplacementAreaFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
