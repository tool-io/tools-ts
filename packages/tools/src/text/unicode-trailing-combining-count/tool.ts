import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly text: string };
export type Output = { readonly trailingMarks: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { text: { type: "string", maxLength: 8192 } },
  required: ["text"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { trailingMarks: { type: "integer" } },
  required: ["trailingMarks"],
} as const;
/** Count literal trailing Unicode Mark code points without decomposing precomposed characters. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { text } = request;
  const compute = (): Output => {
    let trailingMarks = 0;
    for (const c of [...text].reverse()) {
      if (!/\p{M}/u.test(c)) break;
      trailingMarks++;
    }
    return { trailingMarks };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { text: "aé̂" },
  output: { trailingMarks: 2 },
} satisfies ToolExample<Input, Output>;
export const unicodeTrailingCombiningCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "text/unicode-trailing-combining-count",
    title: "Unicode Trailing Combining Count Tool",
    description:
      "Count literal trailing Unicode Mark code points without decomposing precomposed characters.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { text: { type: "string", maxLength: 8192 } },
      required: ["text"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { trailingMarks: { type: "integer" } },
      required: ["trailingMarks"],
    },
    ports: {
      inputs: [
        {
          id: "text",
          label: "Text",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "trailingMarks",
          label: "Trailing Marks",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = unicodeTrailingCombiningCountTool.execute;
export default unicodeTrailingCombiningCountTool;
