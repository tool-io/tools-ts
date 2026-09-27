import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly numerator: string;
  readonly denominator: string;
  readonly isolate: boolean;
};
export type Output = { readonly text: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    numerator: { type: "string", maxLength: 8192 },
    denominator: { type: "string", maxLength: 8192 },
    isolate: { type: "boolean" },
  },
  required: ["numerator", "denominator", "isolate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { text: { type: "string", maxLength: 8192 } },
  required: ["text"],
} as const;
/** Calculate fraction solidus direction isolation from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { numerator, denominator, isolate } = request;
  const compute = (): Output => {
    H.domain(numerator.length > 0 && denominator.length > 0);
    const text = numerator + "/" + denominator;
    return { text: isolate ? "\u2068" + text + "\u2069" : text };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { numerator: "3", denominator: "4", isolate: true },
  output: { text: "⁨3/4⁩" },
} satisfies ToolExample<Input, Output>;
export const fractionSolidusDirectionIsolationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "format/fraction-solidus-direction-isolation",
    title: "Fraction Solidus Direction Isolation Tool",
    description:
      "Calculate fraction solidus direction isolation from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        numerator: { type: "string", maxLength: 8192 },
        denominator: { type: "string", maxLength: 8192 },
        isolate: { type: "boolean" },
      },
      required: ["numerator", "denominator", "isolate"],
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
          id: "numerator",
          label: "Numerator",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "denominator",
          label: "Denominator",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "isolate",
          label: "Isolate",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [{ id: "text", label: "Text", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = fractionSolidusDirectionIsolationTool.execute;
export default fractionSolidusDirectionIsolationTool;
