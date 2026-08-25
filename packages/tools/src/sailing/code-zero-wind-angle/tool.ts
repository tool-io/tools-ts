import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type CodeZeroWindAngleInput = {
  readonly apparentWindKt: number;
};

export type CodeZeroWindAngleOutput = {
  readonly codeZeroTwaDeg: number;
};

export const codeZeroWindAngleExample = {
  input: { apparentWindKt: 10 },
  output: { codeZeroTwaDeg: 53 },
} satisfies ToolExample<CodeZeroWindAngleInput, CodeZeroWindAngleOutput>;

export const codeZeroWindAngleTool = createSimpleTool({
  calculate: (input) => {
    const apparentWindKt = input.apparentWindKt as number;
    return {
      codeZeroTwaDeg: Math.min(
        70,
        Math.max(40, Math.round(50 + apparentWindKt * 0.3)),
      ),
    };
  },
  description:
    "Estimate the true wind angle for a code zero using codeZeroTwaDeg = round(50 + apparentWindKt * 0.3), clamped to 40 through 70 degrees.",
  id: "sailing/code-zero-wind-angle",
  inputs: [
    {
      description: "Apparent wind speed driving the code zero sheeting angle.",
      id: "apparentWindKt",
      kind: "number",
      label: "Apparent wind",
      minimum: 0,
      unit: "kt",
    },
  ],
  outputs: [
    {
      description: "Target true wind angle for the code zero.",
      id: "codeZeroTwaDeg",
      kind: "number",
      label: "Code zero TWA",
      unit: "deg",
    },
  ],
  title: "Code Zero Wind Angle",
});
export const runCodeZeroWindAngle = codeZeroWindAngleTool.execute;
export default codeZeroWindAngleTool;
