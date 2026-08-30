import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ButtWeldStressInput = Readonly<{
  readonly forceNewtons: number;
  readonly weldLengthMillimeters: number;
  readonly thicknessMillimeters: number;
}>;
export type ButtWeldStressOutput = Readonly<{
  readonly stressMegapascals: number;
}>;

export const calculateButtWeldStress = (
  x: ButtWeldStressInput,
): ButtWeldStressOutput => {
  if (!Number.isFinite(x.forceNewtons))
    simpleError("forceNewtons", "Provide a finite number.");
  if (!Number.isFinite(x.weldLengthMillimeters) || x.weldLengthMillimeters < 0)
    simpleError("weldLengthMillimeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.thicknessMillimeters) || x.thicknessMillimeters < 0)
    simpleError("thicknessMillimeters", "Provide a finite number at least 0.");
  const stressMegapascals =
    x.forceNewtons / (x.weldLengthMillimeters * x.thicknessMillimeters);
  if (!Number.isFinite(stressMegapascals))
    simpleError(
      "stressMegapascals",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    stressMegapascals: Object.is(stressMegapascals, -0) ? 0 : stressMegapascals,
  };
};

export const example = {
  input: {
    forceNewtons: 10000,
    weldLengthMillimeters: 100,
    thicknessMillimeters: 5,
  },
  output: { stressMegapascals: 20 },
} satisfies ToolExample<ButtWeldStressInput, ButtWeldStressOutput>;

export const tool = createSimpleTool({
  id: "engineering/butt-weld-stress",
  title: "Butt Weld Stress",
  description:
    "Average axial stress across a full-penetration butt weld from applied force divided by weld length and thickness.",
  inputs: [
    { id: "forceNewtons", kind: "number", label: "Force Newtons", unit: "N" },
    {
      id: "weldLengthMillimeters",
      kind: "number",
      label: "Weld Length Millimeters",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "thicknessMillimeters",
      kind: "number",
      label: "Thickness Millimeters",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "stressMegapascals",
      kind: "number",
      label: "Stress Megapascals",
      unit: "MPa",
    },
  ],
  calculate: (input) =>
    calculateButtWeldStress({
      forceNewtons: input.forceNewtons as number,
      weldLengthMillimeters: input.weldLengthMillimeters as number,
      thicknessMillimeters: input.thicknessMillimeters as number,
    }),
});
export const buttWeldStressTool = tool;
export const runButtWeldStress = tool.execute;
export default tool;
