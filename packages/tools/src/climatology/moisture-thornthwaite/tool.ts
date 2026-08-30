import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  months,
} from "../shared.js";

export type Input = Readonly<{
  readonly monthlyWaterSurplusesMm: readonly number[];
  readonly monthlyWaterDeficitsMm: readonly number[];
  readonly monthlyPotentialEtMm: readonly number[];
}>;
export type Output = Readonly<{
  readonly thornthwaiteHumidityIndex: number;
  readonly thornthwaiteAridityIndex: number;
  readonly thornthwaiteMoistureIndex: number;
}>;
const inputFields = [
  {
    id: "monthlyWaterSurplusesMm",
    label: "Monthly water surpluses mm",
    kind: "numberList",
  },
  {
    id: "monthlyWaterDeficitsMm",
    label: "Monthly water deficits mm",
    kind: "numberList",
  },
  {
    id: "monthlyPotentialEtMm",
    label: "Monthly potential et mm",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.monthlyWaterSurplusesMm.forEach((v) =>
    nonnegative(v, "monthlyWaterSurplusesMm"),
  );
  input.monthlyWaterDeficitsMm.forEach((v) =>
    nonnegative(v, "monthlyWaterDeficitsMm"),
  );
  input.monthlyPotentialEtMm.forEach((v) =>
    nonnegative(v, "monthlyPotentialEtMm"),
  );
  aligned(
    input.monthlyWaterSurplusesMm,
    input.monthlyWaterDeficitsMm,
    "monthlyWaterSurplusesMm",
  );
  aligned(
    input.monthlyWaterSurplusesMm,
    input.monthlyPotentialEtMm,
    "monthlyWaterSurplusesMm",
  );
  months(input.monthlyWaterSurplusesMm, "months");
  if (
    input.monthlyWaterSurplusesMm.some(
      (v, i) => v > 0 && input.monthlyWaterDeficitsMm[i] > 0,
    )
  )
    simpleError(
      "balance",
      "Monthly surplus and deficit cannot coexist in this net balance convention.",
    );
  const pet = positive(
      input.monthlyPotentialEtMm.reduce((a, b) => a + b, 0),
      "pet",
    ),
    h = (100 * input.monthlyWaterSurplusesMm.reduce((a, b) => a + b, 0)) / pet,
    a = (100 * input.monthlyWaterDeficitsMm.reduce((a, b) => a + b, 0)) / pet;
  return {
    thornthwaiteHumidityIndex: h,
    thornthwaiteAridityIndex: a,
    thornthwaiteMoistureIndex: h - 0.6 * a,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  monthlyWaterSurplusesMm: [20, 20, 20, 20, 20, 20, 0, 0, 0, 0, 0, 0],
  monthlyWaterDeficitsMm: [0, 0, 0, 0, 0, 0, 10, 10, 10, 10, 10, 10],
  monthlyPotentialEtMm: [20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20],
} satisfies Input;
export const exampleOutput = {
  thornthwaiteHumidityIndex: 50,
  thornthwaiteAridityIndex: 25,
  thornthwaiteMoistureIndex: 35,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "climatology/moisture-thornthwaite",
  title: "Thornthwaite Moisture Index",
  description:
    "Calculate named Thornthwaite Ih-0.6 Ia from caller precomputed monthly soil-water surplus/deficit and PET; not precipitation-minus-PET substituted for a full soil water budget.",
  inputs: inputFields,
  outputs: [
    {
      id: "thornthwaiteHumidityIndex",
      label: "Thornthwaite humidity index",
      kind: "number",
    },
    {
      id: "thornthwaiteAridityIndex",
      label: "Thornthwaite aridity index",
      kind: "number",
    },
    {
      id: "thornthwaiteMoistureIndex",
      label: "Thornthwaite moisture index",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      monthlyWaterSurplusesMm:
        value.monthlyWaterSurplusesMm as readonly number[],
      monthlyWaterDeficitsMm: value.monthlyWaterDeficitsMm as readonly number[],
      monthlyPotentialEtMm: value.monthlyPotentialEtMm as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
