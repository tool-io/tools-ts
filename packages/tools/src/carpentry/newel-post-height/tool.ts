import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type NewelPostHeightInput = Readonly<{
  readonly exposedMillimeters: number;
  readonly anchorMillimeters: number;
}>;
export type NewelPostHeightOutput = Readonly<{
  readonly blankMillimeters: number;
}>;

export const calculateNewelPostHeight = (
  x: NewelPostHeightInput,
): NewelPostHeightOutput => {
  if (!Number.isFinite(x.exposedMillimeters) || x.exposedMillimeters < 0)
    simpleError("exposedMillimeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.anchorMillimeters) || x.anchorMillimeters < 0)
    simpleError("anchorMillimeters", "Provide a finite number at least 0.");
  const blankMillimeters = x.exposedMillimeters + x.anchorMillimeters;
  if (!Number.isFinite(blankMillimeters))
    simpleError(
      "blankMillimeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    blankMillimeters: Object.is(blankMillimeters, -0) ? 0 : blankMillimeters,
  };
};

export const example = {
  input: { exposedMillimeters: 900, anchorMillimeters: 150 },
  output: { blankMillimeters: 1050 },
} satisfies ToolExample<NewelPostHeightInput, NewelPostHeightOutput>;

export const tool = createSimpleTool({
  id: "carpentry/newel-post-height",
  title: "Newel Post Height",
  description:
    "Minimum newel-post blank length from required exposed height above the mounting surface plus below-surface anchoring length.",
  inputs: [
    {
      id: "exposedMillimeters",
      kind: "number",
      label: "Exposed Millimeters",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "anchorMillimeters",
      kind: "number",
      label: "Anchor Millimeters",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "blankMillimeters",
      kind: "number",
      label: "Blank Millimeters",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculateNewelPostHeight({
      exposedMillimeters: input.exposedMillimeters as number,
      anchorMillimeters: input.anchorMillimeters as number,
    }),
});
export const newelPostHeightTool = tool;
export const runNewelPostHeight = tool.execute;
export default tool;
