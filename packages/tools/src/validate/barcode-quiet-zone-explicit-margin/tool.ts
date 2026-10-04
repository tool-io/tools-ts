import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly left: number;
  readonly right: number;
  readonly moduleWidth: number;
  readonly requiredModules: number;
};
export type Output = {
  readonly leftMargin: number;
  readonly rightMargin: number;
  readonly meetsSuppliedMargins: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    left: { type: "number", minimum: 0 },
    right: { type: "number", minimum: 0 },
    moduleWidth: { type: "number", exclusiveMinimum: 0 },
    requiredModules: { type: "number", minimum: 0 },
  },
  required: ["left", "right", "moduleWidth", "requiredModules"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leftMargin: { type: "number" },
    rightMargin: { type: "number" },
    meetsSuppliedMargins: { type: "boolean" },
  },
  required: ["leftMargin", "rightMargin", "meetsSuppliedMargins"],
} as const;
/** Quiet-zone slack in modules using an explicit supplied requirement, without selecting a barcode standard. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { left, right, moduleWidth, requiredModules } = request;
  const compute = (): Output => {
    H.positive(moduleWidth);
    H.domain(left >= 0 && right >= 0 && requiredModules >= 0);
    return {
      leftMargin: left / moduleWidth - requiredModules,
      rightMargin: right / moduleWidth - requiredModules,
      meetsSuppliedMargins:
        left / moduleWidth >= requiredModules &&
        right / moduleWidth >= requiredModules,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { left: 12, right: 10, moduleWidth: 1, requiredModules: 10 },
  output: { leftMargin: 2, rightMargin: 0, meetsSuppliedMargins: true },
} satisfies ToolExample<Input, Output>;
export const barcodeQuietZoneExplicitMarginTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "validate/barcode-quiet-zone-explicit-margin",
    title: "Barcode Quiet Zone Explicit Margin Tool",
    description:
      "Quiet-zone slack in modules using an explicit supplied requirement, without selecting a barcode standard.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        left: { type: "number", minimum: 0 },
        right: { type: "number", minimum: 0 },
        moduleWidth: { type: "number", exclusiveMinimum: 0 },
        requiredModules: { type: "number", minimum: 0 },
      },
      required: ["left", "right", "moduleWidth", "requiredModules"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        leftMargin: { type: "number" },
        rightMargin: { type: "number" },
        meetsSuppliedMargins: { type: "boolean" },
      },
      required: ["leftMargin", "rightMargin", "meetsSuppliedMargins"],
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
          id: "moduleWidth",
          label: "Module Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "requiredModules",
          label: "Required Modules",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "leftMargin",
          label: "Left Margin",
          valueType: { type: "number" },
        },
        {
          id: "rightMargin",
          label: "Right Margin",
          valueType: { type: "number" },
        },
        {
          id: "meetsSuppliedMargins",
          label: "Meets Supplied Margins",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = barcodeQuietZoneExplicitMarginTool.execute;
export default barcodeQuietZoneExplicitMarginTool;
