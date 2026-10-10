import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly payloadBits: number;
  readonly fixedHeaderBits: number;
};
export type Output = {
  readonly totalBits: number;
  readonly headerFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    payloadBits: { type: "integer", minimum: 0 },
    fixedHeaderBits: { type: "integer", minimum: 0 },
  },
  required: ["payloadBits", "fixedHeaderBits"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalBits: { type: "integer" },
    headerFraction: { type: "number" },
  },
  required: ["totalBits", "headerFraction"],
} as const;
/** Normalize an explicit fixed header bit count to total header-plus-payload bits without assuming a protocol. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { payloadBits, fixedHeaderBits } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(payloadBits) &&
        payloadBits >= 0 &&
        payloadBits <= Number.MAX_SAFE_INTEGER,
      "payloadBits",
    ),
      payloadBits);
    (H.domain(
      Number.isSafeInteger(fixedHeaderBits) &&
        fixedHeaderBits >= 0 &&
        fixedHeaderBits <= Number.MAX_SAFE_INTEGER,
      "fixedHeaderBits",
    ),
      fixedHeaderBits);
    H.domain(payloadBits + fixedHeaderBits > 0, "payloadBits");
    return {
      totalBits: Number(BigInt(payloadBits) + BigInt(fixedHeaderBits)),
      headerFraction: fixedHeaderBits / (payloadBits + fixedHeaderBits),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { payloadBits: 900, fixedHeaderBits: 100 },
  output: { totalBits: 1000, headerFraction: 0.1 },
} satisfies ToolExample<Input, Output>;
export const codingOverheadFixedHeaderShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["information", "information theory", "computer science"],
      keywords: ["information theory", "computer science"],
    },
    id: "information/coding-overhead-fixed-header-share",
    title: "Coding Overhead Fixed Header Share",
    description:
      "Normalize an explicit fixed header bit count to total header-plus-payload bits without assuming a protocol.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        payloadBits: { type: "integer", minimum: 0 },
        fixedHeaderBits: { type: "integer", minimum: 0 },
      },
      required: ["payloadBits", "fixedHeaderBits"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalBits: { type: "integer" },
        headerFraction: { type: "number" },
      },
      required: ["totalBits", "headerFraction"],
    },
    ports: {
      inputs: [
        {
          id: "payloadBits",
          label: "Payload Bits",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "fixedHeaderBits",
          label: "Fixed Header Bits",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "totalBits",
          label: "Total Bits",
          valueType: { type: "integer" },
        },
        {
          id: "headerFraction",
          label: "Header Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = codingOverheadFixedHeaderShareTool.execute;
export default codingOverheadFixedHeaderShareTool;
