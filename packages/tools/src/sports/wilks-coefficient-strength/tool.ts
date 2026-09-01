import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  simpleError,
  type SimpleField,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  safeText,
  polynomial,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedBodyMassKg: number;
  readonly observedMeetTotalKg: number;
  readonly callerVerifiedConstantFirstDenominatorCoefficients: readonly number[];
  readonly callerVerifiedScoreNumerator: number;
  readonly callerCoefficientEditionId: string;
}>;
export type Output = Readonly<{
  readonly callerEditionDenominator: number;
  readonly callerEditionStrengthScore: number;
}>;
const inputFields = [
  { id: "observedBodyMassKg", label: "Observed body mass kg", kind: "number" },
  {
    id: "observedMeetTotalKg",
    label: "Observed meet total kg",
    kind: "number",
  },
  {
    id: "callerVerifiedConstantFirstDenominatorCoefficients",
    label: "Caller verified constant first denominator coefficients",
    kind: "numberList",
  },
  {
    id: "callerVerifiedScoreNumerator",
    label: "Caller verified score numerator",
    kind: "number",
  },
  {
    id: "callerCoefficientEditionId",
    label: "Caller coefficient edition id",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedBodyMassKg, "observedBodyMassKg");
  positive(input.callerVerifiedScoreNumerator, "callerVerifiedScoreNumerator");
  nonnegative(input.observedMeetTotalKg, "observedMeetTotalKg");
  safeText(input.callerCoefficientEditionId, "edition");
  if (input.callerVerifiedConstantFirstDenominatorCoefficients.length !== 6)
    simpleError(
      "coefficients",
      "Wilks requires six independently verified constant-first fifth-degree coefficients.",
    );
  if (input.callerVerifiedScoreNumerator !== 500)
    simpleError(
      "numerator",
      "The named Wilks convention requires numerator 500.",
    );
  const denominator = polynomial(
    input.callerVerifiedConstantFirstDenominatorCoefficients,
    input.observedBodyMassKg,
  );
  positive(denominator, "denominator");
  return {
    callerEditionDenominator: denominator,
    callerEditionStrengthScore:
      (input.callerVerifiedScoreNumerator / denominator) *
      input.observedMeetTotalKg,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedBodyMassKg: 80,
  observedMeetTotalKg: 500,
  callerVerifiedConstantFirstDenominatorCoefficients: [
    -216.0475144, 16.2606339, -0.002388645, -0.00113732, 0.00000701863,
    -0.00000001291,
  ],
  callerVerifiedScoreNumerator: 500,
  callerCoefficientEditionId:
    "Wilks-original-mens-coefficients-caller-verified",
} satisfies Input;
export const exampleOutput = {
  callerEditionDenominator: 732.3876264,
  callerEditionStrengthScore: 341.34929508415854,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sports/wilks-coefficient-strength",
  title: "Wilks Coefficient Calculator",
  description:
    "Evaluate caller verified Wilks fifth-degree edition/cohort denominator (six constant-first coefficients, numerator 500) on actual meet total; example original men's coefficients, category never inferred, not DOTS fourth-degree or simple allometric normalization.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerEditionDenominator",
      label: "Caller edition denominator",
      kind: "number",
    },
    {
      id: "callerEditionStrengthScore",
      label: "Caller edition strength score",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedBodyMassKg: value.observedBodyMassKg as number,
      observedMeetTotalKg: value.observedMeetTotalKg as number,
      callerVerifiedConstantFirstDenominatorCoefficients:
        value.callerVerifiedConstantFirstDenominatorCoefficients as readonly number[],
      callerVerifiedScoreNumerator:
        value.callerVerifiedScoreNumerator as number,
      callerCoefficientEditionId: value.callerCoefficientEditionId as string,
    }),
});
export const run = tool.execute;
export default tool;
