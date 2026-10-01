import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly estimate: number;
  readonly nullValue: number;
  readonly ratioScale: boolean;
  readonly beneficialHigher: boolean;
};
export type Output = {
  readonly orientedDifference: number;
  readonly beneficial: boolean;
  readonly atNull: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    estimate: { type: "number" },
    nullValue: { type: "number" },
    ratioScale: { type: "boolean" },
    beneficialHigher: { type: "boolean" },
  },
  required: ["estimate", "nullValue", "ratioScale", "beneficialHigher"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    orientedDifference: { type: "number" },
    beneficial: { type: "boolean" },
    atNull: { type: "boolean" },
  },
  required: ["orientedDifference", "beneficial", "atNull"],
} as const;
/** Orient a supplied difference or ratio effect under an explicit benefit direction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { estimate, nullValue, ratioScale, beneficialHigher } = request;
  const compute = (): Output => {
    H.domain(!ratioScale || (estimate > 0 && nullValue > 0));
    const delta = ratioScale
      ? Math.log(estimate / nullValue)
      : estimate - nullValue;
    return {
      orientedDifference: (beneficialHigher ? 1 : -1) * delta,
      beneficial: (beneficialHigher ? 1 : -1) * delta > 0,
      atNull: estimate === nullValue,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    estimate: 0.8,
    nullValue: 1,
    ratioScale: true,
    beneficialHigher: false,
  },
  output: {
    orientedDifference: 0.2231435513142097,
    beneficial: true,
    atNull: false,
  },
} satisfies ToolExample<Input, Output>;
export const naturopathyReviewEffectDirectionSignTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "naturopathy/naturopathy-review-effect-direction-sign",
      title: "Naturopathy Review Effect Direction Sign Tool",
      description:
        "Orient a supplied difference or ratio effect under an explicit benefit direction.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          estimate: { type: "number" },
          nullValue: { type: "number" },
          ratioScale: { type: "boolean" },
          beneficialHigher: { type: "boolean" },
        },
        required: ["estimate", "nullValue", "ratioScale", "beneficialHigher"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          orientedDifference: { type: "number" },
          beneficial: { type: "boolean" },
          atNull: { type: "boolean" },
        },
        required: ["orientedDifference", "beneficial", "atNull"],
      },
      ports: {
        inputs: [
          {
            id: "estimate",
            label: "Estimate",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "nullValue",
            label: "Null Value",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "ratioScale",
            label: "Ratio Scale",
            required: true,
            valueType: { type: "boolean" },
          },
          {
            id: "beneficialHigher",
            label: "Beneficial Higher",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "orientedDifference",
            label: "Oriented Difference",
            valueType: { type: "number" },
          },
          {
            id: "beneficial",
            label: "Beneficial",
            valueType: { type: "boolean" },
          },
          { id: "atNull", label: "At Null", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = naturopathyReviewEffectDirectionSignTool.execute;
export default naturopathyReviewEffectDirectionSignTool;
