import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly present: boolean;
  readonly required: boolean;
  readonly inScope: boolean;
};
export type Output = {
  readonly missingRequired: boolean;
  readonly obligationApplies: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    present: { type: "boolean" },
    required: { type: "boolean" },
    inScope: { type: "boolean" },
  },
  required: ["present", "required", "inScope"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    missingRequired: { type: "boolean" },
    obligationApplies: { type: "boolean" },
  },
  required: ["missingRequired", "obligationApplies"],
} as const;
/** Inspect supplied metadata-field presence and obligation flags without selecting a metadata standard. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { present, required, inScope } = request;
  const compute = (): Output => {
    return {
      missingRequired: inScope && required && !present,
      obligationApplies: inScope && required,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { present: false, required: true, inScope: true },
  output: { missingRequired: true, obligationApplies: true },
} satisfies ToolExample<Input, Output>;
export const metadataFieldObligationFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "information-science/metadata-field-obligation-flag",
    title: "Metadata Field Obligation Flag Tool",
    description:
      "Inspect supplied metadata-field presence and obligation flags without selecting a metadata standard.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        present: { type: "boolean" },
        required: { type: "boolean" },
        inScope: { type: "boolean" },
      },
      required: ["present", "required", "inScope"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        missingRequired: { type: "boolean" },
        obligationApplies: { type: "boolean" },
      },
      required: ["missingRequired", "obligationApplies"],
    },
    ports: {
      inputs: [
        {
          id: "present",
          label: "Present",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "required",
          label: "Required",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "inScope",
          label: "In Scope",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "missingRequired",
          label: "Missing Required",
          valueType: { type: "boolean" },
        },
        {
          id: "obligationApplies",
          label: "Obligation Applies",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = metadataFieldObligationFlagTool.execute;
export default metadataFieldObligationFlagTool;
