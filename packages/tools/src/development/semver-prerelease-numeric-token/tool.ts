import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly token: string };
export type Output = {
  readonly numeric: boolean;
  readonly leadingZero: boolean;
  readonly validIdentifier: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    numeric: { type: "boolean" },
    leadingZero: { type: "boolean" },
    validIdentifier: { type: "boolean" },
  },
  required: ["numeric", "leadingZero", "validIdentifier"],
} as const;
/** Inspect one SemVer prerelease identifier; numeric identifiers cannot contain leading zeroes. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { token } = request;
  const compute = (): Output => {
    const numeric = /^\d+(?![\s\S])/.test(token),
      leadingZero = numeric && token.length > 1 && token.startsWith("0"),
      validIdentifier = /^[0-9A-Za-z-]+(?![\s\S])/.test(token) && !leadingZero;
    return { numeric, leadingZero, validIdentifier };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { token: "01" },
  output: { numeric: true, leadingZero: true, validIdentifier: false },
} satisfies ToolExample<Input, Output>;
export const semverPrereleaseNumericTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "development/semver-prerelease-numeric-token",
    title: "SemVer Prerelease Numeric Token Tool",
    description:
      "Inspect one SemVer prerelease identifier; numeric identifiers cannot contain leading zeroes.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        numeric: { type: "boolean" },
        leadingZero: { type: "boolean" },
        validIdentifier: { type: "boolean" },
      },
      required: ["numeric", "leadingZero", "validIdentifier"],
    },
    ports: {
      inputs: [
        {
          id: "token",
          label: "Token",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "numeric", label: "Numeric", valueType: { type: "boolean" } },
        {
          id: "leadingZero",
          label: "Leading Zero",
          valueType: { type: "boolean" },
        },
        {
          id: "validIdentifier",
          label: "Valid Identifier",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = semverPrereleaseNumericTokenTool.execute;
export default semverPrereleaseNumericTokenTool;
