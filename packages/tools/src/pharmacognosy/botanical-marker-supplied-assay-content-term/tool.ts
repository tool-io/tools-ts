import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleSignal: number;
  readonly blankSignal: number;
  readonly referenceSignal: number;
  readonly referenceMass: number;
  readonly sampleMass: number;
  readonly dilution: number;
};
export type Output = {
  readonly correctedSignal: number;
  readonly markerMass: number;
  readonly massFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleSignal: { type: "number" },
    blankSignal: { type: "number" },
    referenceSignal: { type: "number", exclusiveMinimum: 0 },
    referenceMass: { type: "number", exclusiveMinimum: 0 },
    sampleMass: { type: "number", exclusiveMinimum: 0 },
    dilution: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "sampleSignal",
    "blankSignal",
    "referenceSignal",
    "referenceMass",
    "sampleMass",
    "dilution",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    correctedSignal: { type: "number" },
    markerMass: { type: "number" },
    massFraction: { type: "number" },
  },
  required: ["correctedSignal", "markerMass", "massFraction"],
} as const;
/** One supplied linear assay-reference mass calculation without identifying a substance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    sampleSignal,
    blankSignal,
    referenceSignal,
    referenceMass,
    sampleMass,
    dilution,
  } = request;
  const compute = (): Output => {
    H.positive(referenceSignal);
    H.positive(referenceMass);
    H.positive(sampleMass);
    H.positive(dilution);
    return {
      correctedSignal: sampleSignal - blankSignal,
      markerMass:
        ((sampleSignal - blankSignal) * referenceMass * dilution) /
        referenceSignal,
      massFraction:
        ((sampleSignal - blankSignal) * referenceMass * dilution) /
        (referenceSignal * sampleMass),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sampleSignal: 120,
    blankSignal: 20,
    referenceSignal: 50,
    referenceMass: 2,
    sampleMass: 100,
    dilution: 5,
  },
  output: { correctedSignal: 100, markerMass: 20, massFraction: 0.2 },
} satisfies ToolExample<Input, Output>;
export const botanicalMarkerSuppliedAssayContentTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "pharmacognosy/botanical-marker-supplied-assay-content-term",
      title: "Botanical Marker Supplied Assay Content Term Tool",
      description:
        "One supplied linear assay-reference mass calculation without identifying a substance.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          sampleSignal: { type: "number" },
          blankSignal: { type: "number" },
          referenceSignal: { type: "number", exclusiveMinimum: 0 },
          referenceMass: { type: "number", exclusiveMinimum: 0 },
          sampleMass: { type: "number", exclusiveMinimum: 0 },
          dilution: { type: "number", exclusiveMinimum: 0 },
        },
        required: [
          "sampleSignal",
          "blankSignal",
          "referenceSignal",
          "referenceMass",
          "sampleMass",
          "dilution",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          correctedSignal: { type: "number" },
          markerMass: { type: "number" },
          massFraction: { type: "number" },
        },
        required: ["correctedSignal", "markerMass", "massFraction"],
      },
      ports: {
        inputs: [
          {
            id: "sampleSignal",
            label: "Sample Signal",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "blankSignal",
            label: "Blank Signal",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "referenceSignal",
            label: "Reference Signal",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "referenceMass",
            label: "Reference Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "sampleMass",
            label: "Sample Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "dilution",
            label: "Dilution",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "correctedSignal",
            label: "Corrected Signal",
            valueType: { type: "number" },
          },
          {
            id: "markerMass",
            label: "Marker Mass",
            valueType: { type: "number" },
          },
          {
            id: "massFraction",
            label: "Mass Fraction",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = botanicalMarkerSuppliedAssayContentTermTool.execute;
export default botanicalMarkerSuppliedAssayContentTermTool;
