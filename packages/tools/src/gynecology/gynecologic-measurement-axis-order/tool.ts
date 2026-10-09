import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measurements: readonly number[];
  readonly axisLabels: readonly string[];
  readonly requestedOrder: readonly number[];
};
export type Output = {
  readonly orderedMeasurements: readonly number[];
  readonly orderedLabels: readonly string[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measurements: { type: "array", maxItems: 256, items: { type: "number" } },
    axisLabels: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    requestedOrder: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
  },
  required: ["measurements", "axisLabels", "requestedOrder"],
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
    orderedLabels: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["orderedMeasurements", "orderedLabels"],
} as const;
/** Reorder explicit dimension/axis pairs using a supplied permutation without inferring anatomical orientation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measurements, axisLabels, requestedOrder } = request;
  const compute = (): Output => {
    H.domain(measurements.length === axisLabels.length, "axisLabels");
    H.domain(measurements.length === requestedOrder.length, "requestedOrder");
    H.domain(
      new Set(requestedOrder).size === requestedOrder.length,
      "requestedOrder",
    );
    requestedOrder.forEach(
      (i) => (
        H.domain(
          Number.isSafeInteger(i) && i >= 0 && i <= measurements.length - 1,
          "requestedOrder",
        ),
        i
      ),
    );
    H.domain(
      measurements.every((x) => x >= 0),
      "measurements",
    );
    return {
      orderedMeasurements: requestedOrder.map((i) => measurements[i]),
      orderedLabels: requestedOrder.map((i) => axisLabels[i]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    measurements: [4, 2, 3],
    axisLabels: ["A", "B", "C"],
    requestedOrder: [0, 2, 1],
  },
  output: { orderedMeasurements: [4, 3, 2], orderedLabels: ["A", "C", "B"] },
} satisfies ToolExample<Input, Output>;
export const gynecologicMeasurementAxisOrderTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["gynecology", "health and medicine"],
      keywords: ["gynecology", "health and medicine"],
    },
    id: "gynecology/gynecologic-measurement-axis-order",
    title: "Gynecologic Measurement Axis Order",
    description:
      "Reorder explicit dimension/axis pairs using a supplied permutation without inferring anatomical orientation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measurements: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        axisLabels: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        requestedOrder: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
      },
      required: ["measurements", "axisLabels", "requestedOrder"],
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
        orderedLabels: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["orderedMeasurements", "orderedLabels"],
    },
    ports: {
      inputs: [
        {
          id: "measurements",
          label: "Measurements",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "axisLabels",
          label: "Axis Labels",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "requestedOrder",
          label: "Requested Order",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
      outputs: [
        {
          id: "orderedMeasurements",
          label: "Ordered Measurements",
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "orderedLabels",
          label: "Ordered Labels",
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
    },
  },
  calculate,
});
export const run = gynecologicMeasurementAxisOrderTool.execute;
export default gynecologicMeasurementAxisOrderTool;
