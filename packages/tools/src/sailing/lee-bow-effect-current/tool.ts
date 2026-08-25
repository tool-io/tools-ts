import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LeeBowEffectCurrentInput = {
  readonly currentKt: number;
  readonly currentSetDeg: number;
  readonly desiredCourseDeg: number;
};

export type LeeBowEffectCurrentOutput = {
  readonly effectiveGainKt: number;
};

export const calculateLeeBowEffectCurrent = (
  input: LeeBowEffectCurrentInput,
): LeeBowEffectCurrentOutput | null =>
  Number.isFinite(input.currentKt) &&
  Number.isFinite(input.currentSetDeg) &&
  Number.isFinite(input.desiredCourseDeg) &&
  input.currentKt >= 0 &&
  input.currentSetDeg >= 0 &&
  input.currentSetDeg <= 360 &&
  input.desiredCourseDeg >= 0 &&
  input.desiredCourseDeg <= 360
    ? {
        effectiveGainKt:
          input.currentKt *
          Math.cos(
            (input.currentSetDeg - input.desiredCourseDeg) * (Math.PI / 180),
          ),
      }
    : null;

export const leeBowEffectCurrentExample = {
  input: { currentKt: 2, currentSetDeg: 60, desiredCourseDeg: 0 },
  output: { effectiveGainKt: 1.0000000000000002 },
} satisfies ToolExample<LeeBowEffectCurrentInput, LeeBowEffectCurrentOutput>;

export const leeBowEffectCurrentTool = createSimpleTool({
  id: "sailing/lee-bow-effect-current",
  title: "Lee Bow Effect Calculator",
  description:
    "Project current onto the desired course as current speed times the cosine of the relative angle. This along-course proxy does not model the true lee-bow effect, which also depends on heading, boat speed, and apparent wind.",
  inputs: [
    {
      description: "Direction the current flows toward.",
      id: "currentSetDeg",
      kind: "number",
      label: "Current set",
      maximum: 360,
      minimum: 0,
      unit: "\u00B0",
    },
    {
      description: "Course the boat wants to make good.",
      id: "desiredCourseDeg",
      kind: "number",
      label: "Desired course",
      maximum: 360,
      minimum: 0,
      unit: "\u00B0",
    },
    {
      description: "Current strength.",
      id: "currentKt",
      kind: "number",
      label: "Current",
      minimum: 0,
      unit: "kt",
    },
  ],
  outputs: [
    {
      description:
        "Signed current component along the desired course; positive is favorable and negative is adverse.",
      id: "effectiveGainKt",
      kind: "number",
      label: "Effective gain",
      unit: "kt",
    },
  ],
  calculate: (input) => {
    const effectiveGainKt = calculateLeeBowEffectCurrent(
      input as unknown as LeeBowEffectCurrentInput,
    );
    if (effectiveGainKt === null)
      simpleError(
        "currentSetDeg",
        "Enter sets and courses between 0 and 360 degrees and a non-negative current.",
        "invalid_course",
      );
    return effectiveGainKt;
  },
});

export const runLeeBowEffectCurrent = leeBowEffectCurrentTool.execute;
export default leeBowEffectCurrentTool;
