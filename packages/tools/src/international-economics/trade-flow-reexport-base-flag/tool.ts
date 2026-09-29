import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly grossExports: number;
  readonly reexports: number;
  readonly includeReexports: boolean;
};
export type Output = {
  readonly reportedExports: number;
  readonly reexportShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossExports: { type: "number", minimum: 0 },
    reexports: { type: "number", minimum: 0 },
    includeReexports: { type: "boolean" },
  },
  required: ["grossExports", "reexports", "includeReexports"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reportedExports: { type: "number" },
    reexportShare: { type: "number" },
  },
  required: ["reportedExports", "reexportShare"],
} as const;
/** Separate supplied domestic and reexport flows in a common currency and period; zero gross flow has zero reexport share. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { grossExports, reexports, includeReexports } = request;
  const compute = (): Output => {
    H.domain(grossExports >= 0 && reexports >= 0 && reexports <= grossExports);
    return {
      reportedExports: grossExports - (includeReexports ? 0 : reexports),
      reexportShare: grossExports === 0 ? 0 : reexports / grossExports,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { grossExports: 100, reexports: 25, includeReexports: false },
  output: { reportedExports: 75, reexportShare: 0.25 },
} satisfies ToolExample<Input, Output>;
export const tradeFlowReexportBaseFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "international-economics/trade-flow-reexport-base-flag",
    title: "Trade Flow Reexport Base Flag Tool",
    description:
      "Separate supplied domestic and reexport flows in a common currency and period; zero gross flow has zero reexport share.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossExports: { type: "number", minimum: 0 },
        reexports: { type: "number", minimum: 0 },
        includeReexports: { type: "boolean" },
      },
      required: ["grossExports", "reexports", "includeReexports"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reportedExports: { type: "number" },
        reexportShare: { type: "number" },
      },
      required: ["reportedExports", "reexportShare"],
    },
    ports: {
      inputs: [
        {
          id: "grossExports",
          label: "Gross Exports",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reexports",
          label: "Reexports",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "includeReexports",
          label: "Include Reexports",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "reportedExports",
          label: "Reported Exports",
          valueType: { type: "number" },
        },
        {
          id: "reexportShare",
          label: "Reexport Share",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = tradeFlowReexportBaseFlagTool.execute;
export default tradeFlowReexportBaseFlagTool;
