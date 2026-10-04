import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstRaw: number;
  readonly secondRaw: number;
  readonly firstZero: number;
  readonly secondZero: number;
};
export type Output = {
  readonly correctedFirst: number;
  readonly correctedSecond: number;
  readonly correctedDifference: number;
  readonly zeroDifference: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstRaw: { type: "number" },
    secondRaw: { type: "number" },
    firstZero: { type: "number" },
    secondZero: { type: "number" },
  },
  required: ["firstRaw", "secondRaw", "firstZero", "secondZero"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    correctedFirst: { type: "number" },
    correctedSecond: { type: "number" },
    correctedDifference: { type: "number" },
    zeroDifference: { type: "number" },
  },
  required: [
    "correctedFirst",
    "correctedSecond",
    "correctedDifference",
    "zeroDifference",
  ],
} as const;
/** Explicit two-channel bench zero-drift subtraction and differential, without clinical pressure-channel assignment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstRaw, secondRaw, firstZero, secondZero } = request;
  const compute = (): Output => {
    return {
      correctedFirst: firstRaw - firstZero,
      correctedSecond: secondRaw - secondZero,
      correctedDifference: firstRaw - firstZero - secondRaw + secondZero,
      zeroDifference: firstZero - secondZero,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstRaw: 100, secondRaw: 80, firstZero: 5, secondZero: 2 },
  output: {
    correctedFirst: 95,
    correctedSecond: 78,
    correctedDifference: 17,
    zeroDifference: 3,
  },
} satisfies ToolExample<Input, Output>;
export const urodynamicPressureZeroChannelDriftPairTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "urology/urodynamic-pressure-zero-channel-drift-pair",
      title: "Urodynamic Pressure Zero Channel Drift Pair Tool",
      description:
        "Explicit two-channel bench zero-drift subtraction and differential, without clinical pressure-channel assignment.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstRaw: { type: "number" },
          secondRaw: { type: "number" },
          firstZero: { type: "number" },
          secondZero: { type: "number" },
        },
        required: ["firstRaw", "secondRaw", "firstZero", "secondZero"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          correctedFirst: { type: "number" },
          correctedSecond: { type: "number" },
          correctedDifference: { type: "number" },
          zeroDifference: { type: "number" },
        },
        required: [
          "correctedFirst",
          "correctedSecond",
          "correctedDifference",
          "zeroDifference",
        ],
      },
      ports: {
        inputs: [
          {
            id: "firstRaw",
            label: "First Raw",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "secondRaw",
            label: "Second Raw",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "firstZero",
            label: "First Zero",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "secondZero",
            label: "Second Zero",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "correctedFirst",
            label: "Corrected First",
            valueType: { type: "number" },
          },
          {
            id: "correctedSecond",
            label: "Corrected Second",
            valueType: { type: "number" },
          },
          {
            id: "correctedDifference",
            label: "Corrected Difference",
            valueType: { type: "number" },
          },
          {
            id: "zeroDifference",
            label: "Zero Difference",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = urodynamicPressureZeroChannelDriftPairTool.execute;
export default urodynamicPressureZeroChannelDriftPairTool;
