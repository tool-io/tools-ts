import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reported: number;
  readonly beforeWidth: number;
  readonly afterWidth: number;
};
export type Output = {
  readonly earliest: number;
  readonly latest: number;
  readonly width: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reported: { type: "number" },
    beforeWidth: { type: "number", minimum: 0 },
    afterWidth: { type: "number", minimum: 0 },
  },
  required: ["reported", "beforeWidth", "afterWidth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    earliest: { type: "number" },
    latest: { type: "number" },
    width: { type: "number" },
  },
  required: ["earliest", "latest", "width"],
} as const;
/** Calculate biobank sample acquisition precision envelope from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reported, beforeWidth, afterWidth } = request;
  const compute = (): Output => {
    H.domain(beforeWidth >= 0 && afterWidth >= 0);
    return {
      earliest: reported - beforeWidth,
      latest: reported + afterWidth,
      width: beforeWidth + afterWidth,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { reported: 100, beforeWidth: 2, afterWidth: 3 },
  output: { earliest: 98, latest: 103, width: 5 },
} satisfies ToolExample<Input, Output>;
export const biobankSampleAcquisitionPrecisionEnvelopeTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "biobanking/biobank-sample-acquisition-precision-envelope",
      title: "Biobank Sample Acquisition Precision Envelope Tool",
      description:
        "Calculate biobank sample acquisition precision envelope from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          reported: { type: "number" },
          beforeWidth: { type: "number", minimum: 0 },
          afterWidth: { type: "number", minimum: 0 },
        },
        required: ["reported", "beforeWidth", "afterWidth"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          earliest: { type: "number" },
          latest: { type: "number" },
          width: { type: "number" },
        },
        required: ["earliest", "latest", "width"],
      },
      ports: {
        inputs: [
          {
            id: "reported",
            label: "Reported",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "beforeWidth",
            label: "Before Width",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "afterWidth",
            label: "After Width",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "earliest", label: "Earliest", valueType: { type: "number" } },
          { id: "latest", label: "Latest", valueType: { type: "number" } },
          { id: "width", label: "Width", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = biobankSampleAcquisitionPrecisionEnvelopeTool.execute;
export default biobankSampleAcquisitionPrecisionEnvelopeTool;
