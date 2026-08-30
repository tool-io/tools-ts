import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { positive, deg } from "../shared.js";

export type Input = Readonly<{
  readonly diameterCrossingSeconds: number;
  readonly shadowKmPerSecond: number;
  readonly stellarDistanceKm: number;
}>;
export type Output = Readonly<{
  readonly projectedDiameterKm: number;
  readonly angularDiameterMilliarcseconds: number;
}>;
export const calculate = (input: Input): Output => {
  positive(input.diameterCrossingSeconds, "diameterCrossingSeconds");
  positive(input.shadowKmPerSecond, "shadowKmPerSecond");
  positive(input.stellarDistanceKm, "stellarDistanceKm");
  const projectedDiameterKm =
    input.diameterCrossingSeconds * input.shadowKmPerSecond;
  return {
    projectedDiameterKm,
    angularDiameterMilliarcseconds:
      deg(2 * Math.atan(projectedDiameterKm / (2 * input.stellarDistanceKm))) *
      3600000,
  };
};
export const exampleInput = {
  diameterCrossingSeconds: 0.01,
  shadowKmPerSecond: 10,
  stellarDistanceKm: 1000,
} satisfies Input;
export const exampleOutput = {
  projectedDiameterKm: 0.1,
  angularDiameterMilliarcseconds: 20626.480607520905,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrometry/occultation-stellar-angular-diameter",
  title: "Occultation Stellar Angular Diameter",
  description:
    "Estimate diameter from a central occultation-edge crossing and shadow speed, then angular size; diffraction, integration smearing and noncentral chords are excluded.",
  inputs: [
    {
      id: "diameterCrossingSeconds",
      label: "Diameter crossing seconds",
      kind: "number",
    },
    { id: "shadowKmPerSecond", label: "Shadow km per second", kind: "number" },
    { id: "stellarDistanceKm", label: "Stellar distance km", kind: "number" },
  ],
  outputs: [
    {
      id: "projectedDiameterKm",
      label: "Projected diameter km",
      kind: "number",
    },
    {
      id: "angularDiameterMilliarcseconds",
      label: "Angular diameter milliarcseconds",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      diameterCrossingSeconds: value.diameterCrossingSeconds as number,
      shadowKmPerSecond: value.shadowKmPerSecond as number,
      stellarDistanceKm: value.stellarDistanceKm as number,
    }),
});
export const run = tool.execute;
export default tool;
