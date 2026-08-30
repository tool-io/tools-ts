import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly lakeAreaM2: number;
  readonly precipitationDepthMm: number;
  readonly inflowVolumeM3: number;
  readonly outflowVolumeM3: number;
  readonly observedLakeStorageChangeM3: number;
  readonly panEvaporationDepthMm: number;
}>;
export type Output = Readonly<{
  readonly inferredLakeEvaporationDepthMm: number;
  readonly panToLakeCoefficient: number;
}>;
const inputFields = [
  { id: "lakeAreaM2", label: "Lake area m2", kind: "number" },
  {
    id: "precipitationDepthMm",
    label: "Precipitation depth mm",
    kind: "number",
  },
  { id: "inflowVolumeM3", label: "Inflow volume m3", kind: "number" },
  { id: "outflowVolumeM3", label: "Outflow volume m3", kind: "number" },
  {
    id: "observedLakeStorageChangeM3",
    label: "Observed lake storage change m3",
    kind: "number",
  },
  {
    id: "panEvaporationDepthMm",
    label: "Pan evaporation depth mm",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.lakeAreaM2, "lakeAreaM2");
  positive(input.panEvaporationDepthMm, "panEvaporationDepthMm");
  nonnegative(input.precipitationDepthMm, "precipitationDepthMm");
  nonnegative(input.inflowVolumeM3, "inflowVolumeM3");
  nonnegative(input.outflowVolumeM3, "outflowVolumeM3");
  const inferredLakeEvaporationDepthMm =
    input.precipitationDepthMm +
    (1000 *
      (input.inflowVolumeM3 -
        input.outflowVolumeM3 -
        input.observedLakeStorageChangeM3)) /
      input.lakeAreaM2;
  return {
    inferredLakeEvaporationDepthMm,
    panToLakeCoefficient:
      inferredLakeEvaporationDepthMm / input.panEvaporationDepthMm,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  lakeAreaM2: 1000,
  precipitationDepthMm: 2,
  inflowVolumeM3: 1,
  outflowVolumeM3: 0,
  observedLakeStorageChangeM3: -2,
  panEvaporationDepthMm: 10,
} satisfies Input;
export const exampleOutput = {
  inferredLakeEvaporationDepthMm: 5,
  panToLakeCoefficient: 0.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "limnology/evaporation-pan-to-lake-coefficient",
  title: "Evaporation Pan To Lake Coefficient",
  description:
    "Infer a pan-to-lake coefficient from a matched fixed-area observed lake water budget; negative inferred evaporation/coefficient exposes condensation or missing fluxes rather than being forced to an empirical default.",
  inputs: inputFields,
  outputs: [
    {
      id: "inferredLakeEvaporationDepthMm",
      label: "Inferred lake evaporation depth mm",
      kind: "number",
    },
    {
      id: "panToLakeCoefficient",
      label: "Pan to lake coefficient",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      lakeAreaM2: value.lakeAreaM2 as number,
      precipitationDepthMm: value.precipitationDepthMm as number,
      inflowVolumeM3: value.inflowVolumeM3 as number,
      outflowVolumeM3: value.outflowVolumeM3 as number,
      observedLakeStorageChangeM3: value.observedLakeStorageChangeM3 as number,
      panEvaporationDepthMm: value.panEvaporationDepthMm as number,
    }),
});
export const run = tool.execute;
export default tool;
