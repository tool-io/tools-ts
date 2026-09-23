import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly requiredRoles: readonly string[];
  readonly presentRoles: readonly string[];
};
export type Output = {
  readonly covered: number;
  readonly required: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requiredRoles: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    presentRoles: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["requiredRoles", "presentRoles"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    covered: { type: "integer" },
    required: { type: "integer" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["covered", "required", "share", "defined"],
} as const;
/** Audit an explicit protective drill roster without operational or laboratory procedure instructions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { requiredRoles, presentRoles } = request;
  const compute = (): Output => {
    return {
      covered: new Set(requiredRoles.filter((x) => presentRoles.includes(x)))
        .size,
      required: new Set(requiredRoles).size,
      share: requiredRoles.length
        ? new Set(requiredRoles.filter((x) => presentRoles.includes(x))).size /
          new Set(requiredRoles).size
        : 0,
      defined: requiredRoles.length > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { requiredRoles: ["A", "B"], presentRoles: ["A"] },
  output: { covered: 1, required: 2, share: 0.5, defined: true },
} satisfies ToolExample<Input, Output>;
export const drillRoleCoverageShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biosafety/drill-role-coverage-share",
    title: "Drill Role Coverage Share Tool",
    description:
      "Audit an explicit protective drill roster without operational or laboratory procedure instructions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requiredRoles: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        presentRoles: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["requiredRoles", "presentRoles"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        covered: { type: "integer" },
        required: { type: "integer" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["covered", "required", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "requiredRoles",
          label: "Required Roles",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "presentRoles",
          label: "Present Roles",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        { id: "covered", label: "Covered", valueType: { type: "integer" } },
        { id: "required", label: "Required", valueType: { type: "integer" } },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = drillRoleCoverageShareTool.execute;
export default drillRoleCoverageShareTool;
