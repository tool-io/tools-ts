import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ColumnSlendernessRatioInput = Readonly<{
  readonly effectiveLengthFactor: number;
  readonly lengthMeters: number;
  readonly radiusOfGyrationMeters: number;
}>;
export type ColumnSlendernessRatioOutput = Readonly<{
  readonly slendernessRatio: number;
}>;

export const calculateColumnSlendernessRatio = (
  x: ColumnSlendernessRatioInput,
): ColumnSlendernessRatioOutput => {
  if (!Number.isFinite(x.effectiveLengthFactor) || x.effectiveLengthFactor < 0)
    simpleError("effectiveLengthFactor", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.lengthMeters) || x.lengthMeters < 0)
    simpleError("lengthMeters", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.radiusOfGyrationMeters) ||
    x.radiusOfGyrationMeters < 0
  )
    simpleError(
      "radiusOfGyrationMeters",
      "Provide a finite number at least 0.",
    );
  const slendernessRatio =
    (x.effectiveLengthFactor * x.lengthMeters) / x.radiusOfGyrationMeters;
  if (!Number.isFinite(slendernessRatio))
    simpleError(
      "slendernessRatio",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    slendernessRatio: Object.is(slendernessRatio, -0) ? 0 : slendernessRatio,
  };
};

export const example = {
  input: {
    effectiveLengthFactor: 1,
    lengthMeters: 3,
    radiusOfGyrationMeters: 0.03,
  },
  output: { slendernessRatio: 100 },
} satisfies ToolExample<
  ColumnSlendernessRatioInput,
  ColumnSlendernessRatioOutput
>;

export const tool = createSimpleTool({
  id: "engineering/column-slenderness-ratio",
  title: "Column Slenderness Ratio",
  description:
    "Column slenderness KL/r from effective-length factor, unsupported length and radius of gyration.",
  inputs: [
    {
      id: "effectiveLengthFactor",
      kind: "number",
      label: "Effective Length Factor",
      minimum: 0,
    },
    {
      id: "lengthMeters",
      kind: "number",
      label: "Length Meters",
      unit: "m",
      minimum: 0,
    },
    {
      id: "radiusOfGyrationMeters",
      kind: "number",
      label: "Radius Of Gyration Meters",
      unit: "m",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "slendernessRatio", kind: "number", label: "Slenderness Ratio" },
  ],
  calculate: (input) =>
    calculateColumnSlendernessRatio({
      effectiveLengthFactor: input.effectiveLengthFactor as number,
      lengthMeters: input.lengthMeters as number,
      radiusOfGyrationMeters: input.radiusOfGyrationMeters as number,
    }),
});
export const columnSlendernessRatioTool = tool;
export const runColumnSlendernessRatio = tool.execute;
export default tool;
