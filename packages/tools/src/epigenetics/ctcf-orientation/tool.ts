import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly leftMotifOrientation: string;
  readonly rightMotifOrientation: string;
}>;
export type Output = Readonly<{
  readonly pairClass: string;
  readonly convergent: boolean;
}>;

export const calculate = (input: Input): Output => {
  const pairClass =
    input.leftMotifOrientation === "forward" &&
    input.rightMotifOrientation === "reverse"
      ? "convergent"
      : input.leftMotifOrientation === "reverse" &&
          input.rightMotifOrientation === "forward"
        ? "divergent"
        : "tandem";
  return { pairClass, convergent: pairClass === "convergent" };
};

export const exampleInput = {
  leftMotifOrientation: "forward",
  rightMotifOrientation: "reverse",
} satisfies Input;
export const exampleOutput = {
  pairClass: "convergent",
  convergent: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      leftMotifOrientation: input.leftMotifOrientation as string,
      rightMotifOrientation: input.rightMotifOrientation as string,
    }),
  description:
    "Classify a CTCF motif pair as convergent, divergent, or tandem.",
  id: "epigenetics/ctcf-orientation",
  inputs: [
    {
      id: "leftMotifOrientation",
      label: "Left motif orientation",
      kind: "string",
      enum: ["forward", "reverse"],
    },
    {
      id: "rightMotifOrientation",
      label: "Right motif orientation",
      kind: "string",
      enum: ["forward", "reverse"],
    },
  ],
  outputs: [
    {
      id: "pairClass",
      label: "Orientation class",
      kind: "string",
      enum: ["convergent", "divergent", "tandem"],
    },
    { id: "convergent", label: "Convergent pair", kind: "boolean" },
  ],
  title: "CTCF Orientation",
});

export const run = tool.execute;
export default tool;
