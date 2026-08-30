import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FlashingValleyLengthInput = Readonly<{
  readonly planLengthM: number;
  readonly verticalRiseM: number;
}>;
export type FlashingValleyLengthOutput = Readonly<{
  readonly flashingLengthM: number;
}>;

export const calculateFlashingValleyLength = (
  x: FlashingValleyLengthInput,
): FlashingValleyLengthOutput => {
  if (!Number.isFinite(x.planLengthM) || x.planLengthM < 0)
    simpleError("planLengthM", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.verticalRiseM) || x.verticalRiseM < 0)
    simpleError("verticalRiseM", "Provide a finite number at least 0.");
  const flashingLengthM = Math.hypot(x.planLengthM, x.verticalRiseM);
  if (!Number.isFinite(flashingLengthM))
    simpleError("flashingLengthM", "The inputs produce an invalid result.");
  return {
    flashingLengthM: Object.is(flashingLengthM, -0) ? 0 : flashingLengthM,
  };
};

export const example = {
  input: { planLengthM: 5, verticalRiseM: 1 },
  output: { flashingLengthM: 5.099019513592785 },
} satisfies ToolExample<FlashingValleyLengthInput, FlashingValleyLengthOutput>;

export const tool = createSimpleTool({
  id: "construction/flashing-valley-length",
  title: "Valley Flashing Length",
  description:
    "Estimate straight flashing length along a roof valley from its horizontal plan projection and vertical rise.",
  inputs: [
    {
      id: "planLengthM",
      kind: "number",
      label: "Valley plan length",
      unit: "m",
      minimum: 0,
    },
    {
      id: "verticalRiseM",
      kind: "number",
      label: "Vertical rise",
      unit: "m",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "flashingLengthM",
      kind: "number",
      label: "Straight valley length",
      unit: "m",
    },
  ],
  calculate: (input) =>
    calculateFlashingValleyLength({
      planLengthM: input.planLengthM as number,
      verticalRiseM: input.verticalRiseM as number,
    }),
});
export const flashingValleyLengthTool = tool;
export const runFlashingValleyLength = tool.execute;
export default tool;
