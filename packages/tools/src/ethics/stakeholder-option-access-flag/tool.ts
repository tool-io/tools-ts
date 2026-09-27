import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly stakeholders: readonly string[];
  readonly accessible: readonly boolean[];
  readonly requestedStakeholder: string;
};
export type Output = { readonly listed: boolean; readonly access: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stakeholders: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    accessible: { type: "array", maxItems: 256, items: { type: "boolean" } },
    requestedStakeholder: { type: "string", maxLength: 8192 },
  },
  required: ["stakeholders", "accessible", "requestedStakeholder"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { listed: { type: "boolean" }, access: { type: "boolean" } },
  required: ["listed", "access"],
} as const;
/** Calculate stakeholder option access flag from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { stakeholders, accessible, requestedStakeholder } = request;
  const compute = (): Output => {
    H.sameLength(stakeholders, accessible);
    H.domain(new Set(stakeholders).size === stakeholders.length);
    return {
      listed: stakeholders.includes(requestedStakeholder),
      access: accessible[stakeholders.indexOf(requestedStakeholder)] ?? false,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    stakeholders: ["A", "B"],
    accessible: [true, false],
    requestedStakeholder: "B",
  },
  output: { listed: true, access: false },
} satisfies ToolExample<Input, Output>;
export const stakeholderOptionAccessFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ethics/stakeholder-option-access-flag",
    title: "Stakeholder Option Access Flag Tool",
    description:
      "Calculate stakeholder option access flag from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        stakeholders: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        accessible: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        requestedStakeholder: { type: "string", maxLength: 8192 },
      },
      required: ["stakeholders", "accessible", "requestedStakeholder"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { listed: { type: "boolean" }, access: { type: "boolean" } },
      required: ["listed", "access"],
    },
    ports: {
      inputs: [
        {
          id: "stakeholders",
          label: "Stakeholders",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "accessible",
          label: "Accessible",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "requestedStakeholder",
          label: "Requested Stakeholder",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "listed", label: "Listed", valueType: { type: "boolean" } },
        { id: "access", label: "Access", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = stakeholderOptionAccessFlagTool.execute;
export default stakeholderOptionAccessFlagTool;
