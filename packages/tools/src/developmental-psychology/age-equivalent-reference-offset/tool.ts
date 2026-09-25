import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly suppliedAgeEquivalent: number;
  readonly referenceAge: number;
};
export type Output = { readonly offset: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    suppliedAgeEquivalent: { type: "number", minimum: 0 },
    referenceAge: { type: "number", minimum: 0 },
  },
  required: ["suppliedAgeEquivalent", "referenceAge"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { offset: { type: "number" } },
  required: ["offset"],
} as const;
/** Compare supplied research age coordinates; no norm table, developmental age or diagnosis is generated. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { suppliedAgeEquivalent, referenceAge } = request;
  const compute = (): Output => {
    H.domain(suppliedAgeEquivalent >= 0 && referenceAge >= 0);
    return { offset: suppliedAgeEquivalent - referenceAge };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { suppliedAgeEquivalent: 24, referenceAge: 20 },
  output: { offset: 4 },
} satisfies ToolExample<Input, Output>;
export const ageEquivalentReferenceOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "developmental-psychology/age-equivalent-reference-offset",
    title: "Age Equivalent Reference Offset Tool",
    description:
      "Compare supplied research age coordinates; no norm table, developmental age or diagnosis is generated.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        suppliedAgeEquivalent: { type: "number", minimum: 0 },
        referenceAge: { type: "number", minimum: 0 },
      },
      required: ["suppliedAgeEquivalent", "referenceAge"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { offset: { type: "number" } },
      required: ["offset"],
    },
    ports: {
      inputs: [
        {
          id: "suppliedAgeEquivalent",
          label: "Supplied Age Equivalent",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceAge",
          label: "Reference Age",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "offset", label: "Offset", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = ageEquivalentReferenceOffsetTool.execute;
export default ageEquivalentReferenceOffsetTool;
