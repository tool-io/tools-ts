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
  fraction,
  aligned,
  band,
} from "../batch34-shared.js";
export type Input = Readonly<{
  readonly observedPetioleMagnesiumMgKgDry: readonly number[];
  readonly callerDryMatterFractions: readonly number[];
  readonly callerFreshBasisMagnesiumBandMgKg: readonly number[];
}>;
export type Output = Readonly<{
  readonly convertedPetioleMagnesiumMgKgFresh: readonly number[];
  readonly samplesOutsideCallerFreshBasisMgBand: readonly number[];
}>;
const inputFields = [
  {
    id: "observedPetioleMagnesiumMgKgDry",
    label: "Observed petiole magnesium mg kg dry",
    kind: "numberList",
  },
  {
    id: "callerDryMatterFractions",
    label: "Caller dry matter fractions",
    kind: "numberList",
  },
  {
    id: "callerFreshBasisMagnesiumBandMgKg",
    label: "Caller fresh basis magnesium band mg kg",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerDryMatterFractions.forEach((v) =>
    positive(v, "callerDryMatterFractions"),
  );
  input.observedPetioleMagnesiumMgKgDry.forEach((v) =>
    nonnegative(v, "observedPetioleMagnesiumMgKgDry"),
  );
  input.callerFreshBasisMagnesiumBandMgKg.forEach((v) =>
    nonnegative(v, "callerFreshBasisMagnesiumBandMgKg"),
  );
  input.callerDryMatterFractions.forEach((v) =>
    fraction(v, "callerDryMatterFractions"),
  );
  aligned(
    input.observedPetioleMagnesiumMgKgDry,
    input.callerDryMatterFractions,
    "observedPetioleMagnesiumMgKgDry",
  );
  if (input.callerFreshBasisMagnesiumBandMgKg.length !== 2)
    simpleError("band", "Two caller fresh-basis Mg limits required.");
  const fresh = input.observedPetioleMagnesiumMgKgDry.map(
    (v, i) => v * input.callerDryMatterFractions[i],
  );
  return {
    convertedPetioleMagnesiumMgKgFresh: fresh,
    samplesOutsideCallerFreshBasisMgBand: fresh.flatMap((v, i) =>
      band(
        v,
        input.callerFreshBasisMagnesiumBandMgKg[0],
        input.callerFreshBasisMagnesiumBandMgKg[1],
      ) < 0
        ? [i]
        : [],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedPetioleMagnesiumMgKgDry: [1000, 2000],
  callerDryMatterFractions: [0.2, 0.25],
  callerFreshBasisMagnesiumBandMgKg: [200, 400],
} satisfies Input;
export const exampleOutput = {
  convertedPetioleMagnesiumMgKgFresh: [200, 500],
  samplesOutsideCallerFreshBasisMgBand: [1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "viticulture/magnesium-petiole-sufficiency-lookup",
  title: "Magnesium Petiole Sufficiency Lookup",
  description:
    "Audit actual petiole Mg assays after explicit dry→fresh mass-basis conversion against caller same-basis stage band; no tissue sufficiency diagnosis, total Mg per plant or fertilizer recommendation.",
  inputs: inputFields,
  outputs: [
    {
      id: "convertedPetioleMagnesiumMgKgFresh",
      label: "Converted petiole magnesium mg kg fresh",
      kind: "numberList",
    },
    {
      id: "samplesOutsideCallerFreshBasisMgBand",
      label: "Samples outside caller fresh basis mg band",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedPetioleMagnesiumMgKgDry:
        value.observedPetioleMagnesiumMgKgDry as readonly number[],
      callerDryMatterFractions:
        value.callerDryMatterFractions as readonly number[],
      callerFreshBasisMagnesiumBandMgKg:
        value.callerFreshBasisMagnesiumBandMgKg as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
