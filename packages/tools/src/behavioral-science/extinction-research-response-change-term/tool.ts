import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly baselineResponses: number;
  readonly baselineMinutes: number;
  readonly laterResponses: number;
  readonly laterMinutes: number;
};
export type Output = {
  readonly baselineRate: number;
  readonly laterRate: number;
  readonly rateChange: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    baselineResponses: { type: "integer", minimum: 0 },
    baselineMinutes: { type: "number", exclusiveMinimum: 0 },
    laterResponses: { type: "integer", minimum: 0 },
    laterMinutes: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "baselineResponses",
    "baselineMinutes",
    "laterResponses",
    "laterMinutes",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    baselineRate: { type: "number" },
    laterRate: { type: "number" },
    rateChange: { type: "number" },
  },
  required: ["baselineRate", "laterRate", "rateChange"],
} as const;
/** Observed rate change only; it does not establish extinction causality or recommend a behavioral procedure. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { baselineResponses, baselineMinutes, laterResponses, laterMinutes } =
    request;
  const compute = (): Output => {
    H.integer(baselineResponses, 0);
    H.integer(laterResponses, 0);
    H.positive(baselineMinutes);
    H.positive(laterMinutes);
    return {
      baselineRate: baselineResponses / baselineMinutes,
      laterRate: laterResponses / laterMinutes,
      rateChange:
        laterResponses / laterMinutes - baselineResponses / baselineMinutes,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    baselineResponses: 20,
    baselineMinutes: 10,
    laterResponses: 6,
    laterMinutes: 6,
  },
  output: { baselineRate: 2, laterRate: 1, rateChange: -1 },
} satisfies ToolExample<Input, Output>;
export const extinctionResearchResponseChangeTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "behavioral-science/extinction-research-response-change-term",
      title: "Extinction Research Response Change Term Tool",
      description:
        "Observed rate change only; it does not establish extinction causality or recommend a behavioral procedure.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          baselineResponses: { type: "integer", minimum: 0 },
          baselineMinutes: { type: "number", exclusiveMinimum: 0 },
          laterResponses: { type: "integer", minimum: 0 },
          laterMinutes: { type: "number", exclusiveMinimum: 0 },
        },
        required: [
          "baselineResponses",
          "baselineMinutes",
          "laterResponses",
          "laterMinutes",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          baselineRate: { type: "number" },
          laterRate: { type: "number" },
          rateChange: { type: "number" },
        },
        required: ["baselineRate", "laterRate", "rateChange"],
      },
      ports: {
        inputs: [
          {
            id: "baselineResponses",
            label: "Baseline Responses",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "baselineMinutes",
            label: "Baseline Minutes",
            required: true,
            valueType: { type: "number", unit: "min" },
          },
          {
            id: "laterResponses",
            label: "Later Responses",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "laterMinutes",
            label: "Later Minutes",
            required: true,
            valueType: { type: "number", unit: "min" },
          },
        ],
        outputs: [
          {
            id: "baselineRate",
            label: "Baseline Rate",
            valueType: { type: "number" },
          },
          {
            id: "laterRate",
            label: "Later Rate",
            valueType: { type: "number" },
          },
          {
            id: "rateChange",
            label: "Rate Change",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = extinctionResearchResponseChangeTermTool.execute;
export default extinctionResearchResponseChangeTermTool;
