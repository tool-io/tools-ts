import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly caseId: string;
  readonly firstRole: string;
  readonly secondRole: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    caseId: { type: "string", maxLength: 8192, minLength: 1 },
    firstRole: { type: "string", maxLength: 8192, minLength: 1 },
    secondRole: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["caseId", "firstRole", "secondRole"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Encode an ordered pair of explicitly affected roles for an ethics case without ranking interests. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { caseId, firstRole, secondRole } = request;
  const compute = (): Output => {
    H.domain(caseId.length > 0, "caseId");
    H.domain(firstRole.length > 0, "firstRole");
    H.domain(secondRole.length > 0, "secondRole");
    return { token: JSON.stringify([caseId, firstRole, secondRole]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { caseId: "C17", firstRole: "participant", secondRole: "researcher" },
  output: { token: '["C17","participant","researcher"]' },
} satisfies ToolExample<Input, Output>;
export const ethicsCaseAffectedRolePairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["applied-ethics", "applied ethics", "philosophy"],
      keywords: ["applied ethics", "philosophy"],
    },
    id: "applied-ethics/ethics-case-affected-role-pair",
    title: "Ethics Case Affected Role Pair",
    description:
      "Encode an ordered pair of explicitly affected roles for an ethics case without ranking interests.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        caseId: { type: "string", maxLength: 8192, minLength: 1 },
        firstRole: { type: "string", maxLength: 8192, minLength: 1 },
        secondRole: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["caseId", "firstRole", "secondRole"],
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
          id: "caseId",
          label: "Case Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "firstRole",
          label: "First Role",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "secondRole",
          label: "Second Role",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = ethicsCaseAffectedRolePairTool.execute;
export default ethicsCaseAffectedRolePairTool;
