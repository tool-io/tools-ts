import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceCount: number;
  readonly transferredFraction: number;
};
export type Output = {
  readonly expectedTransferred: number;
  readonly expectedRemaining: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceCount: { type: "integer", minimum: 0 },
    transferredFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["sourceCount", "transferredFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expectedTransferred: { type: "number" },
    expectedRemaining: { type: "number" },
  },
  required: ["expectedTransferred", "expectedRemaining"],
} as const;
/** Return expectation-level counts under an explicit proportional transfer without rounding or simulating individuals. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourceCount, transferredFraction } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(sourceCount) &&
        sourceCount >= 0 &&
        sourceCount <= Number.MAX_SAFE_INTEGER,
      "sourceCount",
    ),
      sourceCount);
    (H.domain(
      transferredFraction >= 0 && transferredFraction <= 1,
      "transferredFraction",
    ),
      transferredFraction);
    return {
      expectedTransferred: sourceCount * transferredFraction,
      expectedRemaining: sourceCount * (1 - transferredFraction),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sourceCount: 1000, transferredFraction: 0.1 },
  output: { expectedTransferred: 100, expectedRemaining: 900 },
} satisfies ToolExample<Input, Output>;
export const populationTransferDilutionCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["evolutionary-biology", "evolutionary biology", "biology"],
      keywords: ["evolutionary biology", "biology"],
    },
    id: "evolutionary-biology/population-transfer-dilution-count",
    title: "Population Transfer Dilution Count",
    description:
      "Return expectation-level counts under an explicit proportional transfer without rounding or simulating individuals.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceCount: { type: "integer", minimum: 0 },
        transferredFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["sourceCount", "transferredFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        expectedTransferred: { type: "number" },
        expectedRemaining: { type: "number" },
      },
      required: ["expectedTransferred", "expectedRemaining"],
    },
    ports: {
      inputs: [
        {
          id: "sourceCount",
          label: "Source Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "transferredFraction",
          label: "Transferred Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "expectedTransferred",
          label: "Expected Transferred",
          valueType: { type: "number" },
        },
        {
          id: "expectedRemaining",
          label: "Expected Remaining",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = populationTransferDilutionCountTool.execute;
export default populationTransferDilutionCountTool;
