import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly text: string };
export type Output = { readonly escaped: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { text: { type: "string", maxLength: 8192 } },
  required: ["text"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { escaped: { type: "string", maxLength: 8192 } },
  required: ["escaped"],
} as const;
/** Calculate ninja variable dollar escape from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { text } = input;
  const compute = (): Output => {
    return { escaped: text.replaceAll("$", () => "$$") };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { text: "a$b" },
  output: { escaped: "a$$b" },
} satisfies ToolExample<Input, Output>;
export const ninjaVariableDollarEscapeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "development/ninja-variable-dollar-escape",
    title: "Ninja Variable Dollar Escape Tool",
    description:
      "Calculate ninja variable dollar escape from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { text: { type: "string", maxLength: 8192 } },
      required: ["text"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { escaped: { type: "string", maxLength: 8192 } },
      required: ["escaped"],
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
        { id: "escaped", label: "Escaped", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = ninjaVariableDollarEscapeTool.execute;
export default ninjaVariableDollarEscapeTool;
