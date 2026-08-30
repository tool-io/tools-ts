import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SectionModulusRectangleInput = Readonly<{
  readonly widthMeters: number;
  readonly heightMeters: number;
}>;
export type SectionModulusRectangleOutput = Readonly<{
  readonly sectionModulusMeters3: number;
}>;

export const calculateSectionModulusRectangle = (
  x: SectionModulusRectangleInput,
): SectionModulusRectangleOutput => {
  if (!Number.isFinite(x.widthMeters) || x.widthMeters < 0)
    simpleError("widthMeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.heightMeters) || x.heightMeters < 0)
    simpleError("heightMeters", "Provide a finite number at least 0.");
  const sectionModulusMeters3 = (x.widthMeters * x.heightMeters ** 2) / 6;
  if (!Number.isFinite(sectionModulusMeters3))
    simpleError(
      "sectionModulusMeters3",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    sectionModulusMeters3: Object.is(sectionModulusMeters3, -0)
      ? 0
      : sectionModulusMeters3,
  };
};

export const example = {
  input: { widthMeters: 0.1, heightMeters: 0.2 },
  output: { sectionModulusMeters3: 0.0006666666666666669 },
} satisfies ToolExample<
  SectionModulusRectangleInput,
  SectionModulusRectangleOutput
>;

export const tool = createSimpleTool({
  id: "engineering/section-modulus-rectangle",
  title: "Section Modulus Rectangle",
  description:
    "Elastic section modulus of a solid rectangular section about its strong centroidal bending axis: bh²/6.",
  inputs: [
    {
      id: "widthMeters",
      kind: "number",
      label: "Width Meters",
      unit: "m",
      minimum: 0,
    },
    {
      id: "heightMeters",
      kind: "number",
      label: "Height Meters",
      unit: "m",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "sectionModulusMeters3",
      kind: "number",
      label: "Section Modulus Meters3",
      unit: "m³",
    },
  ],
  calculate: (input) =>
    calculateSectionModulusRectangle({
      widthMeters: input.widthMeters as number,
      heightMeters: input.heightMeters as number,
    }),
});
export const sectionModulusRectangleTool = tool;
export const runSectionModulusRectangle = tool.execute;
export default tool;
