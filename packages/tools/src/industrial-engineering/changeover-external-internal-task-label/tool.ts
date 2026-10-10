import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly taskCode: string;
  readonly canRunWhileMachineOperates: boolean;
  readonly recordedMinutes: number;
};
export type Output = {
  readonly classification: string;
  readonly internalMinutes: number;
  readonly externalMinutes: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    taskCode: { type: "string", maxLength: 8192, minLength: 1 },
    canRunWhileMachineOperates: { type: "boolean" },
    recordedMinutes: { type: "number", minimum: 0 },
  },
  required: ["taskCode", "canRunWhileMachineOperates", "recordedMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    classification: { type: "string", maxLength: 8192 },
    internalMinutes: { type: "number" },
    externalMinutes: { type: "number" },
  },
  required: ["classification", "internalMinutes", "externalMinutes"],
} as const;
/** Allocate an explicit changeover task duration using the supplied machine-operating availability flag. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { taskCode, canRunWhileMachineOperates, recordedMinutes } = request;
  const compute = (): Output => {
    H.domain(taskCode.length > 0, "taskCode");
    H.domain(recordedMinutes >= 0, "recordedMinutes");
    return {
      classification: canRunWhileMachineOperates ? "external" : "internal",
      internalMinutes: canRunWhileMachineOperates ? 0 : recordedMinutes,
      externalMinutes: canRunWhileMachineOperates ? recordedMinutes : 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    taskCode: "T17",
    canRunWhileMachineOperates: true,
    recordedMinutes: 12,
  },
  output: {
    classification: "external",
    internalMinutes: 0,
    externalMinutes: 12,
  },
} satisfies ToolExample<Input, Output>;
export const changeoverExternalInternalTaskLabelTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: [
          "industrial-engineering",
          "industrial engineering",
          "engineering",
        ],
        keywords: ["industrial engineering", "engineering"],
      },
      id: "industrial-engineering/changeover-external-internal-task-label",
      title: "Changeover External Internal Task Label",
      description:
        "Allocate an explicit changeover task duration using the supplied machine-operating availability flag.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          taskCode: { type: "string", maxLength: 8192, minLength: 1 },
          canRunWhileMachineOperates: { type: "boolean" },
          recordedMinutes: { type: "number", minimum: 0 },
        },
        required: ["taskCode", "canRunWhileMachineOperates", "recordedMinutes"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          classification: { type: "string", maxLength: 8192 },
          internalMinutes: { type: "number" },
          externalMinutes: { type: "number" },
        },
        required: ["classification", "internalMinutes", "externalMinutes"],
      },
      ports: {
        inputs: [
          {
            id: "taskCode",
            label: "Task Code",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "canRunWhileMachineOperates",
            label: "Can Run While Machine Operates",
            required: true,
            valueType: { type: "boolean" },
          },
          {
            id: "recordedMinutes",
            label: "Recorded Minutes",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "classification",
            label: "Classification",
            valueType: { type: "string" },
          },
          {
            id: "internalMinutes",
            label: "Internal Minutes",
            valueType: { type: "number" },
          },
          {
            id: "externalMinutes",
            label: "External Minutes",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = changeoverExternalInternalTaskLabelTool.execute;
export default changeoverExternalInternalTaskLabelTool;
