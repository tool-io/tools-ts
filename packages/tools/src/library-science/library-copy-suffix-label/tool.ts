import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly shelfmark: string; readonly copyNumber: number };
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    shelfmark: { type: "string", maxLength: 8192 },
    copyNumber: { type: "integer", minimum: 1 },
  },
  required: ["shelfmark", "copyNumber"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Append a positive copy-number suffix to a literal shelfmark under an explicit c.N display convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { shelfmark, copyNumber } = request;
  const compute = (): Output => {
    H.domain(shelfmark.length > 0, "shelfmark");
    (H.domain(
      Number.isSafeInteger(copyNumber) &&
        copyNumber >= 1 &&
        copyNumber <= Number.MAX_SAFE_INTEGER,
      "copyNumber",
    ),
      copyNumber);
    return { label: shelfmark + " c." + copyNumber };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { shelfmark: "QA76.9.A1", copyNumber: 2 },
  output: { label: "QA76.9.A1 c.2" },
} satisfies ToolExample<Input, Output>;
export const libraryCopySuffixLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "library-science/library-copy-suffix-label",
    title: "Library Copy Suffix Label Tool",
    description:
      "Append a positive copy-number suffix to a literal shelfmark under an explicit c.N display convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        shelfmark: { type: "string", maxLength: 8192 },
        copyNumber: { type: "integer", minimum: 1 },
      },
      required: ["shelfmark", "copyNumber"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "shelfmark",
          label: "Shelfmark",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "copyNumber",
          label: "Copy Number",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = libraryCopySuffixLabelTool.execute;
export default libraryCopySuffixLabelTool;
