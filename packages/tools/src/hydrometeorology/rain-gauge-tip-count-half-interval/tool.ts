import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly tips: number;
  readonly tipDepth: number;
  readonly startHalfTip: boolean;
  readonly endHalfTip: boolean;
};
export type Output = {
  readonly equivalentTips: number;
  readonly depth: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tips: { type: "integer", minimum: 0 },
    tipDepth: { type: "number", minimum: 0 },
    startHalfTip: { type: "boolean" },
    endHalfTip: { type: "boolean" },
  },
  required: ["tips", "tipDepth", "startHalfTip", "endHalfTip"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { equivalentTips: { type: "number" }, depth: { type: "number" } },
  required: ["equivalentTips", "depth"],
} as const;
/** Apply explicitly supplied half-tip allocation flags; no missing rainfall is estimated. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { tips, tipDepth, startHalfTip, endHalfTip } = request;
  const compute = (): Output => {
    H.integer(tips, 0);
    H.domain(tipDepth >= 0);
    return {
      equivalentTips: tips + (startHalfTip ? 0.5 : 0) + (endHalfTip ? 0.5 : 0),
      depth:
        (tips + (startHalfTip ? 0.5 : 0) + (endHalfTip ? 0.5 : 0)) * tipDepth,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { tips: 10, tipDepth: 0.2, startHalfTip: true, endHalfTip: false },
  output: { equivalentTips: 10.5, depth: 2.1 },
} satisfies ToolExample<Input, Output>;
export const rainGaugeTipCountHalfIntervalTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hydrometeorology/rain-gauge-tip-count-half-interval",
    title: "Rain Gauge Tip Count Half Interval Tool",
    description:
      "Apply explicitly supplied half-tip allocation flags; no missing rainfall is estimated.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        tips: { type: "integer", minimum: 0 },
        tipDepth: { type: "number", minimum: 0 },
        startHalfTip: { type: "boolean" },
        endHalfTip: { type: "boolean" },
      },
      required: ["tips", "tipDepth", "startHalfTip", "endHalfTip"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        equivalentTips: { type: "number" },
        depth: { type: "number" },
      },
      required: ["equivalentTips", "depth"],
    },
    ports: {
      inputs: [
        {
          id: "tips",
          label: "Tips",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "tipDepth",
          label: "Tip Depth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "startHalfTip",
          label: "Start Half Tip",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "endHalfTip",
          label: "End Half Tip",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "equivalentTips",
          label: "Equivalent Tips",
          valueType: { type: "number" },
        },
        { id: "depth", label: "Depth", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = rainGaugeTipCountHalfIntervalTool.execute;
export default rainGaugeTipCountHalfIntervalTool;
