import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly metValue: number;
  readonly lightUpperMet: number;
  readonly vigorousLowerMet: number;
}>;
export type Output = Readonly<{
  readonly intensityBand: string;
  readonly distanceToVigorousMet: number;
}>;
export const calculate = (input: Input): Output => {
  if (
    input.metValue < 0 ||
    input.lightUpperMet <= 0 ||
    input.vigorousLowerMet <= input.lightUpperMet
  )
    simpleError(
      "lightUpperMet",
      "Nonnegative MET value and ordered caller-defined band cutoffs required.",
    );
  return {
    intensityBand:
      input.metValue < input.lightUpperMet
        ? "light"
        : input.metValue < input.vigorousLowerMet
          ? "moderate"
          : "vigorous",
    distanceToVigorousMet: input.vigorousLowerMet - input.metValue,
  };
};
export const exampleInput = {
  metValue: 5,
  lightUpperMet: 3,
  vigorousLowerMet: 6,
} satisfies Input;
export const exampleOutput = {
  intensityBand: "moderate",
  distanceToVigorousMet: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/met-intensity-bands",
  title: "MET Intensity Bands",
  description:
    "Classify MET intensity using caller-selected light/moderate/vigorous boundaries.",
  inputs: [
    { id: "metValue", label: "Met value", kind: "number" },
    { id: "lightUpperMet", label: "Light upper met", kind: "number" },
    { id: "vigorousLowerMet", label: "Vigorous lower met", kind: "number" },
  ],
  outputs: [
    { id: "intensityBand", label: "Intensity band", kind: "string" },
    {
      id: "distanceToVigorousMet",
      label: "Distance to vigorous met",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      metValue: value.metValue as number,
      lightUpperMet: value.lightUpperMet as number,
      vigorousLowerMet: value.vigorousLowerMet as number,
    }),
});
export const run = tool.execute;
export default tool;
