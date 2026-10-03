import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly issued: boolean;
  readonly returned: boolean;
  readonly lost: boolean;
  readonly invalidated: boolean;
};
export type Output = { readonly status: string; readonly unresolved: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    issued: { type: "boolean" },
    returned: { type: "boolean" },
    lost: { type: "boolean" },
    invalidated: { type: "boolean" },
  },
  required: ["issued", "returned", "lost", "invalidated"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    status: { type: "string", maxLength: 8192 },
    unresolved: { type: "boolean" },
  },
  required: ["status", "unresolved"],
} as const;
/** Classify a supplied badge inventory record; no access permission or credential action is performed. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { issued, returned, lost, invalidated } = request;
  const compute = (): Output => {
    H.domain(issued || (!returned && !lost && !invalidated));
    H.domain(!(returned && lost));
    return {
      status: !issued
        ? "not-issued"
        : returned
          ? "returned"
          : lost
            ? "reported-lost"
            : "outstanding",
      unresolved: issued && !returned && !lost && !invalidated,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { issued: true, returned: false, lost: false, invalidated: false },
  output: { status: "outstanding", unresolved: true },
} satisfies ToolExample<Input, Output>;
export const visitorBadgeReturnStatusTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "security-studies/visitor-badge-return-status-token",
    title: "Visitor Badge Return Status Token Tool",
    description:
      "Classify a supplied badge inventory record; no access permission or credential action is performed.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        issued: { type: "boolean" },
        returned: { type: "boolean" },
        lost: { type: "boolean" },
        invalidated: { type: "boolean" },
      },
      required: ["issued", "returned", "lost", "invalidated"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        status: { type: "string", maxLength: 8192 },
        unresolved: { type: "boolean" },
      },
      required: ["status", "unresolved"],
    },
    ports: {
      inputs: [
        {
          id: "issued",
          label: "Issued",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "returned",
          label: "Returned",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "lost",
          label: "Lost",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "invalidated",
          label: "Invalidated",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "status", label: "Status", valueType: { type: "string" } },
        {
          id: "unresolved",
          label: "Unresolved",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = visitorBadgeReturnStatusTokenTool.execute;
export default visitorBadgeReturnStatusTokenTool;
