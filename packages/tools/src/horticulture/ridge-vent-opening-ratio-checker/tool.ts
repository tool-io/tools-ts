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
} from "../batch34-shared.js";
export type Input = Readonly<{
  readonly measuredOpenVentAreasM2: readonly number[];
  readonly observedObstructionFractions: readonly number[];
  readonly greenhouseFloorAreaM2: number;
  readonly callerMinimumEffectiveVentFloorRatio: number;
}>;
export type Output = Readonly<{
  readonly modeledUnobstructedVentAreaM2: number;
  readonly effectiveVentFloorRatio: number;
  readonly meetsCallerVentAreaPolicy: boolean;
}>;
const inputFields = [
  {
    id: "measuredOpenVentAreasM2",
    label: "Measured open vent areas m2",
    kind: "numberList",
  },
  {
    id: "observedObstructionFractions",
    label: "Observed obstruction fractions",
    kind: "numberList",
  },
  {
    id: "greenhouseFloorAreaM2",
    label: "Greenhouse floor area m2",
    kind: "number",
  },
  {
    id: "callerMinimumEffectiveVentFloorRatio",
    label: "Caller minimum effective vent floor ratio",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.greenhouseFloorAreaM2, "greenhouseFloorAreaM2");
  input.measuredOpenVentAreasM2.forEach((v) =>
    nonnegative(v, "measuredOpenVentAreasM2"),
  );
  nonnegative(
    input.callerMinimumEffectiveVentFloorRatio,
    "callerMinimumEffectiveVentFloorRatio",
  );
  input.observedObstructionFractions.forEach((v) =>
    fraction(v, "observedObstructionFractions"),
  );
  aligned(
    input.measuredOpenVentAreasM2,
    input.observedObstructionFractions,
    "measuredOpenVentAreasM2",
  );
  const area = sum(
      input.measuredOpenVentAreasM2.map(
        (v, i) => v * (1 - input.observedObstructionFractions[i]),
      ),
    ),
    r = area / input.greenhouseFloorAreaM2;
  return {
    modeledUnobstructedVentAreaM2: area,
    effectiveVentFloorRatio: r,
    meetsCallerVentAreaPolicy: r >= input.callerMinimumEffectiveVentFloorRatio,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  measuredOpenVentAreasM2: [2, 3],
  observedObstructionFractions: [0.5, 0],
  greenhouseFloorAreaM2: 20,
  callerMinimumEffectiveVentFloorRatio: 0.25,
} satisfies Input;
export const exampleOutput = {
  modeledUnobstructedVentAreaM2: 4,
  effectiveVentFloorRatio: 0.2,
  meetsCallerVentAreaPolicy: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horticulture/ridge-vent-opening-ratio-checker",
  title: "Ridge Vent Opening Ratio Checker",
  description:
    "Audit actual open vent area after observed obstructions under caller effective opening/floor policy; not free area from nominal dimensions, airflow coefficient or ventilation/worker safety approval.",
  inputs: inputFields,
  outputs: [
    {
      id: "modeledUnobstructedVentAreaM2",
      label: "Modeled unobstructed vent area m2",
      kind: "number",
    },
    {
      id: "effectiveVentFloorRatio",
      label: "Effective vent floor ratio",
      kind: "number",
    },
    {
      id: "meetsCallerVentAreaPolicy",
      label: "Meets caller vent area policy",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      measuredOpenVentAreasM2:
        value.measuredOpenVentAreasM2 as readonly number[],
      observedObstructionFractions:
        value.observedObstructionFractions as readonly number[],
      greenhouseFloorAreaM2: value.greenhouseFloorAreaM2 as number,
      callerMinimumEffectiveVentFloorRatio:
        value.callerMinimumEffectiveVentFloorRatio as number,
    }),
});
export const run = tool.execute;
export default tool;
