import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  sum,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedLongwallRoofWasteTonnes: readonly number[];
  readonly observedLongwallFloorWasteTonnes: readonly number[];
  readonly observedUndilutedCoalTonnes: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedLongwallRoofDilutionFraction: number;
  readonly observedLongwallFloorDilutionFraction: number;
  readonly totalObservedLongwallDilutionFraction: number;
}>;
const inputFields = [
  {
    id: "observedLongwallRoofWasteTonnes",
    label: "Observed longwall roof waste tonnes",
    kind: "numberList",
  },
  {
    id: "observedLongwallFloorWasteTonnes",
    label: "Observed longwall floor waste tonnes",
    kind: "numberList",
  },
  {
    id: "observedUndilutedCoalTonnes",
    label: "Observed undiluted coal tonnes",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedLongwallRoofWasteTonnes.forEach((v) =>
    nonnegative(v, "observedLongwallRoofWasteTonnes"),
  );
  input.observedLongwallFloorWasteTonnes.forEach((v) =>
    nonnegative(v, "observedLongwallFloorWasteTonnes"),
  );
  input.observedUndilutedCoalTonnes.forEach((v) =>
    nonnegative(v, "observedUndilutedCoalTonnes"),
  );
  aligned(
    input.observedLongwallRoofWasteTonnes,
    input.observedLongwallFloorWasteTonnes,
    "observedLongwallRoofWasteTonnes",
  );
  aligned(
    input.observedLongwallRoofWasteTonnes,
    input.observedUndilutedCoalTonnes,
    "observedLongwallRoofWasteTonnes",
  );
  const roof = sum(input.observedLongwallRoofWasteTonnes),
    floor = sum(input.observedLongwallFloorWasteTonnes),
    total = roof + floor + sum(input.observedUndilutedCoalTonnes);
  positive(total, "total");
  return {
    observedLongwallRoofDilutionFraction: roof / total,
    observedLongwallFloorDilutionFraction: floor / total,
    totalObservedLongwallDilutionFraction: (roof + floor) / total,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedLongwallRoofWasteTonnes: [2, 3],
  observedLongwallFloorWasteTonnes: [1, 2],
  observedUndilutedCoalTonnes: [10, 20],
} satisfies Input;
export const exampleOutput = {
  observedLongwallRoofDilutionFraction: 0.13157894736842105,
  observedLongwallFloorDilutionFraction: 0.07894736842105263,
  totalObservedLongwallDilutionFraction: 0.21052631578947367,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/dilution-longwall",
  title: "Longwall Dilution Calculator",
  description:
    "Separate actual roof/floor longwall dilution source inventory, not generic assay blending, recovered-coal face advance or equal-density volume assumption. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedLongwallRoofDilutionFraction",
      label: "Observed longwall roof dilution fraction",
      kind: "number",
    },
    {
      id: "observedLongwallFloorDilutionFraction",
      label: "Observed longwall floor dilution fraction",
      kind: "number",
    },
    {
      id: "totalObservedLongwallDilutionFraction",
      label: "Total observed longwall dilution fraction",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedLongwallRoofWasteTonnes:
        value.observedLongwallRoofWasteTonnes as readonly number[],
      observedLongwallFloorWasteTonnes:
        value.observedLongwallFloorWasteTonnes as readonly number[],
      observedUndilutedCoalTonnes:
        value.observedUndilutedCoalTonnes as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
