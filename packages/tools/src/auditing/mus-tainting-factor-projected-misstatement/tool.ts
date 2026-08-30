import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MusTaintingFactorInput = {
  readonly auditedValue: number;
  readonly bookValue: number;
  readonly individuallySignificant: boolean;
  readonly samplingInterval: number;
};

export type MusTaintingFactorOutput = {
  readonly misstatement: number;
  readonly projectedMisstatement: number;
  readonly projectionMethod: "actual" | "tainting_factor";
  readonly taintingFactor: number;
};

export const calculateMusTaintingFactor = (
  input: MusTaintingFactorInput,
): MusTaintingFactorOutput => {
  for (const field of [
    "auditedValue",
    "bookValue",
    "samplingInterval",
  ] as const)
    if (!Number.isFinite(input[field]) || input[field] < 0)
      simpleError(
        field,
        `${field} must be finite and nonnegative.`,
        "invalid_monetary_value",
      );
  if (input.bookValue === 0)
    simpleError(
      "bookValue",
      "Book value must be greater than zero to calculate a tainting factor.",
      "zero_book_value",
    );
  if (input.samplingInterval === 0)
    simpleError(
      "samplingInterval",
      "Sampling interval must be greater than zero.",
      "zero_sampling_interval",
    );
  if (typeof input.individuallySignificant !== "boolean")
    simpleError(
      "individuallySignificant",
      "Individually significant status must be a boolean.",
      "boolean_field_required",
    );

  const misstatement = input.bookValue - input.auditedValue;
  const taintingFactor = misstatement / input.bookValue;
  const projectedMisstatement = input.individuallySignificant
    ? misstatement
    : taintingFactor * input.samplingInterval;
  if (!Number.isFinite(projectedMisstatement))
    simpleError(
      "samplingInterval",
      "The projected misstatement is outside the representable numeric range.",
      "result_not_finite",
    );
  return {
    misstatement,
    projectedMisstatement,
    projectionMethod: input.individuallySignificant
      ? "actual"
      : "tainting_factor",
    taintingFactor,
  };
};

export const musTaintingFactorExample = {
  input: {
    auditedValue: 95_000,
    bookValue: 100_000,
    individuallySignificant: false,
    samplingInterval: 200_000,
  },
  output: {
    misstatement: 5_000,
    projectedMisstatement: 10_000,
    projectionMethod: "tainting_factor",
    taintingFactor: 0.05,
  },
} satisfies ToolExample<MusTaintingFactorInput, MusTaintingFactorOutput>;

export const musTaintingFactorTool = createSimpleTool({
  calculate: (input) =>
    calculateMusTaintingFactor({
      auditedValue: input.auditedValue as number,
      bookValue: input.bookValue as number,
      individuallySignificant: input.individuallySignificant as boolean,
      samplingInterval: input.samplingInterval as number,
    }),
  description:
    "Calculate a monetary-unit-sampling tainting factor and project a sampled item's misstatement over the sampling interval. Individually significant items use their actual misstatement instead of interval projection.",
  id: "auditing/mus-tainting-factor-projected-misstatement",
  inputs: [
    {
      id: "auditedValue",
      kind: "number",
      label: "Audited value",
      minimum: 0,
    },
    { id: "bookValue", kind: "number", label: "Book value", minimum: 0 },
    {
      id: "individuallySignificant",
      kind: "boolean",
      label: "Individually significant item",
    },
    {
      id: "samplingInterval",
      kind: "number",
      label: "Sampling interval",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "misstatement", kind: "number", label: "Item misstatement" },
    {
      id: "projectedMisstatement",
      kind: "number",
      label: "Projected misstatement",
    },
    {
      enum: ["actual", "tainting_factor"],
      id: "projectionMethod",
      kind: "string",
      label: "Projection method",
    },
    { id: "taintingFactor", kind: "number", label: "Tainting factor" },
  ],
  title: "MUS Tainting Factor Projected Misstatement",
});

export const runMusTaintingFactor = musTaintingFactorTool.execute;
export default musTaintingFactorTool;
