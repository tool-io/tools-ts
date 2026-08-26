import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TidalStreamAtTimeInput = {
  readonly halfPeriodHours: number;
  readonly hoursIntoCycle: number;
  readonly peakStreamKt: number;
};

export type TidalStreamAtTimeOutput = {
  readonly streamKt: number;
};

export const tidalStreamAtTimeExample = {
  input: {
    halfPeriodHours: 6.2,
    hoursIntoCycle: 3.1,
    peakStreamKt: 3,
  },
  output: { streamKt: 3 },
} satisfies ToolExample<TidalStreamAtTimeInput, TidalStreamAtTimeOutput>;

const streamKt = (
  peakStreamKt: number,
  halfPeriodHours: number,
  hoursIntoCycle: number,
): number =>
  peakStreamKt * Math.sin((Math.PI * hoursIntoCycle) / halfPeriodHours);

export const tidalStreamAtTimeTool = createSimpleTool({
  id: "sailing/tidal-stream-at-time",
  title: "Tidal Stream at Time Calculator",
  description:
    "Model the tidal stream as a sinusoid and return its signed rate at a given time into the flood-and-ebb cycle.",
  inputs: [
    {
      description: "Peak stream rate at maximum flood.",
      id: "peakStreamKt",
      kind: "number",
      label: "Peak stream",
      minimum: 0,
      unit: "kt",
    },
    {
      description:
        "Hours from slack to the next slack, about 6.2 for semidiurnal tides.",
      id: "halfPeriodHours",
      kind: "number",
      label: "Half period",
      minimum: 0,
      unit: "h",
    },
    {
      description: "Elapsed hours since the cycle's slack-water start.",
      id: "hoursIntoCycle",
      kind: "number",
      label: "Hours into cycle",
      minimum: 0,
      unit: "h",
    },
  ],
  outputs: [
    {
      description:
        "Signed stream rate, positive on the flood lobe and negative on the ebb lobe.",
      format: "speed",
      id: "streamKt",
      kind: "number",
      label: "Tidal stream",
      unit: "kt",
    },
  ],
  calculate: (input) => {
    const peakStreamKt = input.peakStreamKt as number;
    const halfPeriodHours = input.halfPeriodHours as number;
    if (peakStreamKt <= 0)
      simpleError(
        "peakStreamKt",
        "Peak stream must be positive.",
        "invalid_peak",
      );
    if (halfPeriodHours <= 0)
      simpleError(
        "halfPeriodHours",
        "Half period must be positive.",
        "invalid_half_period",
      );
    return {
      streamKt: streamKt(
        peakStreamKt,
        halfPeriodHours,
        input.hoursIntoCycle as number,
      ),
    };
  },
});
export const runTidalStreamAtTime = tidalStreamAtTimeTool.execute;
export default tidalStreamAtTimeTool;
