import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly left: number;
  readonly right: number;
  readonly leftHalfwidth: number;
  readonly rightHalfwidth: number;
};
export type Output = {
  readonly signedGap: number;
  readonly lowerGap: number;
  readonly upperGap: number;
  readonly relativeGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    left: { type: "number", exclusiveMinimum: 0 },
    right: { type: "number", exclusiveMinimum: 0 },
    leftHalfwidth: { type: "number", minimum: 0 },
    rightHalfwidth: { type: "number", minimum: 0 },
  },
  required: ["left", "right", "leftHalfwidth", "rightHalfwidth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signedGap: { type: "number" },
    lowerGap: { type: "number" },
    upperGap: { type: "number" },
    relativeGap: { type: "number" },
  },
  required: ["signedGap", "lowerGap", "upperGap", "relativeGap"],
} as const;
/** Compare supplied research foot lengths with independent bounded measurement errors. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { left, right, leftHalfwidth, rightHalfwidth } = request;
  const compute = (): Output => {
    H.domain(
      left > 0 && right > 0 && leftHalfwidth >= 0 && rightHalfwidth >= 0,
    );
    return {
      signedGap: left - right,
      lowerGap: left - right - leftHalfwidth - rightHalfwidth,
      upperGap: left - right + leftHalfwidth + rightHalfwidth,
      relativeGap: (2 * (left - right)) / (left + right),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { left: 250, right: 248, leftHalfwidth: 1, rightHalfwidth: 1 },
  output: {
    signedGap: 2,
    lowerGap: 0,
    upperGap: 4,
    relativeGap: 0.008032128514056224,
  },
} satisfies ToolExample<Input, Output>;
export const podiatryResearchLeftRightLengthGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "podiatry/podiatry-research-left-right-length-gap",
    title: "Podiatry Research Left Right Length Gap Tool",
    description:
      "Compare supplied research foot lengths with independent bounded measurement errors.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        left: { type: "number", exclusiveMinimum: 0 },
        right: { type: "number", exclusiveMinimum: 0 },
        leftHalfwidth: { type: "number", minimum: 0 },
        rightHalfwidth: { type: "number", minimum: 0 },
      },
      required: ["left", "right", "leftHalfwidth", "rightHalfwidth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signedGap: { type: "number" },
        lowerGap: { type: "number" },
        upperGap: { type: "number" },
        relativeGap: { type: "number" },
      },
      required: ["signedGap", "lowerGap", "upperGap", "relativeGap"],
    },
    ports: {
      inputs: [
        {
          id: "left",
          label: "Left",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "right",
          label: "Right",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "leftHalfwidth",
          label: "Left Halfwidth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rightHalfwidth",
          label: "Right Halfwidth",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "signedGap", label: "Signed Gap", valueType: { type: "number" } },
        { id: "lowerGap", label: "Lower Gap", valueType: { type: "number" } },
        { id: "upperGap", label: "Upper Gap", valueType: { type: "number" } },
        {
          id: "relativeGap",
          label: "Relative Gap",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = podiatryResearchLeftRightLengthGapTool.execute;
export default podiatryResearchLeftRightLengthGapTool;
