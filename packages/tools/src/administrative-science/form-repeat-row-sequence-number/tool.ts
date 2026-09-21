import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly start: number;
  readonly rows: number;
  readonly step: number;
  readonly width: number;
};
export type Output = { readonly labels: readonly string[] };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    start: { type: "integer", minimum: 0 },
    rows: { type: "integer", minimum: 0, maximum: 256 },
    step: { type: "integer", exclusiveMinimum: 0 },
    width: { type: "integer", minimum: 1, maximum: 16 },
  },
  required: ["start", "rows", "step", "width"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    labels: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["labels"],
} as const;
/** Calculate form repeat row sequence number from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { start, rows, step, width } = request;
  const compute = (): Output => {
    H.integer(rows, 0, 256);
    H.integer(width, 1, 16);
    H.domain(start >= 0 && step > 0);
    return {
      labels: Array.from({ length: rows }, (_, i) => {
        const n = start + i * step;
        H.integer(n, 0);
        return String(n).padStart(width, "0");
      }),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { start: 1, rows: 3, step: 1, width: 3 },
  output: { labels: ["001", "002", "003"] },
} satisfies ToolExample<Input, Output>;
export const formRepeatRowSequenceNumberTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "administrative-science/form-repeat-row-sequence-number",
    title: "Form Repeat Row Sequence Number Tool",
    description:
      "Calculate form repeat row sequence number from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        start: { type: "integer", minimum: 0 },
        rows: { type: "integer", minimum: 0, maximum: 256 },
        step: { type: "integer", exclusiveMinimum: 0 },
        width: { type: "integer", minimum: 1, maximum: 16 },
      },
      required: ["start", "rows", "step", "width"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        labels: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["labels"],
    },
    ports: {
      inputs: [
        {
          id: "start",
          label: "Start",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "rows",
          label: "Rows",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "step",
          label: "Step",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "width",
          label: "Width",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "labels",
          label: "Labels",
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
    },
  },
  calculate,
});
export const run = formRepeatRowSequenceNumberTool.execute;
export default formRepeatRowSequenceNumberTool;
