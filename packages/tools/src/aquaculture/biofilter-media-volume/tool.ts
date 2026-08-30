import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
} from "../shared.js";
export type Input = Readonly<{
  readonly requiredActiveAreaM2: number;
  readonly nominalSpecificSurfaceM2PerM3: number;
  readonly accessibleSurfaceFraction: number;
  readonly mediaFillFraction: number;
}>;
export type Output = Readonly<{
  readonly requiredMediaVolumeM3: number;
  readonly requiredReactorVolumeM3: number;
}>;
const inputFields = [
  {
    id: "requiredActiveAreaM2",
    label: "Required active area m2",
    kind: "number",
  },
  {
    id: "nominalSpecificSurfaceM2PerM3",
    label: "Nominal specific surface m2 per m3",
    kind: "number",
  },
  {
    id: "accessibleSurfaceFraction",
    label: "Accessible surface fraction",
    kind: "number",
  },
  { id: "mediaFillFraction", label: "Media fill fraction", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.nominalSpecificSurfaceM2PerM3,
    "nominalSpecificSurfaceM2PerM3",
  );
  positive(input.accessibleSurfaceFraction, "accessibleSurfaceFraction");
  positive(input.mediaFillFraction, "mediaFillFraction");
  nonnegative(input.requiredActiveAreaM2, "requiredActiveAreaM2");
  fraction(input.accessibleSurfaceFraction, "accessibleSurfaceFraction");
  fraction(input.mediaFillFraction, "mediaFillFraction");
  const requiredMediaVolumeM3 =
    input.requiredActiveAreaM2 /
    (input.nominalSpecificSurfaceM2PerM3 * input.accessibleSurfaceFraction);
  return {
    requiredMediaVolumeM3,
    requiredReactorVolumeM3: requiredMediaVolumeM3 / input.mediaFillFraction,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  requiredActiveAreaM2: 1000,
  nominalSpecificSurfaceM2PerM3: 500,
  accessibleSurfaceFraction: 0.5,
  mediaFillFraction: 0.4,
} satisfies Input;
export const exampleOutput = {
  requiredMediaVolumeM3: 4,
  requiredReactorVolumeM3: 10,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aquaculture/biofilter-media-volume",
  title: "Biofilter Media Volume",
  description:
    "Convert required active biofilter surface to accessible media and reactor volumes; distinct from TAN-to-area sizing and dependent on supplied accessibility and fill.",
  inputs: inputFields,
  outputs: [
    {
      id: "requiredMediaVolumeM3",
      label: "Required media volume m3",
      kind: "number",
    },
    {
      id: "requiredReactorVolumeM3",
      label: "Required reactor volume m3",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      requiredActiveAreaM2: value.requiredActiveAreaM2 as number,
      nominalSpecificSurfaceM2PerM3:
        value.nominalSpecificSurfaceM2PerM3 as number,
      accessibleSurfaceFraction: value.accessibleSurfaceFraction as number,
      mediaFillFraction: value.mediaFillFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
