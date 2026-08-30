import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type StrainElongationInput = Readonly<{
  readonly lengthChangeMeters: number;
  readonly originalLengthMeters: number;
}>;
export type StrainElongationOutput = Readonly<{
  readonly strain: number;
}>;

export const calculateStrainElongation = (
  x: StrainElongationInput,
): StrainElongationOutput => {
  if (!Number.isFinite(x.lengthChangeMeters))
    simpleError("lengthChangeMeters", "Provide a finite number.");
  if (!Number.isFinite(x.originalLengthMeters) || x.originalLengthMeters < 0)
    simpleError("originalLengthMeters", "Provide a finite number at least 0.");
  const strain = x.lengthChangeMeters / x.originalLengthMeters;
  if (!Number.isFinite(strain))
    simpleError(
      "strain",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { strain: Object.is(strain, -0) ? 0 : strain };
};

export const example = {
  input: { lengthChangeMeters: 0.002, originalLengthMeters: 1 },
  output: { strain: 0.002 },
} satisfies ToolExample<StrainElongationInput, StrainElongationOutput>;

export const tool = createSimpleTool({
  id: "engineering/strain-elongation",
  title: "Strain Elongation",
  description:
    "Engineering axial strain from measured length change divided by original gauge length.",
  inputs: [
    {
      id: "lengthChangeMeters",
      kind: "number",
      label: "Length Change Meters",
      unit: "m",
    },
    {
      id: "originalLengthMeters",
      kind: "number",
      label: "Original Length Meters",
      unit: "m",
      minimum: 0,
    },
  ],
  outputs: [{ id: "strain", kind: "number", label: "Strain" }],
  calculate: (input) =>
    calculateStrainElongation({
      lengthChangeMeters: input.lengthChangeMeters as number,
      originalLengthMeters: input.originalLengthMeters as number,
    }),
});
export const strainElongationTool = tool;
export const runStrainElongation = tool.execute;
export default tool;
