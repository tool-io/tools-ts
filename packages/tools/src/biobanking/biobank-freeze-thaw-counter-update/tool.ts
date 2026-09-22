import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previous: number;
  readonly transitions: readonly string[];
  readonly countPartial: boolean;
};
export type Output = { readonly updated: number; readonly added: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previous: { type: "integer", minimum: 0 },
    transitions: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    countPartial: { type: "boolean" },
  },
  required: ["previous", "transitions", "countPartial"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { updated: { type: "integer" }, added: { type: "integer" } },
  required: ["updated", "added"],
} as const;
/** Update a supplied record counter under an explicit complete/partial-cycle policy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { previous, transitions, countPartial } = request;
  const compute = (): Output => {
    H.integer(previous, 0);
    H.domain(
      transitions.every((x) => ["complete", "partial", "none"].includes(x)),
      "transitions",
    );
    const added = transitions.filter(
      (x) => x === "complete" || (countPartial && x === "partial"),
    ).length;
    return { updated: previous + added, added };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    previous: 2,
    transitions: ["complete", "partial", "none"],
    countPartial: false,
  },
  output: { updated: 3, added: 1 },
} satisfies ToolExample<Input, Output>;
export const biobankFreezeThawCounterUpdateTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biobanking/biobank-freeze-thaw-counter-update",
    title: "Biobank Freeze Thaw Counter Update Tool",
    description:
      "Update a supplied record counter under an explicit complete/partial-cycle policy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        previous: { type: "integer", minimum: 0 },
        transitions: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        countPartial: { type: "boolean" },
      },
      required: ["previous", "transitions", "countPartial"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { updated: { type: "integer" }, added: { type: "integer" } },
      required: ["updated", "added"],
    },
    ports: {
      inputs: [
        {
          id: "previous",
          label: "Previous",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "transitions",
          label: "Transitions",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "countPartial",
          label: "Count Partial",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "updated", label: "Updated", valueType: { type: "integer" } },
        { id: "added", label: "Added", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = biobankFreezeThawCounterUpdateTool.execute;
export default biobankFreezeThawCounterUpdateTool;
