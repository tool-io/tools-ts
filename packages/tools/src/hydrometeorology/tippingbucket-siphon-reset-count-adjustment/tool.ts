import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordedTips: number;
  readonly suppliedLostTips: number;
};
export type Output = { readonly adjustedTips: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedTips: { type: "integer", minimum: 0 },
    suppliedLostTips: { type: "integer", minimum: 0 },
  },
  required: ["recordedTips", "suppliedLostTips"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { adjustedTips: { type: "integer" } },
  required: ["adjustedTips"],
} as const;
/** Add an explicitly supplied lost-tip correction to a tipping-bucket count without detecting resets or choosing bucket volume. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordedTips, suppliedLostTips } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(recordedTips) &&
        recordedTips >= 0 &&
        recordedTips <= Number.MAX_SAFE_INTEGER,
      "recordedTips",
    ),
      recordedTips);
    (H.domain(
      Number.isSafeInteger(suppliedLostTips) &&
        suppliedLostTips >= 0 &&
        suppliedLostTips <= Number.MAX_SAFE_INTEGER,
      "suppliedLostTips",
    ),
      suppliedLostTips);
    return {
      adjustedTips: Number(BigInt(recordedTips) + BigInt(suppliedLostTips)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordedTips: 100, suppliedLostTips: 3 },
  output: { adjustedTips: 103 },
} satisfies ToolExample<Input, Output>;
export const tippingbucketSiphonResetCountAdjustmentTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "hydrometeorology/tippingbucket-siphon-reset-count-adjustment",
      title: "Tippingbucket Siphon Reset Count Adjustment Tool",
      description:
        "Add an explicitly supplied lost-tip correction to a tipping-bucket count without detecting resets or choosing bucket volume.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          recordedTips: { type: "integer", minimum: 0 },
          suppliedLostTips: { type: "integer", minimum: 0 },
        },
        required: ["recordedTips", "suppliedLostTips"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { adjustedTips: { type: "integer" } },
        required: ["adjustedTips"],
      },
      ports: {
        inputs: [
          {
            id: "recordedTips",
            label: "Recorded Tips",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "suppliedLostTips",
            label: "Supplied Lost Tips",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "adjustedTips",
            label: "Adjusted Tips",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = tippingbucketSiphonResetCountAdjustmentTool.execute;
export default tippingbucketSiphonResetCountAdjustmentTool;
