import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstActive: number;
  readonly firstControl: number;
  readonly secondActive: number;
  readonly secondControl: number;
};
export type Output = {
  readonly firstContrast: number;
  readonly secondContrast: number;
  readonly periodDifference: number;
  readonly sequenceImbalance: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstActive: { type: "number" },
    firstControl: { type: "number" },
    secondActive: { type: "number" },
    secondControl: { type: "number" },
  },
  required: ["firstActive", "firstControl", "secondActive", "secondControl"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstContrast: { type: "number" },
    secondContrast: { type: "number" },
    periodDifference: { type: "number" },
    sequenceImbalance: { type: "number" },
  },
  required: [
    "firstContrast",
    "secondContrast",
    "periodDifference",
    "sequenceImbalance",
  ],
} as const;
/** Descriptive supplied crossover contrasts without causal or carryover identification. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstActive, firstControl, secondActive, secondControl } = request;
  const compute = (): Output => {
    return {
      firstContrast: firstActive - firstControl,
      secondContrast: secondActive - secondControl,
      periodDifference:
        (secondActive + secondControl - firstActive - firstControl) / 2,
      sequenceImbalance:
        firstActive + secondControl - firstControl - secondActive,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstActive: 10,
    firstControl: 8,
    secondActive: 12,
    secondControl: 9,
  },
  output: {
    firstContrast: 2,
    secondContrast: 3,
    periodDifference: 1.5,
    sequenceImbalance: -1,
  },
} satisfies ToolExample<Input, Output>;
export const osteopathicStudyCrossoverPeriodImbalanceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "osteopathy/osteopathic-study-crossover-period-imbalance",
      title: "Osteopathic Study Crossover Period Imbalance Tool",
      description:
        "Descriptive supplied crossover contrasts without causal or carryover identification.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstActive: { type: "number" },
          firstControl: { type: "number" },
          secondActive: { type: "number" },
          secondControl: { type: "number" },
        },
        required: [
          "firstActive",
          "firstControl",
          "secondActive",
          "secondControl",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstContrast: { type: "number" },
          secondContrast: { type: "number" },
          periodDifference: { type: "number" },
          sequenceImbalance: { type: "number" },
        },
        required: [
          "firstContrast",
          "secondContrast",
          "periodDifference",
          "sequenceImbalance",
        ],
      },
      ports: {
        inputs: [
          {
            id: "firstActive",
            label: "First Active",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "firstControl",
            label: "First Control",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "secondActive",
            label: "Second Active",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "secondControl",
            label: "Second Control",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "firstContrast",
            label: "First Contrast",
            valueType: { type: "number" },
          },
          {
            id: "secondContrast",
            label: "Second Contrast",
            valueType: { type: "number" },
          },
          {
            id: "periodDifference",
            label: "Period Difference",
            valueType: { type: "number" },
          },
          {
            id: "sequenceImbalance",
            label: "Sequence Imbalance",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = osteopathicStudyCrossoverPeriodImbalanceTool.execute;
export default osteopathicStudyCrossoverPeriodImbalanceTool;
