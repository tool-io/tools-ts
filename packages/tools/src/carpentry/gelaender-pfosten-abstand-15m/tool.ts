import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PostSpacingInput = {
  readonly maxPostSpacingM?: number;
  readonly runLengthM: number;
};

export type PostSpacingOutput = {
  readonly actualSpacingM: number;
  readonly postsRequired: number;
};

const DEFAULT_MAX_POST_SPACING_M = 1.5;

export const postSpacingExample = {
  input: { runLengthM: 15 },
  output: { actualSpacingM: 1.5, postsRequired: 11 },
} satisfies ToolExample<PostSpacingInput, PostSpacingOutput>;

export const postSpacingTool = createSimpleTool({
  id: "carpentry/gelaender-pfosten-abstand-15m",
  title: "Post Spacing Calculator",
  description:
    "Compute the number of railing posts needed for a run so the actual spacing never exceeds the maximum allowed post spacing.",
  inputs: [
    {
      description: "Total railing run length in meters.",
      id: "runLengthM",
      kind: "number",
      label: "Run length",
      unit: "m",
    },
    {
      description:
        "Maximum distance between neighboring posts in meters, between 0 and 3 exclusive, defaulting to 1.5.",
      default: DEFAULT_MAX_POST_SPACING_M,
      id: "maxPostSpacingM",
      kind: "number",
      label: "Maximum post spacing",
      maximum: 3,
      unit: "m",
    },
  ],
  outputs: [
    {
      description:
        "Number of posts required, one more than the rounded-up spacing segments.",
      id: "postsRequired",
      kind: "integer",
      label: "Posts required",
    },
    {
      description:
        "Actual uniform post spacing in meters, the run divided by the gaps between posts.",
      id: "actualSpacingM",
      kind: "number",
      label: "Actual spacing",
      unit: "m",
    },
  ],
  calculate: (input) => {
    const runLengthM = input.runLengthM as number;
    if (!(runLengthM > 0))
      simpleError(
        "runLengthM",
        "Run length must be greater than zero.",
        "must_be_positive",
      );
    const maxPostSpacingM =
      input.maxPostSpacingM === undefined
        ? DEFAULT_MAX_POST_SPACING_M
        : (input.maxPostSpacingM as number);
    if (!(maxPostSpacingM > 0))
      simpleError(
        "maxPostSpacingM",
        "Maximum post spacing must be greater than zero.",
        "must_be_positive",
      );
    if (!(maxPostSpacingM < 3))
      simpleError(
        "maxPostSpacingM",
        "Maximum post spacing must be less than three meters.",
        "out_of_range",
      );
    const postsRequired = Math.ceil(runLengthM / maxPostSpacingM) + 1;
    return {
      actualSpacingM: runLengthM / (postsRequired - 1),
      postsRequired,
    };
  },
});
export const runPostSpacing = postSpacingTool.execute;
export default postSpacingTool;
