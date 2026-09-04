import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  aligned,
  sum,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedAvailableForageKgHa: readonly number[];
  readonly callerUsableForageFractions: readonly number[];
  readonly observedWoodlandAreasHa: readonly number[];
  readonly callerAnimalDemandKgDay: number;
  readonly callerGrazingDays: number;
}>;
export type Output = Readonly<{
  readonly callerModeledSupportedWholeHead: number;
  readonly wholeHeadPerWoodlandHa: number;
}>;
const inputFields = [
  {
    id: "observedAvailableForageKgHa",
    label: "Observed available forage kg ha",
    kind: "numberList",
  },
  {
    id: "callerUsableForageFractions",
    label: "Caller usable forage fractions",
    kind: "numberList",
  },
  {
    id: "observedWoodlandAreasHa",
    label: "Observed woodland areas ha",
    kind: "numberList",
  },
  {
    id: "callerAnimalDemandKgDay",
    label: "Caller animal demand kg day",
    kind: "number",
  },
  { id: "callerGrazingDays", label: "Caller grazing days", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedWoodlandAreasHa.forEach((v) =>
    positive(v, "observedWoodlandAreasHa"),
  );
  positive(input.callerAnimalDemandKgDay, "callerAnimalDemandKgDay");
  positive(input.callerGrazingDays, "callerGrazingDays");
  input.observedAvailableForageKgHa.forEach((v) =>
    nonnegative(v, "observedAvailableForageKgHa"),
  );
  input.callerUsableForageFractions.forEach((v) =>
    fraction(v, "callerUsableForageFractions"),
  );
  aligned(
    input.observedAvailableForageKgHa,
    input.callerUsableForageFractions,
    "observedAvailableForageKgHa",
  );
  aligned(
    input.observedAvailableForageKgHa,
    input.observedWoodlandAreasHa,
    "observedAvailableForageKgHa",
  );
  const forage = sum(
      input.observedAvailableForageKgHa.map(
        (v, i) =>
          v *
          input.callerUsableForageFractions[i] *
          input.observedWoodlandAreasHa[i],
      ),
    ),
    head = Math.floor(
      forage / input.callerAnimalDemandKgDay / input.callerGrazingDays,
    );
  return {
    callerModeledSupportedWholeHead: head,
    wholeHeadPerWoodlandHa: head / sum(input.observedWoodlandAreasHa),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedAvailableForageKgHa: [100, 200],
  callerUsableForageFractions: [0.5, 0.5],
  observedWoodlandAreasHa: [1, 2],
  callerAnimalDemandKgDay: 5,
  callerGrazingDays: 10,
} satisfies Input;
export const exampleOutput = {
  callerModeledSupportedWholeHead: 5,
  wholeHeadPerWoodlandHa: 1.6666666666666667,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/grazing-forest-pasture-head-per-hectare-woodland",
  title: "Woodland Pasture Head Per Hectare Calculator",
  description:
    "Budget measured usable woodland forage versus independently established animal intake/day horizon, whole-head floor explicit; no stocking/ecological/veterinary readiness recommendation. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerModeledSupportedWholeHead",
      label: "Caller modeled supported whole head",
      kind: "number",
    },
    {
      id: "wholeHeadPerWoodlandHa",
      label: "Whole head per woodland ha",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedAvailableForageKgHa:
        value.observedAvailableForageKgHa as readonly number[],
      callerUsableForageFractions:
        value.callerUsableForageFractions as readonly number[],
      observedWoodlandAreasHa:
        value.observedWoodlandAreasHa as readonly number[],
      callerAnimalDemandKgDay: value.callerAnimalDemandKgDay as number,
      callerGrazingDays: value.callerGrazingDays as number,
    }),
});
export const run = tool.execute;
export default tool;
