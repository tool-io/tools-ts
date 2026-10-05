import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly singleton: boolean; readonly element: string };
export type Output = { readonly notation: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    singleton: { type: "boolean" },
    element: { type: "string", maxLength: 8192 },
  },
  required: ["singleton", "element"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { notation: { type: "string", maxLength: 8192 } },
  required: ["notation"],
} as const;
/** Format either the empty set or a singleton string set using a quoted JSON string to avoid delimiter ambiguity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { singleton, element } = request;
  const compute = (): Output => {
    return { notation: singleton ? "{" + JSON.stringify(element) + "}" : "{}" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { singleton: true, element: "alpha" },
  output: { notation: '{"alpha"}' },
} satisfies ToolExample<Input, Output>;
export const singletonEmptySetBraceFormatterTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "set/singleton-empty-set-brace-formatter",
    title: "Singleton Empty Set Brace Formatter Tool",
    description:
      "Format either the empty set or a singleton string set using a quoted JSON string to avoid delimiter ambiguity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        singleton: { type: "boolean" },
        element: { type: "string", maxLength: 8192 },
      },
      required: ["singleton", "element"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { notation: { type: "string", maxLength: 8192 } },
      required: ["notation"],
    },
    ports: {
      inputs: [
        {
          id: "singleton",
          label: "Singleton",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "element",
          label: "Element",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "notation", label: "Notation", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = singletonEmptySetBraceFormatterTool.execute;
export default singletonEmptySetBraceFormatterTool;
