import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly states: readonly string[];
  readonly missingMarkers: readonly string[];
  readonly inapplicableMarkers: readonly string[];
};
export type Output = {
  readonly missingPositions: readonly number[];
  readonly inapplicablePositions: readonly number[];
  readonly conflictingMarkers: readonly string[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    states: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    missingMarkers: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    inapplicableMarkers: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["states", "missingMarkers", "inapplicableMarkers"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    missingPositions: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
    inapplicablePositions: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
    conflictingMarkers: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["missingPositions", "inapplicablePositions", "conflictingMarkers"],
} as const;
/** Distinguish supplied missing and inapplicable character-state markers without imputing character values. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { states, missingMarkers, inapplicableMarkers } = request;
  const compute = (): Output => {
    return {
      missingPositions: states.flatMap((x, i) =>
        missingMarkers.includes(x) ? [i] : [],
      ),
      inapplicablePositions: states.flatMap((x, i) =>
        inapplicableMarkers.includes(x) ? [i] : [],
      ),
      conflictingMarkers: [...new Set(missingMarkers)].filter((x) =>
        inapplicableMarkers.includes(x),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    states: ["0", "?", "-"],
    missingMarkers: ["?"],
    inapplicableMarkers: ["-"],
  },
  output: {
    missingPositions: [1],
    inapplicablePositions: [2],
    conflictingMarkers: [],
  },
} satisfies ToolExample<Input, Output>;
export const characterStateUnobservedMarkerTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biosystematics/character-state-unobserved-marker",
    title: "Character State Unobserved Marker Tool",
    description:
      "Distinguish supplied missing and inapplicable character-state markers without imputing character values.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        states: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        missingMarkers: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        inapplicableMarkers: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["states", "missingMarkers", "inapplicableMarkers"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        missingPositions: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        inapplicablePositions: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        conflictingMarkers: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: [
        "missingPositions",
        "inapplicablePositions",
        "conflictingMarkers",
      ],
    },
    ports: {
      inputs: [
        {
          id: "states",
          label: "States",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "missingMarkers",
          label: "Missing Markers",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "inapplicableMarkers",
          label: "Inapplicable Markers",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "missingPositions",
          label: "Missing Positions",
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "inapplicablePositions",
          label: "Inapplicable Positions",
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "conflictingMarkers",
          label: "Conflicting Markers",
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
    },
  },
  calculate,
});
export const run = characterStateUnobservedMarkerTool.execute;
export default characterStateUnobservedMarkerTool;
