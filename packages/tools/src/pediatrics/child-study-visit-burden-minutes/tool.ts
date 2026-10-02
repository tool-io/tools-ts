import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly activityMinutes: readonly number[];
  readonly breakMinutes: readonly number[];
  readonly suppliedAdditionalMinutes: number;
};
export type Output = {
  readonly activityTotal: number;
  readonly breakTotal: number;
  readonly elapsedBurdenMinutes: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    activityMinutes: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    breakMinutes: { type: "array", maxItems: 256, items: { type: "number" } },
    suppliedAdditionalMinutes: { type: "number", minimum: 0 },
  },
  required: ["activityMinutes", "breakMinutes", "suppliedAdditionalMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    activityTotal: { type: "number" },
    breakTotal: { type: "number" },
    elapsedBurdenMinutes: { type: "number" },
  },
  required: ["activityTotal", "breakTotal", "elapsedBurdenMinutes"],
} as const;
/** Total one supplied research visit’s sequential activities, breaks and additional elapsed time; no safe burden limit is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { activityMinutes, breakMinutes, suppliedAdditionalMinutes } = request;
  const compute = (): Output => {
    H.domain(
      activityMinutes.every((x) => x >= 0) &&
        breakMinutes.every((x) => x >= 0) &&
        suppliedAdditionalMinutes >= 0,
    );
    return {
      activityTotal: activityMinutes.reduce((a, b) => a + b, 0),
      breakTotal: breakMinutes.reduce((a, b) => a + b, 0),
      elapsedBurdenMinutes:
        activityMinutes.reduce((a, b) => a + b, 0) +
        breakMinutes.reduce((a, b) => a + b, 0) +
        suppliedAdditionalMinutes,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    activityMinutes: [10, 15],
    breakMinutes: [5],
    suppliedAdditionalMinutes: 2,
  },
  output: { activityTotal: 25, breakTotal: 5, elapsedBurdenMinutes: 32 },
} satisfies ToolExample<Input, Output>;
export const childStudyVisitBurdenMinutesTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pediatrics/child-study-visit-burden-minutes",
    title: "Child Study Visit Burden Minutes Tool",
    description:
      "Total one supplied research visit’s sequential activities, breaks and additional elapsed time; no safe burden limit is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        activityMinutes: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        breakMinutes: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        suppliedAdditionalMinutes: { type: "number", minimum: 0 },
      },
      required: [
        "activityMinutes",
        "breakMinutes",
        "suppliedAdditionalMinutes",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        activityTotal: { type: "number" },
        breakTotal: { type: "number" },
        elapsedBurdenMinutes: { type: "number" },
      },
      required: ["activityTotal", "breakTotal", "elapsedBurdenMinutes"],
    },
    ports: {
      inputs: [
        {
          id: "activityMinutes",
          label: "Activity Minutes",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "breakMinutes",
          label: "Break Minutes",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "suppliedAdditionalMinutes",
          label: "Supplied Additional Minutes",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "activityTotal",
          label: "Activity Total",
          valueType: { type: "number" },
        },
        {
          id: "breakTotal",
          label: "Break Total",
          valueType: { type: "number" },
        },
        {
          id: "elapsedBurdenMinutes",
          label: "Elapsed Burden Minutes",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = childStudyVisitBurdenMinutesTool.execute;
export default childStudyVisitBurdenMinutesTool;
