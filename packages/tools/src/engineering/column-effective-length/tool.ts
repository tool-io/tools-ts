import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ColumnEffectiveLengthInput = Readonly<{
  readonly unsupportedLengthMeters: number;
  readonly effectiveLengthFactor: number;
}>;
export type ColumnEffectiveLengthOutput = Readonly<{
  readonly effectiveLengthMeters: number;
}>;

export const calculateColumnEffectiveLength = (
  x: ColumnEffectiveLengthInput,
): ColumnEffectiveLengthOutput => {
  if (
    !Number.isFinite(x.unsupportedLengthMeters) ||
    x.unsupportedLengthMeters < 0
  )
    simpleError(
      "unsupportedLengthMeters",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.effectiveLengthFactor) || x.effectiveLengthFactor < 0)
    simpleError("effectiveLengthFactor", "Provide a finite number at least 0.");
  const effectiveLengthMeters =
    x.unsupportedLengthMeters * x.effectiveLengthFactor;
  if (!Number.isFinite(effectiveLengthMeters))
    simpleError(
      "effectiveLengthMeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    effectiveLengthMeters: Object.is(effectiveLengthMeters, -0)
      ? 0
      : effectiveLengthMeters,
  };
};

export const example = {
  input: { unsupportedLengthMeters: 3, effectiveLengthFactor: 1 },
  output: { effectiveLengthMeters: 3 },
} satisfies ToolExample<
  ColumnEffectiveLengthInput,
  ColumnEffectiveLengthOutput
>;

export const tool = createSimpleTool({
  id: "engineering/column-effective-length",
  title: "Column Effective Length",
  description:
    "Effective column length KL from unsupported length and a supplied end-condition factor K.",
  inputs: [
    {
      id: "unsupportedLengthMeters",
      kind: "number",
      label: "Unsupported Length Meters",
      unit: "m",
      minimum: 0,
    },
    {
      id: "effectiveLengthFactor",
      kind: "number",
      label: "Effective Length Factor",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "effectiveLengthMeters",
      kind: "number",
      label: "Effective Length Meters",
      unit: "m",
    },
  ],
  calculate: (input) =>
    calculateColumnEffectiveLength({
      unsupportedLengthMeters: input.unsupportedLengthMeters as number,
      effectiveLengthFactor: input.effectiveLengthFactor as number,
    }),
});
export const columnEffectiveLengthTool = tool;
export const runColumnEffectiveLength = tool.execute;
export default tool;
