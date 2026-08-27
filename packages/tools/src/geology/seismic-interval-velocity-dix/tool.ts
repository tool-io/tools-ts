import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SeismicIntervalVelocityDixInput = {
  readonly rmsVelocity1MPers: number;
  readonly rmsVelocity2MPers: number;
  readonly twoWayTime1S: number;
  readonly twoWayTime2S: number;
};

export type SeismicIntervalVelocityDixOutput = {
  readonly intervalVelocityMPers: number;
};

export const calculateSeismicIntervalVelocityDix = (
  input: SeismicIntervalVelocityDixInput,
): SeismicIntervalVelocityDixOutput => {
  if (!(input.rmsVelocity1MPers > 0))
    return simpleError(
      "rmsVelocity1MPers",
      "RMS velocity must be greater than zero.",
      "invalid_velocity",
    );
  if (!(input.rmsVelocity2MPers > 0))
    return simpleError(
      "rmsVelocity2MPers",
      "RMS velocity must be greater than zero.",
      "invalid_velocity",
    );
  if (!(input.twoWayTime1S > 0))
    return simpleError(
      "twoWayTime1S",
      "Two-way times must be greater than zero.",
      "invalid_time",
    );
  if (!(input.twoWayTime2S > input.twoWayTime1S))
    return simpleError(
      "twoWayTime2S",
      "The deeper two-way time must exceed the shallower one.",
      "invalid_time",
    );
  const numerator =
    input.rmsVelocity2MPers ** 2 * input.twoWayTime2S -
    input.rmsVelocity1MPers ** 2 * input.twoWayTime1S;
  if (numerator <= 0)
    return simpleError(
      "rmsVelocity2MPers",
      "No real interval velocity exists for these RMS picks (Dix numerator is not positive).",
      "invalid_velocity",
    );
  return {
    intervalVelocityMPers: Math.sqrt(
      numerator / (input.twoWayTime2S - input.twoWayTime1S),
    ),
  };
};

export const seismicIntervalVelocityDixExample = {
  input: {
    rmsVelocity1MPers: 1800,
    rmsVelocity2MPers: 2400,
    twoWayTime1S: 0.5,
    twoWayTime2S: 1.0,
  },
  output: { intervalVelocityMPers: 2877.4989139876316 },
} satisfies ToolExample<
  SeismicIntervalVelocityDixInput,
  SeismicIntervalVelocityDixOutput
>;

export const seismicIntervalVelocityDixTool = createSimpleTool({
  id: "geology/seismic-interval-velocity-dix",
  title: "Seismic Interval Velocity Dix Calculator",
  description:
    "Dix (1955) interval velocity Vint^2 = (Vrms2^2 t2 - Vrms1^2 t1) / (t2 - t1) from RMS velocities in meters per second and zero-offset two-way times in seconds.",
  inputs: [
    {
      description:
        "RMS velocity to the shallow reflector in meters per second.",
      id: "rmsVelocity1MPers",
      kind: "number",
      label: "Vrms1",
      minimum: 0,
    },
    {
      description: "RMS velocity to the deep reflector in meters per second.",
      id: "rmsVelocity2MPers",
      kind: "number",
      label: "Vrms2",
      minimum: 0,
    },
    {
      description:
        "Zero-offset two-way time to the shallow reflector in seconds.",
      id: "twoWayTime1S",
      kind: "number",
      label: "t1",
    },
    {
      description: "Zero-offset two-way time to the deep reflector in seconds.",
      id: "twoWayTime2S",
      kind: "number",
      label: "t2",
    },
  ],
  outputs: [
    {
      description:
        "Interval velocity of the layer between the two reflectors in meters per second.",
      id: "intervalVelocityMPers",
      kind: "number",
      label: "V int",
    },
  ],
  calculate: (input) =>
    calculateSeismicIntervalVelocityDix(
      input as unknown as SeismicIntervalVelocityDixInput,
    ),
});

export const runSeismicIntervalVelocityDix =
  seismicIntervalVelocityDixTool.execute;
export default seismicIntervalVelocityDixTool;
