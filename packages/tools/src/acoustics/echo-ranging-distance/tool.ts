import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type EchoRangingDistanceInput = Readonly<{
  readonly speedMetersPerSecond: number;
  readonly roundTripMilliseconds: number;
}>;
export type EchoRangingDistanceOutput = Readonly<{
  readonly distanceMeters: number;
}>;

export const calculateEchoRangingDistance = (
  x: EchoRangingDistanceInput,
): EchoRangingDistanceOutput => {
  if (!Number.isFinite(x.speedMetersPerSecond) || x.speedMetersPerSecond <= 0)
    simpleError("speedMetersPerSecond", "Provide a finite positive number.");
  if (!Number.isFinite(x.roundTripMilliseconds) || x.roundTripMilliseconds < 0)
    simpleError(
      "roundTripMilliseconds",
      "Provide a finite nonnegative number.",
    );
  const distanceMeters =
    (x.speedMetersPerSecond * x.roundTripMilliseconds) / 2000;
  if (!Number.isFinite(distanceMeters))
    simpleError(
      "distanceMeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { distanceMeters: Object.is(distanceMeters, -0) ? 0 : distanceMeters };
};

export const example = {
  input: {
    speedMetersPerSecond: 1500,
    roundTripMilliseconds: 2,
  },
  output: { distanceMeters: 1.5 },
} satisfies ToolExample<EchoRangingDistanceInput, EchoRangingDistanceOutput>;

export const tool = createSimpleTool({
  id: "acoustics/echo-ranging-distance",
  title: "Echo Ranging Distance",
  description:
    "Reflector distance from round-trip echo time and propagation speed.",
  inputs: [
    {
      id: "speedMetersPerSecond",
      kind: "number",
      label: "Speed Meters Per Second",
      unit: "m/s",
      minimum: 0,
    },
    {
      id: "roundTripMilliseconds",
      kind: "number",
      label: "Round Trip Milliseconds",
      unit: "ms",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "distanceMeters",
      kind: "number",
      label: "Distance Meters",
      unit: "m",
    },
  ],
  calculate: (input) =>
    calculateEchoRangingDistance({
      speedMetersPerSecond: input.speedMetersPerSecond as number,
      roundTripMilliseconds: input.roundTripMilliseconds as number,
    }),
});
export const echoRangingDistanceTool = tool;
export const runEchoRangingDistance = tool.execute;
export default tool;
