import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly resultId: string;
  readonly specimenBasis: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    resultId: { type: "string", maxLength: 8192, minLength: 1 },
    specimenBasis: {
      type: "string",
      maxLength: 8192,
      enum: ["plasma", "whole-blood", "serum", "unknown"],
    },
  },
  required: ["resultId", "specimenBasis"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicitly supplied glucose specimen basis without converting values or interpreting glycemia. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { resultId, specimenBasis } = request;
  const compute = (): Output => {
    H.domain(resultId.length > 0, "resultId");
    H.domain(
      ["plasma", "whole-blood", "serum", "unknown"].includes(specimenBasis),
      "specimenBasis",
    );
    return { label: resultId + " [" + specimenBasis + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { resultId: "R17", specimenBasis: "plasma" },
  output: { label: "R17 [plasma]" },
} satisfies ToolExample<Input, Output>;
export const laboratoryGlucosePlasmaWholebloodTagTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "endocrinology/laboratory-glucose-plasma-wholeblood-tag",
      title: "Laboratory Glucose Plasma Wholeblood Tag Tool",
      description:
        "Label an explicitly supplied glucose specimen basis without converting values or interpreting glycemia.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          resultId: { type: "string", maxLength: 8192, minLength: 1 },
          specimenBasis: {
            type: "string",
            maxLength: 8192,
            enum: ["plasma", "whole-blood", "serum", "unknown"],
          },
        },
        required: ["resultId", "specimenBasis"],
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
            id: "resultId",
            label: "Result Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "specimenBasis",
            label: "Specimen Basis",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "label", label: "Label", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = laboratoryGlucosePlasmaWholebloodTagTool.execute;
export default laboratoryGlucosePlasmaWholebloodTagTool;
