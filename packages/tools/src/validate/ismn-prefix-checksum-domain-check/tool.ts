import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly identifier: string };
export type Output = {
  readonly prefixValid: boolean;
  readonly checksumValid: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { identifier: { type: "string", maxLength: 8192 } },
  required: ["identifier"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    prefixValid: { type: "boolean" },
    checksumValid: { type: "boolean" },
  },
  required: ["prefixValid", "checksumValid"],
} as const;
/** Calculate ismn prefix checksum domain check from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { identifier } = request;
  const compute = (): Output => {
    const prefixValid = /^9790\d{9}(?![\s\S])/.test(identifier);
    if (!prefixValid) return { prefixValid: false, checksumValid: false };
    const sum = Array.from(
      identifier,
      (x, i) => Number(x) * (i % 2 === 0 ? 1 : 3),
    ).reduce((a, b) => a + b, 0);
    return { prefixValid, checksumValid: sum % 10 === 0 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { identifier: "9790060115615" },
  output: { prefixValid: true, checksumValid: true },
} satisfies ToolExample<Input, Output>;
export const ismnPrefixChecksumDomainCheckTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "validate/ismn-prefix-checksum-domain-check",
    title: "Ismn Prefix Checksum Domain Check Tool",
    description:
      "Calculate ismn prefix checksum domain check from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { identifier: { type: "string", maxLength: 8192 } },
      required: ["identifier"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        prefixValid: { type: "boolean" },
        checksumValid: { type: "boolean" },
      },
      required: ["prefixValid", "checksumValid"],
    },
    ports: {
      inputs: [
        {
          id: "identifier",
          label: "Identifier",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "prefixValid",
          label: "Prefix Valid",
          valueType: { type: "boolean" },
        },
        {
          id: "checksumValid",
          label: "Checksum Valid",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = ismnPrefixChecksumDomainCheckTool.execute;
export default ismnPrefixChecksumDomainCheckTool;
