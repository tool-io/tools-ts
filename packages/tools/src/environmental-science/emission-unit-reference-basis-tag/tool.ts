import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly unit: string; readonly basis: string };
export type Output = { readonly tag: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unit: { type: "string", maxLength: 8192 },
    basis: {
      type: "string",
      maxLength: 8192,
      enum: ["wet", "dry", "as-received", "standard-volume", "actual-volume"],
    },
  },
  required: ["unit", "basis"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { tag: { type: "string", maxLength: 8192 } },
  required: ["tag"],
} as const;
/** Attach an explicitly declared reference basis to an emission unit without converting bases. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { unit, basis } = request;
  const compute = (): Output => {
    H.domain(unit.length > 0, "unit");
    H.domain(
      [
        "wet",
        "dry",
        "as-received",
        "standard-volume",
        "actual-volume",
      ].includes(basis),
      "basis",
    );
    return { tag: unit + " [" + basis + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { unit: "mg/m3", basis: "dry" },
  output: { tag: "mg/m3 [dry]" },
} satisfies ToolExample<Input, Output>;
export const emissionUnitReferenceBasisTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "environmental-science/emission-unit-reference-basis-tag",
    title: "Emission Unit Reference Basis Tag Tool",
    description:
      "Attach an explicitly declared reference basis to an emission unit without converting bases.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        unit: { type: "string", maxLength: 8192 },
        basis: {
          type: "string",
          maxLength: 8192,
          enum: [
            "wet",
            "dry",
            "as-received",
            "standard-volume",
            "actual-volume",
          ],
        },
      },
      required: ["unit", "basis"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { tag: { type: "string", maxLength: 8192 } },
      required: ["tag"],
    },
    ports: {
      inputs: [
        {
          id: "unit",
          label: "Unit",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "basis",
          label: "Basis",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "tag", label: "Tag", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = emissionUnitReferenceBasisTagTool.execute;
export default emissionUnitReferenceBasisTagTool;
