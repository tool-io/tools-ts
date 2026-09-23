import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly available: readonly boolean[];
  readonly required: readonly boolean[];
};
export type Output = {
  readonly requiredCount: number;
  readonly availableRequired: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    available: { type: "array", maxItems: 256, items: { type: "boolean" } },
    required: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["available", "required"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requiredCount: { type: "integer" },
    availableRequired: { type: "integer" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["requiredCount", "availableRequired", "share", "defined"],
} as const;
/** Audit supplied endpoint availability without imputing a composite clinical outcome. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { available, required } = request;
  const compute = (): Output => {
    H.sameLength(available, required);
    return {
      requiredCount: required.filter(Boolean).length,
      availableRequired: available.filter((x, i) => x && required[i]).length,
      share: required.some(Boolean)
        ? available.filter((x, i) => x && required[i]).length /
          required.filter(Boolean).length
        : 0,
      defined: required.some(Boolean),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { available: [true, false, true], required: [true, true, false] },
  output: { requiredCount: 2, availableRequired: 1, share: 0.5, defined: true },
} satisfies ToolExample<Input, Output>;
export const endpointComponentAvailabilityShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biostatistics/endpoint-component-availability-share",
    title: "Endpoint Component Availability Share Tool",
    description:
      "Audit supplied endpoint availability without imputing a composite clinical outcome.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        available: { type: "array", maxItems: 256, items: { type: "boolean" } },
        required: { type: "array", maxItems: 256, items: { type: "boolean" } },
      },
      required: ["available", "required"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requiredCount: { type: "integer" },
        availableRequired: { type: "integer" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["requiredCount", "availableRequired", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "available",
          label: "Available",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "required",
          label: "Required",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "requiredCount",
          label: "Required Count",
          valueType: { type: "integer" },
        },
        {
          id: "availableRequired",
          label: "Available Required",
          valueType: { type: "integer" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = endpointComponentAvailabilityShareTool.execute;
export default endpointComponentAvailabilityShareTool;
