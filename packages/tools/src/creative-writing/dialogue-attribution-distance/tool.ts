import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly dialogueEnd: number;
  readonly attributionStart: number;
};
export type Output = { readonly distance: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dialogueEnd: { type: "integer", minimum: 0 },
    attributionStart: { type: "integer", minimum: 0 },
  },
  required: ["dialogueEnd", "attributionStart"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { distance: { type: "integer" } },
  required: ["distance"],
} as const;
/** Compare supplied text offsets without identifying dialogue or attributing speakers. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { dialogueEnd, attributionStart } = request;
  const compute = (): Output => {
    H.integer(dialogueEnd, 0);
    H.integer(attributionStart, 0);
    return { distance: attributionStart - dialogueEnd };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { dialogueEnd: 20, attributionStart: 25 },
  output: { distance: 5 },
} satisfies ToolExample<Input, Output>;
export const dialogueAttributionDistanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "creative-writing/dialogue-attribution-distance",
    title: "Dialogue Attribution Distance Tool",
    description:
      "Compare supplied text offsets without identifying dialogue or attributing speakers.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dialogueEnd: { type: "integer", minimum: 0 },
        attributionStart: { type: "integer", minimum: 0 },
      },
      required: ["dialogueEnd", "attributionStart"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { distance: { type: "integer" } },
      required: ["distance"],
    },
    ports: {
      inputs: [
        {
          id: "dialogueEnd",
          label: "Dialogue End",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "attributionStart",
          label: "Attribution Start",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "distance", label: "Distance", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = dialogueAttributionDistanceTool.execute;
export default dialogueAttributionDistanceTool;
