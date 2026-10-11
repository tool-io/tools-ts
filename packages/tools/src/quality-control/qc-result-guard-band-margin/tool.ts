import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly result: number;
  readonly suppliedUpperLimit: number;
  readonly suppliedGuardBand: number;
};
export type Output = {
  readonly guardedUpperLimit: number;
  readonly margin: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    result: { type: "number" },
    suppliedUpperLimit: { type: "number" },
    suppliedGuardBand: { type: "number", minimum: 0 },
  },
  required: ["result", "suppliedUpperLimit", "suppliedGuardBand"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    guardedUpperLimit: { type: "number" },
    margin: { type: "number" },
  },
  required: ["guardedUpperLimit", "margin"],
} as const;
/** Subtract an explicit guard band from an upper limit and compare a result without selecting an uncertainty decision rule. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { result, suppliedUpperLimit, suppliedGuardBand } = request;
  const compute = (): Output => {
    H.domain(suppliedGuardBand >= 0, "suppliedGuardBand");
    return {
      guardedUpperLimit: suppliedUpperLimit - suppliedGuardBand,
      margin: suppliedUpperLimit - suppliedGuardBand - result,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { result: 95, suppliedUpperLimit: 100, suppliedGuardBand: 3 },
  output: { guardedUpperLimit: 97, margin: 2 },
} satisfies ToolExample<Input, Output>;
export const qcResultGuardBandMarginTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "quality-control",
        "quality control",
        "research and quality management",
      ],
      keywords: ["quality control", "research and quality management"],
    },
    id: "quality-control/qc-result-guard-band-margin",
    title: "QC Result Guard Band Margin",
    description:
      "Subtract an explicit guard band from an upper limit and compare a result without selecting an uncertainty decision rule.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        result: { type: "number" },
        suppliedUpperLimit: { type: "number" },
        suppliedGuardBand: { type: "number", minimum: 0 },
      },
      required: ["result", "suppliedUpperLimit", "suppliedGuardBand"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        guardedUpperLimit: { type: "number" },
        margin: { type: "number" },
      },
      required: ["guardedUpperLimit", "margin"],
    },
    ports: {
      inputs: [
        {
          id: "result",
          label: "Result",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedUpperLimit",
          label: "Supplied Upper Limit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedGuardBand",
          label: "Supplied Guard Band",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "guardedUpperLimit",
          label: "Guarded Upper Limit",
          valueType: { type: "number" },
        },
        { id: "margin", label: "Margin", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = qcResultGuardBandMarginTool.execute;
export default qcResultGuardBandMarginTool;
