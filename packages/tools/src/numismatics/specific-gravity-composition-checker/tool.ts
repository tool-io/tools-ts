import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch34-shared.js";
export type Input = Readonly<{
  readonly observedCoinSpecificGravity: number;
  readonly callerFirstConstituentSpecificGravity: number;
  readonly callerSecondConstituentSpecificGravity: number;
}>;
export type Output = Readonly<{
  readonly inferredFirstConstituentMassFraction: number;
  readonly inferredSecondConstituentMassFraction: number;
  readonly withinIdealBinaryMixtureDensityEnvelope: boolean;
}>;
const inputFields = [
  {
    id: "observedCoinSpecificGravity",
    label: "Observed coin specific gravity",
    kind: "number",
  },
  {
    id: "callerFirstConstituentSpecificGravity",
    label: "Caller first constituent specific gravity",
    kind: "number",
  },
  {
    id: "callerSecondConstituentSpecificGravity",
    label: "Caller second constituent specific gravity",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedCoinSpecificGravity, "observedCoinSpecificGravity");
  positive(
    input.callerFirstConstituentSpecificGravity,
    "callerFirstConstituentSpecificGravity",
  );
  positive(
    input.callerSecondConstituentSpecificGravity,
    "callerSecondConstituentSpecificGravity",
  );
  const a = 1 / input.callerFirstConstituentSpecificGravity,
    b = 1 / input.callerSecondConstituentSpecificGravity,
    observed = 1 / input.observedCoinSpecificGravity,
    span = a - b;
  if (
    !Number.isFinite(a) ||
    !Number.isFinite(b) ||
    !Number.isFinite(observed) ||
    span === 0 ||
    !Number.isFinite(span)
  )
    simpleError(
      "mixture",
      "Distinct finite reciprocal constituent densities required.",
    );
  const w = (observed - b) / span;
  return {
    inferredFirstConstituentMassFraction: w,
    inferredSecondConstituentMassFraction: 1 - w,
    withinIdealBinaryMixtureDensityEnvelope: w >= 0 && w <= 1,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedCoinSpecificGravity: 6.666666666666667,
  callerFirstConstituentSpecificGravity: 10,
  callerSecondConstituentSpecificGravity: 5,
} satisfies Input;
export const exampleOutput = {
  inferredFirstConstituentMassFraction: 0.5,
  inferredSecondConstituentMassFraction: 0.5,
  withinIdealBinaryMixtureDensityEnvelope: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "numismatics/specific-gravity-composition-checker",
  title: "Specific Gravity Composition Checker",
  description:
    "Invert actual coin specific gravity under caller two-constituent additive-specific-volume model; not measuring density, linear density-by-mass mixing or proof of composition/authenticity, out-of-envelope fractions retained.",
  inputs: inputFields,
  outputs: [
    {
      id: "inferredFirstConstituentMassFraction",
      label: "Inferred first constituent mass fraction",
      kind: "number",
    },
    {
      id: "inferredSecondConstituentMassFraction",
      label: "Inferred second constituent mass fraction",
      kind: "number",
    },
    {
      id: "withinIdealBinaryMixtureDensityEnvelope",
      label: "Within ideal binary mixture density envelope",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      observedCoinSpecificGravity: value.observedCoinSpecificGravity as number,
      callerFirstConstituentSpecificGravity:
        value.callerFirstConstituentSpecificGravity as number,
      callerSecondConstituentSpecificGravity:
        value.callerSecondConstituentSpecificGravity as number,
    }),
});
export const run = tool.execute;
export default tool;
