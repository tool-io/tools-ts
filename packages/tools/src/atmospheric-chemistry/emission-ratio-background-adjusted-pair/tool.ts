import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstObserved: number;
  readonly firstBackground: number;
  readonly secondObserved: number;
  readonly secondBackground: number;
};
export type Output = {
  readonly firstExcess: number;
  readonly secondExcess: number;
  readonly ratio: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstObserved: { type: "number" },
    firstBackground: { type: "number" },
    secondObserved: { type: "number" },
    secondBackground: { type: "number" },
  },
  required: [
    "firstObserved",
    "firstBackground",
    "secondObserved",
    "secondBackground",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstExcess: { type: "number" },
    secondExcess: { type: "number" },
    ratio: { type: "number" },
  },
  required: ["firstExcess", "secondExcess", "ratio"],
} as const;
/** Calculate emission ratio background adjusted pair from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstObserved, firstBackground, secondObserved, secondBackground } =
    request;
  const compute = (): Output => {
    H.domain(secondObserved !== secondBackground);
    return {
      firstExcess: firstObserved - firstBackground,
      secondExcess: secondObserved - secondBackground,
      ratio:
        (firstObserved - firstBackground) / (secondObserved - secondBackground),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstObserved: 12,
    firstBackground: 2,
    secondObserved: 7,
    secondBackground: 2,
  },
  output: { firstExcess: 10, secondExcess: 5, ratio: 2 },
} satisfies ToolExample<Input, Output>;
export const emissionRatioBackgroundAdjustedPairTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "atmospheric-chemistry/emission-ratio-background-adjusted-pair",
      title: "Emission Ratio Background Adjusted Pair Tool",
      description:
        "Calculate emission ratio background adjusted pair from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstObserved: { type: "number" },
          firstBackground: { type: "number" },
          secondObserved: { type: "number" },
          secondBackground: { type: "number" },
        },
        required: [
          "firstObserved",
          "firstBackground",
          "secondObserved",
          "secondBackground",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstExcess: { type: "number" },
          secondExcess: { type: "number" },
          ratio: { type: "number" },
        },
        required: ["firstExcess", "secondExcess", "ratio"],
      },
      ports: {
        inputs: [
          {
            id: "firstObserved",
            label: "First Observed",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "firstBackground",
            label: "First Background",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "secondObserved",
            label: "Second Observed",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "secondBackground",
            label: "Second Background",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "firstExcess",
            label: "First Excess",
            valueType: { type: "number" },
          },
          {
            id: "secondExcess",
            label: "Second Excess",
            valueType: { type: "number" },
          },
          { id: "ratio", label: "Ratio", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = emissionRatioBackgroundAdjustedPairTool.execute;
export default emissionRatioBackgroundAdjustedPairTool;
