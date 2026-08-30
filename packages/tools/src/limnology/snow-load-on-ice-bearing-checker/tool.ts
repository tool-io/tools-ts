import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly blackIceThicknessM: number;
  readonly whiteIceThicknessM: number;
  readonly snowThicknessM: number;
  readonly blackIceDensityKgPerM3: number;
  readonly whiteIceDensityKgPerM3: number;
  readonly snowDensityKgPerM3: number;
  readonly waterDensityKgPerM3: number;
}>;
export type Output = Readonly<{
  readonly hydrostaticDraftM: number;
  readonly iceSurfaceFreeboardM: number;
  readonly snowFloodingPotential: boolean;
}>;
const inputFields = [
  { id: "blackIceThicknessM", label: "Black ice thickness m", kind: "number" },
  { id: "whiteIceThicknessM", label: "White ice thickness m", kind: "number" },
  { id: "snowThicknessM", label: "Snow thickness m", kind: "number" },
  {
    id: "blackIceDensityKgPerM3",
    label: "Black ice density kg per m3",
    kind: "number",
  },
  {
    id: "whiteIceDensityKgPerM3",
    label: "White ice density kg per m3",
    kind: "number",
  },
  { id: "snowDensityKgPerM3", label: "Snow density kg per m3", kind: "number" },
  {
    id: "waterDensityKgPerM3",
    label: "Water density kg per m3",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.blackIceDensityKgPerM3, "blackIceDensityKgPerM3");
  positive(input.whiteIceDensityKgPerM3, "whiteIceDensityKgPerM3");
  positive(input.snowDensityKgPerM3, "snowDensityKgPerM3");
  positive(input.waterDensityKgPerM3, "waterDensityKgPerM3");
  nonnegative(input.blackIceThicknessM, "blackIceThicknessM");
  nonnegative(input.whiteIceThicknessM, "whiteIceThicknessM");
  nonnegative(input.snowThicknessM, "snowThicknessM");
  const ice = input.blackIceThicknessM + input.whiteIceThicknessM;
  positive(ice, "iceThickness");
  if (
    input.blackIceDensityKgPerM3 >= input.waterDensityKgPerM3 ||
    input.whiteIceDensityKgPerM3 >= input.waterDensityKgPerM3
  )
    simpleError(
      "waterDensityKgPerM3",
      "Floating ice densities below water required.",
    );
  const hydrostaticDraftM =
      (input.blackIceThicknessM * input.blackIceDensityKgPerM3 +
        input.whiteIceThicknessM * input.whiteIceDensityKgPerM3 +
        input.snowThicknessM * input.snowDensityKgPerM3) /
      input.waterDensityKgPerM3,
    iceSurfaceFreeboardM = ice - hydrostaticDraftM;
  return {
    hydrostaticDraftM,
    iceSurfaceFreeboardM,
    snowFloodingPotential: iceSurfaceFreeboardM < 0,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  blackIceThicknessM: 0.5,
  whiteIceThicknessM: 0.2,
  snowThicknessM: 0.1,
  blackIceDensityKgPerM3: 900,
  whiteIceDensityKgPerM3: 800,
  snowDensityKgPerM3: 300,
  waterDensityKgPerM3: 1000,
} satisfies Input;
export const exampleOutput = {
  hydrostaticDraftM: 0.64,
  iceSurfaceFreeboardM: 0.06,
  snowFloodingPotential: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "limnology/snow-load-on-ice-bearing-checker",
  title: "Snow Load On Ice Bearing Checker",
  description:
    "Screen layered ice/snow hydrostatic freeboard for potential snow flooding; this is buoyancy only, not bearing strength or permission to walk, drive or work on ice.",
  inputs: inputFields,
  outputs: [
    { id: "hydrostaticDraftM", label: "Hydrostatic draft m", kind: "number" },
    {
      id: "iceSurfaceFreeboardM",
      label: "Ice surface freeboard m",
      kind: "number",
    },
    {
      id: "snowFloodingPotential",
      label: "Snow flooding potential",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      blackIceThicknessM: value.blackIceThicknessM as number,
      whiteIceThicknessM: value.whiteIceThicknessM as number,
      snowThicknessM: value.snowThicknessM as number,
      blackIceDensityKgPerM3: value.blackIceDensityKgPerM3 as number,
      whiteIceDensityKgPerM3: value.whiteIceDensityKgPerM3 as number,
      snowDensityKgPerM3: value.snowDensityKgPerM3 as number,
      waterDensityKgPerM3: value.waterDensityKgPerM3 as number,
    }),
});
export const run = tool.execute;
export default tool;
