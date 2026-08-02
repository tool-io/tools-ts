import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolResult,
} from "../../core/result.js";
export type TIntervalInput = {
  readonly confidenceLevel?: number;
  readonly sampleMean: number;
  readonly sampleSize: number;
  readonly sampleStandardDeviation: number;
};
export type TIntervalOutput = {
  readonly criticalValue: number;
  readonly degreesOfFreedom: number;
  readonly lower: number;
  readonly marginOfError: number;
  readonly upper: number;
};

export const tIntervalExample = {
  input: {
    confidenceLevel: 0.95,
    sampleMean: 10,
    sampleSize: 10,
    sampleStandardDeviation: 2,
  },
} satisfies ToolExample<TIntervalInput>;

const logGamma = (value: number): number => {
  const coefficients = [
    676.5203681218851, -1259.1392167224028, 771.3234287776531,
    -176.6150291621406, 12.50734327868691, -0.1385710952657201,
    9.984369578019572e-6, 1.505632735149312e-7,
  ];
  if (value < 0.5)
    return (
      Math.log(Math.PI) -
      Math.log(Math.sin(Math.PI * value)) -
      logGamma(1 - value)
    );
  let x = 0.9999999999998099;
  const z = value - 1;
  coefficients.forEach((coefficient, index) => {
    x += coefficient / (z + index + 1);
  });
  const t = z + coefficients.length - 0.5;
  return (
    0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(x)
  );
};
const betaFraction = (a: number, b: number, x: number): number => {
  const qab = a + b;
  const qap = a + 1;
  const qam = a - 1;
  let c = 1;
  let d = 1 - (qab * x) / qap;
  if (Math.abs(d) < 3e-14) d = 3e-14;
  d = 1 / d;
  let result = d;
  for (let iteration = 1; iteration <= 200; iteration += 1) {
    const twice = 2 * iteration;
    let coefficient =
      (iteration * (b - iteration) * x) / ((qam + twice) * (a + twice));
    d = 1 + coefficient * d;
    if (Math.abs(d) < 3e-14) d = 3e-14;
    c = 1 + coefficient / c;
    if (Math.abs(c) < 3e-14) c = 3e-14;
    d = 1 / d;
    result *= d * c;
    coefficient =
      -((a + iteration) * (qab + iteration) * x) /
      ((a + twice) * (qap + twice));
    d = 1 + coefficient * d;
    if (Math.abs(d) < 3e-14) d = 3e-14;
    c = 1 + coefficient / c;
    if (Math.abs(c) < 3e-14) c = 3e-14;
    d = 1 / d;
    const delta = d * c;
    result *= delta;
    if (Math.abs(delta - 1) < 3e-12) break;
  }
  return result;
};
const regularizedBeta = (x: number, a: number, b: number): number => {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  const factor = Math.exp(
    logGamma(a + b) -
      logGamma(a) -
      logGamma(b) +
      a * Math.log(x) +
      b * Math.log1p(-x),
  );
  return x < (a + 1) / (a + b + 2)
    ? (factor * betaFraction(a, b, x)) / a
    : 1 - (factor * betaFraction(b, a, 1 - x)) / b;
};
export const studentTCdf = (
  value: number,
  degreesOfFreedom: number,
): number => {
  const x = degreesOfFreedom / (degreesOfFreedom + value * value);
  const tail = 0.5 * regularizedBeta(x, degreesOfFreedom / 2, 0.5);
  return value >= 0 ? 1 - tail : tail;
};
export const inverseStudentTCdf = (
  probability: number,
  degreesOfFreedom: number,
): number => {
  if (
    !(probability > 0 && probability < 1) ||
    !Number.isSafeInteger(degreesOfFreedom) ||
    degreesOfFreedom < 1
  )
    return Number.NaN;
  if (probability === 0.5) return 0;
  if (probability < 0.5)
    return -inverseStudentTCdf(1 - probability, degreesOfFreedom);
  let low = 0;
  let high = 1;
  while (studentTCdf(high, degreesOfFreedom) < probability && high < 1e6)
    high *= 2;
  for (let iteration = 0; iteration < 80; iteration += 1) {
    const middle = (low + high) / 2;
    if (studentTCdf(middle, degreesOfFreedom) < probability) low = middle;
    else high = middle;
  }
  return (low + high) / 2;
};

export const calculateTInterval = (
  input: unknown,
): ToolResult<TIntervalOutput> => {
  if (typeof input !== "object" || input === null || Array.isArray(input))
    return invalidInput([
      {
        code: "object_required",
        field: "",
        message: "Input must be an object.",
      },
    ]);
  const {
    confidenceLevel = 0.95,
    sampleMean,
    sampleSize,
    sampleStandardDeviation,
  } = input as Record<string, unknown>;
  if (
    typeof confidenceLevel !== "number" ||
    !Number.isFinite(confidenceLevel) ||
    confidenceLevel <= 0 ||
    confidenceLevel >= 1 ||
    typeof sampleMean !== "number" ||
    !Number.isFinite(sampleMean) ||
    typeof sampleStandardDeviation !== "number" ||
    !Number.isFinite(sampleStandardDeviation) ||
    sampleStandardDeviation < 0 ||
    typeof sampleSize !== "number" ||
    !Number.isSafeInteger(sampleSize) ||
    sampleSize < 2
  )
    return invalidInput([
      {
        code: "valid_t_interval_input_required",
        field: "sampleSize",
        message:
          "Provide a finite mean, nonnegative sample deviation, sample size of at least two, and confidence between zero and one.",
      },
    ]);
  const degreesOfFreedom = sampleSize - 1;
  const criticalValue = inverseStudentTCdf(
    0.5 + confidenceLevel / 2,
    degreesOfFreedom,
  );
  const marginOfError =
    (criticalValue * sampleStandardDeviation) / Math.sqrt(sampleSize);
  return toolSuccess({
    criticalValue,
    degreesOfFreedom,
    lower: sampleMean - marginOfError,
    marginOfError,
    upper: sampleMean + marginOfError,
  });
};
export const tIntervalTool = defineTool<TIntervalInput, TIntervalOutput>({
  contractVersion: 1,
  description:
    "Calculate a two-sided Student's t confidence interval for a population mean with unknown sigma.",
  execute: calculateTInterval,
  execution: { kind: "pure" },
  id: "statistics/t-interval",
  inputSchema: {
    additionalProperties: false,
    properties: {
      confidenceLevel: {
        default: 0.95,
        exclusiveMaximum: 1,
        exclusiveMinimum: 0,
        type: "number",
      },
      sampleMean: { type: "number" },
      sampleSize: { minimum: 2, type: "integer" },
      sampleStandardDeviation: { minimum: 0, type: "number" },
    },
    required: ["sampleMean", "sampleStandardDeviation", "sampleSize"],
    type: "object",
  },
  outputSchema: {
    additionalProperties: false,
    properties: {
      criticalValue: { exclusiveMinimum: 0, type: "number" },
      degreesOfFreedom: { minimum: 1, type: "integer" },
      lower: { type: "number" },
      marginOfError: { minimum: 0, type: "number" },
      upper: { type: "number" },
    },
    required: [
      "lower",
      "upper",
      "marginOfError",
      "criticalValue",
      "degreesOfFreedom",
    ],
    type: "object",
  },
  ports: {
    inputs: [
      {
        id: "sampleMean",
        label: "Sample mean",
        required: true,
        valueType: { format: "mean", type: "number" },
      },
      {
        id: "sampleStandardDeviation",
        label: "Sample standard deviation",
        required: true,
        valueType: { format: "standard-deviation", type: "number" },
      },
      {
        id: "sampleSize",
        label: "Sample size",
        required: true,
        valueType: { format: "count", type: "integer" },
      },
      {
        id: "confidenceLevel",
        label: "Confidence level",
        valueType: { format: "probability", type: "number" },
      },
    ],
    outputs: [
      {
        id: "lower",
        label: "Lower bound",
        valueType: { format: "confidence-bound", type: "number" },
      },
      {
        id: "upper",
        label: "Upper bound",
        valueType: { format: "confidence-bound", type: "number" },
      },
      {
        id: "marginOfError",
        label: "Margin of error",
        valueType: { format: "margin-of-error", type: "number" },
      },
      {
        id: "criticalValue",
        label: "Critical t value",
        valueType: { format: "t-critical-value", type: "number" },
      },
      {
        id: "degreesOfFreedom",
        label: "Degrees of freedom",
        valueType: { format: "count", type: "integer" },
      },
    ],
  },
  title: "T-Interval Calculator",
});
export default tIntervalTool;
