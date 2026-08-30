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
  mean,
} from "../shared.js";

export type Input = Readonly<{
  readonly observedTemperaturesC: readonly number[];
  readonly relativeHumidityOverIceFractions: readonly number[];
  readonly callerMaximumPersistenceTemperatureC: number;
  readonly callerMinimumIceHumidityFraction: number;
}>;
export type Output = Readonly<{
  readonly callerPersistenceCriterionFlags: readonly number[];
  readonly criterionMatchFraction: number;
}>;
const inputFields = [
  {
    id: "observedTemperaturesC",
    label: "Observed temperatures c",
    kind: "numberList",
  },
  {
    id: "relativeHumidityOverIceFractions",
    label: "Relative humidity over ice fractions",
    kind: "numberList",
  },
  {
    id: "callerMaximumPersistenceTemperatureC",
    label: "Caller maximum persistence temperature c",
    kind: "number",
  },
  {
    id: "callerMinimumIceHumidityFraction",
    label: "Caller minimum ice humidity fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.callerMinimumIceHumidityFraction,
    "callerMinimumIceHumidityFraction",
  );
  input.relativeHumidityOverIceFractions.forEach((v) =>
    nonnegative(v, "relativeHumidityOverIceFractions"),
  );
  aligned(
    input.observedTemperaturesC,
    input.relativeHumidityOverIceFractions,
    "observedTemperaturesC",
  );
  if (
    input.callerMaximumPersistenceTemperatureC >= 0 ||
    input.callerMinimumIceHumidityFraction < 1
  )
    simpleError(
      "policy",
      "Subzero temperature and at least ice-saturated humidity criterion required.",
    );
  const callerPersistenceCriterionFlags = input.observedTemperaturesC.map(
    (t, i) =>
      t <= input.callerMaximumPersistenceTemperatureC &&
      input.relativeHumidityOverIceFractions[i] >=
        input.callerMinimumIceHumidityFraction
        ? 1
        : 0,
  );
  return {
    callerPersistenceCriterionFlags,
    criterionMatchFraction: mean(callerPersistenceCriterionFlags),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedTemperaturesC: [-50, -30],
  relativeHumidityOverIceFractions: [1.2, 1.2],
  callerMaximumPersistenceTemperatureC: -40,
  callerMinimumIceHumidityFraction: 1,
} satisfies Input;
export const exampleOutput = {
  callerPersistenceCriterionFlags: [1, 0],
  criterionMatchFraction: 0.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "meteorology/contrail-persistence-temp-humidity-checker",
  title: "Contrail Persistence Temp Humidity Checker",
  description:
    "Audit ice-supersaturation/subzero observations against caller contrail persistence policy; supersaturation above 100% is retained, formation requires separate engine/Schmidt–Appleman conditions and persistence is not proven.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerPersistenceCriterionFlags",
      label: "Caller persistence criterion flags",
      kind: "numberList",
    },
    {
      id: "criterionMatchFraction",
      label: "Criterion match fraction",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedTemperaturesC: value.observedTemperaturesC as readonly number[],
      relativeHumidityOverIceFractions:
        value.relativeHumidityOverIceFractions as readonly number[],
      callerMaximumPersistenceTemperatureC:
        value.callerMaximumPersistenceTemperatureC as number,
      callerMinimumIceHumidityFraction:
        value.callerMinimumIceHumidityFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
