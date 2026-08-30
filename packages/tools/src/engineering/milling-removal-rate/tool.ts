import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MillingRemovalRateInput = Readonly<{
  readonly widthMillimeters: number;
  readonly depthMillimeters: number;
  readonly feedMillimetersPerMinute: number;
}>;
export type MillingRemovalRateOutput = Readonly<{
  readonly removalCubicMillimetersPerMinute: number;
}>;

export const calculateMillingRemovalRate = (
  x: MillingRemovalRateInput,
): MillingRemovalRateOutput => {
  if (!Number.isFinite(x.widthMillimeters) || x.widthMillimeters < 0)
    simpleError("widthMillimeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.depthMillimeters) || x.depthMillimeters < 0)
    simpleError("depthMillimeters", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.feedMillimetersPerMinute) ||
    x.feedMillimetersPerMinute < 0
  )
    simpleError(
      "feedMillimetersPerMinute",
      "Provide a finite number at least 0.",
    );
  const removalCubicMillimetersPerMinute =
    x.widthMillimeters * x.depthMillimeters * x.feedMillimetersPerMinute;
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
    widthMillimeters: 10,
    depthMillimeters: 2,
    feedMillimetersPerMinute: 300,
  },
  output: { removalCubicMillimetersPerMinute: 6000 },
} satisfies ToolExample<MillingRemovalRateInput, MillingRemovalRateOutput>;

export const tool = createSimpleTool({
  id: "engineering/milling-removal-rate",
  title: "Milling Removal Rate",
  description:
    "Milling material removal volume per minute from radial engagement, axial depth and table feed.",
  inputs: [
    {
      id: "widthMillimeters",
      kind: "number",
      label: "Width Millimeters",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "depthMillimeters",
      kind: "number",
      label: "Depth Millimeters",
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
    calculateMillingRemovalRate({
      widthMillimeters: input.widthMillimeters as number,
      depthMillimeters: input.depthMillimeters as number,
      feedMillimetersPerMinute: input.feedMillimetersPerMinute as number,
    }),
});
export const millingRemovalRateTool = tool;
export const runMillingRemovalRate = tool.execute;
export default tool;
