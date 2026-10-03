import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly severity: string;
  readonly likelihood: string;
  readonly severities: readonly string[];
  readonly likelihoods: readonly string[];
  readonly codes: readonly string[];
};
export type Output = { readonly code: string; readonly flatIndex: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    severity: { type: "string", maxLength: 8192 },
    likelihood: { type: "string", maxLength: 8192 },
    severities: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    likelihoods: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    codes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["severity", "likelihood", "severities", "likelihoods", "codes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    code: { type: "string", maxLength: 8192 },
    flatIndex: { type: "integer" },
  },
  required: ["code", "flatIndex"],
} as const;
/** Resolve one supplied risk-matrix cell without embedding ratings or thresholds. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { severity, likelihood, severities, likelihoods, codes } = request;
  const compute = (): Output => {
    H.domain(
      new Set(severities).size === severities.length &&
        new Set(likelihoods).size === likelihoods.length &&
        codes.length === severities.length * likelihoods.length,
    );
    const row = severities.indexOf(severity),
      column = likelihoods.indexOf(likelihood);
    H.domain(row >= 0 && column >= 0);
    const flatIndex = row * likelihoods.length + column;
    return { code: codes[flatIndex], flatIndex };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    severity: "high",
    likelihood: "rare",
    severities: ["low", "high"],
    likelihoods: ["rare", "often"],
    codes: ["A", "B", "C", "D"],
  },
  output: { code: "C", flatIndex: 2 },
} satisfies ToolExample<Input, Output>;
export const riskMatrixOneCellSuppliedCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "quality-assurance/risk-matrix-one-cell-supplied-code",
    title: "Risk Matrix One Cell Supplied Code Tool",
    description:
      "Resolve one supplied risk-matrix cell without embedding ratings or thresholds.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        severity: { type: "string", maxLength: 8192 },
        likelihood: { type: "string", maxLength: 8192 },
        severities: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        likelihoods: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        codes: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: [
        "severity",
        "likelihood",
        "severities",
        "likelihoods",
        "codes",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        code: { type: "string", maxLength: 8192 },
        flatIndex: { type: "integer" },
      },
      required: ["code", "flatIndex"],
    },
    ports: {
      inputs: [
        {
          id: "severity",
          label: "Severity",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "likelihood",
          label: "Likelihood",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "severities",
          label: "Severities",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "likelihoods",
          label: "Likelihoods",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "codes",
          label: "Codes",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        { id: "code", label: "Code", valueType: { type: "string" } },
        {
          id: "flatIndex",
          label: "Flat Index",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = riskMatrixOneCellSuppliedCodeTool.execute;
export default riskMatrixOneCellSuppliedCodeTool;
