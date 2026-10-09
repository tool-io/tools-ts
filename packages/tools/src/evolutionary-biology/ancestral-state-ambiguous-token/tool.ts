import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly candidateStates: readonly string[] };
export type Output = {
  readonly statesJson: string;
  readonly ambiguous: boolean;
  readonly unknown: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    candidateStates: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["candidateStates"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    statesJson: { type: "string", maxLength: 8192 },
    ambiguous: { type: "boolean" },
    unknown: { type: "boolean" },
  },
  required: ["statesJson", "ambiguous", "unknown"],
} as const;
/** Serialize distinct explicitly supplied ancestral-state candidates and distinguish ambiguity from an empty unknown list without reconstructing ancestors. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { candidateStates } = request;
  const compute = (): Output => {
    candidateStates.forEach((value) =>
      H.domain(value.length > 0, "candidateStates"),
    );
    return (() => {
      const states = [...new Set(candidateStates)];
      return {
        statesJson: JSON.stringify(states),
        ambiguous: states.length > 1,
        unknown: states.length === 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { candidateStates: ["A", "G", "A"] },
  output: { statesJson: '["A","G"]', ambiguous: true, unknown: false },
} satisfies ToolExample<Input, Output>;
export const ancestralStateAmbiguousTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "evolutionary-biology/ancestral-state-ambiguous-token",
    title: "Ancestral State Ambiguous Token Tool",
    description:
      "Serialize distinct explicitly supplied ancestral-state candidates and distinguish ambiguity from an empty unknown list without reconstructing ancestors.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        candidateStates: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["candidateStates"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        statesJson: { type: "string", maxLength: 8192 },
        ambiguous: { type: "boolean" },
        unknown: { type: "boolean" },
      },
      required: ["statesJson", "ambiguous", "unknown"],
    },
    ports: {
      inputs: [
        {
          id: "candidateStates",
          label: "Candidate States",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "statesJson",
          label: "States Json",
          valueType: { type: "string" },
        },
        { id: "ambiguous", label: "Ambiguous", valueType: { type: "boolean" } },
        { id: "unknown", label: "Unknown", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = ancestralStateAmbiguousTokenTool.execute;
export default ancestralStateAmbiguousTokenTool;
