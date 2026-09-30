import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly leadMinutes: number;
  readonly assistantMinutes: number;
  readonly leadHourly: number;
  readonly assistantHourly: number;
  readonly reimbursed: number;
};
export type Output = {
  readonly gross: number;
  readonly net: number;
  readonly assistantShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leadMinutes: { type: "number", minimum: 0 },
    assistantMinutes: { type: "number", minimum: 0 },
    leadHourly: { type: "number", minimum: 0 },
    assistantHourly: { type: "number", minimum: 0 },
    reimbursed: { type: "number", minimum: 0 },
  },
  required: [
    "leadMinutes",
    "assistantMinutes",
    "leadHourly",
    "assistantHourly",
    "reimbursed",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gross: { type: "number" },
    net: { type: "number" },
    assistantShare: { type: "number" },
  },
  required: ["gross", "net", "assistantShare"],
} as const;
/** Calculate midwifery visit assistant hour cost term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    leadMinutes,
    assistantMinutes,
    leadHourly,
    assistantHourly,
    reimbursed,
  } = request;
  const compute = (): Output => {
    H.domain(
      leadMinutes >= 0 &&
        assistantMinutes >= 0 &&
        leadMinutes + assistantMinutes > 0 &&
        leadHourly >= 0 &&
        assistantHourly >= 0 &&
        reimbursed >= 0,
    );
    return {
      gross:
        (leadMinutes * leadHourly + assistantMinutes * assistantHourly) / 60,
      net:
        (leadMinutes * leadHourly + assistantMinutes * assistantHourly) / 60 -
        reimbursed,
      assistantShare: assistantMinutes / (leadMinutes + assistantMinutes),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    leadMinutes: 60,
    assistantMinutes: 30,
    leadHourly: 50,
    assistantHourly: 30,
    reimbursed: 10,
  },
  output: { gross: 65, net: 55, assistantShare: 0.3333333333333333 },
} satisfies ToolExample<Input, Output>;
export const midwiferyVisitAssistantHourCostTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "midwifery/midwifery-visit-assistant-hour-cost-term",
      title: "Midwifery Visit Assistant Hour Cost Term Tool",
      description:
        "Calculate midwifery visit assistant hour cost term from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          leadMinutes: { type: "number", minimum: 0 },
          assistantMinutes: { type: "number", minimum: 0 },
          leadHourly: { type: "number", minimum: 0 },
          assistantHourly: { type: "number", minimum: 0 },
          reimbursed: { type: "number", minimum: 0 },
        },
        required: [
          "leadMinutes",
          "assistantMinutes",
          "leadHourly",
          "assistantHourly",
          "reimbursed",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          gross: { type: "number" },
          net: { type: "number" },
          assistantShare: { type: "number" },
        },
        required: ["gross", "net", "assistantShare"],
      },
      ports: {
        inputs: [
          {
            id: "leadMinutes",
            label: "Lead Minutes",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "assistantMinutes",
            label: "Assistant Minutes",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "leadHourly",
            label: "Lead Hourly",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "assistantHourly",
            label: "Assistant Hourly",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "reimbursed",
            label: "Reimbursed",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "gross", label: "Gross", valueType: { type: "number" } },
          { id: "net", label: "Net", valueType: { type: "number" } },
          {
            id: "assistantShare",
            label: "Assistant Share",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = midwiferyVisitAssistantHourCostTermTool.execute;
export default midwiferyVisitAssistantHourCostTermTool;
