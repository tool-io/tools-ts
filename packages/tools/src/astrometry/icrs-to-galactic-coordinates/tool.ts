import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import {
  skyVector,
  skyAngles,
  matrixVector,
  galacticRotation,
} from "../shared.js";

export type Input = Readonly<{
  readonly raDegrees: number;
  readonly decDegrees: number;
}>;
export type Output = Readonly<{
  readonly longitudeDegrees: number;
  readonly latitudeDegrees: number;
}>;
export const calculate = (input: Input): Output => {
  const v = matrixVector(
      galacticRotation,
      skyVector(input.raDegrees, input.decDegrees),
    ),
    angles = skyAngles(v);
  return { longitudeDegrees: angles[0], latitudeDegrees: angles[1] };
};
export const exampleInput = { raDegrees: 0, decDegrees: 0 } satisfies Input;
export const exampleOutput = {
  longitudeDegrees: 96.33727234341764,
  latitudeDegrees: -60.18855326759371,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrometry/icrs-to-galactic-coordinates",
  title: "Icrs To Galactic Coordinates",
  description:
    "Apply the fixed ICRS/J2000 Galactic rotation to a sky direction; this is not an epoch propagation.",
  inputs: [
    { id: "raDegrees", label: "Ra degrees", kind: "number" },
    { id: "decDegrees", label: "Dec degrees", kind: "number" },
  ],
  outputs: [
    { id: "longitudeDegrees", label: "Longitude degrees", kind: "number" },
    { id: "latitudeDegrees", label: "Latitude degrees", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      raDegrees: value.raDegrees as number,
      decDegrees: value.decDegrees as number,
    }),
});
export const run = tool.execute;
export default tool;
