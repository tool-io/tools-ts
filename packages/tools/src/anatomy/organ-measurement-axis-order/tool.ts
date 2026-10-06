import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly length: number;
  readonly width: number;
  readonly depth: number;
  readonly outputOrder: string;
};
export type Output = { readonly orderedMeasurements: readonly number[] };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    length: { type: "number", minimum: 0 },
    width: { type: "number", minimum: 0 },
    depth: { type: "number", minimum: 0 },
    outputOrder: {
      type: "string",
      maxLength: 8192,
      enum: ["LWD", "LDW", "WLD", "WDL", "DLW", "DWL"],
    },
  },
  required: ["length", "width", "depth", "outputOrder"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    orderedMeasurements: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
  },
  required: ["orderedMeasurements"],
} as const;
/** Reorder explicit length, width, and depth values under any supplied permutation of L, W, and D without inferring anatomical axes. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { length, width, depth, outputOrder } = request;
  const compute = (): Output => {
    H.domain(length >= 0 && width >= 0 && depth >= 0, "length");
    H.domain(
      ["LWD", "LDW", "WLD", "WDL", "DLW", "DWL"].includes(outputOrder),
      "outputOrder",
    );
    return {
      orderedMeasurements: [...outputOrder].map((key) =>
        key === "L" ? length : key === "W" ? width : depth,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { length: 5, width: 3, depth: 2, outputOrder: "LWD" },
  output: { orderedMeasurements: [5, 3, 2] },
} satisfies ToolExample<Input, Output>;
export const organMeasurementAxisOrderTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["anatomy", "health and medicine"],
      keywords: ["anatomy", "health and medicine"],
    },
    id: "anatomy/organ-measurement-axis-order",
    title: "Organ Measurement Axis Order",
    description:
      "Reorder explicit length, width, and depth values under any supplied permutation of L, W, and D without inferring anatomical axes.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        length: { type: "number", minimum: 0 },
        width: { type: "number", minimum: 0 },
        depth: { type: "number", minimum: 0 },
        outputOrder: {
          type: "string",
          maxLength: 8192,
          enum: ["LWD", "LDW", "WLD", "WDL", "DLW", "DWL"],
        },
      },
      required: ["length", "width", "depth", "outputOrder"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        orderedMeasurements: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
      },
      required: ["orderedMeasurements"],
    },
    ports: {
      inputs: [
        {
          id: "length",
          label: "Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "width",
          label: "Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "depth",
          label: "Depth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "outputOrder",
          label: "Output Order",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "orderedMeasurements",
          label: "Ordered Measurements",
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
    },
  },
  calculate,
});
export const run = organMeasurementAxisOrderTool.execute;
export default organMeasurementAxisOrderTool;
