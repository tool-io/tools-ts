import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly caseReference: string; readonly stage: string };
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    caseReference: { type: "string", maxLength: 8192 },
    stage: {
      type: "string",
      maxLength: 8192,
      enum: [
        "filed",
        "under-review",
        "hearing-scheduled",
        "decided",
        "withdrawn",
      ],
    },
  },
  required: ["caseReference", "stage"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Format an explicitly recorded administrative appeal stage without recommending a legal action or determining appeal rights. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { caseReference, stage } = request;
  const compute = (): Output => {
    H.domain(caseReference.length > 0, "caseReference");
    H.domain(
      [
        "filed",
        "under-review",
        "hearing-scheduled",
        "decided",
        "withdrawn",
      ].includes(stage),
      "stage",
    );
    return { label: caseReference + " [appeal: " + stage + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { caseReference: "A17", stage: "under-review" },
  output: { label: "A17 [appeal: under-review]" },
} satisfies ToolExample<Input, Output>;
export const administrativeAppealStageLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "public-administration/administrative-appeal-stage-label",
    title: "Administrative Appeal Stage Label Tool",
    description:
      "Format an explicitly recorded administrative appeal stage without recommending a legal action or determining appeal rights.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        caseReference: { type: "string", maxLength: 8192 },
        stage: {
          type: "string",
          maxLength: 8192,
          enum: [
            "filed",
            "under-review",
            "hearing-scheduled",
            "decided",
            "withdrawn",
          ],
        },
      },
      required: ["caseReference", "stage"],
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
          id: "caseReference",
          label: "Case Reference",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "stage",
          label: "Stage",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = administrativeAppealStageLabelTool.execute;
export default administrativeAppealStageLabelTool;
