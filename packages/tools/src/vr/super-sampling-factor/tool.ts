import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SuperSamplingFactorInput = Readonly<{
  readonly renderWidthPixels: number;
  readonly renderHeightPixels: number;
  readonly panelWidthPixels: number;
  readonly panelHeightPixels: number;
}>;
export type SuperSamplingFactorOutput = Readonly<{
  readonly pixelAreaFactor: number;
}>;

export const calculateSuperSamplingFactor = (
  x: SuperSamplingFactorInput,
): SuperSamplingFactorOutput => {
  if (
    !Number.isFinite(x.renderWidthPixels) ||
    !Number.isSafeInteger(x.renderWidthPixels) ||
    x.renderWidthPixels < 1
  )
    simpleError("renderWidthPixels", "Provide a positive safe integer.");
  if (
    !Number.isFinite(x.renderHeightPixels) ||
    !Number.isSafeInteger(x.renderHeightPixels) ||
    x.renderHeightPixels < 1
  )
    simpleError("renderHeightPixels", "Provide a positive safe integer.");
  if (
    !Number.isFinite(x.panelWidthPixels) ||
    !Number.isSafeInteger(x.panelWidthPixels) ||
    x.panelWidthPixels < 1
  )
    simpleError("panelWidthPixels", "Provide a positive safe integer.");
  if (
    !Number.isFinite(x.panelHeightPixels) ||
    !Number.isSafeInteger(x.panelHeightPixels) ||
    x.panelHeightPixels < 1
  )
    simpleError("panelHeightPixels", "Provide a positive safe integer.");
  const pixelAreaFactor =
    (x.renderWidthPixels * x.renderHeightPixels) /
    (x.panelWidthPixels * x.panelHeightPixels);
  if (!Number.isFinite(pixelAreaFactor))
    simpleError(
      "pixelAreaFactor",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    pixelAreaFactor: Object.is(pixelAreaFactor, -0) ? 0 : pixelAreaFactor,
  };
};

export const example = {
  input: {
    renderWidthPixels: 2400,
    renderHeightPixels: 2400,
    panelWidthPixels: 2000,
    panelHeightPixels: 2000,
  },
  output: { pixelAreaFactor: 1.44 },
} satisfies ToolExample<SuperSamplingFactorInput, SuperSamplingFactorOutput>;

export const tool = createSimpleTool({
  id: "vr/super-sampling-factor",
  title: "Super Sampling Factor",
  description:
    "Rendered pixel area divided by native panel pixel area for one eye.",
  inputs: [
    {
      id: "renderWidthPixels",
      kind: "integer",
      label: "Render Width Pixels",
      unit: "px",
      minimum: 1,
    },
    {
      id: "renderHeightPixels",
      kind: "integer",
      label: "Render Height Pixels",
      unit: "px",
      minimum: 1,
    },
    {
      id: "panelWidthPixels",
      kind: "integer",
      label: "Panel Width Pixels",
      unit: "px",
      minimum: 1,
    },
    {
      id: "panelHeightPixels",
      kind: "integer",
      label: "Panel Height Pixels",
      unit: "px",
      minimum: 1,
    },
  ],
  outputs: [
    { id: "pixelAreaFactor", kind: "number", label: "Pixel Area Factor" },
  ],
  calculate: (input) =>
    calculateSuperSamplingFactor({
      renderWidthPixels: input.renderWidthPixels as number,
      renderHeightPixels: input.renderHeightPixels as number,
      panelWidthPixels: input.panelWidthPixels as number,
      panelHeightPixels: input.panelHeightPixels as number,
    }),
});
export const superSamplingFactorTool = tool;
export const runSuperSamplingFactor = tool.execute;
export default tool;
