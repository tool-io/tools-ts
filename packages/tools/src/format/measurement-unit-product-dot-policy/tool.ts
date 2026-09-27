import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly units: readonly string[];
  readonly middleDot: boolean;
};
export type Output = { readonly text: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    units: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    middleDot: { type: "boolean" },
  },
  required: ["units", "middleDot"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { text: { type: "string", maxLength: 8192 } },
  required: ["text"],
} as const;
/** Join explicit atomic unit tokens with middle dots or spaces without interpreting unit algebra. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { units, middleDot } = input;
  const compute = (): Output => {
    H.domain(
      units.length > 0 && units.every((s) => s.length > 0 && !/\s/.test(s)),
    );
    return { text: units.join(middleDot ? "·" : " ") };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { units: ["N", "m"], middleDot: true },
  output: { text: "N·m" },
} satisfies ToolExample<Input, Output>;
export const measurementUnitProductDotPolicyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "format/measurement-unit-product-dot-policy",
    title: "Measurement Unit Product Dot Policy Tool",
    description:
      "Join explicit atomic unit tokens with middle dots or spaces without interpreting unit algebra.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        units: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        middleDot: { type: "boolean" },
      },
      required: ["units", "middleDot"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { text: { type: "string", maxLength: 8192 } },
      required: ["text"],
    },
    ports: {
      inputs: [
        {
          id: "units",
          label: "Units",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "middleDot",
          label: "Middle Dot",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [{ id: "text", label: "Text", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = measurementUnitProductDotPolicyTool.execute;
export default measurementUnitProductDotPolicyTool;
