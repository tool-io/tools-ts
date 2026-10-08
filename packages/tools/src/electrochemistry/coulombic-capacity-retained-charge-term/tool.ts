import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly inputCharge: number;
  readonly suppliedRetentionFraction: number;
};
export type Output = {
  readonly retainedCharge: number;
  readonly lostCharge: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inputCharge: { type: "number", minimum: 0 },
    suppliedRetentionFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["inputCharge", "suppliedRetentionFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    retainedCharge: { type: "number" },
    lostCharge: { type: "number" },
  },
  required: ["retainedCharge", "lostCharge"],
} as const;
/** Split an explicit nonnegative charge quantity by a supplied retained fraction without estimating battery capacity or cycle life. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { inputCharge, suppliedRetentionFraction } = request;
  const compute = (): Output => {
    H.domain(inputCharge >= 0, "inputCharge");
    (H.domain(
      suppliedRetentionFraction >= 0 && suppliedRetentionFraction <= 1,
      "suppliedRetentionFraction",
    ),
      suppliedRetentionFraction);
    return {
      retainedCharge: inputCharge * suppliedRetentionFraction,
      lostCharge: inputCharge * (1 - suppliedRetentionFraction),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { inputCharge: 100, suppliedRetentionFraction: 0.8 },
  output: { retainedCharge: 80, lostCharge: 19.999999999999996 },
} satisfies ToolExample<Input, Output>;
export const coulombicCapacityRetainedChargeTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "electrochemistry/coulombic-capacity-retained-charge-term",
      title: "Coulombic Capacity Retained Charge Term Tool",
      description:
        "Split an explicit nonnegative charge quantity by a supplied retained fraction without estimating battery capacity or cycle life.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          inputCharge: { type: "number", minimum: 0 },
          suppliedRetentionFraction: { type: "number", minimum: 0, maximum: 1 },
        },
        required: ["inputCharge", "suppliedRetentionFraction"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          retainedCharge: { type: "number" },
          lostCharge: { type: "number" },
        },
        required: ["retainedCharge", "lostCharge"],
      },
      ports: {
        inputs: [
          {
            id: "inputCharge",
            label: "Input Charge",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "suppliedRetentionFraction",
            label: "Supplied Retention Fraction",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "retainedCharge",
            label: "Retained Charge",
            valueType: { type: "number" },
          },
          {
            id: "lostCharge",
            label: "Lost Charge",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = coulombicCapacityRetainedChargeTermTool.execute;
export default coulombicCapacityRetainedChargeTermTool;
