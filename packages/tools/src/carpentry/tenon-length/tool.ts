import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TenonLengthInput = Readonly<{
  readonly mortiseDepthMm: number;
  readonly endClearanceMm: number;
}>;
export type TenonLengthOutput = Readonly<{
  readonly tenonLengthMm: number;
}>;

export const calculateTenonLength = (
  x: TenonLengthInput,
): TenonLengthOutput => {
  if (!Number.isFinite(x.mortiseDepthMm) || x.mortiseDepthMm < 0)
    simpleError("mortiseDepthMm", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.endClearanceMm) || x.endClearanceMm < 0)
    simpleError("endClearanceMm", "Provide a finite number at least 0.");
  if (!(x.mortiseDepthMm >= x.endClearanceMm))
    simpleError("mortiseDepthMm", "Mortise depth must cover end clearance.");
  const tenonLengthMm = x.mortiseDepthMm - x.endClearanceMm;
  if (!Number.isFinite(tenonLengthMm))
    simpleError("tenonLengthMm", "The inputs produce an invalid result.");
  return { tenonLengthMm: Object.is(tenonLengthMm, -0) ? 0 : tenonLengthMm };
};

export const example = {
  input: { mortiseDepthMm: 32, endClearanceMm: 2 },
  output: { tenonLengthMm: 30 },
} satisfies ToolExample<TenonLengthInput, TenonLengthOutput>;

export const tool = createSimpleTool({
  id: "carpentry/tenon-length",
  title: "Tenon Length",
  description:
    "Find maximum tenon insertion length from measured mortise depth after reserving a nonnegative end clearance.",
  inputs: [
    {
      id: "mortiseDepthMm",
      kind: "number",
      label: "Mortise depth",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "endClearanceMm",
      kind: "number",
      label: "End clearance",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "tenonLengthMm",
      kind: "number",
      label: "Tenon insertion length",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculateTenonLength({
      mortiseDepthMm: input.mortiseDepthMm as number,
      endClearanceMm: input.endClearanceMm as number,
    }),
});
export const tenonLengthTool = tool;
export const runTenonLength = tool.execute;
export default tool;
