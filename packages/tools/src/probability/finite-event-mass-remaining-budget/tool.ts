import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly knownDisjointMasses: readonly number[] };
export type Output = {
  readonly assignedMass: number;
  readonly remainingMass: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    knownDisjointMasses: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
  },
  required: ["knownDisjointMasses"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    assignedMass: { type: "number" },
    remainingMass: { type: "number" },
  },
  required: ["assignedMass", "remainingMass"],
} as const;
/** Subtract explicitly disjoint assigned probability masses from one without inferring disjointness. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { knownDisjointMasses } = request;
  const compute = (): Output => {
    return (() => {
      knownDisjointMasses.forEach(
        (value) => (
          H.domain(value >= 0 && value <= 1, "knownDisjointMasses"),
          value
        ),
      );
      const assignedMass = knownDisjointMasses.reduce((a, b) => a + b, 0);
      H.domain(assignedMass <= 1, "knownDisjointMasses");
      return { assignedMass, remainingMass: 1 - assignedMass };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { knownDisjointMasses: [0.25, 0.5] },
  output: { assignedMass: 0.75, remainingMass: 0.25 },
} satisfies ToolExample<Input, Output>;
export const finiteEventMassRemainingBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["probability", "mathematics"],
      keywords: ["probability", "mathematics"],
    },
    id: "probability/finite-event-mass-remaining-budget",
    title: "Finite Event Mass Remaining Budget",
    description:
      "Subtract explicitly disjoint assigned probability masses from one without inferring disjointness.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        knownDisjointMasses: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
      },
      required: ["knownDisjointMasses"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        assignedMass: { type: "number" },
        remainingMass: { type: "number" },
      },
      required: ["assignedMass", "remainingMass"],
    },
    ports: {
      inputs: [
        {
          id: "knownDisjointMasses",
          label: "Known Disjoint Masses",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "assignedMass",
          label: "Assigned Mass",
          valueType: { type: "number" },
        },
        {
          id: "remainingMass",
          label: "Remaining Mass",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = finiteEventMassRemainingBudgetTool.execute;
export default finiteEventMassRemainingBudgetTool;
