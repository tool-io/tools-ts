import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, roundGeometry } from "../shared.js";
export type Input = Readonly<{
  readonly girdleDiameterMm: number;
  readonly tableDiameterMm: number;
  readonly culetDiameterMm: number;
  readonly crownHeightMm: number;
  readonly girdleHeightMm: number;
  readonly pavilionDepthMm: number;
}>;
export type Output = Readonly<{
  readonly axisymmetricEnvelopeVolumeMm3: number;
}>;
const inputFields = [
  { id: "girdleDiameterMm", label: "Girdle diameter mm", kind: "number" },
  { id: "tableDiameterMm", label: "Table diameter mm", kind: "number" },
  { id: "culetDiameterMm", label: "Culet diameter mm", kind: "number" },
  { id: "crownHeightMm", label: "Crown height mm", kind: "number" },
  { id: "girdleHeightMm", label: "Girdle height mm", kind: "number" },
  { id: "pavilionDepthMm", label: "Pavilion depth mm", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  roundGeometry(
    input.girdleDiameterMm,
    input.tableDiameterMm,
    input.culetDiameterMm,
    input.crownHeightMm,
    input.girdleHeightMm,
    input.pavilionDepthMm,
  );
  const r = input.girdleDiameterMm / 2,
    t = input.tableDiameterMm / 2,
    c = input.culetDiameterMm / 2,
    h = input.crownHeightMm,
    g = input.girdleHeightMm,
    p = input.pavilionDepthMm;
  return {
    axisymmetricEnvelopeVolumeMm3:
      Math.PI *
      ((h * (r * r + r * t + t * t)) / 3 +
        r * r * g +
        (p * (r * r + r * c + c * c)) / 3),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  girdleDiameterMm: 10,
  tableDiameterMm: 6,
  culetDiameterMm: 2,
  crownHeightMm: 2,
  girdleHeightMm: 1,
  pavilionDepthMm: 4,
} satisfies Input;
export const exampleOutput = {
  axisymmetricEnvelopeVolumeMm3: 311.01767270538954,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "gemology/volume-round-brilliant",
  title: "Volume of Round Brilliant",
  description:
    "Evaluate closed coaxial crown-frustum/girdle-cylinder/pavilion-frustum envelope volume including table/culet under supplied geometry; approximation is not true individual faceted round-brilliant geometry or carat weight.",
  inputs: inputFields,
  outputs: [
    {
      id: "axisymmetricEnvelopeVolumeMm3",
      label: "Axisymmetric envelope volume mm3",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      girdleDiameterMm: value.girdleDiameterMm as number,
      tableDiameterMm: value.tableDiameterMm as number,
      culetDiameterMm: value.culetDiameterMm as number,
      crownHeightMm: value.crownHeightMm as number,
      girdleHeightMm: value.girdleHeightMm as number,
      pavilionDepthMm: value.pavilionDepthMm as number,
    }),
});
export const run = tool.execute;
export default tool;
