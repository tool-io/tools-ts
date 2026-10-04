import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly text: string;
  readonly delimiter: string;
  readonly minimum: number;
};
export type Output = { readonly fence: string; readonly length: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    text: { type: "string", maxLength: 8191 },
    delimiter: { type: "string", maxLength: 8192 },
    minimum: { type: "integer", minimum: 1, maximum: 100 },
  },
  required: ["text", "delimiter", "minimum"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fence: { type: "string", maxLength: 8192 },
    length: { type: "integer" },
  },
  required: ["fence", "length"],
} as const;
/** Choose a uniform delimiter fence longer than every run of that delimiter in the supplied text. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { text, delimiter, minimum } = request;
  const compute = (): Output => {
    H.domain(delimiter === "`" || delimiter === "~");
    H.integer(minimum, 1, 100);
    let longest = 0,
      current = 0;
    for (const c of text) {
      current = c === delimiter ? current + 1 : 0;
      longest = Math.max(longest, current);
    }
    const length = Math.max(minimum, longest + 1);
    return { fence: delimiter.repeat(length), length };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { text: "a``b", delimiter: "`", minimum: 1 },
  output: { fence: "```", length: 3 },
} satisfies ToolExample<Input, Output>;
export const stringLiteralDelimiterMinimumFenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "text/string-literal-delimiter-minimum-fence",
    title: "String Literal Delimiter Minimum Fence Tool",
    description:
      "Choose a uniform delimiter fence longer than every run of that delimiter in the supplied text.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        text: { type: "string", maxLength: 8191 },
        delimiter: { type: "string", maxLength: 8192 },
        minimum: { type: "integer", minimum: 1, maximum: 100 },
      },
      required: ["text", "delimiter", "minimum"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fence: { type: "string", maxLength: 8192 },
        length: { type: "integer" },
      },
      required: ["fence", "length"],
    },
    ports: {
      inputs: [
        {
          id: "text",
          label: "Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "delimiter",
          label: "Delimiter",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "minimum",
          label: "Minimum",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "fence", label: "Fence", valueType: { type: "string" } },
        { id: "length", label: "Length", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = stringLiteralDelimiterMinimumFenceTool.execute;
export default stringLiteralDelimiterMinimumFenceTool;
