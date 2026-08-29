import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const reducedTravelTimePlotConverterExample = {
  input: {
    distancesKm: [10, 20],
    travelTimesS: [5, 8],
    reducingVelocityKmS: 4,
  },
  output: { reducedTimesS: [2.5, 3], slopeSlownessSKm: 0.3 },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const reducedTravelTimePlotConverterTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ distancesKm, travelTimesS, reducingVelocityKmS }) => {
      const D = distancesKm as unknown[];
      const T = travelTimesS as unknown[];
      if (
        !Array.isArray(D) ||
        !Array.isArray(T) ||
        D.length !== T.length ||
        D.length === 0
      )
        simpleError("distancesKm", "Provide matching distance/time lists.");
      if (reducingVelocityKmS <= 0)
        simpleError("reducingVelocityKmS", "Velocity must be positive.");
      const distances = D as number[];
      for (let i = 1; i < distances.length; i++)
        if (distances[i] <= distances[i - 1])
          simpleError("distancesKm", "Distances must be strictly increasing.");
      const reducedTimesS = (T as number[]).map(
        (t, i) => t - (D as number[])[i] / reducingVelocityKmS,
      );
      let slope = 0;
      if (D.length >= 2)
        slope =
          ((T as number[])[D.length - 1] - (T as number[])[0]) /
          (distances[D.length - 1] - distances[0]);
      return { reducedTimesS, slopeSlownessSKm: slope };
    })(input as never) as Record<string, unknown>,
  description:
    "Convert absolute travel times to reduced times t − Δ/v_red for slowness plotting.",
  id: "seismology/reduced-travel-time-plot-converter",
  inputs: [
    {
      description: "Epicentral distances.",
      id: "distancesKm",
      kind: "numberList",
      label: "Δ_i",
    },
    {
      description: "Observed travel times.",
      id: "travelTimesS",
      kind: "numberList",
      label: "t_i",
    },
    {
      minimum: 0,
      description: "Reducing velocity.",
      id: "reducingVelocityKmS",
      kind: "number",
      label: "v_red",
      unit: "km/s",
    },
  ],
  outputs: [
    {
      description: "Reduced times.",
      id: "reducedTimesS",
      kind: "numberList",
      label: "t'",
      unit: "s",
    },
    {
      description: "Segment-averaged slowness.",
      id: "slopeSlownessSKm",
      kind: "number",
      label: "dt/dΔ",
      unit: "s/km",
    },
  ],
  title: "Reduced Travel Time Plot Converter",
});
export const runReducedTravelTimePlotConverter =
  reducedTravelTimePlotConverterTool.execute;
export { reducedTravelTimePlotConverterExample as example };
export default reducedTravelTimePlotConverterTool;
