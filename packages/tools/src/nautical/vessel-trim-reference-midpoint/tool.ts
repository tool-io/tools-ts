import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly forwardDraft: number;
  readonly aftDraft: number;
  readonly forwardPosition: number;
  readonly aftPosition: number;
  readonly referencePosition: number;
};
export type Output = {
  readonly referenceDraft: number;
  readonly gradient: number;
  readonly midpointPosition: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    forwardDraft: { type: "number", minimum: 0 },
    aftDraft: { type: "number", minimum: 0 },
    forwardPosition: { type: "number" },
    aftPosition: { type: "number" },
    referencePosition: { type: "number" },
  },
  required: [
    "forwardDraft",
    "aftDraft",
    "forwardPosition",
    "aftPosition",
    "referencePosition",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenceDraft: { type: "number" },
    gradient: { type: "number" },
    midpointPosition: { type: "number" },
  },
  required: ["referenceDraft", "gradient", "midpointPosition"],
} as const;
/** Linear draft interpolation at an explicitly supplied longitudinal reference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    forwardDraft,
    aftDraft,
    forwardPosition,
    aftPosition,
    referencePosition,
  } = request;
  const compute = (): Output => {
    H.domain(
      forwardDraft >= 0 && aftDraft >= 0 && aftPosition > forwardPosition,
    );
    return {
      referenceDraft:
        forwardDraft +
        ((aftDraft - forwardDraft) * (referencePosition - forwardPosition)) /
          (aftPosition - forwardPosition),
      gradient: (aftDraft - forwardDraft) / (aftPosition - forwardPosition),
      midpointPosition: forwardPosition + (aftPosition - forwardPosition) / 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    forwardDraft: 4,
    aftDraft: 6,
    forwardPosition: 0,
    aftPosition: 100,
    referencePosition: 50,
  },
  output: { referenceDraft: 5, gradient: 0.02, midpointPosition: 50 },
} satisfies ToolExample<Input, Output>;
export const vesselTrimReferenceMidpointTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "nautical/vessel-trim-reference-midpoint",
    title: "Vessel Trim Reference Midpoint Tool",
    description:
      "Linear draft interpolation at an explicitly supplied longitudinal reference.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        forwardDraft: { type: "number", minimum: 0 },
        aftDraft: { type: "number", minimum: 0 },
        forwardPosition: { type: "number" },
        aftPosition: { type: "number" },
        referencePosition: { type: "number" },
      },
      required: [
        "forwardDraft",
        "aftDraft",
        "forwardPosition",
        "aftPosition",
        "referencePosition",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        referenceDraft: { type: "number" },
        gradient: { type: "number" },
        midpointPosition: { type: "number" },
      },
      required: ["referenceDraft", "gradient", "midpointPosition"],
    },
    ports: {
      inputs: [
        {
          id: "forwardDraft",
          label: "Forward Draft",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "aftDraft",
          label: "Aft Draft",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "forwardPosition",
          label: "Forward Position",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "aftPosition",
          label: "Aft Position",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referencePosition",
          label: "Reference Position",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "referenceDraft",
          label: "Reference Draft",
          valueType: { type: "number" },
        },
        { id: "gradient", label: "Gradient", valueType: { type: "number" } },
        {
          id: "midpointPosition",
          label: "Midpoint Position",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = vesselTrimReferenceMidpointTool.execute;
export default vesselTrimReferenceMidpointTool;
