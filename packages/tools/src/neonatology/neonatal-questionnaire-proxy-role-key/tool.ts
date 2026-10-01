import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly respondentId: string;
  readonly infantId: string;
  readonly role: string;
  readonly version: string;
};
export type Output = { readonly key: string; readonly proxy: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    respondentId: { type: "string", maxLength: 8192 },
    infantId: { type: "string", maxLength: 8192 },
    role: {
      type: "string",
      maxLength: 8192,
      enum: ["parent", "guardian", "staff", "self"],
    },
    version: { type: "string", maxLength: 8192 },
  },
  required: ["respondentId", "infantId", "role", "version"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    key: { type: "string", maxLength: 8192 },
    proxy: { type: "boolean" },
  },
  required: ["key", "proxy"],
} as const;
/** Identify a supplied questionnaire role within record/version context. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { respondentId, infantId, role, version } = request;
  const compute = (): Output => {
    H.domain(
      [respondentId, infantId, version].every((x) => x.length > 0),
      "respondentId",
    );
    H.domain(["parent", "guardian", "staff", "self"].includes(role), "role");
    return {
      key: JSON.stringify([infantId, version, respondentId, role]),
      proxy: role !== "self",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { respondentId: "P1", infantId: "I1", role: "parent", version: "v2" },
  output: { key: '["I1","v2","P1","parent"]', proxy: true },
} satisfies ToolExample<Input, Output>;
export const neonatalQuestionnaireProxyRoleKeyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "neonatology/neonatal-questionnaire-proxy-role-key",
    title: "Neonatal Questionnaire Proxy Role Key Tool",
    description:
      "Identify a supplied questionnaire role within record/version context.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        respondentId: { type: "string", maxLength: 8192 },
        infantId: { type: "string", maxLength: 8192 },
        role: {
          type: "string",
          maxLength: 8192,
          enum: ["parent", "guardian", "staff", "self"],
        },
        version: { type: "string", maxLength: 8192 },
      },
      required: ["respondentId", "infantId", "role", "version"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        key: { type: "string", maxLength: 8192 },
        proxy: { type: "boolean" },
      },
      required: ["key", "proxy"],
    },
    ports: {
      inputs: [
        {
          id: "respondentId",
          label: "Respondent Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "infantId",
          label: "Infant Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "role",
          label: "Role",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "version",
          label: "Version",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "key", label: "Key", valueType: { type: "string" } },
        { id: "proxy", label: "Proxy", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = neonatalQuestionnaireProxyRoleKeyTool.execute;
export default neonatalQuestionnaireProxyRoleKeyTool;
