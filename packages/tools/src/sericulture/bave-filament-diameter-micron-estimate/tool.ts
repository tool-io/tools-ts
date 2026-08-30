import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, fraction } from "../shared.js";
export type Input = Readonly<{
  readonly filamentDenier: number;
  readonly materialDensityGramsPerCm3: number;
  readonly solidAreaFraction: number;
  readonly ellipseMajorToMinorAxisRatio: number;
}>;
export type Output = Readonly<{
  readonly equivalentEnvelopeDiameterMicrons: number;
  readonly minorAxisDiameterMicrons: number;
  readonly majorAxisDiameterMicrons: number;
}>;
const inputFields = [
  { id: "filamentDenier", label: "Filament denier", kind: "number" },
  {
    id: "materialDensityGramsPerCm3",
    label: "Material density grams per cm3",
    kind: "number",
  },
  { id: "solidAreaFraction", label: "Solid area fraction", kind: "number" },
  {
    id: "ellipseMajorToMinorAxisRatio",
    label: "Ellipse major to minor axis ratio",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.filamentDenier, "filamentDenier");
  positive(input.materialDensityGramsPerCm3, "materialDensityGramsPerCm3");
  positive(input.solidAreaFraction, "solidAreaFraction");
  fraction(input.solidAreaFraction, "solidAreaFraction");
  if (input.ellipseMajorToMinorAxisRatio < 1)
    simpleError(
      "ellipseMajorToMinorAxisRatio",
      "Major/minor axis ratio at least one required.",
    );
  const equivalentEnvelopeDiameterMicrons = Math.sqrt(
      (4 * input.filamentDenier * 1e8) /
        (900000 *
          Math.PI *
          input.materialDensityGramsPerCm3 *
          input.solidAreaFraction),
    ),
    minorAxisDiameterMicrons =
      equivalentEnvelopeDiameterMicrons /
      Math.sqrt(input.ellipseMajorToMinorAxisRatio);
  return {
    equivalentEnvelopeDiameterMicrons,
    minorAxisDiameterMicrons,
    majorAxisDiameterMicrons:
      minorAxisDiameterMicrons * input.ellipseMajorToMinorAxisRatio,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  filamentDenier: 3,
  materialDensityGramsPerCm3: 1.3,
  solidAreaFraction: 0.8,
  ellipseMajorToMinorAxisRatio: 2,
} satisfies Input;
export const exampleOutput = {
  equivalentEnvelopeDiameterMicrons: 20.20122762783308,
  minorAxisDiameterMicrons: 14.284425043933805,
  majorAxisDiameterMicrons: 28.56885008786761,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sericulture/bave-filament-diameter-micron-estimate",
  title: "Bave Filament Diameter Micron Estimate",
  description:
    "Estimate equivalent and elliptical bave envelope diameters from denier, supplied material density and solid-area fraction; cross-section is an assumed model, not measured filament microscopy.",
  inputs: inputFields,
  outputs: [
    {
      id: "equivalentEnvelopeDiameterMicrons",
      label: "Equivalent envelope diameter microns",
      kind: "number",
    },
    {
      id: "minorAxisDiameterMicrons",
      label: "Minor axis diameter microns",
      kind: "number",
    },
    {
      id: "majorAxisDiameterMicrons",
      label: "Major axis diameter microns",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      filamentDenier: value.filamentDenier as number,
      materialDensityGramsPerCm3: value.materialDensityGramsPerCm3 as number,
      solidAreaFraction: value.solidAreaFraction as number,
      ellipseMajorToMinorAxisRatio:
        value.ellipseMajorToMinorAxisRatio as number,
    }),
});
export const run = tool.execute;
export default tool;
