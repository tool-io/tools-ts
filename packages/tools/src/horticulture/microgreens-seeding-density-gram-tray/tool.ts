import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  sum,
} from "../batch34-shared.js";
export type Input = Readonly<{
  readonly measuredSampleSeedMassGrams: number;
  readonly observedSaleableMicrogreenFreshMassGrams: number;
  readonly callerTargetSaleableFreshMassGramsByTray: readonly number[];
  readonly callerWholeSpareSeedGrams: number;
}>;
export type Output = Readonly<{
  readonly calibratedSeedGramsPerSaleableFreshGram: number;
  readonly estimatedSeedGramsByTray: readonly number[];
  readonly totalSeedGramsIncludingSpares: number;
}>;
const inputFields = [
  {
    id: "measuredSampleSeedMassGrams",
    label: "Measured sample seed mass grams",
    kind: "number",
  },
  {
    id: "observedSaleableMicrogreenFreshMassGrams",
    label: "Observed saleable microgreen fresh mass grams",
    kind: "number",
  },
  {
    id: "callerTargetSaleableFreshMassGramsByTray",
    label: "Caller target saleable fresh mass grams by tray",
    kind: "numberList",
  },
  {
    id: "callerWholeSpareSeedGrams",
    label: "Caller whole spare seed grams",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.measuredSampleSeedMassGrams, "measuredSampleSeedMassGrams");
  positive(
    input.observedSaleableMicrogreenFreshMassGrams,
    "observedSaleableMicrogreenFreshMassGrams",
  );
  input.callerTargetSaleableFreshMassGramsByTray.forEach((v) =>
    nonnegative(v, "callerTargetSaleableFreshMassGramsByTray"),
  );
  nonnegative(input.callerWholeSpareSeedGrams, "callerWholeSpareSeedGrams");
  const rate =
      input.measuredSampleSeedMassGrams /
      input.observedSaleableMicrogreenFreshMassGrams,
    grams = input.callerTargetSaleableFreshMassGramsByTray.map((v) => v * rate);
  return {
    calibratedSeedGramsPerSaleableFreshGram: rate,
    estimatedSeedGramsByTray: grams,
    totalSeedGramsIncludingSpares: sum(grams) + input.callerWholeSpareSeedGrams,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  measuredSampleSeedMassGrams: 10,
  observedSaleableMicrogreenFreshMassGrams: 100,
  callerTargetSaleableFreshMassGramsByTray: [150, 200],
  callerWholeSpareSeedGrams: 5,
} satisfies Input;
export const exampleOutput = {
  calibratedSeedGramsPerSaleableFreshGram: 0.1,
  estimatedSeedGramsByTray: [15, 20],
  totalSeedGramsIncludingSpares: 40,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horticulture/microgreens-seeding-density-gram-tray",
  title: "Microgreens Seeding Density Gram Tray Calculator",
  description:
    "Scale actual measured seed-to-saleable microgreen mass trial to caller tray output inventory with spares; not existing independent-cell germination probability or universal g/tray density, linear representativeness assumed.",
  inputs: inputFields,
  outputs: [
    {
      id: "calibratedSeedGramsPerSaleableFreshGram",
      label: "Calibrated seed grams per saleable fresh gram",
      kind: "number",
    },
    {
      id: "estimatedSeedGramsByTray",
      label: "Estimated seed grams by tray",
      kind: "numberList",
    },
    {
      id: "totalSeedGramsIncludingSpares",
      label: "Total seed grams including spares",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      measuredSampleSeedMassGrams: value.measuredSampleSeedMassGrams as number,
      observedSaleableMicrogreenFreshMassGrams:
        value.observedSaleableMicrogreenFreshMassGrams as number,
      callerTargetSaleableFreshMassGramsByTray:
        value.callerTargetSaleableFreshMassGramsByTray as readonly number[],
      callerWholeSpareSeedGrams: value.callerWholeSpareSeedGrams as number,
    }),
});
export const run = tool.execute;
export default tool;
