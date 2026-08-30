import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly girdleDiameterMm: number;
  readonly tableDiameterMm: number;
  readonly crownHeightMm: number;
}>;
export type Output = Readonly<{
  readonly axisymmetricCrownSlopeDegrees: number;
}>;
const inputFields = [
  { id: "girdleDiameterMm", label: "Girdle diameter mm", kind: "number" },
  { id: "tableDiameterMm", label: "Table diameter mm", kind: "number" },
  { id: "crownHeightMm", label: "Crown height mm", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.girdleDiameterMm, "girdleDiameterMm");
  nonnegative(input.tableDiameterMm, "tableDiameterMm");
  nonnegative(input.crownHeightMm, "crownHeightMm");
  const run = positive(
    (input.girdleDiameterMm - input.tableDiameterMm) / 2,
    "crownRun",
  );
  return {
    axisymmetricCrownSlopeDegrees:
      (Math.atan2(input.crownHeightMm, run) * 180) / Math.PI,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  girdleDiameterMm: 10,
  tableDiameterMm: 6,
  crownHeightMm: 2,
} satisfies Input;
export const exampleOutput = {
  axisymmetricCrownSlopeDegrees: 45,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "gemology/crown-angle-height-ratio",
  title: "Crown Angle from Height Ratio",
  description:
    "Infer coaxial truncated-cone crown slope from measured table/girdle diameters and crown height; not individual faceted crown angles or an ideal-cut recommendation.",
  inputs: inputFields,
  outputs: [
    {
      id: "axisymmetricCrownSlopeDegrees",
      label: "Axisymmetric crown slope degrees",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      girdleDiameterMm: value.girdleDiameterMm as number,
      tableDiameterMm: value.tableDiameterMm as number,
      crownHeightMm: value.crownHeightMm as number,
    }),
});
export const run = tool.execute;
export default tool;
