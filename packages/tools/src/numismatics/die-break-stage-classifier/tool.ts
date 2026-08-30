import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly crackReachesRim: boolean;
  readonly fragmentDisplaced: boolean;
  readonly dieSectionMissing: boolean;
}>;
export type Output = Readonly<{
  readonly stage: string;
}>;

export const calculate = (input: Input): Output => {
  const stage = input.dieSectionMissing
    ? "full-cud"
    : input.fragmentDisplaced
      ? "retained-cud"
      : input.crackReachesRim
        ? "die-crack"
        : "insufficient-evidence";
  return { stage };
};

export const exampleInput = {
  crackReachesRim: true,
  fragmentDisplaced: false,
  dieSectionMissing: false,
} satisfies Input;
export const example = {
  input: exampleInput,
  output: calculate(exampleInput),
} satisfies ToolExample<Input, Output>;
export const edgeCase = {
  crackReachesRim: true,
  fragmentDisplaced: true,
  dieSectionMissing: false,
} satisfies Input;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      crackReachesRim: input.crackReachesRim as boolean,
      fragmentDisplaced: input.fragmentDisplaced as boolean,
      dieSectionMissing: input.dieSectionMissing as boolean,
    }),
  description:
    "Classify supplied die-break observations without authenticating the coin.",
  id: "numismatics/die-break-stage-classifier",
  inputs: [
    { id: "crackReachesRim", label: "Crack reaches rim", kind: "boolean" },
    {
      id: "fragmentDisplaced",
      label: "Die fragment displaced",
      kind: "boolean",
    },
    { id: "dieSectionMissing", label: "Die section missing", kind: "boolean" },
  ],
  outputs: [
    {
      id: "stage",
      label: "Die-break stage",
      kind: "string",
      enum: ["die-crack", "retained-cud", "full-cud", "insufficient-evidence"],
    },
  ],
  title: "Die Break Stage Classifier",
});

export const run = tool.execute;
export default tool;
