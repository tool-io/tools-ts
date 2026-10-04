import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly prefix: string };
export type Output = {
  readonly valid: boolean;
  readonly components: readonly string[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { prefix: { type: "string", maxLength: 8192 } },
  required: ["prefix"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    valid: { type: "boolean" },
    components: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["valid", "components"],
} as const;
/** Calculate handle prefix dot component check from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { prefix } = request;
  const compute = (): Output => {
    const components = prefix.split(".");
    return {
      valid:
        components.length > 0 &&
        components.every((x) => /^\d+(?![\s\S])/.test(x)),
      components,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { prefix: "20.500.123" },
  output: { valid: true, components: ["20", "500", "123"] },
} satisfies ToolExample<Input, Output>;
export const handlePrefixDotComponentCheckTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "validate/handle-prefix-dot-component-check",
    title: "Handle Prefix Dot Component Check Tool",
    description:
      "Calculate handle prefix dot component check from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { prefix: { type: "string", maxLength: 8192 } },
      required: ["prefix"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        valid: { type: "boolean" },
        components: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["valid", "components"],
    },
    ports: {
      inputs: [
        {
          id: "prefix",
          label: "Prefix",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "valid", label: "Valid", valueType: { type: "boolean" } },
        {
          id: "components",
          label: "Components",
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
    },
  },
  calculate,
});
export const run = handlePrefixDotComponentCheckTool.execute;
export default handlePrefixDotComponentCheckTool;
