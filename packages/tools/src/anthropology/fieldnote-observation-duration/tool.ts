import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly start: number;
  readonly end: number;
  readonly excluded: number;
};
export type Output = { readonly duration: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    start: { type: "number" },
    end: { type: "number" },
    excluded: { type: "number", minimum: 0 },
  },
  required: ["start", "end", "excluded"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { duration: { type: "number" } },
  required: ["duration"],
} as const;
/** Calculate a supplied fieldnote observation span minus explicitly excluded time in one clock and unit. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { start, end, excluded } = request;
  const compute = (): Output => {
    H.domain(end >= start && excluded >= 0 && excluded <= end - start);
    return { duration: end - start - excluded };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { start: 10, end: 40, excluded: 5 },
  output: { duration: 25 },
} satisfies ToolExample<Input, Output>;
export const fieldnoteObservationDurationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "anthropology/fieldnote-observation-duration",
    title: "Fieldnote Observation Duration Tool",
    description:
      "Calculate a supplied fieldnote observation span minus explicitly excluded time in one clock and unit.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        start: { type: "number" },
        end: { type: "number" },
        excluded: { type: "number", minimum: 0 },
      },
      required: ["start", "end", "excluded"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { duration: { type: "number" } },
      required: ["duration"],
    },
    ports: {
      inputs: [
        {
          id: "start",
          label: "Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "end",
          label: "End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "excluded",
          label: "Excluded",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "duration", label: "Duration", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = fieldnoteObservationDurationTool.execute;
export default fieldnoteObservationDurationTool;
