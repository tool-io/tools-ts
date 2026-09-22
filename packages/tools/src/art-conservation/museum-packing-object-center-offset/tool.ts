import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly caseWidth: number;
  readonly objectWidth: number;
  readonly leftPadding: number;
  readonly rightPadding: number;
};
export type Output = {
  readonly availableWidth: number;
  readonly centerOffset: number;
  readonly clearance: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    caseWidth: { type: "number" },
    objectWidth: { type: "number", minimum: 0 },
    leftPadding: { type: "number", minimum: 0 },
    rightPadding: { type: "number", minimum: 0 },
  },
  required: ["caseWidth", "objectWidth", "leftPadding", "rightPadding"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    availableWidth: { type: "number" },
    centerOffset: { type: "number" },
    clearance: { type: "number" },
  },
  required: ["availableWidth", "centerOffset", "clearance"],
} as const;
/** Object centered within the padded interior; offset is relative to case center, positive toward the right. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { caseWidth, objectWidth, leftPadding, rightPadding } = request;
  const compute = (): Output => {
    H.domain(
      objectWidth >= 0 &&
        leftPadding >= 0 &&
        rightPadding >= 0 &&
        caseWidth >= leftPadding + rightPadding,
    );
    return {
      availableWidth: caseWidth - leftPadding - rightPadding,
      centerOffset: (leftPadding - rightPadding) / 2,
      clearance: caseWidth - leftPadding - rightPadding - objectWidth,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { caseWidth: 100, objectWidth: 60, leftPadding: 10, rightPadding: 20 },
  output: { availableWidth: 70, centerOffset: -5, clearance: 10 },
} satisfies ToolExample<Input, Output>;
export const museumPackingObjectCenterOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "art-conservation/museum-packing-object-center-offset",
    title: "Museum Packing Object Center Offset Tool",
    description:
      "Object centered within the padded interior; offset is relative to case center, positive toward the right.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        caseWidth: { type: "number" },
        objectWidth: { type: "number", minimum: 0 },
        leftPadding: { type: "number", minimum: 0 },
        rightPadding: { type: "number", minimum: 0 },
      },
      required: ["caseWidth", "objectWidth", "leftPadding", "rightPadding"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        availableWidth: { type: "number" },
        centerOffset: { type: "number" },
        clearance: { type: "number" },
      },
      required: ["availableWidth", "centerOffset", "clearance"],
    },
    ports: {
      inputs: [
        {
          id: "caseWidth",
          label: "Case Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "objectWidth",
          label: "Object Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "leftPadding",
          label: "Left Padding",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rightPadding",
          label: "Right Padding",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "availableWidth",
          label: "Available Width",
          valueType: { type: "number" },
        },
        {
          id: "centerOffset",
          label: "Center Offset",
          valueType: { type: "number" },
        },
        { id: "clearance", label: "Clearance", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = museumPackingObjectCenterOffsetTool.execute;
export default museumPackingObjectCenterOffsetTool;
