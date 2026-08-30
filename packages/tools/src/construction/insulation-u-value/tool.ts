import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type InsulationUValueInput = Readonly<{
  readonly totalRValue: number;
}>;
export type InsulationUValueOutput = Readonly<{
  readonly uValue: number;
}>;

export const calculateInsulationUValue = (
  x: InsulationUValueInput,
): InsulationUValueOutput => {
  if (!Number.isFinite(x.totalRValue) || x.totalRValue < 0)
    simpleError("totalRValue", "Provide a finite number at least 0.");
  if (!(x.totalRValue > 0))
    simpleError("totalRValue", "R-value must be positive.");
  const uValue = 1 / x.totalRValue;
  if (!Number.isFinite(uValue))
    simpleError("uValue", "The inputs produce an invalid result.");
  return { uValue: Object.is(uValue, -0) ? 0 : uValue };
};

export const example = {
  input: { totalRValue: 2 },
  output: { uValue: 0.5 },
} satisfies ToolExample<InsulationUValueInput, InsulationUValueOutput>;

export const tool = createSimpleTool({
  id: "construction/insulation-u-value",
  title: "Insulation U-Value",
  description:
    "Convert total SI R-value of an assembly to its reciprocal U-value; include surface films in R if needed.",
  inputs: [
    {
      id: "totalRValue",
      kind: "number",
      label: "Total SI R-value",
      unit: "m²·K/W",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "uValue",
      kind: "number",
      label: "Thermal transmittance",
      unit: "W/(m²·K)",
    },
  ],
  calculate: (input) =>
    calculateInsulationUValue({
      totalRValue: input.totalRValue as number,
    }),
});
export const insulationUValueTool = tool;
export const runInsulationUValue = tool.execute;
export default tool;
