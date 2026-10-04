import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly tag: string };
export type Output = {
  readonly privateUse: readonly string[];
  readonly present: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { tag: { type: "string", maxLength: 8192 } },
  required: ["tag"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    privateUse: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    present: { type: "boolean" },
  },
  required: ["privateUse", "present"],
} as const;
/** Compute bcp 47 private use tail token from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { tag } = input;
  const compute = (): Output => {
    domain(/^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*(?![\s\S])/.test(tag));
    const parts = tag.split("-"),
      i = parts.findIndex((x) => x.toLowerCase() === "x");
    if (i >= 0)
      domain(
        i < parts.length - 1 && parts.slice(i + 1).every((x) => x.length <= 8),
      );
    return { privateUse: i < 0 ? [] : parts.slice(i + 1), present: i >= 0 };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { tag: "en-US-x-acme" },
  output: { privateUse: ["acme"], present: true },
} satisfies ToolExample<Input, Output>;
export const bcp47PrivateUseTailTokenTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "validate/bcp47-private-use-tail-token",
  title: "BCP 47 Private Use Tail Token Tool",
  description:
    "Compute bcp 47 private use tail token from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "tag",
        label: "Tag",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      {
        id: "privateUse",
        label: "Private Use",
        valueType: { type: "list", items: { type: "string" } },
      },
      { id: "present", label: "Present", valueType: { type: "boolean" } },
    ],
  },
});
export const run = bcp47PrivateUseTailTokenTool.execute;
export default bcp47PrivateUseTailTokenTool;
