import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly measuredFreeboardM: number;
  readonly firnAirEquivalentThicknessM: number;
  readonly iceDensityKgPerM3: number;
  readonly waterDensityKgPerM3: number;
}>;
export type Output = Readonly<{
  readonly inferredFloatingThicknessM: number;
  readonly inferredDraftM: number;
}>;
const inputFields = [
  { id: "measuredFreeboardM", label: "Measured freeboard m", kind: "number" },
  {
    id: "firnAirEquivalentThicknessM",
    label: "Firn air equivalent thickness m",
    kind: "number",
  },
  { id: "iceDensityKgPerM3", label: "Ice density kg per m3", kind: "number" },
  {
    id: "waterDensityKgPerM3",
    label: "Water density kg per m3",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.iceDensityKgPerM3, "iceDensityKgPerM3");
  positive(input.waterDensityKgPerM3, "waterDensityKgPerM3");
  nonnegative(input.measuredFreeboardM, "measuredFreeboardM");
  nonnegative(input.firnAirEquivalentThicknessM, "firnAirEquivalentThicknessM");
  const contrast = positive(
      input.waterDensityKgPerM3 - input.iceDensityKgPerM3,
      "waterDensityKgPerM3",
    ),
    inferredFloatingThicknessM = nonnegative(
      (input.waterDensityKgPerM3 * input.measuredFreeboardM -
        input.iceDensityKgPerM3 * input.firnAirEquivalentThicknessM) /
        contrast,
      "measuredFreeboardM",
    ),
    inferredDraftM = nonnegative(
      inferredFloatingThicknessM - input.measuredFreeboardM,
      "firnAirEquivalentThicknessM",
    );
  if (input.firnAirEquivalentThicknessM > inferredFloatingThicknessM)
    simpleError(
      "firnAirEquivalentThicknessM",
      "Air-equivalent thickness cannot exceed total thickness.",
    );
  return { inferredFloatingThicknessM, inferredDraftM };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  measuredFreeboardM: 20,
  firnAirEquivalentThicknessM: 0,
  iceDensityKgPerM3: 900,
  waterDensityKgPerM3: 1000,
} satisfies Input;
export const exampleOutput = {
  inferredFloatingThicknessM: 200,
  inferredDraftM: 180,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glaciology/freeboard-flotation-requirement",
  title: "Freeboard Flotation Requirement",
  description:
    "Infer freely floating thickness and draft from measured freeboard with explicit firn-air correction; unsupported if grounded, flexing or under external loads.",
  inputs: inputFields,
  outputs: [
    {
      id: "inferredFloatingThicknessM",
      label: "Inferred floating thickness m",
      kind: "number",
    },
    { id: "inferredDraftM", label: "Inferred draft m", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      measuredFreeboardM: value.measuredFreeboardM as number,
      firnAirEquivalentThicknessM: value.firnAirEquivalentThicknessM as number,
      iceDensityKgPerM3: value.iceDensityKgPerM3 as number,
      waterDensityKgPerM3: value.waterDensityKgPerM3 as number,
    }),
});
export const run = tool.execute;
export default tool;
