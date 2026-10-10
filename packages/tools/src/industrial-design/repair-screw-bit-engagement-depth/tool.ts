import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly availableRecessDepth: number;
  readonly bitInsertionDepth: number;
};
export type Output = {
  readonly engagedDepth: number;
  readonly unusedRecessDepth: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    availableRecessDepth: { type: "number", minimum: 0 },
    bitInsertionDepth: { type: "number", minimum: 0 },
  },
  required: ["availableRecessDepth", "bitInsertionDepth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    engagedDepth: { type: "number" },
    unusedRecessDepth: { type: "number" },
  },
  required: ["engagedDepth", "unusedRecessDepth"],
} as const;
/** Compare explicit one-axis recess and insertion depths without determining bit compatibility or torque capacity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { availableRecessDepth, bitInsertionDepth } = request;
  const compute = (): Output => {
    H.domain(
      availableRecessDepth >= 0 && bitInsertionDepth >= 0,
      "availableRecessDepth",
    );
    return {
      engagedDepth: Math.min(availableRecessDepth, bitInsertionDepth),
      unusedRecessDepth: Math.max(0, availableRecessDepth - bitInsertionDepth),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { availableRecessDepth: 5, bitInsertionDepth: 3 },
  output: { engagedDepth: 3, unusedRecessDepth: 2 },
} satisfies ToolExample<Input, Output>;
export const repairScrewBitEngagementDepthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["industrial-design", "industrial design", "arts and design"],
      keywords: ["industrial design", "arts and design"],
    },
    id: "industrial-design/repair-screw-bit-engagement-depth",
    title: "Repair Screw Bit Engagement Depth",
    description:
      "Compare explicit one-axis recess and insertion depths without determining bit compatibility or torque capacity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        availableRecessDepth: { type: "number", minimum: 0 },
        bitInsertionDepth: { type: "number", minimum: 0 },
      },
      required: ["availableRecessDepth", "bitInsertionDepth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        engagedDepth: { type: "number" },
        unusedRecessDepth: { type: "number" },
      },
      required: ["engagedDepth", "unusedRecessDepth"],
    },
    ports: {
      inputs: [
        {
          id: "availableRecessDepth",
          label: "Available Recess Depth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "bitInsertionDepth",
          label: "Bit Insertion Depth",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "engagedDepth",
          label: "Engaged Depth",
          valueType: { type: "number" },
        },
        {
          id: "unusedRecessDepth",
          label: "Unused Recess Depth",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = repairScrewBitEngagementDepthTool.execute;
export default repairScrewBitEngagementDepthTool;
