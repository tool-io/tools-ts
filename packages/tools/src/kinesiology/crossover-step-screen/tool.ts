import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly mediolateralFootPlacementCm: number;
  readonly minimumStepWidthCm: number;
}>;
export type Output = Readonly<{
  readonly stepWidthMarginCm: number;
  readonly crossoverFlag: boolean;
}>;
export const calculate = (input: Input): Output => {
  if (input.minimumStepWidthCm < 0)
    simpleError(
      "minimumStepWidthCm",
      "Minimum step width must be nonnegative.",
    );
  const stepWidthMarginCm =
    input.mediolateralFootPlacementCm - input.minimumStepWidthCm;
  return { stepWidthMarginCm, crossoverFlag: stepWidthMarginCm < 0 };
};
export const exampleInput = {
  mediolateralFootPlacementCm: -2,
  minimumStepWidthCm: 0,
} satisfies Input;
export const exampleOutput = {
  stepWidthMarginCm: -2,
  crossoverFlag: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/crossover-step-screen",
  title: "Crossover Step Screen",
  description:
    "Flag foot placements narrower than a caller-supplied step-width limit.",
  inputs: [
    {
      id: "mediolateralFootPlacementCm",
      label: "Mediolateral foot placement cm",
      kind: "number",
    },
    {
      id: "minimumStepWidthCm",
      label: "Minimum step width cm",
      kind: "number",
    },
  ],
  outputs: [
    { id: "stepWidthMarginCm", label: "Step width margin cm", kind: "number" },
    { id: "crossoverFlag", label: "Crossover flag", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      mediolateralFootPlacementCm: value.mediolateralFootPlacementCm as number,
      minimumStepWidthCm: value.minimumStepWidthCm as number,
    }),
});
export const run = tool.execute;
export default tool;
