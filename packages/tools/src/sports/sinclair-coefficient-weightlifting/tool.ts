import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  safeText,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedLifterBodyMassKg: number;
  readonly observedWeightliftingTotalKg: number;
  readonly callerVerifiedSinclairReferenceBodyMassKg: number;
  readonly callerVerifiedSinclairCycleCoefficient: number;
  readonly callerCoefficientCycleId: string;
}>;
export type Output = Readonly<{
  readonly callerSinclairCoefficient: number;
  readonly callerSinclairTotal: number;
}>;
const inputFields = [
  {
    id: "observedLifterBodyMassKg",
    label: "Observed lifter body mass kg",
    kind: "number",
  },
  {
    id: "observedWeightliftingTotalKg",
    label: "Observed weightlifting total kg",
    kind: "number",
  },
  {
    id: "callerVerifiedSinclairReferenceBodyMassKg",
    label: "Caller verified sinclair reference body mass kg",
    kind: "number",
  },
  {
    id: "callerVerifiedSinclairCycleCoefficient",
    label: "Caller verified sinclair cycle coefficient",
    kind: "number",
  },
  {
    id: "callerCoefficientCycleId",
    label: "Caller coefficient cycle id",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedLifterBodyMassKg, "observedLifterBodyMassKg");
  positive(
    input.callerVerifiedSinclairReferenceBodyMassKg,
    "callerVerifiedSinclairReferenceBodyMassKg",
  );
  nonnegative(
    input.observedWeightliftingTotalKg,
    "observedWeightliftingTotalKg",
  );
  nonnegative(
    input.callerVerifiedSinclairCycleCoefficient,
    "callerVerifiedSinclairCycleCoefficient",
  );
  safeText(input.callerCoefficientCycleId, "cycle");
  const coefficient =
    input.observedLifterBodyMassKg >=
    input.callerVerifiedSinclairReferenceBodyMassKg
      ? 1
      : 10 **
        (input.callerVerifiedSinclairCycleCoefficient *
          Math.log10(
            input.observedLifterBodyMassKg /
              input.callerVerifiedSinclairReferenceBodyMassKg,
          ) **
            2);
  return {
    callerSinclairCoefficient: coefficient,
    callerSinclairTotal: coefficient * input.observedWeightliftingTotalKg,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedLifterBodyMassKg: 80,
  observedWeightliftingTotalKg: 200,
  callerVerifiedSinclairReferenceBodyMassKg: 100,
  callerVerifiedSinclairCycleCoefficient: 3,
  callerCoefficientCycleId: "caller-cycle",
} satisfies Input;
export const exampleOutput = {
  callerSinclairCoefficient: 1.0670251399492674,
  callerSinclairTotal: 213.40502798985347,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sports/sinclair-coefficient-weightlifting",
  title: "Sinclair Coefficient Weightlifting Calculator",
  description:
    "Evaluate caller verified Sinclair cycle constants and actual weightlifting mass/total, with unity above reference body mass; no cycle/cohort inference or training recommendation.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerSinclairCoefficient",
      label: "Caller sinclair coefficient",
      kind: "number",
    },
    {
      id: "callerSinclairTotal",
      label: "Caller sinclair total",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedLifterBodyMassKg: value.observedLifterBodyMassKg as number,
      observedWeightliftingTotalKg:
        value.observedWeightliftingTotalKg as number,
      callerVerifiedSinclairReferenceBodyMassKg:
        value.callerVerifiedSinclairReferenceBodyMassKg as number,
      callerVerifiedSinclairCycleCoefficient:
        value.callerVerifiedSinclairCycleCoefficient as number,
      callerCoefficientCycleId: value.callerCoefficientCycleId as string,
    }),
});
export const run = tool.execute;
export default tool;
