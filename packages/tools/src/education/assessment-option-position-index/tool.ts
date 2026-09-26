import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly option: string;
  readonly options: readonly string[];
  readonly origin: number;
};
export type Output = { readonly found: boolean; readonly index: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    option: { type: "string", maxLength: 8192 },
    options: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    origin: { type: "integer" },
  },
  required: ["option", "options", "origin"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { found: { type: "boolean" }, index: { type: "integer" } },
  required: ["found", "index"],
} as const;
/** Calculate assessment option position index from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { option, options, origin } = request;
  const compute = (): Output => {
    H.domain(origin === 0 || origin === 1);
    H.domain(new Set(options).size === options.length);
    return {
      found: options.includes(option),
      index: options.includes(option) ? options.indexOf(option) + origin : -1,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { option: "B", options: ["A", "B", "C"], origin: 1 },
  output: { found: true, index: 2 },
} satisfies ToolExample<Input, Output>;
export const assessmentOptionPositionIndexTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "education/assessment-option-position-index",
    title: "Assessment Option Position Index Tool",
    description:
      "Calculate assessment option position index from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        option: { type: "string", maxLength: 8192 },
        options: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        origin: { type: "integer" },
      },
      required: ["option", "options", "origin"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { found: { type: "boolean" }, index: { type: "integer" } },
      required: ["found", "index"],
    },
    ports: {
      inputs: [
        {
          id: "option",
          label: "Option",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "options",
          label: "Options",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "origin",
          label: "Origin",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "found", label: "Found", valueType: { type: "boolean" } },
        { id: "index", label: "Index", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = assessmentOptionPositionIndexTool.execute;
export default assessmentOptionPositionIndexTool;
