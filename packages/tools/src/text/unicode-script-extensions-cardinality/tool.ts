import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly suppliedScripts: readonly string[];
  readonly unknown: boolean;
};
export type Output = {
  readonly uniqueScripts: readonly string[];
  readonly cardinality: number;
  readonly known: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    suppliedScripts: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    unknown: { type: "boolean" },
  },
  required: ["suppliedScripts", "unknown"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    uniqueScripts: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    cardinality: { type: "integer" },
    known: { type: "boolean" },
  },
  required: ["uniqueScripts", "cardinality", "known"],
} as const;
/** Count caller-supplied Unicode Script_Extensions labels without embedding or inferring a Unicode database. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { suppliedScripts, unknown } = request;
  const compute = (): Output => {
    const uniqueScripts = [...new Set(suppliedScripts)];
    H.domain(uniqueScripts.every((x) => x.length > 0));
    return {
      uniqueScripts,
      cardinality: uniqueScripts.length,
      known: !unknown,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { suppliedScripts: ["Hira", "Kana", "Hira"], unknown: false },
  output: { uniqueScripts: ["Hira", "Kana"], cardinality: 2, known: true },
} satisfies ToolExample<Input, Output>;
export const unicodeScriptExtensionsCardinalityTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "text/unicode-script-extensions-cardinality",
    title: "Unicode Script Extensions Cardinality Tool",
    description:
      "Count caller-supplied Unicode Script_Extensions labels without embedding or inferring a Unicode database.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        suppliedScripts: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        unknown: { type: "boolean" },
      },
      required: ["suppliedScripts", "unknown"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        uniqueScripts: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        cardinality: { type: "integer" },
        known: { type: "boolean" },
      },
      required: ["uniqueScripts", "cardinality", "known"],
    },
    ports: {
      inputs: [
        {
          id: "suppliedScripts",
          label: "Supplied Scripts",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "unknown",
          label: "Unknown",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "uniqueScripts",
          label: "Unique Scripts",
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "cardinality",
          label: "Cardinality",
          valueType: { type: "integer" },
        },
        { id: "known", label: "Known", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = unicodeScriptExtensionsCardinalityTool.execute;
export default unicodeScriptExtensionsCardinalityTool;
