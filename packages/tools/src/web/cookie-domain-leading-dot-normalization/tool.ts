import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly domain: string };
export type Output = {
  readonly normalized: string;
  readonly hadLeadingDot: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { domain: { type: "string", maxLength: 8192 } },
  required: ["domain"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    normalized: { type: "string", maxLength: 8192 },
    hadLeadingDot: { type: "boolean" },
  },
  required: ["normalized", "hadLeadingDot"],
} as const;
/** Calculate cookie domain leading dot normalization from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { domain } = request;
  const compute = (): Output => {
    const hadLeadingDot = domain.startsWith(".");
    const hostname = hadLeadingDot ? domain.slice(1) : domain;
    H.domain(
      hostname.length <= 253 &&
        hostname
          .split(".")
          .every((label) =>
            /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?![\s\S])/.test(
              label,
            ),
          ),
      "domain",
      "Use ASCII domain labels of 1 to 63 characters, with an optional single leading dot.",
    );
    return {
      normalized: (hadLeadingDot ? domain.slice(1) : domain).toLowerCase(),
      hadLeadingDot,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { domain: ".Example.COM" },
  output: { normalized: "example.com", hadLeadingDot: true },
} satisfies ToolExample<Input, Output>;
export const cookieDomainLeadingDotNormalizationTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "web/cookie-domain-leading-dot-normalization",
      title: "Cookie Domain Leading Dot Normalization Tool",
      description:
        "Calculate cookie domain leading dot normalization from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { domain: { type: "string", maxLength: 8192 } },
        required: ["domain"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          normalized: { type: "string", maxLength: 8192 },
          hadLeadingDot: { type: "boolean" },
        },
        required: ["normalized", "hadLeadingDot"],
      },
      ports: {
        inputs: [
          {
            id: "domain",
            label: "Domain",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          {
            id: "normalized",
            label: "Normalized",
            valueType: { type: "string" },
          },
          {
            id: "hadLeadingDot",
            label: "Had Leading Dot",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = cookieDomainLeadingDotNormalizationTool.execute;
export default cookieDomainLeadingDotNormalizationTool;
