import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly procedureId: string;
  readonly jarNumberOneBased: number;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    procedureId: { type: "string", maxLength: 8192, minLength: 1 },
    jarNumberOneBased: { type: "integer", minimum: 1 },
  },
  required: ["procedureId", "jarNumberOneBased"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicitly supplied endoscopy biopsy jar sequence position without assigning specimen sites. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { procedureId, jarNumberOneBased } = request;
  const compute = (): Output => {
    H.domain(procedureId.length > 0, "procedureId");
    (H.domain(
      Number.isSafeInteger(jarNumberOneBased) &&
        jarNumberOneBased >= 1 &&
        jarNumberOneBased <= Number.MAX_SAFE_INTEGER,
      "jarNumberOneBased",
    ),
      jarNumberOneBased);
    return { label: procedureId + "/jar-" + jarNumberOneBased };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { procedureId: "P17", jarNumberOneBased: 3 },
  output: { label: "P17/jar-3" },
} satisfies ToolExample<Input, Output>;
export const endoscopyBiopsyJarSequenceLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gastroenterology/endoscopy-biopsy-jar-sequence-label",
    title: "Endoscopy Biopsy Jar Sequence Label Tool",
    description:
      "Label an explicitly supplied endoscopy biopsy jar sequence position without assigning specimen sites.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        procedureId: { type: "string", maxLength: 8192, minLength: 1 },
        jarNumberOneBased: { type: "integer", minimum: 1 },
      },
      required: ["procedureId", "jarNumberOneBased"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "procedureId",
          label: "Procedure Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "jarNumberOneBased",
          label: "Jar Number One Based",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = endoscopyBiopsyJarSequenceLabelTool.execute;
export default endoscopyBiopsyJarSequenceLabelTool;
