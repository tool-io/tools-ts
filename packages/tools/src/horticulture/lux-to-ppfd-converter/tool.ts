import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  sum,
  weights,
} from "../batch34-shared.js";
export type Input = Readonly<{
  readonly measuredLuxByStation: readonly number[];
  readonly callerMatchedMicromolesPerLuxSecond: readonly number[];
  readonly representedStationAreasM2: readonly number[];
}>;
export type Output = Readonly<{
  readonly calibratedPpfdByStation: readonly number[];
  readonly areaWeightedCalibratedPpfd: number;
}>;
const inputFields = [
  {
    id: "measuredLuxByStation",
    label: "Measured lux by station",
    kind: "numberList",
  },
  {
    id: "callerMatchedMicromolesPerLuxSecond",
    label: "Caller matched micromoles per lux second",
    kind: "numberList",
  },
  {
    id: "representedStationAreasM2",
    label: "Represented station areas m2",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerMatchedMicromolesPerLuxSecond.forEach((v) =>
    positive(v, "callerMatchedMicromolesPerLuxSecond"),
  );
  input.representedStationAreasM2.forEach((v) =>
    positive(v, "representedStationAreasM2"),
  );
  input.measuredLuxByStation.forEach((v) =>
    nonnegative(v, "measuredLuxByStation"),
  );
  aligned(
    input.measuredLuxByStation,
    input.callerMatchedMicromolesPerLuxSecond,
    "measuredLuxByStation",
  );
  aligned(
    input.measuredLuxByStation,
    input.representedStationAreasM2,
    "measuredLuxByStation",
  );
  const ppfd = input.measuredLuxByStation.map(
      (v, i) => v * input.callerMatchedMicromolesPerLuxSecond[i],
    ),
    w = weights(input.representedStationAreasM2);
  return {
    calibratedPpfdByStation: ppfd,
    areaWeightedCalibratedPpfd: sum(ppfd.map((v, i) => v * w[i])),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  measuredLuxByStation: [1000, 2000],
  callerMatchedMicromolesPerLuxSecond: [0.01, 0.02],
  representedStationAreasM2: [2, 1],
} satisfies Input;
export const exampleOutput = {
  calibratedPpfdByStation: [10, 40],
  areaWeightedCalibratedPpfd: 20,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horticulture/lux-to-ppfd-converter",
  title: "Lux to PPFD Converter",
  description:
    "Calibrate actual lux observations separately under matched lamp spectra and pool physical station exposure; not universal lux→PPFD conversion or existing measured-light uniformity audit.",
  inputs: inputFields,
  outputs: [
    {
      id: "calibratedPpfdByStation",
      label: "Calibrated ppfd by station",
      kind: "numberList",
    },
    {
      id: "areaWeightedCalibratedPpfd",
      label: "Area weighted calibrated ppfd",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      measuredLuxByStation: value.measuredLuxByStation as readonly number[],
      callerMatchedMicromolesPerLuxSecond:
        value.callerMatchedMicromolesPerLuxSecond as readonly number[],
      representedStationAreasM2:
        value.representedStationAreasM2 as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
