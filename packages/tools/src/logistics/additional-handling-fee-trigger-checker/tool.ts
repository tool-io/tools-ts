import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AdditionalHandlingFeeTriggerCheckerInput = {
  readonly lengthIn: number;
  readonly widthIn: number;
  readonly heightIn: number;
  readonly weightLb: number;
  readonly maximumLongestSideIn?: number;
  readonly maximumSecondLongestSideIn?: number;
  readonly maximumWeightLb?: number;
  readonly maximumLengthPlusGirthIn?: number;
};

export type AdditionalHandlingFeeTriggerCheckerOutput = {
  readonly longestSideTrigger: boolean;
  readonly secondLongestSideTrigger: boolean;
  readonly weightTrigger: boolean;
  readonly lengthPlusGirthTrigger: boolean;
  readonly additionalHandlingApplies: boolean;
};

const requirePositiveFinite = (value: number, field: string): void => {
  if (!Number.isFinite(value) || value <= 0) {
    simpleError(
      field,
      "Dimensions, weight, and thresholds must be finite and greater than zero.",
      "invalid_measure",
    );
  }
};

export const calculateAdditionalHandlingFeeTriggerChecker = (
  input: AdditionalHandlingFeeTriggerCheckerInput,
): AdditionalHandlingFeeTriggerCheckerOutput => {
  requirePositiveFinite(input.lengthIn, "lengthIn");
  requirePositiveFinite(input.widthIn, "widthIn");
  requirePositiveFinite(input.heightIn, "heightIn");
  requirePositiveFinite(input.weightLb, "weightLb");

  const maximumLongestSideIn =
    input.maximumLongestSideIn === undefined ? 48 : input.maximumLongestSideIn;
  const maximumSecondLongestSideIn =
    input.maximumSecondLongestSideIn === undefined
      ? 30
      : input.maximumSecondLongestSideIn;
  const maximumWeightLb =
    input.maximumWeightLb === undefined ? 50 : input.maximumWeightLb;
  const maximumLengthPlusGirthIn =
    input.maximumLengthPlusGirthIn === undefined
      ? 105
      : input.maximumLengthPlusGirthIn;

  requirePositiveFinite(maximumLongestSideIn, "maximumLongestSideIn");
  requirePositiveFinite(
    maximumSecondLongestSideIn,
    "maximumSecondLongestSideIn",
  );
  requirePositiveFinite(maximumWeightLb, "maximumWeightLb");
  requirePositiveFinite(maximumLengthPlusGirthIn, "maximumLengthPlusGirthIn");

  const orderedSides = [input.lengthIn, input.widthIn, input.heightIn].sort(
    (first, second) => second - first,
  );
  const longestSideIn = orderedSides[0] as number;
  const secondLongestSideIn = orderedSides[1] as number;
  const shortestSideIn = orderedSides[2] as number;
  const lengthPlusGirthIn =
    longestSideIn + 2 * (secondLongestSideIn + shortestSideIn);

  const longestSideTrigger = longestSideIn > maximumLongestSideIn;
  const secondLongestSideTrigger =
    secondLongestSideIn > maximumSecondLongestSideIn;
  const weightTrigger = input.weightLb > maximumWeightLb;
  const lengthPlusGirthTrigger = lengthPlusGirthIn > maximumLengthPlusGirthIn;

  return {
    longestSideTrigger,
    secondLongestSideTrigger,
    weightTrigger,
    lengthPlusGirthTrigger,
    additionalHandlingApplies:
      longestSideTrigger ||
      secondLongestSideTrigger ||
      weightTrigger ||
      lengthPlusGirthTrigger,
  };
};

export const additionalHandlingFeeTriggerCheckerExample = {
  input: { lengthIn: 50, widthIn: 32, heightIn: 20, weightLb: 55 },
  output: {
    longestSideTrigger: true,
    secondLongestSideTrigger: true,
    weightTrigger: true,
    lengthPlusGirthTrigger: true,
    additionalHandlingApplies: true,
  },
} satisfies ToolExample<
  AdditionalHandlingFeeTriggerCheckerInput,
  AdditionalHandlingFeeTriggerCheckerOutput
>;

export const additionalHandlingFeeTriggerCheckerTool = createSimpleTool({
  id: "logistics/additional-handling-fee-trigger-checker",
  title: "Additional Handling Fee Trigger Checker",
  description:
    "Check a rectangular parcel against configurable longest-side, second-longest-side, actual-weight, and length-plus-girth thresholds; packaging and service-specific rules are outside this numeric screen.",
  inputs: [
    {
      description: "One parcel side in inches; side order does not matter.",
      id: "lengthIn",
      kind: "number",
      label: "Length",
      minimum: Number.MIN_VALUE,
      unit: "in",
    },
    {
      description:
        "A second parcel side in inches; side order does not matter.",
      id: "widthIn",
      kind: "number",
      label: "Width",
      minimum: Number.MIN_VALUE,
      unit: "in",
    },
    {
      description:
        "The remaining parcel side in inches; side order does not matter.",
      id: "heightIn",
      kind: "number",
      label: "Height",
      minimum: Number.MIN_VALUE,
      unit: "in",
    },
    {
      description: "Actual package weight in pounds.",
      id: "weightLb",
      kind: "number",
      label: "Weight",
      minimum: Number.MIN_VALUE,
      unit: "lb",
    },
    {
      default: 48,
      description: "Longest-side threshold in inches.",
      id: "maximumLongestSideIn",
      kind: "number",
      label: "Max longest side",
      minimum: Number.MIN_VALUE,
      unit: "in",
    },
    {
      default: 30,
      description: "Second-longest-side threshold in inches.",
      id: "maximumSecondLongestSideIn",
      kind: "number",
      label: "Max second-longest side",
      minimum: Number.MIN_VALUE,
      unit: "in",
    },
    {
      default: 50,
      description: "Actual-weight threshold in pounds.",
      id: "maximumWeightLb",
      kind: "number",
      label: "Max weight",
      minimum: Number.MIN_VALUE,
      unit: "lb",
    },
    {
      default: 105,
      description:
        "Length-plus-girth threshold, where length is the longest side and girth is twice the sum of the other sides.",
      id: "maximumLengthPlusGirthIn",
      kind: "number",
      label: "Max length plus girth",
      minimum: Number.MIN_VALUE,
      unit: "in",
    },
  ],
  outputs: [
    {
      description: "Whether the longest side exceeds its threshold.",
      id: "longestSideTrigger",
      kind: "boolean",
      label: "Longest-side trigger",
    },
    {
      description: "Whether the second-longest side exceeds its threshold.",
      id: "secondLongestSideTrigger",
      kind: "boolean",
      label: "Second-longest-side trigger",
    },
    {
      description: "Whether actual weight exceeds its threshold.",
      id: "weightTrigger",
      kind: "boolean",
      label: "Weight trigger",
    },
    {
      description: "Whether length plus girth exceeds its threshold.",
      id: "lengthPlusGirthTrigger",
      kind: "boolean",
      label: "Length-plus-girth trigger",
    },
    {
      description: "Whether any configured numeric trigger fired.",
      id: "additionalHandlingApplies",
      kind: "boolean",
      label: "Additional handling applies",
    },
  ],
  calculate: (input) =>
    calculateAdditionalHandlingFeeTriggerChecker({
      lengthIn: input.lengthIn as number,
      widthIn: input.widthIn as number,
      heightIn: input.heightIn as number,
      weightLb: input.weightLb as number,
      maximumLongestSideIn: input.maximumLongestSideIn as number,
      maximumSecondLongestSideIn: input.maximumSecondLongestSideIn as number,
      maximumWeightLb: input.maximumWeightLb as number,
      maximumLengthPlusGirthIn: input.maximumLengthPlusGirthIn as number,
    }),
});

export const runAdditionalHandlingFeeTriggerChecker =
  additionalHandlingFeeTriggerCheckerTool.execute;
export default additionalHandlingFeeTriggerCheckerTool;
