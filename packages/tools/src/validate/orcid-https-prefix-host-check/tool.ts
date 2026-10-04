import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly url: string };
export type Output = { readonly valid: boolean; readonly identifier: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { url: { type: "string", maxLength: 8192 } },
  required: ["url"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    valid: { type: "boolean" },
    identifier: { type: "string", maxLength: 8192 },
  },
  required: ["valid", "identifier"],
} as const;
/** Check only the canonical HTTPS ORCID URL host and identifier shape; checksum validation is separate. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { url } = request;
  const compute = (): Output => {
    const r =
      /^https:\/\/orcid\.org\/(\d{4}-\d{4}-\d{4}-\d{3}[\dX])(?![\s\S])/.exec(
        url,
      );
    return { valid: r !== null, identifier: r?.[1] ?? "" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { url: "https://orcid.org/0000-0002-1825-0097" },
  output: { valid: true, identifier: "0000-0002-1825-0097" },
} satisfies ToolExample<Input, Output>;
export const orcidHttpsPrefixHostCheckTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "validate/orcid-https-prefix-host-check",
    title: "ORCID Https Prefix Host Check Tool",
    description:
      "Check only the canonical HTTPS ORCID URL host and identifier shape; checksum validation is separate.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { url: { type: "string", maxLength: 8192 } },
      required: ["url"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        valid: { type: "boolean" },
        identifier: { type: "string", maxLength: 8192 },
      },
      required: ["valid", "identifier"],
    },
    ports: {
      inputs: [
        {
          id: "url",
          label: "Url",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "valid", label: "Valid", valueType: { type: "boolean" } },
        {
          id: "identifier",
          label: "Identifier",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = orcidHttpsPrefixHostCheckTool.execute;
export default orcidHttpsPrefixHostCheckTool;
