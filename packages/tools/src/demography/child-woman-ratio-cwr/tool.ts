import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ChildWomanRatioCwrInput = {
  readonly childrenUnderFive: number;
  readonly women15to49: number;
};

export type ChildWomanRatioCwrOutput = {
  readonly childWomanRatio: number;
};

export const calculateChildWomanRatioCwr = (
  input: ChildWomanRatioCwrInput,
): ChildWomanRatioCwrOutput => {
  if (!(input.childrenUnderFive >= 0))
    simpleError(
      "childrenUnderFive",
      "The child count must be non-negative.",
      "invalid_count",
    );
  if (!(input.women15to49 > 0))
    simpleError(
      "women15to49",
      "The number of women aged 15-49 must be greater than zero.",
      "invalid_count",
    );
  return {
    childWomanRatio: (input.childrenUnderFive / input.women15to49) * 1000,
  };
};

export const childWomanRatioCwrExample = {
  input: { childrenUnderFive: 12500, women15to49: 30000 },
  output: { childWomanRatio: 416.6666666666667 },
} satisfies ToolExample<ChildWomanRatioCwrInput, ChildWomanRatioCwrOutput>;

export const childWomanRatioCwrTool = createSimpleTool({
  id: "demography/child-woman-ratio-cwr",
  title: "Child Woman Ratio CWR Calculator",
  description:
    "Compute the child-woman ratio as children under age five per one thousand women aged 15 to 49.",
  inputs: [
    {
      description: "Population aged 0-4 at the reference date.",
      id: "childrenUnderFive",
      kind: "number",
      label: "Children 0-4",
      minimum: 0,
    },
    {
      description: "Female population aged 15-49.",
      id: "women15to49",
      kind: "number",
      label: "Women 15-49",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Children under five per 1000 women aged 15-49.",
      id: "childWomanRatio",
      kind: "number",
      label: "CWR",
    },
  ],
  calculate: (input) =>
    calculateChildWomanRatioCwr(input as unknown as ChildWomanRatioCwrInput),
});

export const runChildWomanRatioCwr = childWomanRatioCwrTool.execute;
export default childWomanRatioCwrTool;
