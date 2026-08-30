import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GrindingRemovalRateInput = Readonly<{
  readonly contactWidthMillimeters: number;
  readonly cutDepthMillimeters: number;
  readonly feedMillimetersPerMinute: number;
}>;
export type GrindingRemovalRateOutput = Readonly<{
  readonly removalCubicMillimetersPerMinute: number;
}>;

export const calculateGrindingRemovalRate = (
  x: GrindingRemovalRateInput,
): GrindingRemovalRateOutput => {
  if (
    !Number.isFinite(x.contactWidthMillimeters) ||
    x.contactWidthMillimeters < 0
  )
    simpleError(
      "contactWidthMillimeters",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.cutDepthMillimeters) || x.cutDepthMillimeters < 0)
    simpleError("cutDepthMillimeters", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.feedMillimetersPerMinute) ||
    x.feedMillimetersPerMinute < 0
  )
    simpleError(
      "feedMillimetersPerMinute",
      "Provide a finite number at least 0.",
    );
  const removalCubicMillimetersPerMinute =
    x.contactWidthMillimeters *
    x.cutDepthMillimeters *
    x.feedMillimetersPerMinute;
  if (!Number.isFinite(removalCubicMillimetersPerMinute))
    simpleError(
      "removalCubicMillimetersPerMinute",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    removalCubicMillimetersPerMinute: Object.is(
      removalCubicMillimetersPerMinute,
      -0,
    )
      ? 0
      : removalCubicMillimetersPerMinute,
  };
};

export const example = {
  input: {
    contactWidthMillimeters: 10,
    cutDepthMillimeters: 0.1,
    feedMillimetersPerMinute: 100,
  },
  output: { removalCubicMillimetersPerMinute: 100 },
} satisfies ToolExample<GrindingRemovalRateInput, GrindingRemovalRateOutput>;

export const tool = createSimpleTool({
  id: "engineering/grinding-removal-rate",
  title: "Grinding Removal Rate",
  description:
    "Ideal grinding removal volume per minute from contact width, cut depth and workpiece feed.",
  inputs: [
    {
      id: "contactWidthMillimeters",
      kind: "number",
      label: "Contact Width Millimeters",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "cutDepthMillimeters",
      kind: "number",
      label: "Cut Depth Millimeters",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "feedMillimetersPerMinute",
      kind: "number",
      label: "Feed Millimeters Per Minute",
      unit: "mm/min",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "removalCubicMillimetersPerMinute",
      kind: "number",
      label: "Removal Cubic Millimeters Per Minute",
      unit: "mm³/min",
    },
  ],
  calculate: (input) =>
    calculateGrindingRemovalRate({
      contactWidthMillimeters: input.contactWidthMillimeters as number,
      cutDepthMillimeters: input.cutDepthMillimeters as number,
      feedMillimetersPerMinute: input.feedMillimetersPerMinute as number,
    }),
});
export const grindingRemovalRateTool = tool;
export const runGrindingRemovalRate = tool.execute;
export default tool;
