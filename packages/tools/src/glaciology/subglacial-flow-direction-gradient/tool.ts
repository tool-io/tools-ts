import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly bedElevationGradients: readonly number[];
  readonly iceThicknessGradients: readonly number[];
  readonly waterPressureOverburdenFraction: number;
  readonly iceDensityKgPerM3: number;
  readonly waterDensityKgPerM3: number;
  readonly gravityMPerSecondSquared: number;
}>;
export type Output = Readonly<{
  readonly potentialGradientPaPerMeter: readonly number[];
  readonly unitDownPotentialDirection: readonly number[];
}>;
const inputFields = [
  {
    id: "bedElevationGradients",
    label: "Bed elevation gradients",
    kind: "numberList",
  },
  {
    id: "iceThicknessGradients",
    label: "Ice thickness gradients",
    kind: "numberList",
  },
  {
    id: "waterPressureOverburdenFraction",
    label: "Water pressure overburden fraction",
    kind: "number",
  },
  { id: "iceDensityKgPerM3", label: "Ice density kg per m3", kind: "number" },
  {
    id: "waterDensityKgPerM3",
    label: "Water density kg per m3",
    kind: "number",
  },
  {
    id: "gravityMPerSecondSquared",
    label: "Gravity m per second squared",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.iceDensityKgPerM3, "iceDensityKgPerM3");
  positive(input.waterDensityKgPerM3, "waterDensityKgPerM3");
  positive(input.gravityMPerSecondSquared, "gravityMPerSecondSquared");
  nonnegative(
    input.waterPressureOverburdenFraction,
    "waterPressureOverburdenFraction",
  );
  if (
    input.bedElevationGradients.length !== 2 ||
    input.iceThicknessGradients.length !== 2
  )
    simpleError(
      "bedElevationGradients",
      "Two horizontal components per gradient required.",
    );
  const potentialGradientPaPerMeter = input.bedElevationGradients.map(
      (v, i) =>
        input.gravityMPerSecondSquared *
        (input.waterDensityKgPerM3 * v +
          input.waterPressureOverburdenFraction *
            input.iceDensityKgPerM3 *
            input.iceThicknessGradients[i]),
    ),
    length = positive(Math.hypot(...potentialGradientPaPerMeter), "gradient");
  return {
    potentialGradientPaPerMeter,
    unitDownPotentialDirection: potentialGradientPaPerMeter.map(
      (v) => -v / length,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  bedElevationGradients: [1, 0],
  iceThicknessGradients: [0, 1],
  waterPressureOverburdenFraction: 1,
  iceDensityKgPerM3: 900,
  waterDensityKgPerM3: 1000,
  gravityMPerSecondSquared: 10,
} satisfies Input;
export const exampleOutput = {
  potentialGradientPaPerMeter: [10000, 9000],
  unitDownPotentialDirection: [-0.7432941462471664, -0.6689647316224497],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glaciology/subglacial-flow-direction-gradient",
  title: "Subglacial Flow Direction Gradient",
  description:
    "Compute isotropic downhill hydraulic-potential direction from bed/thickness gradients and pressure ratio; flat gradients have no defined direction and anisotropic transmissivity is excluded.",
  inputs: inputFields,
  outputs: [
    {
      id: "potentialGradientPaPerMeter",
      label: "Potential gradient pa per meter",
      kind: "numberList",
    },
    {
      id: "unitDownPotentialDirection",
      label: "Unit down potential direction",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      bedElevationGradients: value.bedElevationGradients as readonly number[],
      iceThicknessGradients: value.iceThicknessGradients as readonly number[],
      waterPressureOverburdenFraction:
        value.waterPressureOverburdenFraction as number,
      iceDensityKgPerM3: value.iceDensityKgPerM3 as number,
      waterDensityKgPerM3: value.waterDensityKgPerM3 as number,
      gravityMPerSecondSquared: value.gravityMPerSecondSquared as number,
    }),
});
export const run = tool.execute;
export default tool;
