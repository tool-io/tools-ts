import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly frameInnerWidth: number;
  readonly panelWidth: number;
  readonly leftGap: number;
  readonly rightGap: number;
};
export type Output = {
  readonly unallocatedGap: number;
  readonly perSideIfSymmetric: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    frameInnerWidth: { type: "number", minimum: 0 },
    panelWidth: { type: "number", minimum: 0 },
    leftGap: { type: "number", minimum: 0 },
    rightGap: { type: "number", minimum: 0 },
  },
  required: ["frameInnerWidth", "panelWidth", "leftGap", "rightGap"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unallocatedGap: { type: "number" },
    perSideIfSymmetric: { type: "number" },
  },
  required: ["unallocatedGap", "perSideIfSymmetric"],
} as const;
/** Calculate panel frame gap factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { frameInnerWidth, panelWidth, leftGap, rightGap } = request;
  const compute = (): Output => {
    H.domain(
      frameInnerWidth >= 0 && panelWidth >= 0 && leftGap >= 0 && rightGap >= 0,
    );
    return {
      unallocatedGap: frameInnerWidth - panelWidth - leftGap - rightGap,
      perSideIfSymmetric: (frameInnerWidth - panelWidth) / 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { frameInnerWidth: 20, panelWidth: 16, leftGap: 1, rightGap: 1 },
  output: { unallocatedGap: 2, perSideIfSymmetric: 2 },
} satisfies ToolExample<Input, Output>;
export const panelFrameGapFactorTool = H.defineSchemaCalculation<Input, Output>(
  {
    ...{
      id: "visual-arts/panel-frame-gap-factor",
      title: "Panel Frame Gap Factor Tool",
      description:
        "Calculate panel frame gap factor from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          frameInnerWidth: { type: "number", minimum: 0 },
          panelWidth: { type: "number", minimum: 0 },
          leftGap: { type: "number", minimum: 0 },
          rightGap: { type: "number", minimum: 0 },
        },
        required: ["frameInnerWidth", "panelWidth", "leftGap", "rightGap"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          unallocatedGap: { type: "number" },
          perSideIfSymmetric: { type: "number" },
        },
        required: ["unallocatedGap", "perSideIfSymmetric"],
      },
      ports: {
        inputs: [
          {
            id: "frameInnerWidth",
            label: "Frame Inner Width",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "panelWidth",
            label: "Panel Width",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "leftGap",
            label: "Left Gap",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "rightGap",
            label: "Right Gap",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "unallocatedGap",
            label: "Unallocated Gap",
            valueType: { type: "number" },
          },
          {
            id: "perSideIfSymmetric",
            label: "Per Side If Symmetric",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  },
);
export const run = panelFrameGapFactorTool.execute;
export default panelFrameGapFactorTool;
