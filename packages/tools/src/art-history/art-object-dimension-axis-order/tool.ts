import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly axisLabels: readonly string[];
  readonly dimensions: readonly number[];
  readonly requestedOrder: readonly string[];
};
export type Output = { readonly orderedDimensions: readonly number[] };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    axisLabels: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    dimensions: { type: "array", maxItems: 256, items: { type: "number" } },
    requestedOrder: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["axisLabels", "dimensions", "requestedOrder"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    orderedDimensions: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
  },
  required: ["orderedDimensions"],
} as const;
/** Reorder recorded art-object dimensions according to explicit unique axis labels without assuming a catalogue axis convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { axisLabels, dimensions, requestedOrder } = request;
  const compute = (): Output => {
    H.sameLength(axisLabels, dimensions);
    H.sameLength(axisLabels, requestedOrder);
    H.domain(
      new Set(axisLabels).size === axisLabels.length &&
        new Set(requestedOrder).size === requestedOrder.length,
      "axisLabels",
    );
    dimensions.forEach((v) => H.domain(v >= 0, "dimensions"));
    H.domain(
      requestedOrder.every((v) => axisLabels.includes(v)),
      "requestedOrder",
    );
    return {
      orderedDimensions: requestedOrder.map(
        (v) => dimensions[axisLabels.indexOf(v)],
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    axisLabels: ["width", "height", "depth"],
    dimensions: [50, 70, 4],
    requestedOrder: ["height", "width", "depth"],
  },
  output: { orderedDimensions: [70, 50, 4] },
} satisfies ToolExample<Input, Output>;
export const artObjectDimensionAxisOrderTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "art-history/art-object-dimension-axis-order",
    title: "Art Object Dimension Axis Order Tool",
    description:
      "Reorder recorded art-object dimensions according to explicit unique axis labels without assuming a catalogue axis convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        axisLabels: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        dimensions: { type: "array", maxItems: 256, items: { type: "number" } },
        requestedOrder: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["axisLabels", "dimensions", "requestedOrder"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        orderedDimensions: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
      },
      required: ["orderedDimensions"],
    },
    ports: {
      inputs: [
        {
          id: "axisLabels",
          label: "Axis Labels",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "dimensions",
          label: "Dimensions",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "requestedOrder",
          label: "Requested Order",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "orderedDimensions",
          label: "Ordered Dimensions",
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
    },
  },
  calculate,
});
export const run = artObjectDimensionAxisOrderTool.execute;
export default artObjectDimensionAxisOrderTool;
