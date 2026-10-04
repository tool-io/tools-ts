import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly freshMass: number;
  readonly preservedMass: number;
  readonly containerTare: number;
  readonly referenceRetention: number;
};
export type Output = {
  readonly netPreservedMass: number;
  readonly observedRetention: number;
  readonly retentionGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    freshMass: { type: "number", exclusiveMinimum: 0 },
    preservedMass: { type: "number" },
    containerTare: { type: "number", minimum: 0 },
    referenceRetention: { type: "number", minimum: 0 },
  },
  required: [
    "freshMass",
    "preservedMass",
    "containerTare",
    "referenceRetention",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    netPreservedMass: { type: "number" },
    observedRetention: { type: "number" },
    retentionGap: { type: "number" },
  },
  required: ["netPreservedMass", "observedRetention", "retentionGap"],
} as const;
/** Calculate zoological specimen preservation weight gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { freshMass, preservedMass, containerTare, referenceRetention } =
    request;
  const compute = (): Output => {
    H.positive(freshMass);
    H.domain(
      containerTare >= 0 &&
        preservedMass >= containerTare &&
        referenceRetention >= 0,
    );
    return {
      netPreservedMass: preservedMass - containerTare,
      observedRetention: (preservedMass - containerTare) / freshMass,
      retentionGap:
        (preservedMass - containerTare) / freshMass - referenceRetention,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    freshMass: 100,
    preservedMass: 85,
    containerTare: 5,
    referenceRetention: 0.75,
  },
  output: {
    netPreservedMass: 80,
    observedRetention: 0.8,
    retentionGap: 0.050000000000000044,
  },
} satisfies ToolExample<Input, Output>;
export const zoologicalSpecimenPreservationWeightGapTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "zoology/zoological-specimen-preservation-weight-gap",
      title: "Zoological Specimen Preservation Weight Gap Tool",
      description:
        "Calculate zoological specimen preservation weight gap from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          freshMass: { type: "number", exclusiveMinimum: 0 },
          preservedMass: { type: "number" },
          containerTare: { type: "number", minimum: 0 },
          referenceRetention: { type: "number", minimum: 0 },
        },
        required: [
          "freshMass",
          "preservedMass",
          "containerTare",
          "referenceRetention",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          netPreservedMass: { type: "number" },
          observedRetention: { type: "number" },
          retentionGap: { type: "number" },
        },
        required: ["netPreservedMass", "observedRetention", "retentionGap"],
      },
      ports: {
        inputs: [
          {
            id: "freshMass",
            label: "Fresh Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "preservedMass",
            label: "Preserved Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "containerTare",
            label: "Container Tare",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "referenceRetention",
            label: "Reference Retention",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "netPreservedMass",
            label: "Net Preserved Mass",
            valueType: { type: "number" },
          },
          {
            id: "observedRetention",
            label: "Observed Retention",
            valueType: { type: "number" },
          },
          {
            id: "retentionGap",
            label: "Retention Gap",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = zoologicalSpecimenPreservationWeightGapTool.execute;
export default zoologicalSpecimenPreservationWeightGapTool;
