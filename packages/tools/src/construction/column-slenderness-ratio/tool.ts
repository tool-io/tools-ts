import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ColumnSlendernessRatioInput = Readonly<{
  readonly effectiveLengthM: number;
  readonly radiusOfGyrationM: number;
}>;
export type ColumnSlendernessRatioOutput = Readonly<{
  readonly slendernessRatio: number;
}>;

export const calculateColumnSlendernessRatio = (
  x: ColumnSlendernessRatioInput,
): ColumnSlendernessRatioOutput => {
  if (!Number.isFinite(x.effectiveLengthM) || x.effectiveLengthM < 0)
    simpleError("effectiveLengthM", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.radiusOfGyrationM) || x.radiusOfGyrationM < 0)
    simpleError("radiusOfGyrationM", "Provide a finite number at least 0.");
  if (!(x.radiusOfGyrationM > 0))
    simpleError("radiusOfGyrationM", "Radius of gyration must be positive.");
  const slendernessRatio = x.effectiveLengthM / x.radiusOfGyrationM;
  if (!Number.isFinite(slendernessRatio))
    simpleError("slendernessRatio", "The inputs produce an invalid result.");
  return {
    slendernessRatio: Object.is(slendernessRatio, -0) ? 0 : slendernessRatio,
  };
};

export const example = {
  input: { effectiveLengthM: 3, radiusOfGyrationM: 0.05 },
  output: { slendernessRatio: 60 },
} satisfies ToolExample<
  ColumnSlendernessRatioInput,
  ColumnSlendernessRatioOutput
>;

export const tool = createSimpleTool({
  id: "construction/column-slenderness-ratio",
  title: "Column Slenderness Ratio",
  description:
    "Calculate dimensionless column slenderness from effective buckling length and radius of gyration about the chosen axis.",
  inputs: [
    {
      id: "effectiveLengthM",
      kind: "number",
      label: "Effective buckling length",
      unit: "m",
      minimum: 0,
    },
    {
      id: "radiusOfGyrationM",
      kind: "number",
      label: "Radius of gyration",
      unit: "m",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "slendernessRatio", kind: "number", label: "Slenderness ratio" },
  ],
  calculate: (input) =>
    calculateColumnSlendernessRatio({
      effectiveLengthM: input.effectiveLengthM as number,
      radiusOfGyrationM: input.radiusOfGyrationM as number,
    }),
});
export const columnSlendernessRatioTool = tool;
export const runColumnSlendernessRatio = tool.execute;
export default tool;
