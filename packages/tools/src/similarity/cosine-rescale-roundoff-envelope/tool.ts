import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly originalCosine: number;
  readonly rescaledCosine: number;
  readonly suppliedAbsoluteBudget: number;
};
export type Output = {
  readonly absoluteGap: number;
  readonly withinBudget: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    originalCosine: { type: "number" },
    rescaledCosine: { type: "number" },
    suppliedAbsoluteBudget: { type: "number", minimum: 0 },
  },
  required: ["originalCosine", "rescaledCosine", "suppliedAbsoluteBudget"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    absoluteGap: { type: "number" },
    withinBudget: { type: "boolean" },
  },
  required: ["absoluteGap", "withinBudget"],
} as const;
/** Audit a measured cosine-rescaling discrepancy against a caller-supplied absolute roundoff budget. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { originalCosine, rescaledCosine, suppliedAbsoluteBudget } = request;
  const compute = (): Output => {
    H.domain(
      Math.abs(originalCosine) <= 1 &&
        Math.abs(rescaledCosine) <= 1 &&
        suppliedAbsoluteBudget >= 0,
    );
    return {
      absoluteGap: Math.abs(rescaledCosine - originalCosine),
      withinBudget:
        Math.abs(rescaledCosine - originalCosine) <= suppliedAbsoluteBudget,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    originalCosine: 0.5,
    rescaledCosine: 0.5000000000000001,
    suppliedAbsoluteBudget: 1e-15,
  },
  output: { absoluteGap: 1.1102230246251565e-16, withinBudget: true },
} satisfies ToolExample<Input, Output>;
export const cosineRescaleRoundoffEnvelopeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "similarity/cosine-rescale-roundoff-envelope",
    title: "Cosine Rescale Roundoff Envelope Tool",
    description:
      "Audit a measured cosine-rescaling discrepancy against a caller-supplied absolute roundoff budget.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        originalCosine: { type: "number" },
        rescaledCosine: { type: "number" },
        suppliedAbsoluteBudget: { type: "number", minimum: 0 },
      },
      required: ["originalCosine", "rescaledCosine", "suppliedAbsoluteBudget"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        absoluteGap: { type: "number" },
        withinBudget: { type: "boolean" },
      },
      required: ["absoluteGap", "withinBudget"],
    },
    ports: {
      inputs: [
        {
          id: "originalCosine",
          label: "Original Cosine",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rescaledCosine",
          label: "Rescaled Cosine",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedAbsoluteBudget",
          label: "Supplied Absolute Budget",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "absoluteGap",
          label: "Absolute Gap",
          valueType: { type: "number" },
        },
        {
          id: "withinBudget",
          label: "Within Budget",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = cosineRescaleRoundoffEnvelopeTool.execute;
export default cosineRescaleRoundoffEnvelopeTool;
