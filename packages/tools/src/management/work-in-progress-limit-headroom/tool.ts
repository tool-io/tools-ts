import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly active: number;
  readonly limit: number;
  readonly reserved: number;
};
export type Output = { readonly headroom: number; readonly overLimit: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    active: { type: "integer", minimum: 0 },
    limit: { type: "integer", minimum: 0 },
    reserved: { type: "integer", minimum: 0 },
  },
  required: ["active", "limit", "reserved"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { headroom: { type: "integer" }, overLimit: { type: "boolean" } },
  required: ["headroom", "overLimit"],
} as const;
/** Calculate work in progress limit headroom from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { active, limit, reserved } = request;
  const compute = (): Output => {
    H.integer(active, 0);
    H.integer(limit, 0);
    H.integer(reserved, 0);
    return {
      headroom: limit - active - reserved,
      overLimit: active + reserved > limit,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { active: 6, limit: 10, reserved: 2 },
  output: { headroom: 2, overLimit: false },
} satisfies ToolExample<Input, Output>;
export const workInProgressLimitHeadroomTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "management/work-in-progress-limit-headroom",
    title: "Work In Progress Limit Headroom Tool",
    description:
      "Calculate work in progress limit headroom from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        active: { type: "integer", minimum: 0 },
        limit: { type: "integer", minimum: 0 },
        reserved: { type: "integer", minimum: 0 },
      },
      required: ["active", "limit", "reserved"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        headroom: { type: "integer" },
        overLimit: { type: "boolean" },
      },
      required: ["headroom", "overLimit"],
    },
    ports: {
      inputs: [
        {
          id: "active",
          label: "Active",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "limit",
          label: "Limit",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "reserved",
          label: "Reserved",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "headroom", label: "Headroom", valueType: { type: "integer" } },
        {
          id: "overLimit",
          label: "Over Limit",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = workInProgressLimitHeadroomTool.execute;
export default workInProgressLimitHeadroomTool;
