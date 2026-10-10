import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly availableClearance: number;
  readonly suppliedRequiredClearance: number;
};
export type Output = {
  readonly margin: number;
  readonly meetsSuppliedClearance: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    availableClearance: { type: "number", minimum: 0 },
    suppliedRequiredClearance: { type: "number", minimum: 0 },
  },
  required: ["availableClearance", "suppliedRequiredClearance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    margin: { type: "number" },
    meetsSuppliedClearance: { type: "boolean" },
  },
  required: ["margin", "meetsSuppliedClearance"],
} as const;
/** Compare explicit handle clearance with a supplied requirement without choosing ergonomic or safety standards. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { availableClearance, suppliedRequiredClearance } = request;
  const compute = (): Output => {
    H.domain(
      availableClearance >= 0 && suppliedRequiredClearance >= 0,
      "availableClearance",
    );
    return {
      margin: availableClearance - suppliedRequiredClearance,
      meetsSuppliedClearance: availableClearance >= suppliedRequiredClearance,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { availableClearance: 35, suppliedRequiredClearance: 25 },
  output: { margin: 10, meetsSuppliedClearance: true },
} satisfies ToolExample<Input, Output>;
export const handleFingerClearanceMarginTool = H.defineSchemaCalculation<
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
    id: "industrial-design/handle-finger-clearance-margin",
    title: "Handle Finger Clearance Margin",
    description:
      "Compare explicit handle clearance with a supplied requirement without choosing ergonomic or safety standards.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        availableClearance: { type: "number", minimum: 0 },
        suppliedRequiredClearance: { type: "number", minimum: 0 },
      },
      required: ["availableClearance", "suppliedRequiredClearance"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        margin: { type: "number" },
        meetsSuppliedClearance: { type: "boolean" },
      },
      required: ["margin", "meetsSuppliedClearance"],
    },
    ports: {
      inputs: [
        {
          id: "availableClearance",
          label: "Available Clearance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedRequiredClearance",
          label: "Supplied Required Clearance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "margin", label: "Margin", valueType: { type: "number" } },
        {
          id: "meetsSuppliedClearance",
          label: "Meets Supplied Clearance",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = handleFingerClearanceMarginTool.execute;
export default handleFingerClearanceMarginTool;
