import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly available: number;
  readonly required: number;
  readonly scheduledUse: number;
  readonly reserve: number;
};
export type Output = {
  readonly remaining: number;
  readonly margin: number;
  readonly sufficient: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    available: { type: "number", minimum: 0 },
    required: { type: "number", minimum: 0 },
    scheduledUse: { type: "number", minimum: 0 },
    reserve: { type: "number", minimum: 0 },
  },
  required: ["available", "required", "scheduledUse", "reserve"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    remaining: { type: "number" },
    margin: { type: "number" },
    sufficient: { type: "boolean" },
  },
  required: ["remaining", "margin", "sufficient"],
} as const;
/** Calculate glp retained sample minimum caller gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { available, required, scheduledUse, reserve } = request;
  const compute = (): Output => {
    H.domain(
      available >= 0 && required >= 0 && scheduledUse >= 0 && reserve >= 0,
    );
    return {
      remaining: available - scheduledUse - reserve,
      margin: available - scheduledUse - reserve - required,
      sufficient: available - scheduledUse - reserve >= required,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { available: 100, required: 40, scheduledUse: 20, reserve: 10 },
  output: { remaining: 70, margin: 30, sufficient: true },
} satisfies ToolExample<Input, Output>;
export const glpRetainedSampleMinimumCallerGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "glp/glp-retained-sample-minimum-caller-gap",
    title: "GLP Retained Sample Minimum Caller Gap Tool",
    description:
      "Calculate glp retained sample minimum caller gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        available: { type: "number", minimum: 0 },
        required: { type: "number", minimum: 0 },
        scheduledUse: { type: "number", minimum: 0 },
        reserve: { type: "number", minimum: 0 },
      },
      required: ["available", "required", "scheduledUse", "reserve"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        remaining: { type: "number" },
        margin: { type: "number" },
        sufficient: { type: "boolean" },
      },
      required: ["remaining", "margin", "sufficient"],
    },
    ports: {
      inputs: [
        {
          id: "available",
          label: "Available",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "required",
          label: "Required",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "scheduledUse",
          label: "Scheduled Use",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reserve",
          label: "Reserve",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "remaining", label: "Remaining", valueType: { type: "number" } },
        { id: "margin", label: "Margin", valueType: { type: "number" } },
        {
          id: "sufficient",
          label: "Sufficient",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = glpRetainedSampleMinimumCallerGapTool.execute;
export default glpRetainedSampleMinimumCallerGapTool;
