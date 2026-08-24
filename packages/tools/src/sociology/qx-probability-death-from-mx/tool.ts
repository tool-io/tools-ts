import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type QxProbabilityDeathFromMxInput = {
  readonly axYears?: number;
  readonly intervalN?: number;
  readonly mxRate: number;
};

export type QxProbabilityDeathFromMxOutput = {
  readonly qxProbability: number;
};

export const qxProbabilityDeathFromMxExample = {
  input: {
    axYears: 0.5,
    intervalN: 1,
    mxRate: 0.02,
  },
  output: {
    qxProbability: 0.019801980198019802,
  },
} satisfies ToolExample<
  QxProbabilityDeathFromMxInput,
  QxProbabilityDeathFromMxOutput
>;

export const calculateQxFromMx = (
  input: QxProbabilityDeathFromMxInput,
): QxProbabilityDeathFromMxOutput => {
  const width = input.intervalN ?? 1;
  const ax = input.axYears ?? width / 2;
  if (!Number.isFinite(width) || width <= 0)
    simpleError(
      "intervalN",
      "The age interval width must be a finite positive number.",
      "invalid_value",
    );
  if (!Number.isFinite(ax) || ax < 0 || ax > width)
    simpleError(
      "axYears",
      "The average years lived by the dying must fall inside the age interval.",
      "invalid_value",
    );
  if (!Number.isFinite(input.mxRate) || input.mxRate < 0)
    simpleError(
      "mxRate",
      "The central death rate must be a finite nonnegative number.",
      "invalid_value",
    );
  const directNumerator = width * input.mxRate;
  const directDenominator = 1 + (width - ax) * input.mxRate;
  const qxProbability =
    Number.isFinite(directNumerator) && Number.isFinite(directDenominator)
      ? directNumerator / directDenominator
      : width / (1 / input.mxRate + width - ax);
  if (!Number.isFinite(qxProbability) || qxProbability < 0 || qxProbability > 1)
    simpleError(
      "mxRate",
      "This interval, a(x), and m(x) combination does not produce a probability between zero and one.",
      "invalid_probability",
    );
  return {
    qxProbability,
  };
};

export const qxProbabilityDeathFromMxTool = createSimpleTool({
  calculate: (input) =>
    calculateQxFromMx({
      axYears: input.axYears as number,
      intervalN: input.intervalN as number,
      mxRate: input.mxRate as number,
    }),
  description:
    "Convert a central death rate into the life table probability of dying over the age interval.",
  id: "sociology/qx-probability-death-from-mx",
  inputs: [
    {
      description:
        "Average person-years lived in the interval by those who die there.",
      id: "axYears",
      kind: "number",
      label: "a(x)",
      minimum: 0,
      required: false,
      unit: "yr",
    },
    {
      default: 1,
      description: "Width of the age interval.",
      id: "intervalN",
      kind: "number",
      label: "Interval",
      minimum: Number.MIN_VALUE,
      unit: "yr",
    },
    {
      description: "Central death rate for the interval.",
      id: "mxRate",
      kind: "number",
      label: "m(x)",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Life table probability of dying in the interval.",
      id: "qxProbability",
      kind: "number",
      label: "q(x)",
      maximum: 1,
      minimum: 0,
    },
  ],
  title: "q(x) Probability of Death From m(x) Calculator",
});
export const runQxProbabilityDeathFromMx = qxProbabilityDeathFromMxTool.execute;
export default qxProbabilityDeathFromMxTool;
