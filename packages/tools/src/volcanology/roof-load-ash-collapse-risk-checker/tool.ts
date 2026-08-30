import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly wetAshMassLoadingsKgPerM2: readonly number[];
  readonly roofZoneAreasM2: readonly number[];
  readonly callerRemainingUniformCapacitiesPa: readonly number[];
  readonly gravityMPerSecondSquared: number;
}>;
export type Output = Readonly<{
  readonly ashWeightLoadingsPa: readonly number[];
  readonly callerCapacityMarginsPa: readonly number[];
  readonly aboveCallerCapacityFlags: readonly number[];
  readonly totalAshMassKg: number;
}>;
const inputFields = [
  {
    id: "wetAshMassLoadingsKgPerM2",
    label: "Wet ash mass loadings kg per m2",
    kind: "numberList",
  },
  { id: "roofZoneAreasM2", label: "Roof zone areas m2", kind: "numberList" },
  {
    id: "callerRemainingUniformCapacitiesPa",
    label: "Caller remaining uniform capacities pa",
    kind: "numberList",
  },
  {
    id: "gravityMPerSecondSquared",
    label: "Gravity m per second squared",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.roofZoneAreasM2.forEach((v) => positive(v, "roofZoneAreasM2"));
  positive(input.gravityMPerSecondSquared, "gravityMPerSecondSquared");
  input.wetAshMassLoadingsKgPerM2.forEach((v) =>
    nonnegative(v, "wetAshMassLoadingsKgPerM2"),
  );
  input.callerRemainingUniformCapacitiesPa.forEach((v) =>
    nonnegative(v, "callerRemainingUniformCapacitiesPa"),
  );
  aligned(
    input.wetAshMassLoadingsKgPerM2,
    input.roofZoneAreasM2,
    "wetAshMassLoadingsKgPerM2",
  );
  aligned(
    input.wetAshMassLoadingsKgPerM2,
    input.callerRemainingUniformCapacitiesPa,
    "wetAshMassLoadingsKgPerM2",
  );
  const ashWeightLoadingsPa = input.wetAshMassLoadingsKgPerM2.map(
      (v) => v * input.gravityMPerSecondSquared,
    ),
    callerCapacityMarginsPa = ashWeightLoadingsPa.map(
      (v, i) => input.callerRemainingUniformCapacitiesPa[i] - v,
    );
  return {
    ashWeightLoadingsPa,
    callerCapacityMarginsPa,
    aboveCallerCapacityFlags: callerCapacityMarginsPa.map((v) =>
      v < 0 ? 1 : 0,
    ),
    totalAshMassKg: input.wetAshMassLoadingsKgPerM2.reduce(
      (s, v, i) => s + v * input.roofZoneAreasM2[i],
      0,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  wetAshMassLoadingsKgPerM2: [10, 20],
  roofZoneAreasM2: [2, 3],
  callerRemainingUniformCapacitiesPa: [200, 100],
  gravityMPerSecondSquared: 10,
} satisfies Input;
export const exampleOutput = {
  ashWeightLoadingsPa: [100, 200],
  callerCapacityMarginsPa: [100, -100],
  aboveCallerCapacityFlags: [0, 1],
  totalAshMassKg: 80,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "volcanology/roof-load-ash-collapse-risk-checker",
  title: "Roof Load Ash Collapse Risk Checker",
  description:
    "Audit independently measured wet ash loads against caller remaining zone capacities and sum physical ash mass; capacities must account for other loads and this is not a collapse forecast or structural/access-safety certificate.",
  inputs: inputFields,
  outputs: [
    {
      id: "ashWeightLoadingsPa",
      label: "Ash weight loadings pa",
      kind: "numberList",
    },
    {
      id: "callerCapacityMarginsPa",
      label: "Caller capacity margins pa",
      kind: "numberList",
    },
    {
      id: "aboveCallerCapacityFlags",
      label: "Above caller capacity flags",
      kind: "numberList",
    },
    { id: "totalAshMassKg", label: "Total ash mass kg", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      wetAshMassLoadingsKgPerM2:
        value.wetAshMassLoadingsKgPerM2 as readonly number[],
      roofZoneAreasM2: value.roofZoneAreasM2 as readonly number[],
      callerRemainingUniformCapacitiesPa:
        value.callerRemainingUniformCapacitiesPa as readonly number[],
      gravityMPerSecondSquared: value.gravityMPerSecondSquared as number,
    }),
});
export const run = tool.execute;
export default tool;
