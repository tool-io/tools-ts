import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly start: number;
  readonly end: number;
  readonly width: number;
};
export type Output = { readonly numbers: readonly string[] };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    start: { type: "integer", minimum: 0 },
    end: { type: "integer" },
    width: { type: "integer", minimum: 1, maximum: 16 },
  },
  required: ["start", "end", "width"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    numbers: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["numbers"],
} as const;
/** Expand an inclusive nonnegative issue range of at most 256 numbers with a minimum decimal display width. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { start, end, width } = request;
  const compute = (): Output => {
    H.integer(start, 0);
    H.integer(end, start, start + 255);
    H.integer(width, 1, 16);
    return {
      numbers: Array.from({ length: end - start + 1 }, (_, i) =>
        String(start + i).padStart(width, "0"),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { start: 3, end: 5, width: 2 },
  output: { numbers: ["03", "04", "05"] },
} satisfies ToolExample<Input, Output>;
export const serialEnumerationRangeExpanderLimitedTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "library-science/serial-enumeration-range-expander-limited",
      title: "Serial Enumeration Range Expander Limited Tool",
      description:
        "Expand an inclusive nonnegative issue range of at most 256 numbers with a minimum decimal display width.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          start: { type: "integer", minimum: 0 },
          end: { type: "integer" },
          width: { type: "integer", minimum: 1, maximum: 16 },
        },
        required: ["start", "end", "width"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          numbers: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
        },
        required: ["numbers"],
      },
      ports: {
        inputs: [
          {
            id: "start",
            label: "Start",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "end",
            label: "End",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "width",
            label: "Width",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "numbers",
            label: "Numbers",
            valueType: { type: "list", items: { type: "string" } },
          },
        ],
      },
    },
    calculate,
  });
export const run = serialEnumerationRangeExpanderLimitedTool.execute;
export default serialEnumerationRangeExpanderLimitedTool;
