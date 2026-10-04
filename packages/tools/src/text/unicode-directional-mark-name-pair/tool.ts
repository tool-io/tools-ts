import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly scalar: number };
export type Output = { readonly name: string; readonly direction: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { scalar: { type: "integer" } },
  required: ["scalar"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    name: { type: "string", maxLength: 8192 },
    direction: { type: "string", maxLength: 8192 },
  },
  required: ["name", "direction"],
} as const;
/** Calculate unicode directional mark name pair from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { scalar } = request;
  const compute = (): Output => {
    H.codePoint(scalar);
    return {
      name:
        scalar === 8206
          ? "LEFT-TO-RIGHT MARK"
          : scalar === 8207
            ? "RIGHT-TO-LEFT MARK"
            : scalar === 1564
              ? "ARABIC LETTER MARK"
              : "OTHER",
      direction:
        scalar === 8206
          ? "ltr"
          : scalar === 8207 || scalar === 1564
            ? "rtl"
            : "none",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { scalar: 8207 },
  output: { name: "RIGHT-TO-LEFT MARK", direction: "rtl" },
} satisfies ToolExample<Input, Output>;
export const unicodeDirectionalMarkNamePairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "text/unicode-directional-mark-name-pair",
    title: "Unicode Directional Mark Name Pair Tool",
    description:
      "Calculate unicode directional mark name pair from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { scalar: { type: "integer" } },
      required: ["scalar"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        name: { type: "string", maxLength: 8192 },
        direction: { type: "string", maxLength: 8192 },
      },
      required: ["name", "direction"],
    },
    ports: {
      inputs: [
        {
          id: "scalar",
          label: "Scalar",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "name", label: "Name", valueType: { type: "string" } },
        { id: "direction", label: "Direction", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = unicodeDirectionalMarkNamePairTool.execute;
export default unicodeDirectionalMarkNamePairTool;
