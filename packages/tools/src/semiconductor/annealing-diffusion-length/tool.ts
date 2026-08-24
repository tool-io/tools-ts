import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DiffusionLengthInput = {
  readonly diffusivityNm2PerHour: number;
  readonly annealHours: number;
};

export type DiffusionLengthOutput = {
  readonly diffusionLengthNm: number;
};

export const diffusionLengthExample = {
  input: { diffusivityNm2PerHour: 0.25, annealHours: 4 },
  output: { diffusionLengthNm: 1 },
} satisfies ToolExample<DiffusionLengthInput, DiffusionLengthOutput>;

export const calculateDiffusionLength = (
  input: DiffusionLengthInput,
): DiffusionLengthOutput => {
  const diffusivityNm2PerHour = input.diffusivityNm2PerHour;
  const annealHours = input.annealHours;

  if (!Number.isFinite(diffusivityNm2PerHour) || diffusivityNm2PerHour <= 0)
    simpleError(
      "diffusivityNm2PerHour",
      "Diffusivity must be a finite positive number.",
      "degenerate_input",
    );
  if (!Number.isFinite(annealHours) || annealHours < 0)
    simpleError(
      "annealHours",
      "Anneal time must be a finite number at least 0.",
      "invalid_anneal_time",
    );

  // Use direct product when finite for maximal precision, fallback to
  // sqrt-separated form to avoid intermediate overflow of D*t.
  const product = diffusivityNm2PerHour * annealHours;
  const diffusionLengthNm =
    annealHours === 0
      ? 0
      : Number.isFinite(product) && product > 0
        ? Math.sqrt(product)
        : Math.sqrt(diffusivityNm2PerHour) * Math.sqrt(annealHours);

  if (
    !Number.isFinite(diffusionLengthNm) ||
    (diffusionLengthNm <= 0 && annealHours > 0)
  )
    simpleError(
      "annealHours",
      "Diffusion length is outside the representable positive range.",
      Number.isFinite(diffusionLengthNm)
        ? "numeric_underflow"
        : "numeric_overflow",
    );

  return { diffusionLengthNm: diffusionLengthNm === 0 ? 0 : diffusionLengthNm };
};

export const diffusionLengthTool = createSimpleTool({
  calculate: (input) =>
    calculateDiffusionLength({
      annealHours: input.annealHours as number,
      diffusivityNm2PerHour: input.diffusivityNm2PerHour as number,
    }),
  description:
    "Compute the diffusion length from a diffusivity and anneal duration. Length = sqrt(diffusivity × time).",
  id: "semiconductor/annealing-diffusion-length",
  inputs: [
    {
      description:
        "Diffusion coefficient of the species at the anneal temperature. Must be greater than 0 nm²/hour.",
      id: "diffusivityNm2PerHour",
      kind: "number",
      label: "Diffusivity",
      minimum: Number.MIN_VALUE,
      unit: "nm^2/hour",
    },
    {
      description:
        "Duration of the anneal. Must be at least 0 hour; 0 yields 0 nm.",
      id: "annealHours",
      kind: "number",
      label: "Anneal time",
      minimum: 0,
      unit: "hour",
    },
  ],
  outputs: [
    {
      description:
        "Characteristic diffusion length over the anneal, at least 0 nm.",
      id: "diffusionLengthNm",
      kind: "number",
      label: "Diffusion length",
      minimum: 0,
      unit: "nm",
    },
  ],
  title: "Diffusion Length Calculator",
});
export const runDiffusionLength = diffusionLengthTool.execute;
export default diffusionLengthTool;
