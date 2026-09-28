import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstEnd: number;
  readonly secondStart: number;
  readonly firstEndIncluded: boolean;
  readonly secondStartIncluded: boolean;
};
export type Output = {
  readonly touches: boolean;
  readonly sharedBoundary: boolean;
  readonly gap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstEnd: { type: "number" },
    secondStart: { type: "number" },
    firstEndIncluded: { type: "boolean" },
    secondStartIncluded: { type: "boolean" },
  },
  required: [
    "firstEnd",
    "secondStart",
    "firstEndIncluded",
    "secondStartIncluded",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    touches: { type: "boolean" },
    sharedBoundary: { type: "boolean" },
    gap: { type: "number" },
  },
  required: ["touches", "sharedBoundary", "gap"],
} as const;
/** Inspect supplied policy-record boundary ownership without establishing continuous legal coverage. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstEnd, secondStart, firstEndIncluded, secondStartIncluded } =
    request;
  const compute = (): Output => {
    return {
      touches: firstEnd === secondStart,
      sharedBoundary:
        firstEnd === secondStart && firstEndIncluded && secondStartIncluded,
      gap: secondStart - firstEnd,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstEnd: 10,
    secondStart: 10,
    firstEndIncluded: true,
    secondStartIncluded: true,
  },
  output: { touches: true, sharedBoundary: true, gap: 0 },
} satisfies ToolExample<Input, Output>;
export const insurancePeriodTouchTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health-policy/insurance-period-touch-token",
    title: "Insurance Period Touch Token Tool",
    description:
      "Inspect supplied policy-record boundary ownership without establishing continuous legal coverage.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstEnd: { type: "number" },
        secondStart: { type: "number" },
        firstEndIncluded: { type: "boolean" },
        secondStartIncluded: { type: "boolean" },
      },
      required: [
        "firstEnd",
        "secondStart",
        "firstEndIncluded",
        "secondStartIncluded",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        touches: { type: "boolean" },
        sharedBoundary: { type: "boolean" },
        gap: { type: "number" },
      },
      required: ["touches", "sharedBoundary", "gap"],
    },
    ports: {
      inputs: [
        {
          id: "firstEnd",
          label: "First End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondStart",
          label: "Second Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstEndIncluded",
          label: "First End Included",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "secondStartIncluded",
          label: "Second Start Included",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "touches", label: "Touches", valueType: { type: "boolean" } },
        {
          id: "sharedBoundary",
          label: "Shared Boundary",
          valueType: { type: "boolean" },
        },
        { id: "gap", label: "Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = insurancePeriodTouchTokenTool.execute;
export default insurancePeriodTouchTokenTool;
