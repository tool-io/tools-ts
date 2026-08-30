import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DrywallPatchAreaInput = Readonly<{
  readonly widthMeters: number;
  readonly heightMeters: number;
}>;
export type DrywallPatchAreaOutput = Readonly<{
  readonly patchSquareMeters: number;
}>;

export const calculateDrywallPatchArea = (
  x: DrywallPatchAreaInput,
): DrywallPatchAreaOutput => {
  if (!Number.isFinite(x.widthMeters) || x.widthMeters < 0)
    simpleError("widthMeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.heightMeters) || x.heightMeters < 0)
    simpleError("heightMeters", "Provide a finite number at least 0.");
  const patchSquareMeters = x.widthMeters * x.heightMeters;
  if (!Number.isFinite(patchSquareMeters))
    simpleError(
      "patchSquareMeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    patchSquareMeters: Object.is(patchSquareMeters, -0) ? 0 : patchSquareMeters,
  };
};

export const example = {
  input: { widthMeters: 1, heightMeters: 0.5 },
  output: { patchSquareMeters: 0.5 },
} satisfies ToolExample<DrywallPatchAreaInput, DrywallPatchAreaOutput>;

export const tool = createSimpleTool({
  id: "construction/drywall-patch-area",
  title: "Drywall Patch Area",
  description:
    "Rectangular drywall patch area from cut opening width and height, excluding lap or backing material.",
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
      id: "patchSquareMeters",
      kind: "number",
      label: "Patch Square Meters",
      unit: "m²",
    },
  ],
  calculate: (input) =>
    calculateDrywallPatchArea({
      widthMeters: input.widthMeters as number,
      heightMeters: input.heightMeters as number,
    }),
});
export const drywallPatchAreaTool = tool;
export const runDrywallPatchArea = tool.execute;
export default tool;
