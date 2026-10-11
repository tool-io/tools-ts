import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly suppliedNormalizedDot: number;
  readonly clampToUnitInterval: boolean;
};
export type Output = {
  readonly boundedDot: number;
  readonly outsideUnitInterval: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    suppliedNormalizedDot: { type: "number" },
    clampToUnitInterval: { type: "boolean" },
  },
  required: ["suppliedNormalizedDot", "clampToUnitInterval"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    boundedDot: { type: "number" },
    outsideUnitInterval: { type: "boolean" },
  },
  required: ["boundedDot", "outsideUnitInterval"],
} as const;
/** Optionally clamp an explicitly supplied normalized dot product to [-1,1] while retaining an out-of-domain diagnostic. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { suppliedNormalizedDot, clampToUnitInterval } = request;
  const compute = (): Output => {
    return {
      boundedDot: clampToUnitInterval
        ? Math.min(1, Math.max(-1, suppliedNormalizedDot))
        : suppliedNormalizedDot,
      outsideUnitInterval: Math.abs(suppliedNormalizedDot) > 1,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    suppliedNormalizedDot: 1.0000000000000002,
    clampToUnitInterval: true,
  },
  output: { boundedDot: 1, outsideUnitInterval: true },
} satisfies ToolExample<Input, Output>;
export const vectorNormalizedDotDomainClampTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["vector", "mathematics"],
      keywords: ["vector", "mathematics"],
    },
    id: "vector/vector-normalized-dot-domain-clamp",
    title: "Vector Normalized Dot Domain Clamp",
    description:
      "Optionally clamp an explicitly supplied normalized dot product to [-1,1] while retaining an out-of-domain diagnostic.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        suppliedNormalizedDot: { type: "number" },
        clampToUnitInterval: { type: "boolean" },
      },
      required: ["suppliedNormalizedDot", "clampToUnitInterval"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        boundedDot: { type: "number" },
        outsideUnitInterval: { type: "boolean" },
      },
      required: ["boundedDot", "outsideUnitInterval"],
    },
    ports: {
      inputs: [
        {
          id: "suppliedNormalizedDot",
          label: "Supplied Normalized Dot",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "clampToUnitInterval",
          label: "Clamp To Unit Interval",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "boundedDot",
          label: "Bounded Dot",
          valueType: { type: "number" },
        },
        {
          id: "outsideUnitInterval",
          label: "Outside Unit Interval",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = vectorNormalizedDotDomainClampTool.execute;
export default vectorNormalizedDotDomainClampTool;
