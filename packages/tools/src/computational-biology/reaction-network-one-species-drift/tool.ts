import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly stoichiometricChanges: readonly number[];
  readonly propensities: readonly number[];
};
export type Output = { readonly drift: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stoichiometricChanges: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
    propensities: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["stoichiometricChanges", "propensities"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { drift: { type: "number" } },
  required: ["drift"],
} as const;
/** Expected instantaneous count drift from explicit reaction propensities; no random trajectory is sampled. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { stoichiometricChanges, propensities } = request;
  const compute = (): Output => {
    H.sameLength(stoichiometricChanges, propensities);
    H.domain(propensities.every((x) => x >= 0));
    return { drift: H.dot(stoichiometricChanges, propensities) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { stoichiometricChanges: [-1, 2], propensities: [3, 4] },
  output: { drift: 5 },
} satisfies ToolExample<Input, Output>;
export const reactionNetworkOneSpeciesDriftTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "computational-biology/reaction-network-one-species-drift",
    title: "Reaction Network One Species Drift Tool",
    description:
      "Expected instantaneous count drift from explicit reaction propensities; no random trajectory is sampled.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        stoichiometricChanges: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        propensities: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
      },
      required: ["stoichiometricChanges", "propensities"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { drift: { type: "number" } },
      required: ["drift"],
    },
    ports: {
      inputs: [
        {
          id: "stoichiometricChanges",
          label: "Stoichiometric Changes",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "propensities",
          label: "Propensities",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [{ id: "drift", label: "Drift", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = reactionNetworkOneSpeciesDriftTool.execute;
export default reactionNetworkOneSpeciesDriftTool;
