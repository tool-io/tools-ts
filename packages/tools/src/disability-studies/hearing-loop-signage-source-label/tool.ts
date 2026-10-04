import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly locationCode: string;
  readonly signWording: string;
  readonly sourceReference: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    locationCode: { type: "string", maxLength: 8192 },
    signWording: { type: "string", maxLength: 8192 },
    sourceReference: { type: "string", maxLength: 8192 },
  },
  required: ["locationCode", "signWording", "sourceReference"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Record literal hearing-loop sign wording and provenance without verifying device availability or performance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { locationCode, signWording, sourceReference } = request;
  const compute = (): Output => {
    H.domain(
      locationCode.length > 0 &&
        signWording.length > 0 &&
        sourceReference.length > 0,
      "locationCode",
    );
    return {
      label:
        locationCode +
        ": " +
        JSON.stringify(signWording) +
        " [" +
        sourceReference +
        "]",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    locationCode: "ROOM17",
    signWording: "Hearing loop available",
    sourceReference: "survey 2026",
  },
  output: { label: 'ROOM17: "Hearing loop available" [survey 2026]' },
} satisfies ToolExample<Input, Output>;
export const hearingLoopSignageSourceLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "disability-studies/hearing-loop-signage-source-label",
    title: "Hearing Loop Signage Source Label Tool",
    description:
      "Record literal hearing-loop sign wording and provenance without verifying device availability or performance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        locationCode: { type: "string", maxLength: 8192 },
        signWording: { type: "string", maxLength: 8192 },
        sourceReference: { type: "string", maxLength: 8192 },
      },
      required: ["locationCode", "signWording", "sourceReference"],
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
          id: "locationCode",
          label: "Location Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "signWording",
          label: "Sign Wording",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sourceReference",
          label: "Source Reference",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = hearingLoopSignageSourceLabelTool.execute;
export default hearingLoopSignageSourceLabelTool;
