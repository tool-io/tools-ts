import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly flowerContactObserved: boolean;
  readonly pollenStructureContactObserved: boolean;
  readonly observationComplete: boolean;
};
export type Output = {
  readonly recordedContactVisit: boolean;
  readonly missing: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    flowerContactObserved: { type: "boolean" },
    pollenStructureContactObserved: { type: "boolean" },
    observationComplete: { type: "boolean" },
  },
  required: [
    "flowerContactObserved",
    "pollenStructureContactObserved",
    "observationComplete",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedContactVisit: { type: "boolean" },
    missing: { type: "boolean" },
  },
  required: ["recordedContactVisit", "missing"],
} as const;
/** Combine explicit contact observations and observation completeness without inferring pollination success. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    flowerContactObserved,
    pollenStructureContactObserved,
    observationComplete,
  } = request;
  const compute = (): Output => {
    return {
      recordedContactVisit:
        observationComplete &&
        flowerContactObserved &&
        pollenStructureContactObserved,
      missing: !observationComplete,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    flowerContactObserved: true,
    pollenStructureContactObserved: true,
    observationComplete: true,
  },
  output: { recordedContactVisit: true, missing: false },
} satisfies ToolExample<Input, Output>;
export const pollinatorContactVisitFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["entomology", "biology"],
      keywords: ["entomology", "biology"],
    },
    id: "entomology/pollinator-contact-visit-flag",
    title: "Pollinator Contact Visit Flag",
    description:
      "Combine explicit contact observations and observation completeness without inferring pollination success.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        flowerContactObserved: { type: "boolean" },
        pollenStructureContactObserved: { type: "boolean" },
        observationComplete: { type: "boolean" },
      },
      required: [
        "flowerContactObserved",
        "pollenStructureContactObserved",
        "observationComplete",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedContactVisit: { type: "boolean" },
        missing: { type: "boolean" },
      },
      required: ["recordedContactVisit", "missing"],
    },
    ports: {
      inputs: [
        {
          id: "flowerContactObserved",
          label: "Flower Contact Observed",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "pollenStructureContactObserved",
          label: "Pollen Structure Contact Observed",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "observationComplete",
          label: "Observation Complete",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "recordedContactVisit",
          label: "Recorded Contact Visit",
          valueType: { type: "boolean" },
        },
        { id: "missing", label: "Missing", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = pollinatorContactVisitFlagTool.execute;
export default pollinatorContactVisitFlagTool;
