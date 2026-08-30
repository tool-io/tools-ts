import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { positive } from "../shared.js";

export type Input = Readonly<{
  readonly axialRiseAngstrom: number;
  readonly rotationDegreesPerSubunit: number;
}>;
export type Output = Readonly<{
  readonly subunitsPerTurn: number;
  readonly helicalPitchAngstrom: number;
}>;
export const calculate = (input: Input): Output => {
  positive(input.axialRiseAngstrom, "axialRiseAngstrom");
  positive(input.rotationDegreesPerSubunit, "rotationDegreesPerSubunit");
  if (input.rotationDegreesPerSubunit > 360)
    simpleError(
      "rotationDegreesPerSubunit",
      "Rotation must not exceed one turn.",
    );
  const subunitsPerTurn = 360 / input.rotationDegreesPerSubunit;
  return {
    subunitsPerTurn,
    helicalPitchAngstrom: input.axialRiseAngstrom * subunitsPerTurn,
  };
};
export const exampleInput = {
  axialRiseAngstrom: 2,
  rotationDegreesPerSubunit: 30,
} satisfies Input;
export const exampleOutput = {
  subunitsPerTurn: 12,
  helicalPitchAngstrom: 24,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "virology/helical-capsid-pitch",
  title: "Helical Capsid Pitch",
  description:
    "Derive helical subunits per turn and axial pitch from measured rise and rotation.",
  inputs: [
    { id: "axialRiseAngstrom", label: "Axial rise angstrom", kind: "number" },
    {
      id: "rotationDegreesPerSubunit",
      label: "Rotation degrees per subunit",
      kind: "number",
    },
  ],
  outputs: [
    { id: "subunitsPerTurn", label: "Subunits per turn", kind: "number" },
    {
      id: "helicalPitchAngstrom",
      label: "Helical pitch angstrom",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      axialRiseAngstrom: value.axialRiseAngstrom as number,
      rotationDegreesPerSubunit: value.rotationDegreesPerSubunit as number,
    }),
});
export const run = tool.execute;
export default tool;
