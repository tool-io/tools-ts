import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SeismicTwoWayTimeInput = {
  readonly depthM: number;
  readonly intervalVelocityMPers: number;
};

export type SeismicTwoWayTimeOutput = {
  readonly twoWayTimeS: number;
  readonly oneWayTimeS: number;
};

export const calculateSeismicTwoWayTime = (
  input: SeismicTwoWayTimeInput,
): SeismicTwoWayTimeOutput => {
  if (!(input.depthM >= 0))
    return simpleError(
      "depthM",
      "Depth must be non-negative.",
      "invalid_depth",
    );
  if (!(input.intervalVelocityMPers > 0))
    return simpleError(
      "intervalVelocityMPers",
      "Interval velocity must be greater than zero.",
      "invalid_velocity",
    );
  const oneWayTimeS = input.depthM / input.intervalVelocityMPers;
  return { twoWayTimeS: 2 * oneWayTimeS, oneWayTimeS };
};

export const seismicTwoWayTimeExample = {
  input: { depthM: 2000, intervalVelocityMPers: 2800 },
  output: { twoWayTimeS: 1.4285714285714286, oneWayTimeS: 0.7142857142857143 },
} satisfies ToolExample<SeismicTwoWayTimeInput, SeismicTwoWayTimeOutput>;

export const seismicTwoWayTimeTool = createSimpleTool({
  id: "geology/seismic-two-way-time",
  title: "Seismic Two Way Time Calculator",
  description:
    "Convert depth to seismic travel time: t = z / V for the one-way time and twice that for the zero-offset two-way time, with depth in meters and interval velocity in meters per second.",
  inputs: [
    {
      description: "Reflector depth below the datum in meters.",
      id: "depthM",
      kind: "number",
      label: "Depth",
      minimum: 0,
    },
    {
      description:
        "Average interval velocity above the reflector in meters per second.",
      id: "intervalVelocityMPers",
      kind: "number",
      label: "V int",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Zero-offset two-way travel time in seconds.",
      id: "twoWayTimeS",
      kind: "number",
      label: "TWT",
    },
    {
      description: "One-way travel time in seconds.",
      id: "oneWayTimeS",
      kind: "number",
      label: "OWT",
    },
  ],
  calculate: (input) =>
    calculateSeismicTwoWayTime(input as unknown as SeismicTwoWayTimeInput),
});

export const runSeismicTwoWayTime = seismicTwoWayTimeTool.execute;
export default seismicTwoWayTimeTool;
