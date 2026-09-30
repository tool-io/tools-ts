import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly creditedRoles: number;
  readonly duplicateRoles: number;
  readonly totalRoles: number;
};
export type Output = { readonly uniqueRoles: number; readonly share: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    creditedRoles: { type: "integer", minimum: 0 },
    duplicateRoles: { type: "integer", minimum: 0 },
    totalRoles: { type: "integer", minimum: 1 },
  },
  required: ["creditedRoles", "duplicateRoles", "totalRoles"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { uniqueRoles: { type: "integer" }, share: { type: "number" } },
  required: ["uniqueRoles", "share"],
} as const;
/** Calculate credits duplicate role share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { creditedRoles, duplicateRoles, totalRoles } = request;
  const compute = (): Output => {
    H.integer(totalRoles, 1);
    H.integer(creditedRoles, 0);
    H.integer(duplicateRoles, 0, creditedRoles);
    H.domain(creditedRoles - duplicateRoles <= totalRoles);
    return {
      uniqueRoles: creditedRoles - duplicateRoles,
      share: (creditedRoles - duplicateRoles) / totalRoles,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { creditedRoles: 5, duplicateRoles: 2, totalRoles: 10 },
  output: { uniqueRoles: 3, share: 0.3 },
} satisfies ToolExample<Input, Output>;
export const creditsDuplicateRoleShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "media-studies/credits-duplicate-role-share",
    title: "Credits Duplicate Role Share Tool",
    description:
      "Calculate credits duplicate role share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        creditedRoles: { type: "integer", minimum: 0 },
        duplicateRoles: { type: "integer", minimum: 0 },
        totalRoles: { type: "integer", minimum: 1 },
      },
      required: ["creditedRoles", "duplicateRoles", "totalRoles"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        uniqueRoles: { type: "integer" },
        share: { type: "number" },
      },
      required: ["uniqueRoles", "share"],
    },
    ports: {
      inputs: [
        {
          id: "creditedRoles",
          label: "Credited Roles",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "duplicateRoles",
          label: "Duplicate Roles",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "totalRoles",
          label: "Total Roles",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "uniqueRoles",
          label: "Unique Roles",
          valueType: { type: "integer" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = creditsDuplicateRoleShareTool.execute;
export default creditsDuplicateRoleShareTool;
