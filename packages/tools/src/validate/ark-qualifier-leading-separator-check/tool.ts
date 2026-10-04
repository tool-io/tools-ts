import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly qualifier: string };
export type Output = { readonly valid: boolean; readonly kind: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { qualifier: { type: "string", maxLength: 8192 } },
  required: ["qualifier"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    valid: { type: "boolean" },
    kind: { type: "string", maxLength: 8192 },
  },
  required: ["valid", "kind"],
} as const;
/** Calculate ark qualifier leading separator check from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { qualifier } = request;
  const compute = (): Output => {
    const valid =
      qualifier === "" ||
      qualifier.startsWith("/") ||
      qualifier.startsWith(".");
    return {
      valid,
      kind:
        qualifier === ""
          ? "none"
          : qualifier.startsWith("/")
            ? "path"
            : qualifier.startsWith(".")
              ? "variant"
              : "invalid",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { qualifier: ".pdf" },
  output: { valid: true, kind: "variant" },
} satisfies ToolExample<Input, Output>;
export const arkQualifierLeadingSeparatorCheckTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "validate/ark-qualifier-leading-separator-check",
    title: "Ark Qualifier Leading Separator Check Tool",
    description:
      "Calculate ark qualifier leading separator check from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { qualifier: { type: "string", maxLength: 8192 } },
      required: ["qualifier"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        valid: { type: "boolean" },
        kind: { type: "string", maxLength: 8192 },
      },
      required: ["valid", "kind"],
    },
    ports: {
      inputs: [
        {
          id: "qualifier",
          label: "Qualifier",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "valid", label: "Valid", valueType: { type: "boolean" } },
        { id: "kind", label: "Kind", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = arkQualifierLeadingSeparatorCheckTool.execute;
export default arkQualifierLeadingSeparatorCheckTool;
