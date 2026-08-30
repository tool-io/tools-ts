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
} from "../shared.js";
export type Input = Readonly<{
  readonly buildingRoofedAreasM2: readonly number[];
  readonly residentialFractions: readonly number[];
  readonly occupiedFractions: readonly number[];
  readonly callerResidentialM2PerPersonBounds: readonly number[];
}>;
export type Output = Readonly<{
  readonly effectiveOccupiedResidentialAreaM2: number;
  readonly populationScenarioBounds: readonly number[];
}>;
const inputFields = [
  {
    id: "buildingRoofedAreasM2",
    label: "Building roofed areas m2",
    kind: "numberList",
  },
  {
    id: "residentialFractions",
    label: "Residential fractions",
    kind: "numberList",
  },
  { id: "occupiedFractions", label: "Occupied fractions", kind: "numberList" },
  {
    id: "callerResidentialM2PerPersonBounds",
    label: "Caller residential m2 per person bounds",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerResidentialM2PerPersonBounds.forEach((v) =>
    positive(v, "callerResidentialM2PerPersonBounds"),
  );
  input.buildingRoofedAreasM2.forEach((v) =>
    nonnegative(v, "buildingRoofedAreasM2"),
  );
  input.residentialFractions.forEach((v) =>
    fraction(v, "residentialFractions"),
  );
  input.occupiedFractions.forEach((v) => fraction(v, "occupiedFractions"));
  aligned(
    input.buildingRoofedAreasM2,
    input.residentialFractions,
    "buildingRoofedAreasM2",
  );
  aligned(
    input.buildingRoofedAreasM2,
    input.occupiedFractions,
    "buildingRoofedAreasM2",
  );
  if (
    input.callerResidentialM2PerPersonBounds.length !== 2 ||
    input.callerResidentialM2PerPersonBounds[0] >
      input.callerResidentialM2PerPersonBounds[1]
  )
    simpleError(
      "bounds",
      "Ordered two-value positive per-person floor area assumptions required.",
    );
  const effectiveOccupiedResidentialAreaM2 = input.buildingRoofedAreasM2.reduce(
    (s, v, i) =>
      s + v * input.residentialFractions[i] * input.occupiedFractions[i],
    0,
  );
  return {
    effectiveOccupiedResidentialAreaM2,
    populationScenarioBounds: [
      effectiveOccupiedResidentialAreaM2 /
        input.callerResidentialM2PerPersonBounds[1],
      effectiveOccupiedResidentialAreaM2 /
        input.callerResidentialM2PerPersonBounds[0],
    ],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  buildingRoofedAreasM2: [100, 200],
  residentialFractions: [0.5, 0.8],
  occupiedFractions: [1, 0.5],
  callerResidentialM2PerPersonBounds: [10, 20],
} satisfies Input;
export const exampleOutput = {
  effectiveOccupiedResidentialAreaM2: 130,
  populationScenarioBounds: [6.5, 13],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archaeology/population-estimate-roofed-area",
  title: "Population Estimate From Roofed Area",
  description:
    "Screen occupied residential roofed-area population scenarios with building-specific use/occupancy and caller area-per-person bounds; not census counts or inferred contemporaneity.",
  inputs: inputFields,
  outputs: [
    {
      id: "effectiveOccupiedResidentialAreaM2",
      label: "Effective occupied residential area m2",
      kind: "number",
    },
    {
      id: "populationScenarioBounds",
      label: "Population scenario bounds",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      buildingRoofedAreasM2: value.buildingRoofedAreasM2 as readonly number[],
      residentialFractions: value.residentialFractions as readonly number[],
      occupiedFractions: value.occupiedFractions as readonly number[],
      callerResidentialM2PerPersonBounds:
        value.callerResidentialM2PerPersonBounds as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
