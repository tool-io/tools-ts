import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  integer,
  aligned,
  sum,
} from "../batch41-shared.js";
export type Input = Readonly<{
  readonly observedRoomCounts: readonly number[];
  readonly independentlyContemporaryResidentialFractions: readonly number[];
  readonly callerPersonsPerOccupiedRoom: readonly number[];
  readonly callerStudyAreaHectares: number;
}>;
export type Output = Readonly<{
  readonly conditionalPopulationPersons: number;
  readonly conditionalPersonsPerHectare: number;
}>;
const inputFields = [
  {
    id: "observedRoomCounts",
    label: "Observed room counts",
    kind: "numberList",
  },
  {
    id: "independentlyContemporaryResidentialFractions",
    label: "Independently contemporary residential fractions",
    kind: "numberList",
  },
  {
    id: "callerPersonsPerOccupiedRoom",
    label: "Caller persons per occupied room",
    kind: "numberList",
  },
  {
    id: "callerStudyAreaHectares",
    label: "Caller study area hectares",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerStudyAreaHectares, "callerStudyAreaHectares");
  input.observedRoomCounts.forEach((v) => nonnegative(v, "observedRoomCounts"));
  input.callerPersonsPerOccupiedRoom.forEach((v) =>
    nonnegative(v, "callerPersonsPerOccupiedRoom"),
  );
  input.independentlyContemporaryResidentialFractions.forEach((v) =>
    fraction(v, "independentlyContemporaryResidentialFractions"),
  );
  aligned(
    input.observedRoomCounts,
    input.independentlyContemporaryResidentialFractions,
    "observedRoomCounts",
  );
  aligned(
    input.observedRoomCounts,
    input.callerPersonsPerOccupiedRoom,
    "observedRoomCounts",
  );
  input.observedRoomCounts.forEach((v) => integer(v, "rooms"));
  const pop = sum(
    input.observedRoomCounts.map(
      (v, i) =>
        v *
        input.independentlyContemporaryResidentialFractions[i] *
        input.callerPersonsPerOccupiedRoom[i],
    ),
  );
  return {
    conditionalPopulationPersons: pop,
    conditionalPersonsPerHectare: pop / input.callerStudyAreaHectares,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedRoomCounts: [10, 20],
  independentlyContemporaryResidentialFractions: [0.5, 1],
  callerPersonsPerOccupiedRoom: [2, 3],
  callerStudyAreaHectares: 2,
} satisfies Input;
export const exampleOutput = {
  conditionalPopulationPersons: 70,
  conditionalPersonsPerHectare: 35,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archaeology/population-density-room-count",
  title: "Population Density From Room Count Calculator",
  description:
    "Room-count occupancy population/density scenario, independent contemporary residential fraction per class, not roofed-area estimator or real census. Caller independently establishes sample/context/calibration applicability; not definitive chronology, provenance, taxonomy, disease or human identity.",
  inputs: inputFields,
  outputs: [
    {
      id: "conditionalPopulationPersons",
      label: "Conditional population persons",
      kind: "number",
    },
    {
      id: "conditionalPersonsPerHectare",
      label: "Conditional persons per hectare",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedRoomCounts: value.observedRoomCounts as readonly number[],
      independentlyContemporaryResidentialFractions:
        value.independentlyContemporaryResidentialFractions as readonly number[],
      callerPersonsPerOccupiedRoom:
        value.callerPersonsPerOccupiedRoom as readonly number[],
      callerStudyAreaHectares: value.callerStudyAreaHectares as number,
    }),
});
export const run = tool.execute;
export default tool;
