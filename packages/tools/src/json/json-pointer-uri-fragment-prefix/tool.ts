import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly pointer: string };
export type Output = { readonly fragmentForm: boolean; readonly body: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { pointer: { type: "string", maxLength: 8192 } },
  required: ["pointer"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fragmentForm: { type: "boolean" },
    body: { type: "string", maxLength: 8192 },
  },
  required: ["fragmentForm", "body"],
} as const;
/** Compute json pointer uri fragment prefix from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { pointer } = input;
  const compute = (): Output => {
    domain(
      pointer === "" || pointer.startsWith("/") || pointer.startsWith("#"),
    );
    return {
      fragmentForm: pointer.startsWith("#"),
      body: pointer.startsWith("#") ? pointer.slice(1) : pointer,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { pointer: "#/a" },
  output: { fragmentForm: true, body: "/a" },
} satisfies ToolExample<Input, Output>;
export const jsonPointerUriFragmentPrefixTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "json/json-pointer-uri-fragment-prefix",
  title: "JSON Pointer URI Fragment Prefix Tool",
  description:
    "Compute json pointer uri fragment prefix from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "pointer",
        label: "Pointer",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      {
        id: "fragmentForm",
        label: "Fragment Form",
        valueType: { type: "boolean" },
      },
      { id: "body", label: "Body", valueType: { type: "string" } },
    ],
  },
});
export const run = jsonPointerUriFragmentPrefixTool.execute;
export default jsonPointerUriFragmentPrefixTool;
