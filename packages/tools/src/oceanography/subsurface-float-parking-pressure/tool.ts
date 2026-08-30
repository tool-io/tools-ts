import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, layers } from "../shared.js";
export type Input = Readonly<{
  readonly depthBoundariesM: readonly number[];
  readonly layerDensitiesKgPerM3: readonly number[];
  readonly gravityMPerSecondSquared: number;
  readonly surfaceAbsolutePressurePa: number;
}>;
export type Output = Readonly<{
  readonly boundaryGaugePressuresDbar: readonly number[];
  readonly boundaryAbsolutePressuresPa: readonly number[];
}>;
const inputFields = [
  { id: "depthBoundariesM", label: "Depth boundaries m", kind: "numberList" },
  {
    id: "layerDensitiesKgPerM3",
    label: "Layer densities kg per m3",
    kind: "numberList",
  },
  {
    id: "gravityMPerSecondSquared",
    label: "Gravity m per second squared",
    kind: "number",
  },
  {
    id: "surfaceAbsolutePressurePa",
    label: "Surface absolute pressure pa",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.layerDensitiesKgPerM3.forEach((v) =>
    positive(v, "layerDensitiesKgPerM3"),
  );
  positive(input.gravityMPerSecondSquared, "gravityMPerSecondSquared");
  positive(input.surfaceAbsolutePressurePa, "surfaceAbsolutePressurePa");
  layers(input.depthBoundariesM, input.layerDensitiesKgPerM3);
  if (input.depthBoundariesM[0] !== 0)
    simpleError(
      "depthBoundariesM",
      "Hydrostatic profile must begin at surface zero.",
    );
  let p = 0;
  const boundaryGaugePressuresDbar = [0],
    boundaryAbsolutePressuresPa = [input.surfaceAbsolutePressurePa];
  input.layerDensitiesKgPerM3.forEach((rho, i) => {
    p +=
      rho *
      input.gravityMPerSecondSquared *
      (input.depthBoundariesM[i + 1] - input.depthBoundariesM[i]);
    boundaryGaugePressuresDbar.push(p / 10000);
    boundaryAbsolutePressuresPa.push(p + input.surfaceAbsolutePressurePa);
  });
  return { boundaryGaugePressuresDbar, boundaryAbsolutePressuresPa };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  depthBoundariesM: [0, 10, 30],
  layerDensitiesKgPerM3: [1000, 1100],
  gravityMPerSecondSquared: 10,
  surfaceAbsolutePressurePa: 100000,
} satisfies Input;
export const exampleOutput = {
  boundaryGaugePressuresDbar: [0, 10, 32],
  boundaryAbsolutePressuresPa: [100000, 200000, 420000],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "oceanography/subsurface-float-parking-pressure",
  title: "Subsurface Float Parking Pressure",
  description:
    "Integrate layer-varying hydrostatic density into float parking pressure profiles, separating gauge dbar from absolute Pa; does not infer a neutral-buoyancy depth or use homogeneous pressure/depth division.",
  inputs: inputFields,
  outputs: [
    {
      id: "boundaryGaugePressuresDbar",
      label: "Boundary gauge pressures dbar",
      kind: "numberList",
    },
    {
      id: "boundaryAbsolutePressuresPa",
      label: "Boundary absolute pressures pa",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      depthBoundariesM: value.depthBoundariesM as readonly number[],
      layerDensitiesKgPerM3: value.layerDensitiesKgPerM3 as readonly number[],
      gravityMPerSecondSquared: value.gravityMPerSecondSquared as number,
      surfaceAbsolutePressurePa: value.surfaceAbsolutePressurePa as number,
    }),
});
export const run = tool.execute;
export default tool;
