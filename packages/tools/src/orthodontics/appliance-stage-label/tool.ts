import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly applianceId: string;
  readonly stageWording: string;
  readonly planVersion: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    applianceId: { type: "string", maxLength: 8192, minLength: 1 },
    stageWording: { type: "string", maxLength: 8192, minLength: 1 },
    planVersion: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["applianceId", "stageWording", "planVersion"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record an explicit appliance-stage label and plan version without choosing a treatment stage. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { applianceId, stageWording, planVersion } = request;
  const compute = (): Output => {
    H.domain(applianceId.length > 0, "applianceId");
    H.domain(stageWording.length > 0, "stageWording");
    H.domain(planVersion.length > 0, "planVersion");
    return { token: JSON.stringify([applianceId, stageWording, planVersion]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { applianceId: "AP17", stageWording: "stage 3", planVersion: "v2" },
  output: { token: '["AP17","stage 3","v2"]' },
} satisfies ToolExample<Input, Output>;
export const applianceStageLabelTool = H.defineSchemaCalculation<Input, Output>(
  {
    ...{
      discovery: {
        aliases: [],
        collections: ["data"],
        fields: ["orthodontics", "health and medicine"],
        keywords: ["orthodontics", "health and medicine"],
      },
      id: "orthodontics/appliance-stage-label",
      title: "Appliance Stage Label",
      description:
        "Record an explicit appliance-stage label and plan version without choosing a treatment stage.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          applianceId: { type: "string", maxLength: 8192, minLength: 1 },
          stageWording: { type: "string", maxLength: 8192, minLength: 1 },
          planVersion: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["applianceId", "stageWording", "planVersion"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { token: { type: "string", maxLength: 8192 } },
        required: ["token"],
      },
      ports: {
        inputs: [
          {
            id: "applianceId",
            label: "Appliance Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "stageWording",
            label: "Stage Wording",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "planVersion",
            label: "Plan Version",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "token", label: "Token", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  },
);
export const run = applianceStageLabelTool.execute;
export default applianceStageLabelTool;
