import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly change: number; readonly showPlus: boolean };
export type Output = { readonly text: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { change: { type: "number" }, showPlus: { type: "boolean" } },
  required: ["change", "showPlus"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { text: { type: "string", maxLength: 8192 } },
  required: ["text"],
} as const;
/** Format a value already expressed in percent with an optional explicit positive sign. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { change, showPlus } = input;
  const compute = (): Output => {
    return { text: (change > 0 && showPlus ? "+" : "") + change + "%" };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { change: 12.5, showPlus: true },
  output: { text: "+12.5%" },
} satisfies ToolExample<Input, Output>;
export const percentageChangePlusminusStyleTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "format/percentage-change-plusminus-style",
    title: "Percentage Change Plusminus Style Tool",
    description:
      "Format a value already expressed in percent with an optional explicit positive sign.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { change: { type: "number" }, showPlus: { type: "boolean" } },
      required: ["change", "showPlus"],
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
          id: "change",
          label: "Change",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "showPlus",
          label: "Show Plus",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [{ id: "text", label: "Text", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = percentageChangePlusminusStyleTool.execute;
export default percentageChangePlusminusStyleTool;
