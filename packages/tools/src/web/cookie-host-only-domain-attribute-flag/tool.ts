import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly domainAttribute: string };
export type Output = {
  readonly hostOnly: boolean;
  readonly normalizedDomain: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { domainAttribute: { type: "string", maxLength: 8192 } },
  required: ["domainAttribute"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    hostOnly: { type: "boolean" },
    normalizedDomain: { type: "string", maxLength: 8192 },
  },
  required: ["hostOnly", "normalizedDomain"],
} as const;
/** Compute cookie host only domain attribute flag from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { domainAttribute } = input;
  const compute = (): Output => {
    domain(
      domainAttribute === "" ||
        /^\.?[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*(?![\s\S])/.test(domainAttribute),
    );
    return {
      hostOnly: domainAttribute === "",
      normalizedDomain: domainAttribute.replace(/^\./, "").toLowerCase(),
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { domainAttribute: ".Example.com" },
  output: { hostOnly: false, normalizedDomain: "example.com" },
} satisfies ToolExample<Input, Output>;
export const cookieHostOnlyDomainAttributeFlagTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "web/cookie-host-only-domain-attribute-flag",
  title: "Cookie Host Only Domain Attribute Flag Tool",
  description:
    "Compute cookie host only domain attribute flag from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "domainAttribute",
        label: "Domain Attribute",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      { id: "hostOnly", label: "Host Only", valueType: { type: "boolean" } },
      {
        id: "normalizedDomain",
        label: "Normalized Domain",
        valueType: { type: "string" },
      },
    ],
  },
});
export const run = cookieHostOnlyDomainAttributeFlagTool.execute;
export default cookieHostOnlyDomainAttributeFlagTool;
