import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { positive, nonnegative, count } from "../shared.js";

export type Input = Readonly<{
  readonly planetSemimajorAxis: number;
  readonly smallBodyRevolutions: number;
  readonly planetRevolutions: number;
  readonly regionInnerRadius: number;
  readonly regionOuterRadius: number;
}>;
export type Output = Readonly<{
  readonly resonanceSemimajorAxis: number;
  readonly withinRegion: boolean;
}>;
export const calculate = (input: Input): Output => {
  positive(input.planetSemimajorAxis, "planetSemimajorAxis");
  count(input.smallBodyRevolutions, "smallBodyRevolutions", 1);
  count(input.planetRevolutions, "planetRevolutions", 1);
  nonnegative(input.regionInnerRadius, "regionInnerRadius");
  if (
    input.smallBodyRevolutions <= input.planetRevolutions ||
    input.regionOuterRadius < input.regionInnerRadius
  )
    simpleError(
      "smallBodyRevolutions",
      "An interior resonance and ordered radial bounds required.",
    );
  const resonanceSemimajorAxis =
    input.planetSemimajorAxis *
    (input.planetRevolutions / input.smallBodyRevolutions) ** (2 / 3);
  return {
    resonanceSemimajorAxis,
    withinRegion:
      resonanceSemimajorAxis >= input.regionInnerRadius &&
      resonanceSemimajorAxis <= input.regionOuterRadius,
  };
};
export const exampleInput = {
  planetSemimajorAxis: 4,
  smallBodyRevolutions: 8,
  planetRevolutions: 1,
  regionInnerRadius: 0.5,
  regionOuterRadius: 2,
} satisfies Input;
export const exampleOutput = {
  resonanceSemimajorAxis: 1,
  withinRegion: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "celestial-mechanics/interior-resonance-location",
  title: "Interior Resonance Location",
  description:
    "Locate an interior Keplerian p:q resonance from the supplied planet orbit, rather than embedding Kirkwood-gap reference positions.",
  inputs: [
    {
      id: "planetSemimajorAxis",
      label: "Planet semimajor axis",
      kind: "number",
    },
    {
      id: "smallBodyRevolutions",
      label: "Small body revolutions",
      kind: "integer",
    },
    { id: "planetRevolutions", label: "Planet revolutions", kind: "integer" },
    { id: "regionInnerRadius", label: "Region inner radius", kind: "number" },
    { id: "regionOuterRadius", label: "Region outer radius", kind: "number" },
  ],
  outputs: [
    {
      id: "resonanceSemimajorAxis",
      label: "Resonance semimajor axis",
      kind: "number",
    },
    { id: "withinRegion", label: "Within region", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      planetSemimajorAxis: value.planetSemimajorAxis as number,
      smallBodyRevolutions: value.smallBodyRevolutions as number,
      planetRevolutions: value.planetRevolutions as number,
      regionInnerRadius: value.regionInnerRadius as number,
      regionOuterRadius: value.regionOuterRadius as number,
    }),
});
export const run = tool.execute;
export default tool;
