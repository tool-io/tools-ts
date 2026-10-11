import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly changeId: string;
  readonly suppliedEffectiveDate: string;
  readonly version: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    changeId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedEffectiveDate: { type: "string", maxLength: 8192, minLength: 1 },
    version: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["changeId", "suppliedEffectiveDate", "version"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit change version by its supplied effective-date wording without determining change approval. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { changeId, suppliedEffectiveDate, version } = request;
  const compute = (): Output => {
    H.domain(changeId.length > 0, "changeId");
    H.domain(suppliedEffectiveDate.length > 0, "suppliedEffectiveDate");
    H.domain(version.length > 0, "version");
    return {
      token: JSON.stringify([changeId, suppliedEffectiveDate, version]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    changeId: "CH17",
    suppliedEffectiveDate: "2026-11-01",
    version: "v2",
  },
  output: { token: '["CH17","2026-11-01","v2"]' },
} satisfies ToolExample<Input, Output>;
export const changeControlEffectiveDateTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "quality-assurance",
        "quality assurance",
        "research and quality management",
      ],
      keywords: ["quality assurance", "research and quality management"],
    },
    id: "quality-assurance/change-control-effective-date-tag",
    title: "Change Control Effective Date Tag",
    description:
      "Qualify an explicit change version by its supplied effective-date wording without determining change approval.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        changeId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedEffectiveDate: {
          type: "string",
          maxLength: 8192,
          minLength: 1,
        },
        version: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["changeId", "suppliedEffectiveDate", "version"],
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
          id: "changeId",
          label: "Change Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedEffectiveDate",
          label: "Supplied Effective Date",
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
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = changeControlEffectiveDateTagTool.execute;
export default changeControlEffectiveDateTagTool;
