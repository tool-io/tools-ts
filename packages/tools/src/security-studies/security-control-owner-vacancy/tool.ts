import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly controlId: string;
  readonly ownerIds: readonly string[];
};
export type Output = {
  readonly vacant: boolean;
  readonly distinctOwnerCount: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    controlId: { type: "string", maxLength: 8192 },
    ownerIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["controlId", "ownerIds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    vacant: { type: "boolean" },
    distinctOwnerCount: { type: "integer" },
  },
  required: ["vacant", "distinctOwnerCount"],
} as const;
/** Check whether a defensive control has any recorded nonblank owners, without assigning ownership or granting permissions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { controlId, ownerIds } = request;
  const compute = (): Output => {
    H.domain(controlId.length > 0, "controlId");
    H.domain(
      ownerIds.every((v) => v.trim().length > 0),
      "ownerIds",
    );
    const distinctOwnerCount = new Set(ownerIds).size;
    return { vacant: distinctOwnerCount === 0, distinctOwnerCount };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { controlId: "C17", ownerIds: [] },
  output: { vacant: true, distinctOwnerCount: 0 },
} satisfies ToolExample<Input, Output>;
export const securityControlOwnerVacancyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "security-studies/security-control-owner-vacancy",
    title: "Security Control Owner Vacancy Tool",
    description:
      "Check whether a defensive control has any recorded nonblank owners, without assigning ownership or granting permissions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        controlId: { type: "string", maxLength: 8192 },
        ownerIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["controlId", "ownerIds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        vacant: { type: "boolean" },
        distinctOwnerCount: { type: "integer" },
      },
      required: ["vacant", "distinctOwnerCount"],
    },
    ports: {
      inputs: [
        {
          id: "controlId",
          label: "Control Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "ownerIds",
          label: "Owner Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        { id: "vacant", label: "Vacant", valueType: { type: "boolean" } },
        {
          id: "distinctOwnerCount",
          label: "Distinct Owner Count",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = securityControlOwnerVacancyTool.execute;
export default securityControlOwnerVacancyTool;
