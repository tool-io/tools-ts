import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type TravelerPositionInput = {
  apparentWindKt: number;
};

export type TravelerPositionOutput = {
  travelerOffsetCm: number;
};

export const travelerPositionExample = {
  input: { apparentWindKt: 10 },
  output: { travelerOffsetCm: 10 },
} satisfies ToolExample<TravelerPositionInput, TravelerPositionOutput>;

export const travelerPositionTool = createSimpleTool({
  calculate: (input) => ({
    travelerOffsetCm: Math.min(
      30,
      Math.max(-30, Math.round((15 - (input.apparentWindKt as number)) * 2)),
    ),
  }),
  description:
    "Suggest traveler position from offsetCm = min(30, max(-30, round((15 - apparentWindKt) * 2))); positive values are to weather.",
  id: "sailing/traveler-position",
  inputs: [
    {
      description: "Apparent wind speed between 0 and 40 knots.",
      id: "apparentWindKt",
      kind: "number",
      label: "Apparent wind",
      maximum: 40,
      minimum: 0,
      unit: "kn",
    },
  ],
  outputs: [
    {
      description:
        "Signed traveler offset in centimeters; positive means to weather.",
      format: "length-cm",
      id: "travelerOffsetCm",
      kind: "number",
      label: "Traveler offset",
      unit: "cm",
    },
  ],
  title: "Traveler Position Guide",
});
export const runTravelerPosition = travelerPositionTool.execute;
export default travelerPositionTool;
