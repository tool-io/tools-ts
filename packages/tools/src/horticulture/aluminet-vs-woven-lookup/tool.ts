import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  fraction,
  aligned,
  unique,
} from "../batch34-shared.js";
export type Input = Readonly<{
  readonly callerScreenIds: readonly string[];
  readonly matchedMeasuredLightTransmission: readonly number[];
  readonly matchedObservedCanopyTemperaturesC: readonly number[];
  readonly callerMinimumLightTransmission: number;
  readonly callerMaximumCanopyTemperatureC: number;
}>;
export type Output = Readonly<{
  readonly callerJointlyCompatibleScreenIds: readonly string[];
  readonly signedTemperatureMarginsC: readonly number[];
}>;
const inputFields = [
  { id: "callerScreenIds", label: "Caller screen ids", kind: "stringList" },
  {
    id: "matchedMeasuredLightTransmission",
    label: "Matched measured light transmission",
    kind: "numberList",
  },
  {
    id: "matchedObservedCanopyTemperaturesC",
    label: "Matched observed canopy temperatures c",
    kind: "numberList",
  },
  {
    id: "callerMinimumLightTransmission",
    label: "Caller minimum light transmission",
    kind: "number",
  },
  {
    id: "callerMaximumCanopyTemperatureC",
    label: "Caller maximum canopy temperature c",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.matchedMeasuredLightTransmission.forEach((v) =>
    fraction(v, "matchedMeasuredLightTransmission"),
  );
  fraction(
    input.callerMinimumLightTransmission,
    "callerMinimumLightTransmission",
  );
  aligned(
    input.callerScreenIds,
    input.matchedMeasuredLightTransmission,
    "callerScreenIds",
  );
  aligned(
    input.callerScreenIds,
    input.matchedObservedCanopyTemperaturesC,
    "callerScreenIds",
  );
  unique(input.callerScreenIds, "screens");
  return {
    callerJointlyCompatibleScreenIds: input.callerScreenIds.filter(
      (_, i) =>
        input.matchedMeasuredLightTransmission[i] >=
          input.callerMinimumLightTransmission &&
        input.matchedObservedCanopyTemperaturesC[i] <=
          input.callerMaximumCanopyTemperatureC,
    ),
    signedTemperatureMarginsC: input.matchedObservedCanopyTemperaturesC.map(
      (v) => input.callerMaximumCanopyTemperatureC - v,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerScreenIds: ["reflective", "woven"],
  matchedMeasuredLightTransmission: [0.6, 0.5],
  matchedObservedCanopyTemperaturesC: [24, 28],
  callerMinimumLightTransmission: 0.5,
  callerMaximumCanopyTemperatureC: 26,
} satisfies Input;
export const exampleOutput = {
  callerJointlyCompatibleScreenIds: ["reflective"],
  signedTemperatureMarginsC: [2, -2],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horticulture/aluminet-vs-woven-lookup",
  title: "Aluminet vs Woven Shade Lookup",
  description:
    "Compare actual matched reflective/woven screen trials on independent light and canopy temperature constraints; no universal Aluminet superiority, causal cooling guarantee or product spec invention.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerJointlyCompatibleScreenIds",
      label: "Caller jointly compatible screen ids",
      kind: "stringList",
    },
    {
      id: "signedTemperatureMarginsC",
      label: "Signed temperature margins c",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerScreenIds: value.callerScreenIds as readonly string[],
      matchedMeasuredLightTransmission:
        value.matchedMeasuredLightTransmission as readonly number[],
      matchedObservedCanopyTemperaturesC:
        value.matchedObservedCanopyTemperaturesC as readonly number[],
      callerMinimumLightTransmission:
        value.callerMinimumLightTransmission as number,
      callerMaximumCanopyTemperatureC:
        value.callerMaximumCanopyTemperatureC as number,
    }),
});
export const run = tool.execute;
export default tool;
