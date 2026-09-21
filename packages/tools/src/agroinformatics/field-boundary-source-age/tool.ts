import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly sourceAt: number; readonly cutoff: number };
export type Output = { readonly age: number; readonly futureSource: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { sourceAt: { type: "number" }, cutoff: { type: "number" } },
  required: ["sourceAt", "cutoff"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { age: { type: "number" }, futureSource: { type: "boolean" } },
  required: ["age", "futureSource"],
} as const;
/** Compute explicit public field-boundary record age without inferring parcel ownership. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourceAt, cutoff } = request;
  const compute = (): Output => {
    return { age: cutoff - sourceAt, futureSource: sourceAt > cutoff };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sourceAt: 10, cutoff: 25 },
  output: { age: 15, futureSource: false },
} satisfies ToolExample<Input, Output>;
export const fieldBoundarySourceAgeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agroinformatics/field-boundary-source-age",
    title: "Field Boundary Source Age Tool",
    description:
      "Compute explicit public field-boundary record age without inferring parcel ownership.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { sourceAt: { type: "number" }, cutoff: { type: "number" } },
      required: ["sourceAt", "cutoff"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        age: { type: "number" },
        futureSource: { type: "boolean" },
      },
      required: ["age", "futureSource"],
    },
    ports: {
      inputs: [
        {
          id: "sourceAt",
          label: "Source At",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cutoff",
          label: "Cutoff",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "age", label: "Age", valueType: { type: "number" } },
        {
          id: "futureSource",
          label: "Future Source",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = fieldBoundarySourceAgeTool.execute;
export default fieldBoundarySourceAgeTool;
