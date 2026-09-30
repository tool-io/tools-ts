import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly fieldAreas: readonly number[];
  readonly missing: readonly boolean[];
};
export type Output = {
  readonly observedArea: number;
  readonly missingArea: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fieldAreas: { type: "array", maxItems: 256, items: { type: "number" } },
    missing: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["fieldAreas", "missing"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedArea: { type: "number" },
    missingArea: { type: "number" },
  },
  required: ["observedArea", "missingArea"],
} as const;
/** Calculate micrograph missing field area from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { fieldAreas, missing } = request;
  const compute = (): Output => {
    H.sameLength(fieldAreas, missing);
    H.domain(fieldAreas.every((x) => x >= 0));
    return {
      observedArea: fieldAreas.reduce((a, b, i) => a + (missing[i] ? 0 : b), 0),
      missingArea: fieldAreas.reduce((a, b, i) => a + (missing[i] ? b : 0), 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { fieldAreas: [2, 3, 4], missing: [false, true, false] },
  output: { observedArea: 6, missingArea: 3 },
} satisfies ToolExample<Input, Output>;
export const micrographMissingFieldAreaTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "microbiology/micrograph-missing-field-area",
    title: "Micrograph Missing Field Area Tool",
    description:
      "Calculate micrograph missing field area from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fieldAreas: { type: "array", maxItems: 256, items: { type: "number" } },
        missing: { type: "array", maxItems: 256, items: { type: "boolean" } },
      },
      required: ["fieldAreas", "missing"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedArea: { type: "number" },
        missingArea: { type: "number" },
      },
      required: ["observedArea", "missingArea"],
    },
    ports: {
      inputs: [
        {
          id: "fieldAreas",
          label: "Field Areas",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "missing",
          label: "Missing",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "observedArea",
          label: "Observed Area",
          valueType: { type: "number" },
        },
        {
          id: "missingArea",
          label: "Missing Area",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = micrographMissingFieldAreaTool.execute;
export default micrographMissingFieldAreaTool;
