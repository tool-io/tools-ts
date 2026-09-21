import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly fee: number;
  readonly subsidyFraction: number;
  readonly subsidyCap: number;
  readonly employerFractionOfNet: number;
};
export type Output = {
  readonly subsidy: number;
  readonly employer: number;
  readonly employee: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fee: { type: "number", minimum: 0 },
    subsidyFraction: { type: "number", minimum: 0, maximum: 1 },
    subsidyCap: { type: "number", minimum: 0 },
    employerFractionOfNet: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["fee", "subsidyFraction", "subsidyCap", "employerFractionOfNet"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    subsidy: { type: "number" },
    employer: { type: "number" },
    employee: { type: "number" },
  },
  required: ["subsidy", "employer", "employee"],
} as const;
/** Calculate training subsidy employer employee split from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { fee, subsidyFraction, subsidyCap, employerFractionOfNet } = request;
  const compute = (): Output => {
    H.domain(fee >= 0 && subsidyCap >= 0);
    H.probability(subsidyFraction);
    H.probability(employerFractionOfNet);
    return {
      subsidy: Math.min(subsidyCap, fee * subsidyFraction),
      employer:
        (fee - Math.min(subsidyCap, fee * subsidyFraction)) *
        employerFractionOfNet,
      employee:
        (fee - Math.min(subsidyCap, fee * subsidyFraction)) *
        (1 - employerFractionOfNet),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    fee: 1000,
    subsidyFraction: 0.5,
    subsidyCap: 400,
    employerFractionOfNet: 0.5,
  },
  output: { subsidy: 400, employer: 300, employee: 300 },
} satisfies ToolExample<Input, Output>;
export const trainingSubsidyEmployerEmployeeSplitTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "adult-education/training-subsidy-employer-employee-split",
      title: "Training Subsidy Employer Employee Split Tool",
      description:
        "Calculate training subsidy employer employee split from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          fee: { type: "number", minimum: 0 },
          subsidyFraction: { type: "number", minimum: 0, maximum: 1 },
          subsidyCap: { type: "number", minimum: 0 },
          employerFractionOfNet: { type: "number", minimum: 0, maximum: 1 },
        },
        required: [
          "fee",
          "subsidyFraction",
          "subsidyCap",
          "employerFractionOfNet",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          subsidy: { type: "number" },
          employer: { type: "number" },
          employee: { type: "number" },
        },
        required: ["subsidy", "employer", "employee"],
      },
      ports: {
        inputs: [
          {
            id: "fee",
            label: "Fee",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "subsidyFraction",
            label: "Subsidy Fraction",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "subsidyCap",
            label: "Subsidy Cap",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "employerFractionOfNet",
            label: "Employer Fraction Of Net",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "subsidy", label: "Subsidy", valueType: { type: "number" } },
          { id: "employer", label: "Employer", valueType: { type: "number" } },
          { id: "employee", label: "Employee", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = trainingSubsidyEmployerEmployeeSplitTool.execute;
export default trainingSubsidyEmployerEmployeeSplitTool;
