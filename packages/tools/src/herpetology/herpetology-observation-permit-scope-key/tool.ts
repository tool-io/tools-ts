import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observationId: string;
  readonly permitId: string;
  readonly suppliedScope: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observationId: { type: "string", maxLength: 8192, minLength: 1 },
    permitId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedScope: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["observationId", "permitId", "suppliedScope"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve explicit herpetology permit-scope metadata without granting permission or interpreting regulations. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observationId, permitId, suppliedScope } = request;
  const compute = (): Output => {
    H.domain(observationId.length > 0, "observationId");
    H.domain(permitId.length > 0, "permitId");
    H.domain(suppliedScope.length > 0, "suppliedScope");
    return { token: JSON.stringify([observationId, permitId, suppliedScope]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    observationId: "O17",
    permitId: "P4",
    suppliedScope: "public observation",
  },
  output: { token: '["O17","P4","public observation"]' },
} satisfies ToolExample<Input, Output>;
export const herpetologyObservationPermitScopeKeyTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "herpetology/herpetology-observation-permit-scope-key",
      title: "Herpetology Observation Permit Scope Key Tool",
      description:
        "Preserve explicit herpetology permit-scope metadata without granting permission or interpreting regulations.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          observationId: { type: "string", maxLength: 8192, minLength: 1 },
          permitId: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedScope: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["observationId", "permitId", "suppliedScope"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { token: { type: "string", maxLength: 8192 } },
        required: ["token"],
      },
      ports: {
        inputs: [
          {
            id: "observationId",
            label: "Observation Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "permitId",
            label: "Permit Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "suppliedScope",
            label: "Supplied Scope",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "token", label: "Token", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = herpetologyObservationPermitScopeKeyTool.execute;
export default herpetologyObservationPermitScopeKeyTool;
