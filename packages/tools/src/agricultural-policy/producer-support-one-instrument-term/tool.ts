import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly eligibleOutput: number;
  readonly administeredPrice: number;
  readonly suppliedReferencePrice: number;
};
export type Output = {
  readonly unitGap: number;
  readonly supportTransfer: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligibleOutput: { type: "number", minimum: 0 },
    administeredPrice: { type: "number", minimum: 0 },
    suppliedReferencePrice: { type: "number", minimum: 0 },
  },
  required: ["eligibleOutput", "administeredPrice", "suppliedReferencePrice"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unitGap: { type: "number" },
    supportTransfer: { type: "number" },
  },
  required: ["unitGap", "supportTransfer"],
} as const;
/** Signed price-gap transfer for one supplied instrument, without aggregation into a policy indicator. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { eligibleOutput, administeredPrice, suppliedReferencePrice } = request;
  const compute = (): Output => {
    H.domain(
      eligibleOutput >= 0 &&
        administeredPrice >= 0 &&
        suppliedReferencePrice >= 0,
    );
    return {
      unitGap: administeredPrice - suppliedReferencePrice,
      supportTransfer:
        eligibleOutput * (administeredPrice - suppliedReferencePrice),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    eligibleOutput: 100,
    administeredPrice: 12,
    suppliedReferencePrice: 10,
  },
  output: { unitGap: 2, supportTransfer: 200 },
} satisfies ToolExample<Input, Output>;
export const producerSupportOneInstrumentTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agricultural-policy/producer-support-one-instrument-term",
    title: "Producer Support One Instrument Term Tool",
    description:
      "Signed price-gap transfer for one supplied instrument, without aggregation into a policy indicator.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eligibleOutput: { type: "number", minimum: 0 },
        administeredPrice: { type: "number", minimum: 0 },
        suppliedReferencePrice: { type: "number", minimum: 0 },
      },
      required: [
        "eligibleOutput",
        "administeredPrice",
        "suppliedReferencePrice",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        unitGap: { type: "number" },
        supportTransfer: { type: "number" },
      },
      required: ["unitGap", "supportTransfer"],
    },
    ports: {
      inputs: [
        {
          id: "eligibleOutput",
          label: "Eligible Output",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "administeredPrice",
          label: "Administered Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedReferencePrice",
          label: "Supplied Reference Price",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "unitGap", label: "Unit Gap", valueType: { type: "number" } },
        {
          id: "supportTransfer",
          label: "Support Transfer",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = producerSupportOneInstrumentTermTool.execute;
export default producerSupportOneInstrumentTermTool;
