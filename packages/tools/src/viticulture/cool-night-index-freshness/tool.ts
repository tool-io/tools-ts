import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  binary,
  mean,
  unique,
  strictlyIncreasing,
} from "../batch34-shared.js";
export type Input = Readonly<{
  readonly observedNightMinimumTemperaturesC: readonly number[];
  readonly nightObservationFlags: readonly number[];
  readonly callerCoolNightClassUpperEdgesC: readonly number[];
  readonly callerCoolNightClassLabels: readonly string[];
}>;
export type Output = Readonly<{
  readonly knownMeanNightMinimumC: number;
  readonly knownNightCount: number;
  readonly unknownNightCount: number;
  readonly callerCoolNightClassLabel: string;
}>;
const inputFields = [
  {
    id: "observedNightMinimumTemperaturesC",
    label: "Observed night minimum temperatures c",
    kind: "numberList",
  },
  {
    id: "nightObservationFlags",
    label: "Night observation flags",
    kind: "numberList",
  },
  {
    id: "callerCoolNightClassUpperEdgesC",
    label: "Caller cool night class upper edges c",
    kind: "numberList",
  },
  {
    id: "callerCoolNightClassLabels",
    label: "Caller cool night class labels",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  binary(input.nightObservationFlags, "nightObservationFlags");
  aligned(
    input.observedNightMinimumTemperaturesC,
    input.nightObservationFlags,
    "observedNightMinimumTemperaturesC",
  );
  strictlyIncreasing(input.callerCoolNightClassUpperEdgesC, "classes", 1);
  unique(input.callerCoolNightClassLabels, "classes");
  if (
    input.callerCoolNightClassLabels.length !==
    input.callerCoolNightClassUpperEdgesC.length + 1
  )
    simpleError(
      "classes",
      "One class above last caller inclusive edge required.",
    );
  const known = input.observedNightMinimumTemperaturesC.filter(
    (_, i) => input.nightObservationFlags[i],
  );
  if (!known.length)
    simpleError(
      "nights",
      "No observed nights; cannot classify unknown climate.",
    );
  const average = mean(known),
    i = input.callerCoolNightClassUpperEdgesC.findIndex((v) => average <= v);
  return {
    knownMeanNightMinimumC: average,
    knownNightCount: known.length,
    unknownNightCount: input.nightObservationFlags.length - known.length,
    callerCoolNightClassLabel:
      input.callerCoolNightClassLabels[
        i < 0 ? input.callerCoolNightClassUpperEdgesC.length : i
      ],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedNightMinimumTemperaturesC: [10, 12, 20],
  nightObservationFlags: [1, 1, 0],
  callerCoolNightClassUpperEdgesC: [12, 18],
  callerCoolNightClassLabels: ["cool", "intermediate", "warm"],
} satisfies Input;
export const exampleOutput = {
  knownMeanNightMinimumC: 11,
  knownNightCount: 2,
  unknownNightCount: 1,
  callerCoolNightClassLabel: "cool",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "viticulture/cool-night-index-freshness",
  title: "Cool Night Index Freshness Lookup",
  description:
    "Audit actual caller-defined night-window mean minima with observation coverage and independently supplied cool-night bands; no default hemisphere month, wine freshness or cultivar suitability inference.",
  inputs: inputFields,
  outputs: [
    {
      id: "knownMeanNightMinimumC",
      label: "Known mean night minimum c",
      kind: "number",
    },
    { id: "knownNightCount", label: "Known night count", kind: "number" },
    { id: "unknownNightCount", label: "Unknown night count", kind: "number" },
    {
      id: "callerCoolNightClassLabel",
      label: "Caller cool night class label",
      kind: "string",
    },
  ],
  calculate: (value) =>
    calculate({
      observedNightMinimumTemperaturesC:
        value.observedNightMinimumTemperaturesC as readonly number[],
      nightObservationFlags: value.nightObservationFlags as readonly number[],
      callerCoolNightClassUpperEdgesC:
        value.callerCoolNightClassUpperEdgesC as readonly number[],
      callerCoolNightClassLabels:
        value.callerCoolNightClassLabels as readonly string[],
    }),
});
export const run = tool.execute;
export default tool;
