import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FlowLineWidthScalingInput = Readonly<{
  readonly flowValue: number;
  readonly referenceFlow: number;
  readonly referenceWidthMillimeters: number;
}>;
export type FlowLineWidthScalingOutput = Readonly<{
  readonly widthMillimeters: number;
}>;

export const calculateFlowLineWidthScaling = (
  x: FlowLineWidthScalingInput,
): FlowLineWidthScalingOutput => {
  if (!Number.isFinite(x.flowValue) || x.flowValue < 0)
    simpleError("flowValue", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.referenceFlow) || x.referenceFlow <= 0)
    simpleError("referenceFlow", "Provide a finite positive number.");
  if (
    !Number.isFinite(x.referenceWidthMillimeters) ||
    x.referenceWidthMillimeters < 0
  )
    simpleError(
      "referenceWidthMillimeters",
      "Provide a finite nonnegative number.",
    );
  const widthMillimeters =
    (x.referenceWidthMillimeters * x.flowValue) / x.referenceFlow;
  if (!Number.isFinite(widthMillimeters))
    simpleError(
      "widthMillimeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    widthMillimeters: Object.is(widthMillimeters, -0) ? 0 : widthMillimeters,
  };
};

export const example = {
  input: {
    flowValue: 50,
    referenceFlow: 100,
    referenceWidthMillimeters: 2,
  },
  output: { widthMillimeters: 1 },
} satisfies ToolExample<FlowLineWidthScalingInput, FlowLineWidthScalingOutput>;

export const tool = createSimpleTool({
  id: "cartography/flow-line-width-scaling",
  title: "Flow Line Width Scaling",
  description:
    "Line width proportional to flow value relative to a reference flow and reference width.",
  inputs: [
    { id: "flowValue", kind: "number", label: "Flow Value", minimum: 0 },
    {
      id: "referenceFlow",
      kind: "number",
      label: "Reference Flow",
      minimum: 0,
    },
    {
      id: "referenceWidthMillimeters",
      kind: "number",
      label: "Reference Width Millimeters",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "widthMillimeters",
      kind: "number",
      label: "Width Millimeters",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculateFlowLineWidthScaling({
      flowValue: input.flowValue as number,
      referenceFlow: input.referenceFlow as number,
      referenceWidthMillimeters: input.referenceWidthMillimeters as number,
    }),
});
export const flowLineWidthScalingTool = tool;
export const runFlowLineWidthScaling = tool.execute;
export default tool;
