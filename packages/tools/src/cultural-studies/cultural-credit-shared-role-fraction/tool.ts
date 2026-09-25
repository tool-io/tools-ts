import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly roleWeights: readonly number[];
  readonly peopleSharing: readonly number[];
};
export type Output = { readonly individualCredit: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    roleWeights: { type: "array", maxItems: 256, items: { type: "number" } },
    peopleSharing: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["roleWeights", "peopleSharing"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { individualCredit: { type: "number" } },
  required: ["individualCredit"],
} as const;
/** Sum a person’s supplied role allocations divided by the number sharing each role. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { roleWeights, peopleSharing } = request;
  const compute = (): Output => {
    H.sameLength(roleWeights, peopleSharing);
    H.domain(
      roleWeights.every((x) => x >= 0) && peopleSharing.every((x) => x > 0),
    );
    return {
      individualCredit: roleWeights.reduce(
        (s, x, i) => s + x / peopleSharing[i],
        0,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { roleWeights: [0.6, 0.4], peopleSharing: [2, 4] },
  output: { individualCredit: 0.4 },
} satisfies ToolExample<Input, Output>;
export const culturalCreditSharedRoleFractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cultural-studies/cultural-credit-shared-role-fraction",
    title: "Cultural Credit Shared Role Fraction Tool",
    description:
      "Sum a person’s supplied role allocations divided by the number sharing each role.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        roleWeights: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        peopleSharing: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
      },
      required: ["roleWeights", "peopleSharing"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { individualCredit: { type: "number" } },
      required: ["individualCredit"],
    },
    ports: {
      inputs: [
        {
          id: "roleWeights",
          label: "Role Weights",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "peopleSharing",
          label: "People Sharing",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
      outputs: [
        {
          id: "individualCredit",
          label: "Individual Credit",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = culturalCreditSharedRoleFractionTool.execute;
export default culturalCreditSharedRoleFractionTool;
