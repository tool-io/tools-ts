import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly leftValue: number;
  readonly rightValue: number;
  readonly rightEndpoint: boolean;
};
export type Output = { readonly endpointValue: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leftValue: { type: "number" },
    rightValue: { type: "number" },
    rightEndpoint: { type: "boolean" },
  },
  required: ["leftValue", "rightValue", "rightEndpoint"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { endpointValue: { type: "number" } },
  required: ["endpointValue"],
} as const;
/** Return the selected endpoint value of a normalized Hermite segment without evaluating interior tangents. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { leftValue, rightValue, rightEndpoint } = request;
  const compute = (): Output => {
    return { endpointValue: rightEndpoint ? rightValue : leftValue };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { leftValue: 2, rightValue: 5, rightEndpoint: true },
  output: { endpointValue: 5 },
} satisfies ToolExample<Input, Output>;
export const normalizedHermiteEndpointValueTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "interpolation/normalized-hermite-endpoint-value",
    title: "Normalized Hermite Endpoint Value Tool",
    description:
      "Return the selected endpoint value of a normalized Hermite segment without evaluating interior tangents.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        leftValue: { type: "number" },
        rightValue: { type: "number" },
        rightEndpoint: { type: "boolean" },
      },
      required: ["leftValue", "rightValue", "rightEndpoint"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { endpointValue: { type: "number" } },
      required: ["endpointValue"],
    },
    ports: {
      inputs: [
        {
          id: "leftValue",
          label: "Left Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rightValue",
          label: "Right Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rightEndpoint",
          label: "Right Endpoint",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "endpointValue",
          label: "Endpoint Value",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = normalizedHermiteEndpointValueTool.execute;
export default normalizedHermiteEndpointValueTool;
