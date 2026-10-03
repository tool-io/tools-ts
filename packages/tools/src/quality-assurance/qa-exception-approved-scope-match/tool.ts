import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly requestedTask: string;
  readonly requestedSite: string;
  readonly approvedTasks: readonly string[];
  readonly approvedSites: readonly string[];
  readonly approved: boolean;
  readonly startDay: number;
  readonly endDay: number;
  readonly eventDay: number;
};
export type Output = {
  readonly scopeMatches: boolean;
  readonly timeMatches: boolean;
  readonly matches: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requestedTask: { type: "string", maxLength: 8192 },
    requestedSite: { type: "string", maxLength: 8192 },
    approvedTasks: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    approvedSites: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    approved: { type: "boolean" },
    startDay: { type: "integer" },
    endDay: { type: "integer" },
    eventDay: { type: "integer" },
  },
  required: [
    "requestedTask",
    "requestedSite",
    "approvedTasks",
    "approvedSites",
    "approved",
    "startDay",
    "endDay",
    "eventDay",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scopeMatches: { type: "boolean" },
    timeMatches: { type: "boolean" },
    matches: { type: "boolean" },
  },
  required: ["scopeMatches", "timeMatches", "matches"],
} as const;
/** Match explicitly approved exception scope/time fields without compliance certification. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    requestedTask,
    requestedSite,
    approvedTasks,
    approvedSites,
    approved,
    startDay,
    endDay,
    eventDay,
  } = request;
  const compute = (): Output => {
    H.domain(endDay >= startDay);
    const scopeMatches =
        approvedTasks.includes(requestedTask) &&
        approvedSites.includes(requestedSite),
      timeMatches = eventDay >= startDay && eventDay <= endDay;
    return {
      scopeMatches,
      timeMatches,
      matches: approved && scopeMatches && timeMatches,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    requestedTask: "A",
    requestedSite: "S1",
    approvedTasks: ["A"],
    approvedSites: ["S1"],
    approved: true,
    startDay: 100,
    endDay: 110,
    eventDay: 105,
  },
  output: { scopeMatches: true, timeMatches: true, matches: true },
} satisfies ToolExample<Input, Output>;
export const qaExceptionApprovedScopeMatchTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "quality-assurance/qa-exception-approved-scope-match",
    title: "QA Exception Approved Scope Match Tool",
    description:
      "Match explicitly approved exception scope/time fields without compliance certification.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requestedTask: { type: "string", maxLength: 8192 },
        requestedSite: { type: "string", maxLength: 8192 },
        approvedTasks: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        approvedSites: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        approved: { type: "boolean" },
        startDay: { type: "integer" },
        endDay: { type: "integer" },
        eventDay: { type: "integer" },
      },
      required: [
        "requestedTask",
        "requestedSite",
        "approvedTasks",
        "approvedSites",
        "approved",
        "startDay",
        "endDay",
        "eventDay",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        scopeMatches: { type: "boolean" },
        timeMatches: { type: "boolean" },
        matches: { type: "boolean" },
      },
      required: ["scopeMatches", "timeMatches", "matches"],
    },
    ports: {
      inputs: [
        {
          id: "requestedTask",
          label: "Requested Task",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "requestedSite",
          label: "Requested Site",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "approvedTasks",
          label: "Approved Tasks",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "approvedSites",
          label: "Approved Sites",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "approved",
          label: "Approved",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "startDay",
          label: "Start Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "endDay",
          label: "End Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "eventDay",
          label: "Event Day",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "scopeMatches",
          label: "Scope Matches",
          valueType: { type: "boolean" },
        },
        {
          id: "timeMatches",
          label: "Time Matches",
          valueType: { type: "boolean" },
        },
        { id: "matches", label: "Matches", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = qaExceptionApprovedScopeMatchTool.execute;
export default qaExceptionApprovedScopeMatchTool;
