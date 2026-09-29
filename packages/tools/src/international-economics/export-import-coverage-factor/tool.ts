import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly exports: number; readonly imports: number };
export type Output = { readonly coverage: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    exports: { type: "number", minimum: 0 },
    imports: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["exports", "imports"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { coverage: { type: "number" } },
  required: ["coverage"],
} as const;
/** Calculate export import coverage factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { exports, imports } = request;
  const compute = (): Output => {
    H.domain(exports >= 0);
    H.positive(imports);
    return { coverage: exports / imports };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { exports: 120, imports: 100 },
  output: { coverage: 1.2 },
} satisfies ToolExample<Input, Output>;
export const exportImportCoverageFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "international-economics/export-import-coverage-factor",
    title: "Export Import Coverage Factor Tool",
    description:
      "Calculate export import coverage factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        exports: { type: "number", minimum: 0 },
        imports: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["exports", "imports"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { coverage: { type: "number" } },
      required: ["coverage"],
    },
    ports: {
      inputs: [
        {
          id: "exports",
          label: "Exports",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "imports",
          label: "Imports",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "coverage", label: "Coverage", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = exportImportCoverageFactorTool.execute;
export default exportImportCoverageFactorTool;
