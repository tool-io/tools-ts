import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly occupancies: readonly number[];
  readonly valences: readonly number[];
  readonly targetCharge: number;
};
export type Output = { readonly charge: number; readonly residual: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    occupancies: { type: "array", maxItems: 256, items: { type: "number" } },
    valences: { type: "array", maxItems: 256, items: { type: "number" } },
    targetCharge: { type: "number" },
  },
  required: ["occupancies", "valences", "targetCharge"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { charge: { type: "number" }, residual: { type: "number" } },
  required: ["charge", "residual"],
} as const;
/** Calculate mineral site valence budget from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { occupancies, valences, targetCharge } = request;
  const compute = (): Output => {
    H.sameLength(occupancies, valences);
    H.domain(occupancies.every((x) => x >= 0));
    return {
      charge: H.dot(occupancies, valences),
      residual: H.dot(occupancies, valences) - targetCharge,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { occupancies: [1, 2], valences: [2, -1], targetCharge: 0 },
  output: { charge: 0, residual: 0 },
} satisfies ToolExample<Input, Output>;
export const mineralSiteValenceBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geochemistry/mineral-site-valence-budget",
    title: "Mineral Site Valence Budget Tool",
    description:
      "Calculate mineral site valence budget from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        occupancies: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        valences: { type: "array", maxItems: 256, items: { type: "number" } },
        targetCharge: { type: "number" },
      },
      required: ["occupancies", "valences", "targetCharge"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { charge: { type: "number" }, residual: { type: "number" } },
      required: ["charge", "residual"],
    },
    ports: {
      inputs: [
        {
          id: "occupancies",
          label: "Occupancies",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "valences",
          label: "Valences",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "targetCharge",
          label: "Target Charge",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "charge", label: "Charge", valueType: { type: "number" } },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = mineralSiteValenceBudgetTool.execute;
export default mineralSiteValenceBudgetTool;
