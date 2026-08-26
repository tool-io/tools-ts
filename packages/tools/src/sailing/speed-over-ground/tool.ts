import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type SpeedOverGroundInput = {
  readonly currentSetDeg: number;
  readonly currentSpeedKt: number;
  readonly vesselCourseDeg: number;
  readonly vesselSpeedKt: number;
};

export type SpeedOverGroundOutput = {
  readonly speedOverGroundKt: number;
};

export const speedOverGroundExample = {
  input: {
    currentSetDeg: 90,
    currentSpeedKt: 2,
    vesselCourseDeg: 0,
    vesselSpeedKt: 10,
  },
  output: { speedOverGroundKt: 10.19803902718557 },
} satisfies ToolExample<SpeedOverGroundInput, SpeedOverGroundOutput>;

export const speedOverGroundTool = createSimpleTool({
  id: "sailing/speed-over-ground",
  title: "Speed Over Ground Calculator",
  description:
    "Calculate the resulting speed over ground from vessel motion combined with current set and drift.",
  inputs: [
    {
      id: "vesselCourseDeg",
      kind: "number",
      label: "Vessel course",
      maximum: 360,
      minimum: 0,
    },
    { id: "vesselSpeedKt", kind: "number", label: "Vessel speed", minimum: 0 },
    {
      id: "currentSetDeg",
      kind: "number",
      label: "Current set",
      maximum: 360,
      minimum: 0,
    },
    {
      id: "currentSpeedKt",
      kind: "number",
      label: "Current speed",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "speedOverGroundKt", kind: "number", label: "Speed over ground" },
  ],
  calculate: (input) => {
    const toRad = Math.PI / 180;
    const east =
      (input.vesselSpeedKt as number) *
        Math.sin((input.vesselCourseDeg as number) * toRad) +
      (input.currentSpeedKt as number) *
        Math.sin((input.currentSetDeg as number) * toRad);
    const north =
      (input.vesselSpeedKt as number) *
        Math.cos((input.vesselCourseDeg as number) * toRad) +
      (input.currentSpeedKt as number) *
        Math.cos((input.currentSetDeg as number) * toRad);
    return { speedOverGroundKt: Math.hypot(east, north) };
  },
});
export const runSpeedOverGround = speedOverGroundTool.execute;
export default speedOverGroundTool;
