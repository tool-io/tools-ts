import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly value: string;
  readonly levels: readonly string[];
  readonly fallback: string;
};
export type Output = {
  readonly mapped: string;
  readonly known: boolean;
  readonly index: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "string", maxLength: 8192 },
    levels: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    fallback: { type: "string", maxLength: 8192 },
  },
  required: ["value", "levels", "fallback"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    mapped: { type: "string", maxLength: 8192 },
    known: { type: "boolean" },
    index: { type: "integer" },
  },
  required: ["mapped", "known", "index"],
} as const;
/** Calculate categorical level unseen fallback token from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { value, levels, fallback } = request;
  const compute = (): Output => {
    H.domain(new Set(levels).size === levels.length);
    const index = levels.indexOf(value);
    return { mapped: index < 0 ? fallback : value, known: index >= 0, index };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { value: "C", levels: ["A", "B"], fallback: "UNKNOWN" },
  output: { mapped: "UNKNOWN", known: false, index: -1 },
} satisfies ToolExample<Input, Output>;
export const categoricalLevelUnseenFallbackTokenTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "data-science/categorical-level-unseen-fallback-token",
      title: "Categorical Level Unseen Fallback Token Tool",
      description:
        "Calculate categorical level unseen fallback token from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          value: { type: "string", maxLength: 8192 },
          levels: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          fallback: { type: "string", maxLength: 8192 },
        },
        required: ["value", "levels", "fallback"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          mapped: { type: "string", maxLength: 8192 },
          known: { type: "boolean" },
          index: { type: "integer" },
        },
        required: ["mapped", "known", "index"],
      },
      ports: {
        inputs: [
          {
            id: "value",
            label: "Value",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "levels",
            label: "Levels",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "fallback",
            label: "Fallback",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "mapped", label: "Mapped", valueType: { type: "string" } },
          { id: "known", label: "Known", valueType: { type: "boolean" } },
          { id: "index", label: "Index", valueType: { type: "integer" } },
        ],
      },
    },
    calculate,
  });
export const run = categoricalLevelUnseenFallbackTokenTool.execute;
export default categoricalLevelUnseenFallbackTokenTool;
