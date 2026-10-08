import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observationId: string;
  readonly visibility: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observationId: { type: "string", maxLength: 8192, minLength: 1 },
    visibility: {
      type: "string",
      maxLength: 8192,
      enum: ["visible", "partly-visible", "not-visible", "not-recorded"],
    },
  },
  required: ["observationId", "visibility"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicitly recorded lesion border visibility status without assessing malignancy or morphology. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observationId, visibility } = request;
  const compute = (): Output => {
    H.domain(observationId.length > 0, "observationId");
    H.domain(
      ["visible", "partly-visible", "not-visible", "not-recorded"].includes(
        visibility,
      ),
      "visibility",
    );
    return { label: observationId + " [" + visibility + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observationId: "O17", visibility: "partly-visible" },
  output: { label: "O17 [partly-visible]" },
} satisfies ToolExample<Input, Output>;
export const lesionObservationBorderVisibilityCodeTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "dermatology/lesion-observation-border-visibility-code",
      title: "Lesion Observation Border Visibility Code Tool",
      description:
        "Label an explicitly recorded lesion border visibility status without assessing malignancy or morphology.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          observationId: { type: "string", maxLength: 8192, minLength: 1 },
          visibility: {
            type: "string",
            maxLength: 8192,
            enum: ["visible", "partly-visible", "not-visible", "not-recorded"],
          },
        },
        required: ["observationId", "visibility"],
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
            id: "observationId",
            label: "Observation Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "visibility",
            label: "Visibility",
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
export const run = lesionObservationBorderVisibilityCodeTool.execute;
export default lesionObservationBorderVisibilityCodeTool;
