import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type JibLeadAngleInput = {
  apparentWindKt: number;
};

export type JibLeadAngleOutput = {
  leadAngleDegrees: number;
};

export const jibLeadAngleExample = {
  input: { apparentWindKt: 10 },
  output: { leadAngleDegrees: 8 },
} satisfies ToolExample<JibLeadAngleInput, JibLeadAngleOutput>;

export const jibLeadAngleTool = createSimpleTool({
  calculate: (input) => ({
    leadAngleDegrees: Math.min(
      25,
      Math.max(5, Math.round((input.apparentWindKt as number) * 0.8)),
    ),
  }),
  description:
    "Suggest jib lead angle from leadAngleDegrees = min(25, max(5, round(apparentWindKt * 0.8))).",
  id: "sailing/jib-lead-angle",
  inputs: [
    {
      description: "Apparent wind speed.",
      id: "apparentWindKt",
      kind: "number",
      label: "Apparent wind",
      minimum: 0,
      unit: "kn",
    },
  ],
  outputs: [
    {
      description: "Recommended lead angle off the centerline.",
      format: "angle-deg",
      id: "leadAngleDegrees",
      kind: "number",
      label: "Lead angle",
      unit: "deg",
    },
  ],
  title: "Jib Lead Angle Guide",
});
export const runJibLeadAngle = jibLeadAngleTool.execute;
export default jibLeadAngleTool;
