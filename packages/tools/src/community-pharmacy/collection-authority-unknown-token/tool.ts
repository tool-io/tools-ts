import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly authorityKnown: boolean;
  readonly authorityGranted: boolean;
  readonly identityKnown: boolean;
};
export type Output = {
  readonly recordedAuthority: boolean;
  readonly unresolved: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    authorityKnown: { type: "boolean" },
    authorityGranted: { type: "boolean" },
    identityKnown: { type: "boolean" },
  },
  required: ["authorityKnown", "authorityGranted", "identityKnown"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedAuthority: { type: "boolean" },
    unresolved: { type: "boolean" },
  },
  required: ["recordedAuthority", "unresolved"],
} as const;
/** Preserve supplied authority and identity verification flags; does not establish legal collection permission. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { authorityKnown, authorityGranted, identityKnown } = request;
  const compute = (): Output => {
    return {
      recordedAuthority: authorityKnown && authorityGranted && identityKnown,
      unresolved: !authorityKnown || !identityKnown,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { authorityKnown: true, authorityGranted: true, identityKnown: false },
  output: { recordedAuthority: false, unresolved: true },
} satisfies ToolExample<Input, Output>;
export const collectionAuthorityUnknownTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "community-pharmacy/collection-authority-unknown-token",
    title: "Collection Authority Unknown Token Tool",
    description:
      "Preserve supplied authority and identity verification flags; does not establish legal collection permission.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        authorityKnown: { type: "boolean" },
        authorityGranted: { type: "boolean" },
        identityKnown: { type: "boolean" },
      },
      required: ["authorityKnown", "authorityGranted", "identityKnown"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedAuthority: { type: "boolean" },
        unresolved: { type: "boolean" },
      },
      required: ["recordedAuthority", "unresolved"],
    },
    ports: {
      inputs: [
        {
          id: "authorityKnown",
          label: "Authority Known",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "authorityGranted",
          label: "Authority Granted",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "identityKnown",
          label: "Identity Known",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "recordedAuthority",
          label: "Recorded Authority",
          valueType: { type: "boolean" },
        },
        {
          id: "unresolved",
          label: "Unresolved",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = collectionAuthorityUnknownTokenTool.execute;
export default collectionAuthorityUnknownTokenTool;
