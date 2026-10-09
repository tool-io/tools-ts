import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly expectedPeople: number;
  readonly servedPeople: number;
};
export type Output = {
  readonly unservedPeople: number;
  readonly extraServedPeople: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expectedPeople: { type: "integer", minimum: 0 },
    servedPeople: { type: "integer", minimum: 0 },
  },
  required: ["expectedPeople", "servedPeople"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unservedPeople: { type: "integer" },
    extraServedPeople: { type: "integer" },
  },
  required: ["unservedPeople", "extraServedPeople"],
} as const;
/** Compare explicit expected and served person counts without judging nutritional adequacy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { expectedPeople, servedPeople } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(expectedPeople) &&
        expectedPeople >= 0 &&
        expectedPeople <= Number.MAX_SAFE_INTEGER,
      "expectedPeople",
    ),
      expectedPeople);
    (H.domain(
      Number.isSafeInteger(servedPeople) &&
        servedPeople >= 0 &&
        servedPeople <= Number.MAX_SAFE_INTEGER,
      "servedPeople",
    ),
      servedPeople);
    return {
      unservedPeople: Math.max(0, expectedPeople - servedPeople),
      extraServedPeople: Math.max(0, servedPeople - expectedPeople),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { expectedPeople: 100, servedPeople: 85 },
  output: { unservedPeople: 15, extraServedPeople: 0 },
} satisfies ToolExample<Input, Output>;
export const communalmealServedUnservedCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["food-security", "food security", "agriculture"],
      keywords: ["food security", "agriculture"],
    },
    id: "food-security/communal-meal-served-unserved-count",
    title: "Communal Meal Served Unserved Count",
    description:
      "Compare explicit expected and served person counts without judging nutritional adequacy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        expectedPeople: { type: "integer", minimum: 0 },
        servedPeople: { type: "integer", minimum: 0 },
      },
      required: ["expectedPeople", "servedPeople"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        unservedPeople: { type: "integer" },
        extraServedPeople: { type: "integer" },
      },
      required: ["unservedPeople", "extraServedPeople"],
    },
    ports: {
      inputs: [
        {
          id: "expectedPeople",
          label: "Expected People",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "servedPeople",
          label: "Served People",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "unservedPeople",
          label: "Unserved People",
          valueType: { type: "integer" },
        },
        {
          id: "extraServedPeople",
          label: "Extra Served People",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = communalmealServedUnservedCountTool.execute;
export default communalmealServedUnservedCountTool;
