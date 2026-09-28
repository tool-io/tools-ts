import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly flatWidth: number;
  readonly leftFlap: number;
  readonly rightFlap: number;
  readonly leftGap: number;
  readonly rightGap: number;
};
export type Output = {
  readonly centerPanel: number;
  readonly foldedWidth: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    flatWidth: { type: "number", minimum: 0 },
    leftFlap: { type: "number", minimum: 0 },
    rightFlap: { type: "number", minimum: 0 },
    leftGap: { type: "number", minimum: 0 },
    rightGap: { type: "number", minimum: 0 },
  },
  required: ["flatWidth", "leftFlap", "rightFlap", "leftGap", "rightGap"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    centerPanel: { type: "number" },
    foldedWidth: { type: "number" },
  },
  required: ["centerPanel", "foldedWidth"],
} as const;
/** Flat-width panel budget with explicit hinge gaps; foldedWidth is the maximum planar panel span, excluding stock thickness. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { flatWidth, leftFlap, rightFlap, leftGap, rightGap } = request;
  const compute = (): Output => {
    H.domain(
      flatWidth >= 0 &&
        leftFlap >= 0 &&
        rightFlap >= 0 &&
        leftGap >= 0 &&
        rightGap >= 0 &&
        flatWidth >= leftFlap + rightFlap + leftGap + rightGap,
    );
    return {
      centerPanel: flatWidth - leftFlap - rightFlap - leftGap - rightGap,
      foldedWidth: Math.max(
        flatWidth - leftFlap - rightFlap - leftGap - rightGap,
        leftFlap,
        rightFlap,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    flatWidth: 600,
    leftFlap: 145,
    rightFlap: 145,
    leftGap: 5,
    rightGap: 5,
  },
  output: { centerPanel: 300, foldedWidth: 300 },
} satisfies ToolExample<Input, Output>;
export const printGatefoldCenterPanelRemainderTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "graphic-design/print-gatefold-center-panel-remainder",
    title: "Print Gatefold Center Panel Remainder Tool",
    description:
      "Flat-width panel budget with explicit hinge gaps; foldedWidth is the maximum planar panel span, excluding stock thickness.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        flatWidth: { type: "number", minimum: 0 },
        leftFlap: { type: "number", minimum: 0 },
        rightFlap: { type: "number", minimum: 0 },
        leftGap: { type: "number", minimum: 0 },
        rightGap: { type: "number", minimum: 0 },
      },
      required: ["flatWidth", "leftFlap", "rightFlap", "leftGap", "rightGap"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        centerPanel: { type: "number" },
        foldedWidth: { type: "number" },
      },
      required: ["centerPanel", "foldedWidth"],
    },
    ports: {
      inputs: [
        {
          id: "flatWidth",
          label: "Flat Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "leftFlap",
          label: "Left Flap",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rightFlap",
          label: "Right Flap",
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
          id: "centerPanel",
          label: "Center Panel",
          valueType: { type: "number" },
        },
        {
          id: "foldedWidth",
          label: "Folded Width",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = printGatefoldCenterPanelRemainderTool.execute;
export default printGatefoldCenterPanelRemainderTool;
