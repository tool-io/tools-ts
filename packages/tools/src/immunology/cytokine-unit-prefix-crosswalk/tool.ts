import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly value: number;
  readonly sourcePrefix: string;
  readonly targetPrefix: string;
};
export type Output = { readonly convertedValue: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "number" },
    sourcePrefix: {
      type: "string",
      maxLength: 8192,
      enum: ["nano", "pico", "femto"],
    },
    targetPrefix: {
      type: "string",
      maxLength: 8192,
      enum: ["nano", "pico", "femto"],
    },
  },
  required: ["value", "sourcePrefix", "targetPrefix"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { convertedValue: { type: "number" } },
  required: ["convertedValue"],
} as const;
/** Convert a supplied cytokine value between nano, pico, and femto prefixes while requiring the same underlying quantity and denominator. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { value, sourcePrefix, targetPrefix } = request;
  const compute = (): Output => {
    H.domain(["nano", "pico", "femto"].includes(sourcePrefix), "sourcePrefix");
    H.domain(["nano", "pico", "femto"].includes(targetPrefix), "targetPrefix");
    return {
      convertedValue:
        value *
        10 **
          ((sourcePrefix === "nano"
            ? -9
            : sourcePrefix === "pico"
              ? -12
              : -15) -
            (targetPrefix === "nano"
              ? -9
              : targetPrefix === "pico"
                ? -12
                : -15)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { value: 2, sourcePrefix: "nano", targetPrefix: "pico" },
  output: { convertedValue: 2000 },
} satisfies ToolExample<Input, Output>;
export const cytokineUnitPrefixCrosswalkTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["immunology", "health and medicine"],
      keywords: ["immunology", "health and medicine"],
    },
    id: "immunology/cytokine-unit-prefix-crosswalk",
    title: "Cytokine Unit Prefix Crosswalk",
    description:
      "Convert a supplied cytokine value between nano, pico, and femto prefixes while requiring the same underlying quantity and denominator.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        value: { type: "number" },
        sourcePrefix: {
          type: "string",
          maxLength: 8192,
          enum: ["nano", "pico", "femto"],
        },
        targetPrefix: {
          type: "string",
          maxLength: 8192,
          enum: ["nano", "pico", "femto"],
        },
      },
      required: ["value", "sourcePrefix", "targetPrefix"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { convertedValue: { type: "number" } },
      required: ["convertedValue"],
    },
    ports: {
      inputs: [
        {
          id: "value",
          label: "Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sourcePrefix",
          label: "Source Prefix",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "targetPrefix",
          label: "Target Prefix",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "convertedValue",
          label: "Converted Value",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = cytokineUnitPrefixCrosswalkTool.execute;
export default cytokineUnitPrefixCrosswalkTool;
