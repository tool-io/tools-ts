import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly process: string;
  readonly approvedProcesses: readonly string[];
  readonly eventDay: number;
  readonly approvalDay: number;
  readonly expiryDay: number;
  readonly approved: boolean;
};
export type Output = {
  readonly scopeMatch: boolean;
  readonly effective: boolean;
  readonly leadDays: number;
  readonly eligible: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    process: { type: "string", maxLength: 8192 },
    approvedProcesses: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    eventDay: { type: "integer" },
    approvalDay: { type: "integer" },
    expiryDay: { type: "integer" },
    approved: { type: "boolean" },
  },
  required: [
    "process",
    "approvedProcesses",
    "eventDay",
    "approvalDay",
    "expiryDay",
    "approved",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scopeMatch: { type: "boolean" },
    effective: { type: "boolean" },
    leadDays: { type: "integer" },
    eligible: { type: "boolean" },
  },
  required: ["scopeMatch", "effective", "leadDays", "eligible"],
} as const;
/** Audit explicit deviation approval scope and timing fields. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    process,
    approvedProcesses,
    eventDay,
    approvalDay,
    expiryDay,
    approved,
  } = request;
  const compute = (): Output => {
    H.domain(expiryDay >= approvalDay);
    const scopeMatch = approvedProcesses.includes(process),
      effective = eventDay >= approvalDay && eventDay <= expiryDay;
    return {
      scopeMatch,
      effective,
      leadDays: eventDay - approvalDay,
      eligible: approved && scopeMatch && effective,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    process: "P",
    approvedProcesses: ["P"],
    eventDay: 110,
    approvalDay: 100,
    expiryDay: 120,
    approved: true,
  },
  output: { scopeMatch: true, effective: true, leadDays: 10, eligible: true },
} satisfies ToolExample<Input, Output>;
export const gmpDeviationApprovedScopeDategapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gmp/gmp-deviation-approved-scope-dategap",
    title: "GMP Deviation Approved Scope Dategap Tool",
    description: "Audit explicit deviation approval scope and timing fields.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        process: { type: "string", maxLength: 8192 },
        approvedProcesses: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        eventDay: { type: "integer" },
        approvalDay: { type: "integer" },
        expiryDay: { type: "integer" },
        approved: { type: "boolean" },
      },
      required: [
        "process",
        "approvedProcesses",
        "eventDay",
        "approvalDay",
        "expiryDay",
        "approved",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        scopeMatch: { type: "boolean" },
        effective: { type: "boolean" },
        leadDays: { type: "integer" },
        eligible: { type: "boolean" },
      },
      required: ["scopeMatch", "effective", "leadDays", "eligible"],
    },
    ports: {
      inputs: [
        {
          id: "process",
          label: "Process",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "approvedProcesses",
          label: "Approved Processes",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "eventDay",
          label: "Event Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "approvalDay",
          label: "Approval Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "expiryDay",
          label: "Expiry Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "approved",
          label: "Approved",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "scopeMatch",
          label: "Scope Match",
          valueType: { type: "boolean" },
        },
        { id: "effective", label: "Effective", valueType: { type: "boolean" } },
        { id: "leadDays", label: "Lead Days", valueType: { type: "integer" } },
        { id: "eligible", label: "Eligible", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = gmpDeviationApprovedScopeDategapTool.execute;
export default gmpDeviationApprovedScopeDategapTool;
