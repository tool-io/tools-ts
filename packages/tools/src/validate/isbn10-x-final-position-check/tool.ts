import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly compactIsbn: string };
export type Output = {
  readonly layoutValid: boolean;
  readonly xPresent: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { compactIsbn: { type: "string", maxLength: 8192 } },
  required: ["compactIsbn"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    layoutValid: { type: "boolean" },
    xPresent: { type: "boolean" },
  },
  required: ["layoutValid", "xPresent"],
} as const;
/** Check a compact ISBN-10 layout with uppercase X allowed only as the last check character; no checksum validation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { compactIsbn } = request;
  const compute = (): Output => {
    return {
      layoutValid: /^\d{9}[\dX](?![\s\S])/.test(compactIsbn),
      xPresent: compactIsbn.includes("X"),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { compactIsbn: "080442957X" },
  output: { layoutValid: true, xPresent: true },
} satisfies ToolExample<Input, Output>;
export const isbn10XFinalPositionCheckTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "validate/isbn10-x-final-position-check",
    title: "Isbn10 X Final Position Check Tool",
    description:
      "Check a compact ISBN-10 layout with uppercase X allowed only as the last check character; no checksum validation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { compactIsbn: { type: "string", maxLength: 8192 } },
      required: ["compactIsbn"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        layoutValid: { type: "boolean" },
        xPresent: { type: "boolean" },
      },
      required: ["layoutValid", "xPresent"],
    },
    ports: {
      inputs: [
        {
          id: "compactIsbn",
          label: "Compact Isbn",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "layoutValid",
          label: "Layout Valid",
          valueType: { type: "boolean" },
        },
        { id: "xPresent", label: "X Present", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = isbn10XFinalPositionCheckTool.execute;
export default isbn10XFinalPositionCheckTool;
