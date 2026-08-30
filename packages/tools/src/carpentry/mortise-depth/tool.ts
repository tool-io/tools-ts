import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MortiseDepthInput = Readonly<{
  readonly tenonLengthMm: number;
  readonly endClearanceMm: number;
}>;
export type MortiseDepthOutput = Readonly<{
  readonly mortiseDepthMm: number;
}>;

export const calculateMortiseDepth = (
  x: MortiseDepthInput,
): MortiseDepthOutput => {
  if (!Number.isFinite(x.tenonLengthMm) || x.tenonLengthMm < 0)
    simpleError("tenonLengthMm", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.endClearanceMm) || x.endClearanceMm < 0)
    simpleError("endClearanceMm", "Provide a finite number at least 0.");
  const mortiseDepthMm = x.tenonLengthMm + x.endClearanceMm;
  if (!Number.isFinite(mortiseDepthMm))
    simpleError("mortiseDepthMm", "The inputs produce an invalid result.");
  return { mortiseDepthMm: Object.is(mortiseDepthMm, -0) ? 0 : mortiseDepthMm };
};

export const example = {
  input: { tenonLengthMm: 30, endClearanceMm: 2 },
  output: { mortiseDepthMm: 32 },
} satisfies ToolExample<MortiseDepthInput, MortiseDepthOutput>;

export const tool = createSimpleTool({
  id: "carpentry/mortise-depth",
  title: "Mortise Depth",
  description:
    "Specify mortise depth for a given tenon length plus a deliberate end-clearance allowance for glue or debris.",
  inputs: [
    {
      id: "tenonLengthMm",
      kind: "number",
      label: "Tenon insertion length",
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
      id: "mortiseDepthMm",
      kind: "number",
      label: "Required mortise depth",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculateMortiseDepth({
      tenonLengthMm: input.tenonLengthMm as number,
      endClearanceMm: input.endClearanceMm as number,
    }),
});
export const mortiseDepthTool = tool;
export const runMortiseDepth = tool.execute;
export default tool;
