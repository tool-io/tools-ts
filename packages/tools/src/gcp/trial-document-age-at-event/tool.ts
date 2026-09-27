import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly documentAt: number; readonly eventAt: number };
export type Output = { readonly age: number; readonly futureDocument: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { documentAt: { type: "number" }, eventAt: { type: "number" } },
  required: ["documentAt", "eventAt"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { age: { type: "number" }, futureDocument: { type: "boolean" } },
  required: ["age", "futureDocument"],
} as const;
/** Calculate trial document age at event from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { documentAt, eventAt } = request;
  const compute = (): Output => {
    return { age: eventAt - documentAt, futureDocument: documentAt > eventAt };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { documentAt: 10, eventAt: 25 },
  output: { age: 15, futureDocument: false },
} satisfies ToolExample<Input, Output>;
export const trialDocumentAgeAtEventTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gcp/trial-document-age-at-event",
    title: "Trial Document Age At Event Tool",
    description:
      "Calculate trial document age at event from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        documentAt: { type: "number" },
        eventAt: { type: "number" },
      },
      required: ["documentAt", "eventAt"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        age: { type: "number" },
        futureDocument: { type: "boolean" },
      },
      required: ["age", "futureDocument"],
    },
    ports: {
      inputs: [
        {
          id: "documentAt",
          label: "Document At",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "eventAt",
          label: "Event At",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "age", label: "Age", valueType: { type: "number" } },
        {
          id: "futureDocument",
          label: "Future Document",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = trialDocumentAgeAtEventTool.execute;
export default trialDocumentAgeAtEventTool;
