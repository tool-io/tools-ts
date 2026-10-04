import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly digits: string;
  readonly boundaries: readonly number[];
};
export type Output = { readonly text: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    digits: { type: "string", maxLength: 8192 },
    boundaries: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["digits", "boundaries"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { text: { type: "string", maxLength: 8192 } },
  required: ["text"],
} as const;
/** Apply caller-supplied ISBN separator positions; assignment ranges and checksum are not inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { digits, boundaries } = request;
  const compute = (): Output => {
    H.domain(
      /^\d{13}(?![\s\S])/.test(digits) &&
        boundaries.every(
          (x, i) =>
            x > 0 && x < digits.length && (i === 0 || x > boundaries[i - 1]),
        ),
    );
    let start = 0;
    const p = boundaries.map((end) => {
      const s = digits.slice(start, end);
      start = end;
      return s;
    });
    p.push(digits.slice(start));
    return { text: p.join("-") };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { digits: "9780306406157", boundaries: [3, 4, 7, 12] },
  output: { text: "978-0-306-40615-7" },
} satisfies ToolExample<Input, Output>;
export const isbnHyphenationSuppliedBoundariesTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "validate/isbn-hyphenation-supplied-boundaries",
    title: "ISBN Hyphenation Supplied Boundaries Tool",
    description:
      "Apply caller-supplied ISBN separator positions; assignment ranges and checksum are not inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        digits: { type: "string", maxLength: 8192 },
        boundaries: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
      },
      required: ["digits", "boundaries"],
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
          id: "digits",
          label: "Digits",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "boundaries",
          label: "Boundaries",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
      outputs: [{ id: "text", label: "Text", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = isbnHyphenationSuppliedBoundariesTool.execute;
export default isbnHyphenationSuppliedBoundariesTool;
