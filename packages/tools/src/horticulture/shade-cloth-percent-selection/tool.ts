import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  fraction,
  aligned,
  unique,
  band,
} from "../batch34-shared.js";
export type Input = Readonly<{
  readonly callerShadeClothIds: readonly string[];
  readonly matchedMeasuredTransmissionFractions: readonly number[];
  readonly incidentDli: number;
  readonly callerAcceptableDliRange: readonly number[];
}>;
export type Output = Readonly<{
  readonly modeledClothDli: readonly number[];
  readonly callerCompatibleShadeClothIds: readonly string[];
}>;
const inputFields = [
  {
    id: "callerShadeClothIds",
    label: "Caller shade cloth ids",
    kind: "stringList",
  },
  {
    id: "matchedMeasuredTransmissionFractions",
    label: "Matched measured transmission fractions",
    kind: "numberList",
  },
  { id: "incidentDli", label: "Incident dli", kind: "number" },
  {
    id: "callerAcceptableDliRange",
    label: "Caller acceptable dli range",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.incidentDli, "incidentDli");
  input.callerAcceptableDliRange.forEach((v) =>
    nonnegative(v, "callerAcceptableDliRange"),
  );
  input.matchedMeasuredTransmissionFractions.forEach((v) =>
    fraction(v, "matchedMeasuredTransmissionFractions"),
  );
  aligned(
    input.callerShadeClothIds,
    input.matchedMeasuredTransmissionFractions,
    "callerShadeClothIds",
  );
  unique(input.callerShadeClothIds, "cloth");
  if (input.callerAcceptableDliRange.length !== 2)
    simpleError("range", "Two caller DLI limits required.");
  const dose = input.matchedMeasuredTransmissionFractions.map(
    (v) => v * input.incidentDli,
  );
  return {
    modeledClothDli: dose,
    callerCompatibleShadeClothIds: input.callerShadeClothIds.filter(
      (_, i) =>
        band(
          dose[i],
          input.callerAcceptableDliRange[0],
          input.callerAcceptableDliRange[1],
        ) >= 0,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerShadeClothIds: ["a", "b", "c"],
  matchedMeasuredTransmissionFractions: [0.8, 0.5, 0.2],
  incidentDli: 20,
  callerAcceptableDliRange: [8, 12],
} satisfies Input;
export const exampleOutput = {
  modeledClothDli: [16, 10, 4],
  callerCompatibleShadeClothIds: ["b"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horticulture/shade-cloth-percent-selection",
  title: "Shade Cloth Percent Selection Lookup",
  description:
    "Screen actual shade cloth candidates under matched measured transmission and caller DLI band, preserving no/multiple matches; no nominal shade-percent inference or cooling/crop recommendation.",
  inputs: inputFields,
  outputs: [
    { id: "modeledClothDli", label: "Modeled cloth dli", kind: "numberList" },
    {
      id: "callerCompatibleShadeClothIds",
      label: "Caller compatible shade cloth ids",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerShadeClothIds: value.callerShadeClothIds as readonly string[],
      matchedMeasuredTransmissionFractions:
        value.matchedMeasuredTransmissionFractions as readonly number[],
      incidentDli: value.incidentDli as number,
      callerAcceptableDliRange:
        value.callerAcceptableDliRange as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
