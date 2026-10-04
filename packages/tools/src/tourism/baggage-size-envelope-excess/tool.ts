import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly dimensions: readonly number[];
  readonly suppliedLimits: readonly number[];
};
export type Output = {
  readonly axisExcess: readonly number[];
  readonly exceeds: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dimensions: { type: "array", maxItems: 256, items: { type: "number" } },
    suppliedLimits: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["dimensions", "suppliedLimits"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    axisExcess: { type: "array", maxItems: 256, items: { type: "number" } },
    exceeds: { type: "boolean" },
  },
  required: ["axisExcess", "exceeds"],
} as const;
/** Compare supplied ordered dimensions with explicit axis limits without rotating bags or selecting carrier rules. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { dimensions, suppliedLimits } = request;
  const compute = (): Output => {
    H.sameLength(dimensions, suppliedLimits);
    H.domain(
      dimensions.length > 0 &&
        [...dimensions, ...suppliedLimits].every((x) => x >= 0),
    );
    return {
      axisExcess: dimensions.map((x, i) => Math.max(0, x - suppliedLimits[i])),
      exceeds: dimensions.some((x, i) => x > suppliedLimits[i]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { dimensions: [55, 40, 25], suppliedLimits: [55, 40, 20] },
  output: { axisExcess: [0, 0, 5], exceeds: true },
} satisfies ToolExample<Input, Output>;
export const baggageSizeEnvelopeExcessTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "tourism/baggage-size-envelope-excess",
    title: "Baggage Size Envelope Excess Tool",
    description:
      "Compare supplied ordered dimensions with explicit axis limits without rotating bags or selecting carrier rules.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dimensions: { type: "array", maxItems: 256, items: { type: "number" } },
        suppliedLimits: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
      },
      required: ["dimensions", "suppliedLimits"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        axisExcess: { type: "array", maxItems: 256, items: { type: "number" } },
        exceeds: { type: "boolean" },
      },
      required: ["axisExcess", "exceeds"],
    },
    ports: {
      inputs: [
        {
          id: "dimensions",
          label: "Dimensions",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "suppliedLimits",
          label: "Supplied Limits",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "axisExcess",
          label: "Axis Excess",
          valueType: { type: "list", items: { type: "number" } },
        },
        { id: "exceeds", label: "Exceeds", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = baggageSizeEnvelopeExcessTool.execute;
export default baggageSizeEnvelopeExcessTool;
