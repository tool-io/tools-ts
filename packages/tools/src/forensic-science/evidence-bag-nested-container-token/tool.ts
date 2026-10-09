import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly outerContainerId: string;
  readonly innerContainerId: string;
  readonly evidenceId: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    outerContainerId: { type: "string", maxLength: 8192, minLength: 1 },
    innerContainerId: { type: "string", maxLength: 8192, minLength: 1 },
    evidenceId: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["outerContainerId", "innerContainerId", "evidenceId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Encode an ordered supplied outer-container, inner-container and evidence key without asserting chain-of-custody validity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { outerContainerId, innerContainerId, evidenceId } = request;
  const compute = (): Output => {
    H.domain(outerContainerId.length > 0, "outerContainerId");
    H.domain(innerContainerId.length > 0, "innerContainerId");
    H.domain(evidenceId.length > 0, "evidenceId");
    return {
      token: JSON.stringify([outerContainerId, innerContainerId, evidenceId]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { outerContainerId: "B17", innerContainerId: "V4", evidenceId: "E2" },
  output: { token: '["B17","V4","E2"]' },
} satisfies ToolExample<Input, Output>;
export const evidenceBagNestedContainerTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "forensic-science/evidence-bag-nested-container-token",
    title: "Evidence Bag Nested Container Token Tool",
    description:
      "Encode an ordered supplied outer-container, inner-container and evidence key without asserting chain-of-custody validity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        outerContainerId: { type: "string", maxLength: 8192, minLength: 1 },
        innerContainerId: { type: "string", maxLength: 8192, minLength: 1 },
        evidenceId: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["outerContainerId", "innerContainerId", "evidenceId"],
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
          id: "outerContainerId",
          label: "Outer Container Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "innerContainerId",
          label: "Inner Container Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "evidenceId",
          label: "Evidence Id",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = evidenceBagNestedContainerTokenTool.execute;
export default evidenceBagNestedContainerTokenTool;
