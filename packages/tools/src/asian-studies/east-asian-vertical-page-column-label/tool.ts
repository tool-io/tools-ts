import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly page: number;
  readonly column: number;
  readonly direction: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    page: { type: "integer", minimum: 1 },
    column: { type: "integer", minimum: 1 },
    direction: {
      type: "string",
      maxLength: 8192,
      enum: ["right-to-left", "left-to-right"],
    },
  },
  required: ["page", "column", "direction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicit vertical-page column coordinate and declared column-order direction without inferring a manuscript layout. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { page, column, direction } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(page) &&
        page >= 1 &&
        page <= Number.MAX_SAFE_INTEGER,
      "page",
    ),
      page);
    (H.domain(
      Number.isSafeInteger(column) &&
        column >= 1 &&
        column <= Number.MAX_SAFE_INTEGER,
      "column",
    ),
      column);
    H.domain(
      ["right-to-left", "left-to-right"].includes(direction),
      "direction",
    );
    return {
      label: "page " + page + ", column " + column + " (" + direction + ")",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { page: 12, column: 3, direction: "right-to-left" },
  output: { label: "page 12, column 3 (right-to-left)" },
} satisfies ToolExample<Input, Output>;
export const eastAsianVerticalPageColumnLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "asian-studies/east-asian-vertical-page-column-label",
    title: "East Asian Vertical Page Column Label Tool",
    description:
      "Label an explicit vertical-page column coordinate and declared column-order direction without inferring a manuscript layout.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        page: { type: "integer", minimum: 1 },
        column: { type: "integer", minimum: 1 },
        direction: {
          type: "string",
          maxLength: 8192,
          enum: ["right-to-left", "left-to-right"],
        },
      },
      required: ["page", "column", "direction"],
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
          id: "page",
          label: "Page",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "column",
          label: "Column",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "direction",
          label: "Direction",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = eastAsianVerticalPageColumnLabelTool.execute;
export default eastAsianVerticalPageColumnLabelTool;
