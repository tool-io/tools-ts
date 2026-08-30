import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  months,
} from "../shared.js";

export type Input = Readonly<{
  readonly monthlyPrecipitationMm: readonly number[];
  readonly monthlyPotentialEtMm: readonly number[];
}>;
export type Output = Readonly<{
  readonly annualUnepAridityRatio: number;
  readonly monthlyWaterDeficitsMm: readonly number[];
}>;
const inputFields = [
  {
    id: "monthlyPrecipitationMm",
    label: "Monthly precipitation mm",
    kind: "numberList",
  },
  {
    id: "monthlyPotentialEtMm",
    label: "Monthly potential et mm",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.monthlyPrecipitationMm.forEach((v) =>
    nonnegative(v, "monthlyPrecipitationMm"),
  );
  input.monthlyPotentialEtMm.forEach((v) =>
    nonnegative(v, "monthlyPotentialEtMm"),
  );
  aligned(
    input.monthlyPrecipitationMm,
    input.monthlyPotentialEtMm,
    "monthlyPrecipitationMm",
  );
  months(input.monthlyPrecipitationMm, "months");
  return {
    annualUnepAridityRatio:
      input.monthlyPrecipitationMm.reduce((a, b) => a + b, 0) /
      positive(
        input.monthlyPotentialEtMm.reduce((a, b) => a + b, 0),
        "annualPet",
      ),
    monthlyWaterDeficitsMm: input.monthlyPotentialEtMm.map((v, i) =>
      Math.max(0, v - input.monthlyPrecipitationMm[i]),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  monthlyPrecipitationMm: [25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25],
  monthlyPotentialEtMm: [50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50],
} satisfies Input;
export const exampleOutput = {
  annualUnepAridityRatio: 0.5,
  monthlyWaterDeficitsMm: [25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "climatology/aridity-unep-p-pet",
  title: "UNEP Aridity Index P over PET",
  description:
    "Compute annual UNEP P/PET from matched monthly normals and show seasonal nonnegative climate deficits; no fixed aridity classification or inference of actual crop water stress.",
  inputs: inputFields,
  outputs: [
    {
      id: "annualUnepAridityRatio",
      label: "Annual unep aridity ratio",
      kind: "number",
    },
    {
      id: "monthlyWaterDeficitsMm",
      label: "Monthly water deficits mm",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      monthlyPrecipitationMm: value.monthlyPrecipitationMm as readonly number[],
      monthlyPotentialEtMm: value.monthlyPotentialEtMm as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
