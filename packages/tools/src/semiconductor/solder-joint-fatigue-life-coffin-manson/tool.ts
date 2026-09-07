import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedPlasticStrainAmplitudes: readonly number[];
  readonly callerMatchedDuctilityCoefficient: number;
  readonly callerMatchedFatigueExponent: number;
}>;
export type Output = Readonly<{
  readonly coffinMansonFailureCycles: readonly number[];
}>;
const inputFields = [
  {
    id: "observedPlasticStrainAmplitudes",
    label: "Observed plastic strain amplitudes",
    kind: "numberList",
  },
  {
    id: "callerMatchedDuctilityCoefficient",
    label: "Caller matched ductility coefficient",
    kind: "number",
  },
  {
    id: "callerMatchedFatigueExponent",
    label: "Caller matched fatigue exponent",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedPlasticStrainAmplitudes.forEach((v) =>
    positive(v, "observedPlasticStrainAmplitudes"),
  );
  positive(
    input.callerMatchedDuctilityCoefficient,
    "callerMatchedDuctilityCoefficient",
  );
  if (input.callerMatchedFatigueExponent >= 0)
    simpleError(
      "exponent",
      "Negative independently calibrated Coffin–Manson exponent required.",
    );
  return {
    coffinMansonFailureCycles: input.observedPlasticStrainAmplitudes.map(
      (v) =>
        0.5 *
        (v / input.callerMatchedDuctilityCoefficient) **
          (1 / input.callerMatchedFatigueExponent),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedPlasticStrainAmplitudes: [0.1, 0.2],
  callerMatchedDuctilityCoefficient: 0.5,
  callerMatchedFatigueExponent: -0.5,
} satisfies Input;
export const exampleOutput = {
  coffinMansonFailureCycles: [12.5, 3.125],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/solder-joint-fatigue-life-coffin-manson",
  title: "Semiconductor Solder Joint Fatigue Life Coffin Manson Calculator",
  description:
    "Named Coffin–Manson plastic STRAIN AMPLITUDE=εf′(2Nf)^c, explicit reversals-versus-cycles half factor; no elastic Basquin term, life guarantee or safety qualification.",
  inputs: inputFields,
  outputs: [
    {
      id: "coffinMansonFailureCycles",
      label: "Coffin manson failure cycles",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedPlasticStrainAmplitudes:
        value.observedPlasticStrainAmplitudes as readonly number[],
      callerMatchedDuctilityCoefficient:
        value.callerMatchedDuctilityCoefficient as number,
      callerMatchedFatigueExponent:
        value.callerMatchedFatigueExponent as number,
    }),
});
export const run = tool.execute;
export default tool;
