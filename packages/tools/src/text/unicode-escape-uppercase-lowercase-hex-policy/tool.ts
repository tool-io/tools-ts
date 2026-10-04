import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  codePoint,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly point: number; readonly uppercase: boolean };
export type Output = { readonly escape: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { point: { type: "integer" }, uppercase: { type: "boolean" } },
  required: ["point", "uppercase"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { escape: { type: "string", maxLength: 8192 } },
  required: ["escape"],
} as const;
/** Compute unicode escape uppercase lowercase hex policy from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { point, uppercase } = input;
  const compute = (): Output => {
    codePoint(point);
    let h = point.toString(16);
    if (uppercase) h = h.toUpperCase();
    return { escape: "\\u{" + h + "}" };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { point: 128512, uppercase: true },
  output: { escape: "\\u{1F600}" },
} satisfies ToolExample<Input, Output>;
export const unicodeEscapeUppercaseLowercaseHexPolicyTool =
  defineSchemaCalculation<Input, Output>({
    id: "text/unicode-escape-uppercase-lowercase-hex-policy",
    title: "Unicode Escape Uppercase Lowercase Hex Policy Tool",
    description:
      "Compute unicode escape uppercase lowercase hex policy from explicit bounded inputs.",
    calculate,
    inputSchema,
    outputSchema,
    ports: {
      inputs: [
        {
          id: "point",
          label: "Point",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "uppercase",
          label: "Uppercase",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "escape", label: "Escape", valueType: { type: "string" } },
      ],
    },
  });
export const run = unicodeEscapeUppercaseLowercaseHexPolicyTool.execute;
export default unicodeEscapeUppercaseLowercaseHexPolicyTool;
