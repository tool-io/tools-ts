import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CasingRevealInput = Readonly<{
  readonly jambFaceWidthMm: number;
  readonly casingOverlapMm: number;
}>;
export type CasingRevealOutput = Readonly<{
  readonly revealWidthMm: number;
}>;

export const calculateCasingReveal = (
  x: CasingRevealInput,
): CasingRevealOutput => {
  if (!Number.isFinite(x.jambFaceWidthMm) || x.jambFaceWidthMm < 0)
    simpleError("jambFaceWidthMm", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.casingOverlapMm) || x.casingOverlapMm < 0)
    simpleError("casingOverlapMm", "Provide a finite number at least 0.");
  if (!(x.jambFaceWidthMm >= x.casingOverlapMm))
    simpleError("casingOverlapMm", "Overlap cannot exceed jamb face width.");
  const revealWidthMm = x.jambFaceWidthMm - x.casingOverlapMm;
  if (!Number.isFinite(revealWidthMm))
    simpleError("revealWidthMm", "The inputs produce an invalid result.");
  return { revealWidthMm: Object.is(revealWidthMm, -0) ? 0 : revealWidthMm };
};

export const example = {
  input: { jambFaceWidthMm: 20, casingOverlapMm: 15 },
  output: { revealWidthMm: 5 },
} satisfies ToolExample<CasingRevealInput, CasingRevealOutput>;

export const tool = createSimpleTool({
  id: "carpentry/casing-reveal",
  title: "Casing Reveal",
  description:
    "Find exposed jamb-face reveal when a casing overlaps part of the available flat jamb face.",
  inputs: [
    {
      id: "jambFaceWidthMm",
      kind: "number",
      label: "Flat jamb face width",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "casingOverlapMm",
      kind: "number",
      label: "Casing overlap on jamb",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "revealWidthMm",
      kind: "number",
      label: "Exposed jamb reveal",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculateCasingReveal({
      jambFaceWidthMm: input.jambFaceWidthMm as number,
      casingOverlapMm: input.casingOverlapMm as number,
    }),
});
export const casingRevealTool = tool;
export const runCasingReveal = tool.execute;
export default tool;
