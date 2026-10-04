import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
import { simpleError } from "../../core/simple.js";
import { parseUrl, type PortableUrl } from "../../core/url.js";
export type Input = { readonly firstUrl: string; readonly secondUrl: string };
export type Output = {
  readonly equivalent: boolean;
  readonly firstOrigin: string;
  readonly secondOrigin: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstUrl: { type: "string", maxLength: 8192 },
    secondUrl: { type: "string", maxLength: 8192 },
  },
  required: ["firstUrl", "secondUrl"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    equivalent: { type: "boolean" },
    firstOrigin: { type: "string", maxLength: 8192 },
    secondOrigin: { type: "string", maxLength: 8192 },
  },
  required: ["equivalent", "firstOrigin", "secondOrigin"],
} as const;
/** Compare normalized HTTP(S) origin tuples including default-port normalization. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstUrl, secondUrl } = request;
  const compute = (): Output => {
    const parse = (s: string): PortableUrl => {
      try {
        return parseUrl(s);
      } catch {
        return simpleError(
          "url",
          "Enter an absolute HTTP or HTTPS URL.",
          "invalid_url",
        );
      }
    };
    const a = parse(firstUrl),
      b = parse(secondUrl);
    H.domain(
      ["http:", "https:"].includes(a.protocol) &&
        ["http:", "https:"].includes(b.protocol),
    );
    return {
      equivalent: a.origin === b.origin,
      firstOrigin: a.origin,
      secondOrigin: b.origin,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstUrl: "https://EXAMPLE.org:443/a",
    secondUrl: "https://example.org/b",
  },
  output: {
    equivalent: true,
    firstOrigin: "https://example.org",
    secondOrigin: "https://example.org",
  },
} satisfies ToolExample<Input, Output>;
export const originPortEquivalenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "web/origin-port-equivalence",
    title: "Origin Port Equivalence Tool",
    description:
      "Compare normalized HTTP(S) origin tuples including default-port normalization.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstUrl: { type: "string", maxLength: 8192 },
        secondUrl: { type: "string", maxLength: 8192 },
      },
      required: ["firstUrl", "secondUrl"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        equivalent: { type: "boolean" },
        firstOrigin: { type: "string", maxLength: 8192 },
        secondOrigin: { type: "string", maxLength: 8192 },
      },
      required: ["equivalent", "firstOrigin", "secondOrigin"],
    },
    ports: {
      inputs: [
        {
          id: "firstUrl",
          label: "First Url",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "secondUrl",
          label: "Second Url",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "equivalent",
          label: "Equivalent",
          valueType: { type: "boolean" },
        },
        {
          id: "firstOrigin",
          label: "First Origin",
          valueType: { type: "string" },
        },
        {
          id: "secondOrigin",
          label: "Second Origin",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = originPortEquivalenceTool.execute;
export default originPortEquivalenceTool;
