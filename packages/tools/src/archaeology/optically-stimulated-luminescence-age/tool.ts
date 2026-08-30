import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly equivalentDoseGy: number;
  readonly equivalentDoseSigmaGy: number;
  readonly residualDoseGy: number;
  readonly residualDoseSigmaGy: number;
  readonly doseRateGyPerKyr: number;
  readonly doseRateSigmaGyPerKyr: number;
}>;
export type Output = Readonly<{
  readonly residualCorrectedOslAgeKyr: number;
  readonly independentAgeSigmaKyr: number;
}>;
const inputFields = [
  { id: "equivalentDoseGy", label: "Equivalent dose gy", kind: "number" },
  {
    id: "equivalentDoseSigmaGy",
    label: "Equivalent dose sigma gy",
    kind: "number",
  },
  { id: "residualDoseGy", label: "Residual dose gy", kind: "number" },
  {
    id: "residualDoseSigmaGy",
    label: "Residual dose sigma gy",
    kind: "number",
  },
  { id: "doseRateGyPerKyr", label: "Dose rate gy per kyr", kind: "number" },
  {
    id: "doseRateSigmaGyPerKyr",
    label: "Dose rate sigma gy per kyr",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.doseRateGyPerKyr, "doseRateGyPerKyr");
  nonnegative(input.equivalentDoseGy, "equivalentDoseGy");
  nonnegative(input.equivalentDoseSigmaGy, "equivalentDoseSigmaGy");
  nonnegative(input.residualDoseGy, "residualDoseGy");
  nonnegative(input.residualDoseSigmaGy, "residualDoseSigmaGy");
  nonnegative(input.doseRateSigmaGyPerKyr, "doseRateSigmaGyPerKyr");
  const d = input.equivalentDoseGy - input.residualDoseGy,
    residualCorrectedOslAgeKyr = d / input.doseRateGyPerKyr;
  return {
    residualCorrectedOslAgeKyr,
    independentAgeSigmaKyr: Math.hypot(
      Math.hypot(input.equivalentDoseSigmaGy, input.residualDoseSigmaGy) /
        input.doseRateGyPerKyr,
      (residualCorrectedOslAgeKyr * input.doseRateSigmaGyPerKyr) /
        input.doseRateGyPerKyr,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  equivalentDoseGy: 10,
  equivalentDoseSigmaGy: 1,
  residualDoseGy: 2,
  residualDoseSigmaGy: 0.5,
  doseRateGyPerKyr: 2,
  doseRateSigmaGyPerKyr: 0.1,
} satisfies Input;
export const exampleOutput = {
  residualCorrectedOslAgeKyr: 4,
  independentAgeSigmaKyr: 0.5937171043518958,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archaeology/optically-stimulated-luminescence-age",
  title: "OSL Age",
  description:
    "Infer residual-corrected OSL age with independent dose/rate uncertainties, retaining signed residual nondetections; assumes full resetting and constant effective dose rate, not a validated burial age.",
  inputs: inputFields,
  outputs: [
    {
      id: "residualCorrectedOslAgeKyr",
      label: "Residual corrected osl age kyr",
      kind: "number",
    },
    {
      id: "independentAgeSigmaKyr",
      label: "Independent age sigma kyr",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      equivalentDoseGy: value.equivalentDoseGy as number,
      equivalentDoseSigmaGy: value.equivalentDoseSigmaGy as number,
      residualDoseGy: value.residualDoseGy as number,
      residualDoseSigmaGy: value.residualDoseSigmaGy as number,
      doseRateGyPerKyr: value.doseRateGyPerKyr as number,
      doseRateSigmaGyPerKyr: value.doseRateSigmaGyPerKyr as number,
    }),
});
export const run = tool.execute;
export default tool;
