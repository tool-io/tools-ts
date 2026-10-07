import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly systemId: string;
  readonly stepCode: string;
  readonly status: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    systemId: { type: "string", maxLength: 8192, minLength: 1 },
    stepCode: { type: "string", maxLength: 8192, minLength: 1 },
    status: {
      type: "string",
      maxLength: 8192,
      enum: ["pending", "recorded-pass", "recorded-fail", "not-applicable"],
    },
  },
  required: ["systemId", "stepCode", "status"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Render an explicitly recorded commissioning-step status without certifying a system or generating a sign-off. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { systemId, stepCode, status } = request;
  const compute = (): Output => {
    H.domain(systemId.length > 0 && stepCode.length > 0, "systemId");
    H.domain(
      ["pending", "recorded-pass", "recorded-fail", "not-applicable"].includes(
        status,
      ),
      "status",
    );
    return { label: systemId + "/" + stepCode + " [" + status + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { systemId: "SYS17", stepCode: "CHK3", status: "recorded-pass" },
  output: { label: "SYS17/CHK3 [recorded-pass]" },
} satisfies ToolExample<Input, Output>;
export const commissioningStepSignOffLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: [
        "construction-management",
        "construction management",
        "engineering",
      ],
      keywords: ["construction management", "engineering"],
    },
    id: "construction-management/commissioning-step-sign-off-label",
    title: "Commissioning Step Sign Off Label",
    description:
      "Render an explicitly recorded commissioning-step status without certifying a system or generating a sign-off.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        systemId: { type: "string", maxLength: 8192, minLength: 1 },
        stepCode: { type: "string", maxLength: 8192, minLength: 1 },
        status: {
          type: "string",
          maxLength: 8192,
          enum: ["pending", "recorded-pass", "recorded-fail", "not-applicable"],
        },
      },
      required: ["systemId", "stepCode", "status"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "systemId",
          label: "System Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "stepCode",
          label: "Step Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "status",
          label: "Status",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = commissioningStepSignOffLabelTool.execute;
export default commissioningStepSignOffLabelTool;
