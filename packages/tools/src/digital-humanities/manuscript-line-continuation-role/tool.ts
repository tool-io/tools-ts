import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly marker: string;
  readonly continuationMarkers: readonly string[];
  readonly uncertainMarkers: readonly string[];
};
export type Output = { readonly role: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    marker: { type: "string", maxLength: 8192 },
    continuationMarkers: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    uncertainMarkers: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["marker", "continuationMarkers", "uncertainMarkers"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { role: { type: "string", maxLength: 8192 } },
  required: ["role"],
} as const;
/** Classify supplied editorial continuation markers without joining manuscript lines. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { marker, continuationMarkers, uncertainMarkers } = request;
  const compute = (): Output => {
    H.domain(!continuationMarkers.some((x) => uncertainMarkers.includes(x)));
    return {
      role: continuationMarkers.includes(marker)
        ? "continuation"
        : uncertainMarkers.includes(marker)
          ? "uncertain"
          : "other",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { marker: "↩", continuationMarkers: ["↩"], uncertainMarkers: ["?"] },
  output: { role: "continuation" },
} satisfies ToolExample<Input, Output>;
export const manuscriptLineContinuationRoleTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "digital-humanities/manuscript-line-continuation-role",
    title: "Manuscript Line Continuation Role Tool",
    description:
      "Classify supplied editorial continuation markers without joining manuscript lines.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        marker: { type: "string", maxLength: 8192 },
        continuationMarkers: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        uncertainMarkers: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["marker", "continuationMarkers", "uncertainMarkers"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { role: { type: "string", maxLength: 8192 } },
      required: ["role"],
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
          id: "continuationMarkers",
          label: "Continuation Markers",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "uncertainMarkers",
          label: "Uncertain Markers",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [{ id: "role", label: "Role", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = manuscriptLineContinuationRoleTool.execute;
export default manuscriptLineContinuationRoleTool;
