import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly contactPositionFraction: number;
  readonly rearfootUpper: number;
  readonly midfootUpper: number;
}>;
export type Output = Readonly<{
  readonly contactClass: string;
  readonly marginAboveRearfoot: number;
}>;
export const calculate = (input: Input): Output => {
  if (
    input.contactPositionFraction < 0 ||
    input.contactPositionFraction > 1 ||
    input.rearfootUpper < 0 ||
    input.rearfootUpper >= input.midfootUpper ||
    input.midfootUpper > 1
  )
    simpleError(
      "contactPositionFraction",
      "Normalized contact position and ordered phase boundaries required.",
    );
  return {
    contactClass:
      input.contactPositionFraction <= input.rearfootUpper
        ? "rearfoot"
        : input.contactPositionFraction <= input.midfootUpper
          ? "midfoot"
          : "forefoot",
    marginAboveRearfoot: input.contactPositionFraction - input.rearfootUpper,
  };
};
export const exampleInput = {
  contactPositionFraction: 0.8,
  rearfootUpper: 0.3,
  midfootUpper: 0.7,
} satisfies Input;
export const exampleOutput = {
  contactClass: "forefoot",
  marginAboveRearfoot: 0.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/foot-strike-contact-classifier",
  title: "Foot Strike Contact Classifier",
  description:
    "Classify first-contact location on a normalized heel=0 to toe=1 axis using caller-defined regions.",
  inputs: [
    {
      id: "contactPositionFraction",
      label: "Contact position fraction",
      kind: "number",
    },
    { id: "rearfootUpper", label: "Rearfoot upper", kind: "number" },
    { id: "midfootUpper", label: "Midfoot upper", kind: "number" },
  ],
  outputs: [
    { id: "contactClass", label: "Contact class", kind: "string" },
    {
      id: "marginAboveRearfoot",
      label: "Margin above rearfoot",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      contactPositionFraction: value.contactPositionFraction as number,
      rearfootUpper: value.rearfootUpper as number,
      midfootUpper: value.midfootUpper as number,
    }),
});
export const run = tool.execute;
export default tool;
