import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly lactate: number;
  readonly pyruvate: number;
  readonly minimumRatio: number;
}>;
export type Output = Readonly<{
  readonly lactatePyruvateRatio: number;
  readonly elevated: boolean;
}>;
export const calculate = (input: Input): Output => {
  if (input.lactate < 0 || input.pyruvate <= 0)
    simpleError("pyruvate", "Pyruvate must be positive.");
  const lactatePyruvateRatio = input.lactate / input.pyruvate;
  return {
    lactatePyruvateRatio,
    elevated: lactatePyruvateRatio >= input.minimumRatio,
  };
};
export const exampleInput = {
  lactate: 20,
  pyruvate: 2,
  minimumRatio: 5,
} satisfies Input;
export const exampleOutput = {
  lactatePyruvateRatio: 10,
  elevated: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/lactate-pyruvate-ratio",
  title: "Lactate Pyruvate Ratio",
  description:
    "Screen lactate/pyruvate redox proxy with a caller-supplied threshold.",
  inputs: [
    { id: "lactate", kind: "number", label: "Lactate" },
    { id: "pyruvate", kind: "number", label: "Pyruvate" },
    { id: "minimumRatio", kind: "number", label: "Minimum ratio" },
  ],
  outputs: [
    {
      id: "lactatePyruvateRatio",
      kind: "number",
      label: "Lactate pyruvate ratio",
    },
    { id: "elevated", kind: "boolean", label: "Elevated" },
  ],
  calculate: (value) =>
    calculate({
      lactate: value.lactate as number,
      pyruvate: value.pyruvate as number,
      minimumRatio: value.minimumRatio as number,
    }),
});
export const run = tool.execute;
export default tool;
