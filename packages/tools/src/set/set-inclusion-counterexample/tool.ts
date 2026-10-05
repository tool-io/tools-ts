import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly subset: readonly string[];
  readonly superset: readonly string[];
};
export type Output = {
  readonly included: boolean;
  readonly counterexamples: readonly string[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    subset: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    superset: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["subset", "superset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    included: { type: "boolean" },
    counterexamples: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["included", "counterexamples"],
} as const;
/** Return exact string witnesses disproving finite-set inclusion, in the subset's first-occurrence order. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { subset, superset } = request;
  const compute = (): Output => {
    const counterexamples = [...new Set(subset)].filter(
      (v) => !new Set(superset).has(v),
    );
    return { included: counterexamples.length === 0, counterexamples };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { subset: ["a", "b", "b"], superset: ["a", "c"] },
  output: { included: false, counterexamples: ["b"] },
} satisfies ToolExample<Input, Output>;
export const setInclusionCounterexampleTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "set/set-inclusion-counterexample",
    title: "Set Inclusion Counterexample Tool",
    description:
      "Return exact string witnesses disproving finite-set inclusion, in the subset's first-occurrence order.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        subset: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        superset: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["subset", "superset"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        included: { type: "boolean" },
        counterexamples: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["included", "counterexamples"],
    },
    ports: {
      inputs: [
        {
          id: "subset",
          label: "Subset",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "superset",
          label: "Superset",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        { id: "included", label: "Included", valueType: { type: "boolean" } },
        {
          id: "counterexamples",
          label: "Counterexamples",
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
    },
  },
  calculate,
});
export const run = setInclusionCounterexampleTool.execute;
export default setInclusionCounterexampleTool;
