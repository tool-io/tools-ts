import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly token: string;
  readonly closedMarker: string;
  readonly openMarker: string;
};
export type Output = { readonly kind: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    token: { type: "string", maxLength: 8192 },
    closedMarker: { type: "string", maxLength: 8192 },
    openMarker: { type: "string", maxLength: 8192 },
  },
  required: ["token", "closedMarker", "openMarker"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { kind: { type: "string", maxLength: 8192 } },
  required: ["kind"],
} as const;
/** Classify supplied public transcript caption markers without redacting or disclosing records. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { token, closedMarker, openMarker } = request;
  const compute = (): Output => {
    H.domain(closedMarker !== openMarker);
    return {
      kind:
        token === closedMarker
          ? "closed-caption"
          : token === openMarker
            ? "open-caption"
            : "other",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { token: "[CC]", closedMarker: "[CC]", openMarker: "[OC]" },
  output: { kind: "closed-caption" },
} satisfies ToolExample<Input, Output>;
export const transcriptClosedCaptionMarkerTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "criminal-justice/transcript-closed-caption-marker",
    title: "Transcript Closed Caption Marker Tool",
    description:
      "Classify supplied public transcript caption markers without redacting or disclosing records.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        token: { type: "string", maxLength: 8192 },
        closedMarker: { type: "string", maxLength: 8192 },
        openMarker: { type: "string", maxLength: 8192 },
      },
      required: ["token", "closedMarker", "openMarker"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { kind: { type: "string", maxLength: 8192 } },
      required: ["kind"],
    },
    ports: {
      inputs: [
        {
          id: "token",
          label: "Token",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "closedMarker",
          label: "Closed Marker",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "openMarker",
          label: "Open Marker",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "kind", label: "Kind", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = transcriptClosedCaptionMarkerTool.execute;
export default transcriptClosedCaptionMarkerTool;
