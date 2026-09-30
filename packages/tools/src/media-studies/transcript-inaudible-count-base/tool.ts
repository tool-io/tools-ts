import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly audibleTokens: number;
  readonly inaudibleMarkers: number;
  readonly excludedMarkers: number;
  readonly includeInaudible: boolean;
};
export type Output = {
  readonly denominator: number;
  readonly inaudibleShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    audibleTokens: { type: "integer", minimum: 1 },
    inaudibleMarkers: { type: "integer", minimum: 0 },
    excludedMarkers: { type: "integer", minimum: 0 },
    includeInaudible: { type: "boolean" },
  },
  required: [
    "audibleTokens",
    "inaudibleMarkers",
    "excludedMarkers",
    "includeInaudible",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    denominator: { type: "integer" },
    inaudibleShare: { type: "number" },
  },
  required: ["denominator", "inaudibleShare"],
} as const;
/** Separate audible tokens, counted inaudible markers and excluded annotation markers; excluded markers never enter the base. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { audibleTokens, inaudibleMarkers, excludedMarkers, includeInaudible } =
    request;
  const compute = (): Output => {
    H.integer(audibleTokens, 1);
    H.integer(inaudibleMarkers, 0);
    H.integer(excludedMarkers, 0);
    return {
      denominator: audibleTokens + (includeInaudible ? inaudibleMarkers : 0),
      inaudibleShare: inaudibleMarkers / (audibleTokens + inaudibleMarkers),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    audibleTokens: 80,
    inaudibleMarkers: 20,
    excludedMarkers: 5,
    includeInaudible: true,
  },
  output: { denominator: 100, inaudibleShare: 0.2 },
} satisfies ToolExample<Input, Output>;
export const transcriptInaudibleCountBaseTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "media-studies/transcript-inaudible-count-base",
    title: "Transcript Inaudible Count Base Tool",
    description:
      "Separate audible tokens, counted inaudible markers and excluded annotation markers; excluded markers never enter the base.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        audibleTokens: { type: "integer", minimum: 1 },
        inaudibleMarkers: { type: "integer", minimum: 0 },
        excludedMarkers: { type: "integer", minimum: 0 },
        includeInaudible: { type: "boolean" },
      },
      required: [
        "audibleTokens",
        "inaudibleMarkers",
        "excludedMarkers",
        "includeInaudible",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        denominator: { type: "integer" },
        inaudibleShare: { type: "number" },
      },
      required: ["denominator", "inaudibleShare"],
    },
    ports: {
      inputs: [
        {
          id: "audibleTokens",
          label: "Audible Tokens",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "inaudibleMarkers",
          label: "Inaudible Markers",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "excludedMarkers",
          label: "Excluded Markers",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "includeInaudible",
          label: "Include Inaudible",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "denominator",
          label: "Denominator",
          valueType: { type: "integer" },
        },
        {
          id: "inaudibleShare",
          label: "Inaudible Share",
          valueType: { type: "number", unit: "1" },
        },
      ],
    },
  },
  calculate,
});
export const run = transcriptInaudibleCountBaseTool.execute;
export default transcriptInaudibleCountBaseTool;
