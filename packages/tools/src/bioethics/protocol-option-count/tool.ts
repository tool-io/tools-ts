import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly options: readonly string[];
  readonly excludedOptions: readonly string[];
};
export type Output = {
  readonly availableCount: number;
  readonly duplicateOptions: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    options: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    excludedOptions: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["options", "excludedOptions"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    availableCount: { type: "integer" },
    duplicateOptions: { type: "integer" },
  },
  required: ["availableCount", "duplicateOptions"],
} as const;
/** Count distinct supplied protocol options after explicit exclusions without recommending an option. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { options, excludedOptions } = request;
  const compute = (): Output => {
    return {
      availableCount: [...new Set(options)].filter(
        (x) => !excludedOptions.includes(x),
      ).length,
      duplicateOptions: options.length - new Set(options).size,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { options: ["A", "B", "B", "C"], excludedOptions: ["B"] },
  output: { availableCount: 2, duplicateOptions: 1 },
} satisfies ToolExample<Input, Output>;
export const protocolOptionCountTool = H.defineSchemaCalculation<Input, Output>(
  {
    ...{
      id: "bioethics/protocol-option-count",
      title: "Protocol Option Count Tool",
      description:
        "Count distinct supplied protocol options after explicit exclusions without recommending an option.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          options: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          excludedOptions: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
        },
        required: ["options", "excludedOptions"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          availableCount: { type: "integer" },
          duplicateOptions: { type: "integer" },
        },
        required: ["availableCount", "duplicateOptions"],
      },
      ports: {
        inputs: [
          {
            id: "options",
            label: "Options",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "excludedOptions",
            label: "Excluded Options",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
        ],
        outputs: [
          {
            id: "availableCount",
            label: "Available Count",
            valueType: { type: "integer" },
          },
          {
            id: "duplicateOptions",
            label: "Duplicate Options",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  },
);
export const run = protocolOptionCountTool.execute;
export default protocolOptionCountTool;
