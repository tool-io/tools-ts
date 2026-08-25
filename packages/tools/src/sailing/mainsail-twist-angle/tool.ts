import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type MainsailTwistAngleInput = {
  apparentWindKt: number;
};

export type MainsailTwistAngleOutput = {
  twistDegrees: number;
};

export const mainsailTwistAngleExample = {
  input: { apparentWindKt: 20 },
  output: { twistDegrees: 40 },
} satisfies ToolExample<MainsailTwistAngleInput, MainsailTwistAngleOutput>;

export const mainsailTwistAngleTool = createSimpleTool({
  calculate: (input) => ({
    twistDegrees: Math.min(
      45,
      Math.max(5, 60 - (input.apparentWindKt as number)),
    ),
  }),
  description:
    "Suggest mainsail twist from twistDegrees = min(45, max(5, 60 - apparentWindKt)).",
  id: "sailing/mainsail-twist-angle",
  inputs: [
    {
      description: "Apparent wind speed between 0 and 60 knots.",
      id: "apparentWindKt",
      kind: "number",
      label: "Apparent wind",
      maximum: 60,
      minimum: 0,
      unit: "kn",
    },
  ],
  outputs: [
    {
      description: "Recommended twist between the boom and upper leech.",
      format: "angle-deg",
      id: "twistDegrees",
      kind: "number",
      label: "Twist angle",
      unit: "deg",
    },
  ],
  title: "Mainsail Twist Guide",
});
export const runMainsailTwistAngle = mainsailTwistAngleTool.execute;
export default mainsailTwistAngleTool;
