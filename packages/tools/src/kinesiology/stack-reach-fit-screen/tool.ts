import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly stackMillimeters: number;
  readonly reachMillimeters: number;
  readonly minimumStackMillimeters: number;
  readonly maximumStackMillimeters: number;
  readonly minimumReachMillimeters: number;
  readonly maximumReachMillimeters: number;
}>;
export type Output = Readonly<{
  readonly stackFits: boolean;
  readonly reachFits: boolean;
  readonly geometryFits: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.minimumStackMillimeters > input.maximumStackMillimeters ||
    input.minimumReachMillimeters > input.maximumReachMillimeters
  )
    simpleError(
      "minimumStackMillimeters",
      "Minimums cannot exceed maximums.",
      "invalid_range",
    );
  const stackFits =
    input.stackMillimeters >= input.minimumStackMillimeters &&
    input.stackMillimeters <= input.maximumStackMillimeters;
  const reachFits =
    input.reachMillimeters >= input.minimumReachMillimeters &&
    input.reachMillimeters <= input.maximumReachMillimeters;
  return { stackFits, reachFits, geometryFits: stackFits && reachFits };
};

export const exampleInput = {
  stackMillimeters: 580,
  reachMillimeters: 390,
  minimumStackMillimeters: 560,
  maximumStackMillimeters: 600,
  minimumReachMillimeters: 380,
  maximumReachMillimeters: 400,
} satisfies Input;
export const example = {
  input: exampleInput,
  output: calculate(exampleInput),
} satisfies ToolExample<Input, Output>;
export const edgeCase = {
  stackMillimeters: 620,
  reachMillimeters: 390,
  minimumStackMillimeters: 560,
  maximumStackMillimeters: 600,
  minimumReachMillimeters: 380,
  maximumReachMillimeters: 400,
} satisfies Input;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      stackMillimeters: input.stackMillimeters as number,
      reachMillimeters: input.reachMillimeters as number,
      minimumStackMillimeters: input.minimumStackMillimeters as number,
      maximumStackMillimeters: input.maximumStackMillimeters as number,
      minimumReachMillimeters: input.minimumReachMillimeters as number,
      maximumReachMillimeters: input.maximumReachMillimeters as number,
    }),
  description:
    "Compare frame stack and reach with a caller-defined fit window.",
  id: "kinesiology/stack-reach-fit-screen",
  inputs: [
    {
      id: "stackMillimeters",
      label: "Measured stack",
      kind: "number",
      unit: "mm",
    },
    {
      id: "reachMillimeters",
      label: "Measured reach",
      kind: "number",
      unit: "mm",
    },
    {
      id: "minimumStackMillimeters",
      label: "Minimum stack",
      kind: "number",
      unit: "mm",
    },
    {
      id: "maximumStackMillimeters",
      label: "Maximum stack",
      kind: "number",
      unit: "mm",
    },
    {
      id: "minimumReachMillimeters",
      label: "Minimum reach",
      kind: "number",
      unit: "mm",
    },
    {
      id: "maximumReachMillimeters",
      label: "Maximum reach",
      kind: "number",
      unit: "mm",
    },
  ],
  outputs: [
    { id: "stackFits", label: "Stack fits", kind: "boolean" },
    { id: "reachFits", label: "Reach fits", kind: "boolean" },
    { id: "geometryFits", label: "Geometry fits", kind: "boolean" },
  ],
  title: "Stack and Reach Fit Screen",
});

export const run = tool.execute;
export default tool;
