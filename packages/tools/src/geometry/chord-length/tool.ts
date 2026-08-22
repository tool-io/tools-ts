import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const chordLengthExample = {
  input: { angleDeg: 60, radius: 2 },
  output: { chordLength: 1.9999999999999998 },
} satisfies ToolExample<ChordLengthInput, ChordLengthOutput>;

export type ChordLengthInput = {
  readonly angleDeg: number;
  readonly radius: number;
};
export type ChordLengthOutput = { readonly chordLength: number };

export const calculateChordLength = (
  input: ChordLengthInput,
): ChordLengthOutput => {
  if (input.angleDeg < 0 || input.angleDeg > 360 || input.radius < 0)
    simpleError(
      "angleDeg",
      "Angle must be between zero and three-sixty.",
      "invalid_angle",
    );
  return {
    chordLength:
      2 * input.radius * Math.sin(((input.angleDeg / 2) * Math.PI) / 180),
  };
};

export const chordLengthTool = createSimpleTool({
  calculate: (input) =>
    calculateChordLength(input as unknown as ChordLengthInput),
  description:
    "Compute the chord length subtended by a central angle in a circle.",
  id: "geometry/chord-length",
  inputs: [
    {
      description: "Central angle of the chord.",
      id: "angleDeg",
      kind: "number",
      label: "Angle",
      unit: "°",
      maximum: 360,
      minimum: 0,
    },
    {
      description: "Radius of the circle.",
      id: "radius",
      kind: "number",
      label: "Radius",
      minimum: 0,
    },
  ],
  outputs: [{ id: "chordLength", kind: "number", label: "Chord length" }],
  title: "Chord Length Calculator",
});
export const runChordLength = chordLengthTool.execute;
export default chordLengthTool;
