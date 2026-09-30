import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly detections: number;
  readonly examinedFields: number;
  readonly excludedFields: number;
  readonly fieldsPerImage: number;
};
export type Output = {
  readonly usableFields: number;
  readonly ratePerUsableField: number;
  readonly equivalentImages: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    detections: { type: "integer", minimum: 0 },
    examinedFields: { type: "integer", minimum: 1 },
    excludedFields: { type: "integer", minimum: 0 },
    fieldsPerImage: { type: "integer", minimum: 1 },
  },
  required: [
    "detections",
    "examinedFields",
    "excludedFields",
    "fieldsPerImage",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    usableFields: { type: "integer" },
    ratePerUsableField: { type: "number" },
    equivalentImages: { type: "number" },
  },
  required: ["usableFields", "ratePerUsableField", "equivalentImages"],
} as const;
/** Calculate microbiology observation detection effort term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { detections, examinedFields, excludedFields, fieldsPerImage } =
    request;
  const compute = (): Output => {
    H.integer(detections, 0);
    H.integer(examinedFields, 1);
    H.integer(excludedFields, 0, examinedFields - 1);
    H.integer(fieldsPerImage, 1);
    return {
      usableFields: examinedFields - excludedFields,
      ratePerUsableField: detections / (examinedFields - excludedFields),
      equivalentImages: (examinedFields - excludedFields) / fieldsPerImage,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    detections: 30,
    examinedFields: 20,
    excludedFields: 5,
    fieldsPerImage: 5,
  },
  output: { usableFields: 15, ratePerUsableField: 2, equivalentImages: 3 },
} satisfies ToolExample<Input, Output>;
export const microbiologyObservationDetectionEffortTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "microbiology/microbiology-observation-detection-effort-term",
      title: "Microbiology Observation Detection Effort Term Tool",
      description:
        "Calculate microbiology observation detection effort term from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          detections: { type: "integer", minimum: 0 },
          examinedFields: { type: "integer", minimum: 1 },
          excludedFields: { type: "integer", minimum: 0 },
          fieldsPerImage: { type: "integer", minimum: 1 },
        },
        required: [
          "detections",
          "examinedFields",
          "excludedFields",
          "fieldsPerImage",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          usableFields: { type: "integer" },
          ratePerUsableField: { type: "number" },
          equivalentImages: { type: "number" },
        },
        required: ["usableFields", "ratePerUsableField", "equivalentImages"],
      },
      ports: {
        inputs: [
          {
            id: "detections",
            label: "Detections",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "examinedFields",
            label: "Examined Fields",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "excludedFields",
            label: "Excluded Fields",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "fieldsPerImage",
            label: "Fields Per Image",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "usableFields",
            label: "Usable Fields",
            valueType: { type: "integer" },
          },
          {
            id: "ratePerUsableField",
            label: "Rate Per Usable Field",
            valueType: { type: "number" },
          },
          {
            id: "equivalentImages",
            label: "Equivalent Images",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = microbiologyObservationDetectionEffortTermTool.execute;
export default microbiologyObservationDetectionEffortTermTool;
