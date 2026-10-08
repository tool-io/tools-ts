import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly personLabel: string;
  readonly recordedDeceased: boolean;
  readonly suppliedMarker: string;
};
export type Output = { readonly diagramLabel: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    personLabel: { type: "string", maxLength: 8192, minLength: 1 },
    recordedDeceased: { type: "boolean" },
    suppliedMarker: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["personLabel", "recordedDeceased", "suppliedMarker"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { diagramLabel: { type: "string", maxLength: 8192 } },
  required: ["diagramLabel"],
} as const;
/** Append an explicitly supplied deceased marker to a kinship label only when its recorded flag is true. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { personLabel, recordedDeceased, suppliedMarker } = request;
  const compute = (): Output => {
    H.domain(personLabel.length > 0, "personLabel");
    H.domain(suppliedMarker.length > 0, "suppliedMarker");
    return {
      diagramLabel: personLabel + (recordedDeceased ? suppliedMarker : ""),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    personLabel: "Person A",
    recordedDeceased: true,
    suppliedMarker: "†",
  },
  output: { diagramLabel: "Person A†" },
} satisfies ToolExample<Input, Output>;
export const kinshipDiagramDeceasedMarkerLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cultural-anthropology/kinship-diagram-deceased-marker-label",
    title: "Kinship Diagram Deceased Marker Label Tool",
    description:
      "Append an explicitly supplied deceased marker to a kinship label only when its recorded flag is true.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        personLabel: { type: "string", maxLength: 8192, minLength: 1 },
        recordedDeceased: { type: "boolean" },
        suppliedMarker: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["personLabel", "recordedDeceased", "suppliedMarker"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { diagramLabel: { type: "string", maxLength: 8192 } },
      required: ["diagramLabel"],
    },
    ports: {
      inputs: [
        {
          id: "personLabel",
          label: "Person Label",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "recordedDeceased",
          label: "Recorded Deceased",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "suppliedMarker",
          label: "Supplied Marker",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "diagramLabel",
          label: "Diagram Label",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = kinshipDiagramDeceasedMarkerLabelTool.execute;
export default kinshipDiagramDeceasedMarkerLabelTool;
