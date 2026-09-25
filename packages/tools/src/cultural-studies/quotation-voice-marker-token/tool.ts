import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly marker: string;
  readonly suppliedVoiceMarkers: readonly string[];
};
export type Output = {
  readonly recognized: boolean;
  readonly matchedIndex: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    marker: { type: "string", maxLength: 8192 },
    suppliedVoiceMarkers: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["marker", "suppliedVoiceMarkers"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recognized: { type: "boolean" },
    matchedIndex: { type: "integer" },
  },
  required: ["recognized", "matchedIndex"],
} as const;
/** Calculate quotation voice marker token from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { marker, suppliedVoiceMarkers } = request;
  const compute = (): Output => {
    H.domain(
      new Set(suppliedVoiceMarkers).size === suppliedVoiceMarkers.length,
    );
    return {
      recognized: suppliedVoiceMarkers.includes(marker),
      matchedIndex: suppliedVoiceMarkers.indexOf(marker),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { marker: "Q", suppliedVoiceMarkers: ["N", "Q"] },
  output: { recognized: true, matchedIndex: 1 },
} satisfies ToolExample<Input, Output>;
export const quotationVoiceMarkerTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cultural-studies/quotation-voice-marker-token",
    title: "Quotation Voice Marker Token Tool",
    description:
      "Calculate quotation voice marker token from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        marker: { type: "string", maxLength: 8192 },
        suppliedVoiceMarkers: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["marker", "suppliedVoiceMarkers"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recognized: { type: "boolean" },
        matchedIndex: { type: "integer" },
      },
      required: ["recognized", "matchedIndex"],
    },
    ports: {
      inputs: [
        {
          id: "marker",
          label: "Marker",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedVoiceMarkers",
          label: "Supplied Voice Markers",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "recognized",
          label: "Recognized",
          valueType: { type: "boolean" },
        },
        {
          id: "matchedIndex",
          label: "Matched Index",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = quotationVoiceMarkerTokenTool.execute;
export default quotationVoiceMarkerTokenTool;
