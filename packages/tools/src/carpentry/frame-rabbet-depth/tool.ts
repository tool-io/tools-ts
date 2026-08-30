import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FrameRabbetDepthInput = Readonly<{
  readonly glazingStackThicknessMm: number;
  readonly beddingClearanceMm: number;
}>;
export type FrameRabbetDepthOutput = Readonly<{
  readonly rabbetDepthMm: number;
}>;

export const calculateFrameRabbetDepth = (
  x: FrameRabbetDepthInput,
): FrameRabbetDepthOutput => {
  if (
    !Number.isFinite(x.glazingStackThicknessMm) ||
    x.glazingStackThicknessMm < 0
  )
    simpleError(
      "glazingStackThicknessMm",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.beddingClearanceMm) || x.beddingClearanceMm < 0)
    simpleError("beddingClearanceMm", "Provide a finite number at least 0.");
  const rabbetDepthMm = x.glazingStackThicknessMm + x.beddingClearanceMm;
  if (!Number.isFinite(rabbetDepthMm))
    simpleError("rabbetDepthMm", "The inputs produce an invalid result.");
  return { rabbetDepthMm: Object.is(rabbetDepthMm, -0) ? 0 : rabbetDepthMm };
};

export const example = {
  input: { glazingStackThicknessMm: 6, beddingClearanceMm: 1 },
  output: { rabbetDepthMm: 7 },
} satisfies ToolExample<FrameRabbetDepthInput, FrameRabbetDepthOutput>;

export const tool = createSimpleTool({
  id: "carpentry/frame-rabbet-depth",
  title: "Frame Rabbet Depth",
  description:
    "Size a glazing-frame rabbet from measured glass-and-backing stack thickness plus bedding clearance.",
  inputs: [
    {
      id: "glazingStackThicknessMm",
      kind: "number",
      label: "Glass and backing stack",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "beddingClearanceMm",
      kind: "number",
      label: "Bedding clearance",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "rabbetDepthMm",
      kind: "number",
      label: "Frame rabbet depth",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculateFrameRabbetDepth({
      glazingStackThicknessMm: input.glazingStackThicknessMm as number,
      beddingClearanceMm: input.beddingClearanceMm as number,
    }),
});
export const frameRabbetDepthTool = tool;
export const runFrameRabbetDepth = tool.execute;
export default tool;
