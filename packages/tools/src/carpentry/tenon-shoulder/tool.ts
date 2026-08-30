import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TenonShoulderInput = Readonly<{
  readonly stockWidthMm: number;
  readonly tenonWidthMm: number;
}>;
export type TenonShoulderOutput = Readonly<{
  readonly shoulderEachMm: number;
}>;

export const calculateTenonShoulder = (
  x: TenonShoulderInput,
): TenonShoulderOutput => {
  if (!Number.isFinite(x.stockWidthMm) || x.stockWidthMm < 0)
    simpleError("stockWidthMm", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.tenonWidthMm) || x.tenonWidthMm < 0)
    simpleError("tenonWidthMm", "Provide a finite number at least 0.");
  if (!(x.stockWidthMm >= x.tenonWidthMm))
    simpleError("stockWidthMm", "Stock must be at least as wide as tenon.");
  const shoulderEachMm = (x.stockWidthMm - x.tenonWidthMm) / 2;
  if (!Number.isFinite(shoulderEachMm))
    simpleError("shoulderEachMm", "The inputs produce an invalid result.");
  return { shoulderEachMm: Object.is(shoulderEachMm, -0) ? 0 : shoulderEachMm };
};

export const example = {
  input: { stockWidthMm: 50, tenonWidthMm: 30 },
  output: { shoulderEachMm: 10 },
} satisfies ToolExample<TenonShoulderInput, TenonShoulderOutput>;

export const tool = createSimpleTool({
  id: "carpentry/tenon-shoulder",
  title: "Tenon Shoulder",
  description:
    "Calculate equal tenon shoulder widths when a centered tenon is cut from a wider stock edge.",
  inputs: [
    {
      id: "stockWidthMm",
      kind: "number",
      label: "Stock width",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "tenonWidthMm",
      kind: "number",
      label: "Centered tenon width",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "shoulderEachMm",
      kind: "number",
      label: "Each shoulder width",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculateTenonShoulder({
      stockWidthMm: input.stockWidthMm as number,
      tenonWidthMm: input.tenonWidthMm as number,
    }),
});
export const tenonShoulderTool = tool;
export const runTenonShoulder = tool.execute;
export default tool;
