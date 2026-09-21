import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly parcelArea: number;
  readonly bufferArea: number;
  readonly otherExcluded: number;
  readonly overlap: number;
  readonly rate: number;
};
export type Output = {
  readonly eligibleArea: number;
  readonly payment: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    parcelArea: { type: "number", minimum: 0 },
    bufferArea: { type: "number", minimum: 0 },
    otherExcluded: { type: "number", minimum: 0 },
    overlap: { type: "number", minimum: 0 },
    rate: { type: "number", minimum: 0 },
  },
  required: ["parcelArea", "bufferArea", "otherExcluded", "overlap", "rate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { eligibleArea: { type: "number" }, payment: { type: "number" } },
  required: ["eligibleArea", "payment"],
} as const;
/** Calculate conservation payment excluded buffer area from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { parcelArea, bufferArea, otherExcluded, overlap, rate } = request;
  const compute = (): Output => {
    H.domain(
      parcelArea >= 0 &&
        bufferArea >= 0 &&
        otherExcluded >= 0 &&
        overlap >= 0 &&
        overlap <= Math.min(bufferArea, otherExcluded) &&
        bufferArea + otherExcluded - overlap <= parcelArea &&
        rate >= 0,
    );
    return {
      eligibleArea: parcelArea - bufferArea - otherExcluded + overlap,
      payment: (parcelArea - bufferArea - otherExcluded + overlap) * rate,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    parcelArea: 100,
    bufferArea: 10,
    otherExcluded: 20,
    overlap: 5,
    rate: 30,
  },
  output: { eligibleArea: 75, payment: 2250 },
} satisfies ToolExample<Input, Output>;
export const conservationPaymentExcludedBufferAreaTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "agricultural-policy/conservation-payment-excluded-buffer-area",
      title: "Conservation Payment Excluded Buffer Area Tool",
      description:
        "Calculate conservation payment excluded buffer area from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          parcelArea: { type: "number", minimum: 0 },
          bufferArea: { type: "number", minimum: 0 },
          otherExcluded: { type: "number", minimum: 0 },
          overlap: { type: "number", minimum: 0 },
          rate: { type: "number", minimum: 0 },
        },
        required: [
          "parcelArea",
          "bufferArea",
          "otherExcluded",
          "overlap",
          "rate",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          eligibleArea: { type: "number" },
          payment: { type: "number" },
        },
        required: ["eligibleArea", "payment"],
      },
      ports: {
        inputs: [
          {
            id: "parcelArea",
            label: "Parcel Area",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "bufferArea",
            label: "Buffer Area",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "otherExcluded",
            label: "Other Excluded",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "overlap",
            label: "Overlap",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "rate",
            label: "Rate",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "eligibleArea",
            label: "Eligible Area",
            valueType: { type: "number" },
          },
          { id: "payment", label: "Payment", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = conservationPaymentExcludedBufferAreaTool.execute;
export default conservationPaymentExcludedBufferAreaTool;
