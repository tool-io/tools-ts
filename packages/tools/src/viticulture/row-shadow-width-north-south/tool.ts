import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly verticalCanopyHeightM: number;
  readonly horizontalCanopyWidthM: number;
  readonly rowSpacingM: number;
  readonly solarAltitudeDegrees: number;
  readonly solarAzimuthClockwiseFromNorthDegrees: number;
}>;
export type Output = Readonly<{
  readonly northSouthRowNormalShadowWidthM: number;
  readonly shadowBeyondAdjacentRowSpacingM: number;
}>;
const inputFields = [
  {
    id: "verticalCanopyHeightM",
    label: "Vertical canopy height m",
    kind: "number",
  },
  {
    id: "horizontalCanopyWidthM",
    label: "Horizontal canopy width m",
    kind: "number",
  },
  { id: "rowSpacingM", label: "Row spacing m", kind: "number" },
  {
    id: "solarAltitudeDegrees",
    label: "Solar altitude degrees",
    kind: "number",
  },
  {
    id: "solarAzimuthClockwiseFromNorthDegrees",
    label: "Solar azimuth clockwise from north degrees",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.rowSpacingM, "rowSpacingM");
  positive(input.solarAltitudeDegrees, "solarAltitudeDegrees");
  nonnegative(input.verticalCanopyHeightM, "verticalCanopyHeightM");
  nonnegative(input.horizontalCanopyWidthM, "horizontalCanopyWidthM");
  if (input.solarAltitudeDegrees > 90)
    simpleError(
      "sun",
      "Solar altitude in (0,90] required for above-horizon shadow model.",
    );
  const a = (input.solarAltitudeDegrees * Math.PI) / 180,
    normal = Math.abs(
      Math.sin((input.solarAzimuthClockwiseFromNorthDegrees * Math.PI) / 180),
    ),
    northSouthRowNormalShadowWidthM =
      input.horizontalCanopyWidthM +
      ((input.verticalCanopyHeightM * Math.cos(a)) / Math.sin(a)) * normal;
  return {
    northSouthRowNormalShadowWidthM,
    shadowBeyondAdjacentRowSpacingM: Math.max(
      0,
      northSouthRowNormalShadowWidthM - input.rowSpacingM,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  verticalCanopyHeightM: 2,
  horizontalCanopyWidthM: 0.5,
  rowSpacingM: 2,
  solarAltitudeDegrees: 45,
  solarAzimuthClockwiseFromNorthDegrees: 90,
} satisfies Input;
export const exampleOutput = {
  northSouthRowNormalShadowWidthM: 2.5,
  shadowBeyondAdjacentRowSpacingM: 0.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "viticulture/row-shadow-width-north-south",
  title: "Row Shadow Width North South",
  description:
    "Project ideal vertical north–south row canopy shadow onto east–west row normal using supplied sun angles/dimensions; no coordinates, terrain, irradiance loss, vine suitability or geodesy.",
  inputs: inputFields,
  outputs: [
    {
      id: "northSouthRowNormalShadowWidthM",
      label: "North south row normal shadow width m",
      kind: "number",
    },
    {
      id: "shadowBeyondAdjacentRowSpacingM",
      label: "Shadow beyond adjacent row spacing m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      verticalCanopyHeightM: value.verticalCanopyHeightM as number,
      horizontalCanopyWidthM: value.horizontalCanopyWidthM as number,
      rowSpacingM: value.rowSpacingM as number,
      solarAltitudeDegrees: value.solarAltitudeDegrees as number,
      solarAzimuthClockwiseFromNorthDegrees:
        value.solarAzimuthClockwiseFromNorthDegrees as number,
    }),
});
export const run = tool.execute;
export default tool;
