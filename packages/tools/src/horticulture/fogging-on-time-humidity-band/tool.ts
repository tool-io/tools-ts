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
} from "../shared.js";
export type Input = Readonly<{
  readonly roomVolumeM3: number;
  readonly saturationVaporDensityGramsPerM3: number;
  readonly initialRhPercent: number;
  readonly targetRhPercent: number;
  readonly fogWaterGramsPerSecond: number;
  readonly evaporatedFraction: number;
  readonly otherVaporSourcesGramsPerSecond: number;
}>;
export type Output = Readonly<{
  readonly modelFogOnSeconds: number;
  readonly evaporatedWaterGrams: number;
}>;
const inputFields = [
  { id: "roomVolumeM3", label: "Room volume m3", kind: "number" },
  {
    id: "saturationVaporDensityGramsPerM3",
    label: "Saturation vapor density grams per m3",
    kind: "number",
  },
  { id: "initialRhPercent", label: "Initial rh percent", kind: "number" },
  { id: "targetRhPercent", label: "Target rh percent", kind: "number" },
  {
    id: "fogWaterGramsPerSecond",
    label: "Fog water grams per second",
    kind: "number",
  },
  { id: "evaporatedFraction", label: "Evaporated fraction", kind: "number" },
  {
    id: "otherVaporSourcesGramsPerSecond",
    label: "Other vapor sources grams per second",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.roomVolumeM3, "roomVolumeM3");
  positive(
    input.saturationVaporDensityGramsPerM3,
    "saturationVaporDensityGramsPerM3",
  );
  positive(input.fogWaterGramsPerSecond, "fogWaterGramsPerSecond");
  positive(input.evaporatedFraction, "evaporatedFraction");
  nonnegative(input.initialRhPercent, "initialRhPercent");
  nonnegative(input.targetRhPercent, "targetRhPercent");
  nonnegative(
    input.otherVaporSourcesGramsPerSecond,
    "otherVaporSourcesGramsPerSecond",
  );
  fraction(input.evaporatedFraction, "evaporatedFraction");
  if (
    input.targetRhPercent > 100 ||
    input.initialRhPercent > input.targetRhPercent
  )
    simpleError(
      "targetRhPercent",
      "Ordered RH rise target within [0,100] required.",
    );
  const evaporatedRate =
      input.fogWaterGramsPerSecond * input.evaporatedFraction,
    required =
      (input.roomVolumeM3 *
        input.saturationVaporDensityGramsPerM3 *
        (input.targetRhPercent - input.initialRhPercent)) /
      100,
    modelFogOnSeconds =
      required / (evaporatedRate + input.otherVaporSourcesGramsPerSecond);
  return {
    modelFogOnSeconds,
    evaporatedWaterGrams: modelFogOnSeconds * evaporatedRate,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  roomVolumeM3: 100,
  saturationVaporDensityGramsPerM3: 20,
  initialRhPercent: 40,
  targetRhPercent: 60,
  fogWaterGramsPerSecond: 10,
  evaporatedFraction: 0.5,
  otherVaporSourcesGramsPerSecond: 0,
} satisfies Input;
export const exampleOutput = {
  modelFogOnSeconds: 80,
  evaporatedWaterGrams: 400,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horticulture/fogging-on-time-humidity-band",
  title: "Fogging On Time Humidity Band",
  description:
    "Calculate constant-temperature closed-room fog on-time from a supplied saturation vapor density, evaporation yield and other vapor sources; ventilation, condensation and cooling are excluded, so not a controller setting guarantee.",
  inputs: inputFields,
  outputs: [
    { id: "modelFogOnSeconds", label: "Model fog on seconds", kind: "number" },
    {
      id: "evaporatedWaterGrams",
      label: "Evaporated water grams",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      roomVolumeM3: value.roomVolumeM3 as number,
      saturationVaporDensityGramsPerM3:
        value.saturationVaporDensityGramsPerM3 as number,
      initialRhPercent: value.initialRhPercent as number,
      targetRhPercent: value.targetRhPercent as number,
      fogWaterGramsPerSecond: value.fogWaterGramsPerSecond as number,
      evaporatedFraction: value.evaporatedFraction as number,
      otherVaporSourcesGramsPerSecond:
        value.otherVaporSourcesGramsPerSecond as number,
    }),
});
export const run = tool.execute;
export default tool;
