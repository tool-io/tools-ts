import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly count: number;
  readonly countedFields: number;
  readonly targetFields: number;
};
export type Output = { readonly scaledCount: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    count: { type: "integer", minimum: 0 },
    countedFields: { type: "integer", minimum: 1 },
    targetFields: { type: "integer", minimum: 0 },
  },
  required: ["count", "countedFields", "targetFields"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { scaledCount: { type: "number" } },
  required: ["scaledCount"],
} as const;
/** Calculate microscope field count factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { count, countedFields, targetFields } = request;
  const compute = (): Output => {
    H.integer(count, 0);
    H.integer(countedFields, 1);
    H.integer(targetFields, 0);
    return { scaledCount: (count / countedFields) * targetFields };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { count: 30, countedFields: 5, targetFields: 10 },
  output: { scaledCount: 60 },
} satisfies ToolExample<Input, Output>;
export const microscopeFieldCountFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "microbiology/microscope-field-count-factor",
    title: "Microscope Field Count Factor Tool",
    description:
      "Calculate microscope field count factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        count: { type: "integer", minimum: 0 },
        countedFields: { type: "integer", minimum: 1 },
        targetFields: { type: "integer", minimum: 0 },
      },
      required: ["count", "countedFields", "targetFields"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { scaledCount: { type: "number" } },
      required: ["scaledCount"],
    },
    ports: {
      inputs: [
        {
          id: "count",
          label: "Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "countedFields",
          label: "Counted Fields",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "targetFields",
          label: "Target Fields",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "scaledCount",
          label: "Scaled Count",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = microscopeFieldCountFactorTool.execute;
export default microscopeFieldCountFactorTool;
