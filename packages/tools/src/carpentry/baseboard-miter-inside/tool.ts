import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BaseboardMiterInsideInput = Readonly<{
  readonly insideCornerDegrees: number;
}>;
export type BaseboardMiterInsideOutput = Readonly<{
  readonly miterDegrees: number;
}>;

export const calculateBaseboardMiterInside = (
  x: BaseboardMiterInsideInput,
): BaseboardMiterInsideOutput => {
  if (!Number.isFinite(x.insideCornerDegrees) || x.insideCornerDegrees < 0)
    simpleError("insideCornerDegrees", "Provide a finite number at least 0.");
  if (x.insideCornerDegrees >= 180)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const miterDegrees = x.insideCornerDegrees / 2;
  if (!Number.isFinite(miterDegrees))
    simpleError(
      "miterDegrees",
      "Inputs produce an undefined or non-finite result.",
    );
  return { miterDegrees: Object.is(miterDegrees, -0) ? 0 : miterDegrees };
};

export const example = {
  input: { insideCornerDegrees: 90 },
  output: { miterDegrees: 45 },
} satisfies ToolExample<BaseboardMiterInsideInput, BaseboardMiterInsideOutput>;

export const tool = createSimpleTool({
  id: "carpentry/baseboard-miter-inside",
  title: "Baseboard Miter Inside",
  description:
    "Equal miter angle for each of two baseboard pieces meeting at a measured inside corner; assumes a symmetric joint.",
  inputs: [
    {
      id: "insideCornerDegrees",
      kind: "number",
      label: "Inside Corner Degrees",
      unit: "°",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "miterDegrees", kind: "number", label: "Miter Degrees", unit: "°" },
  ],
  calculate: (input) =>
    calculateBaseboardMiterInside({
      insideCornerDegrees: input.insideCornerDegrees as number,
    }),
});
export const baseboardMiterInsideTool = tool;
export const runBaseboardMiterInside = tool.execute;
export default tool;
