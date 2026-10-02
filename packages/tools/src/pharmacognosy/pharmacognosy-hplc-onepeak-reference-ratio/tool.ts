import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly area: number;
  readonly referenceArea: number;
  readonly referenceConcentration: number;
  readonly responseFactor: number;
  readonly sampleDilution: number;
};
export type Output = {
  readonly areaRatio: number;
  readonly correctedConcentration: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    area: { type: "number", minimum: 0 },
    referenceArea: { type: "number", exclusiveMinimum: 0 },
    referenceConcentration: { type: "number", exclusiveMinimum: 0 },
    responseFactor: { type: "number", exclusiveMinimum: 0 },
    sampleDilution: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "area",
    "referenceArea",
    "referenceConcentration",
    "responseFactor",
    "sampleDilution",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    areaRatio: { type: "number" },
    correctedConcentration: { type: "number" },
  },
  required: ["areaRatio", "correctedConcentration"],
} as const;
/** Calculate pharmacognosy hplc onepeak reference ratio from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    area,
    referenceArea,
    referenceConcentration,
    responseFactor,
    sampleDilution,
  } = request;
  const compute = (): Output => {
    H.domain(area >= 0);
    H.positive(referenceArea);
    H.positive(referenceConcentration);
    H.positive(responseFactor);
    H.positive(sampleDilution);
    return {
      areaRatio: area / referenceArea,
      correctedConcentration:
        (area * referenceConcentration * sampleDilution) /
        (referenceArea * responseFactor),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    area: 120,
    referenceArea: 100,
    referenceConcentration: 2,
    responseFactor: 1.2,
    sampleDilution: 5,
  },
  output: { areaRatio: 1.2, correctedConcentration: 10 },
} satisfies ToolExample<Input, Output>;
export const pharmacognosyHplcOnepeakReferenceRatioTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "pharmacognosy/pharmacognosy-hplc-onepeak-reference-ratio",
      title: "Pharmacognosy HPLC Onepeak Reference Ratio Tool",
      description:
        "Calculate pharmacognosy hplc onepeak reference ratio from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          area: { type: "number", minimum: 0 },
          referenceArea: { type: "number", exclusiveMinimum: 0 },
          referenceConcentration: { type: "number", exclusiveMinimum: 0 },
          responseFactor: { type: "number", exclusiveMinimum: 0 },
          sampleDilution: { type: "number", exclusiveMinimum: 0 },
        },
        required: [
          "area",
          "referenceArea",
          "referenceConcentration",
          "responseFactor",
          "sampleDilution",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          areaRatio: { type: "number" },
          correctedConcentration: { type: "number" },
        },
        required: ["areaRatio", "correctedConcentration"],
      },
      ports: {
        inputs: [
          {
            id: "area",
            label: "Area",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "referenceArea",
            label: "Reference Area",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "referenceConcentration",
            label: "Reference Concentration",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "responseFactor",
            label: "Response Factor",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "sampleDilution",
            label: "Sample Dilution",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "areaRatio",
            label: "Area Ratio",
            valueType: { type: "number" },
          },
          {
            id: "correctedConcentration",
            label: "Corrected Concentration",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = pharmacognosyHplcOnepeakReferenceRatioTool.execute;
export default pharmacognosyHplcOnepeakReferenceRatioTool;
