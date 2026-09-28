import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly token: string };
export type Output = {
  readonly hasVersion: boolean;
  readonly hasFragment: boolean;
  readonly versionSeparatorBeforeFragment: boolean;
  readonly canonicalBase: string;
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
    hasVersion: { type: "boolean" },
    hasFragment: { type: "boolean" },
    versionSeparatorBeforeFragment: { type: "boolean" },
    canonicalBase: { type: "string", maxLength: 8192 },
  },
  required: [
    "hasVersion",
    "hasFragment",
    "versionSeparatorBeforeFragment",
    "canonicalBase",
  ],
} as const;
/** Inspect canonical version/fragment separator positions without resolving resources or interpreting fragment text as a version. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { token } = request;
  const compute = (): Output => {
    const pipe = token.indexOf("|"),
      hash = token.indexOf("#");
    return {
      hasVersion: pipe >= 0 && (hash < 0 || pipe < hash),
      hasFragment: hash >= 0,
      versionSeparatorBeforeFragment: pipe >= 0 && hash >= 0 && pipe < hash,
      canonicalBase: token.slice(
        0,
        Math.min(...[pipe, hash, token.length].filter((x) => x >= 0)),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { token: "http://example.org/Plan|1#part" },
  output: {
    hasVersion: true,
    hasFragment: true,
    versionSeparatorBeforeFragment: true,
    canonicalBase: "http://example.org/Plan",
  },
} satisfies ToolExample<Input, Output>;
export const fhirCanonicalFragmentSeparatorFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health-informatics/fhir-canonical-fragment-separator-flag",
    title: "FHIR Canonical Fragment Separator Flag Tool",
    description:
      "Inspect canonical version/fragment separator positions without resolving resources or interpreting fragment text as a version.",
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
        hasVersion: { type: "boolean" },
        hasFragment: { type: "boolean" },
        versionSeparatorBeforeFragment: { type: "boolean" },
        canonicalBase: { type: "string", maxLength: 8192 },
      },
      required: [
        "hasVersion",
        "hasFragment",
        "versionSeparatorBeforeFragment",
        "canonicalBase",
      ],
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
        {
          id: "hasVersion",
          label: "Has Version",
          valueType: { type: "boolean" },
        },
        {
          id: "hasFragment",
          label: "Has Fragment",
          valueType: { type: "boolean" },
        },
        {
          id: "versionSeparatorBeforeFragment",
          label: "Version Separator Before Fragment",
          valueType: { type: "boolean" },
        },
        {
          id: "canonicalBase",
          label: "Canonical Base",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = fhirCanonicalFragmentSeparatorFlagTool.execute;
export default fhirCanonicalFragmentSeparatorFlagTool;
