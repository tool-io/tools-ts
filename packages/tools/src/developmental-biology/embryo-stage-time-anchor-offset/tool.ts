import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedTime: number;
  readonly anchorTime: number;
  readonly rate: number;
};
export type Output = { readonly offset: number; readonly scaledOffset: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedTime: { type: "number" },
    anchorTime: { type: "number" },
    rate: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["observedTime", "anchorTime", "rate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { offset: { type: "number" }, scaledOffset: { type: "number" } },
  required: ["offset", "scaledOffset"],
} as const;
/** Relative time from a caller-supplied developmental-stage anchor, without assigning a biological stage. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observedTime, anchorTime, rate } = request;
  const compute = (): Output => {
    H.positive(rate);
    return {
      offset: observedTime - anchorTime,
      scaledOffset: (observedTime - anchorTime) * rate,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observedTime: 30, anchorTime: 24, rate: 2 },
  output: { offset: 6, scaledOffset: 12 },
} satisfies ToolExample<Input, Output>;
export const embryoStageTimeAnchorOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "developmental-biology/embryo-stage-time-anchor-offset",
    title: "Embryo Stage Time Anchor Offset Tool",
    description:
      "Relative time from a caller-supplied developmental-stage anchor, without assigning a biological stage.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedTime: { type: "number" },
        anchorTime: { type: "number" },
        rate: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["observedTime", "anchorTime", "rate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        offset: { type: "number" },
        scaledOffset: { type: "number" },
      },
      required: ["offset", "scaledOffset"],
    },
    ports: {
      inputs: [
        {
          id: "observedTime",
          label: "Observed Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "anchorTime",
          label: "Anchor Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rate",
          label: "Rate",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "offset", label: "Offset", valueType: { type: "number" } },
        {
          id: "scaledOffset",
          label: "Scaled Offset",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = embryoStageTimeAnchorOffsetTool.execute;
export default embryoStageTimeAnchorOffsetTool;
