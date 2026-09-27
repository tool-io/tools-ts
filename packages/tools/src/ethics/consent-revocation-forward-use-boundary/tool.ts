import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly revocationEpoch: number;
  readonly useEpoch: number;
  readonly inclusive: boolean;
};
export type Output = { readonly afterBoundary: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    revocationEpoch: { type: "integer" },
    useEpoch: { type: "integer" },
    inclusive: { type: "boolean" },
  },
  required: ["revocationEpoch", "useEpoch", "inclusive"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { afterBoundary: { type: "boolean" } },
  required: ["afterBoundary"],
} as const;
/** Compare explicit timestamps under a selected boundary convention; no retrospective-use policy is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { revocationEpoch, useEpoch, inclusive } = request;
  const compute = (): Output => {
    return {
      afterBoundary: inclusive
        ? useEpoch >= revocationEpoch
        : useEpoch > revocationEpoch,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { revocationEpoch: 100, useEpoch: 100, inclusive: true },
  output: { afterBoundary: true },
} satisfies ToolExample<Input, Output>;
export const consentRevocationForwardUseBoundaryTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "ethics/consent-revocation-forward-use-boundary",
      title: "Consent Revocation Forward Use Boundary Tool",
      description:
        "Compare explicit timestamps under a selected boundary convention; no retrospective-use policy is inferred.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          revocationEpoch: { type: "integer" },
          useEpoch: { type: "integer" },
          inclusive: { type: "boolean" },
        },
        required: ["revocationEpoch", "useEpoch", "inclusive"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { afterBoundary: { type: "boolean" } },
        required: ["afterBoundary"],
      },
      ports: {
        inputs: [
          {
            id: "revocationEpoch",
            label: "Revocation Epoch",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "useEpoch",
            label: "Use Epoch",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "inclusive",
            label: "Inclusive",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "afterBoundary",
            label: "After Boundary",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = consentRevocationForwardUseBoundaryTool.execute;
export default consentRevocationForwardUseBoundaryTool;
