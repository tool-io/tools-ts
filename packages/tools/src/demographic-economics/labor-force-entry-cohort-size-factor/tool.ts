import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cohort: number;
  readonly survival: number;
  readonly participation: number;
  readonly employment: number;
};
export type Output = { readonly laborForce: number; readonly employed: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cohort: { type: "integer", minimum: 0 },
    survival: { type: "number", minimum: 0, maximum: 1 },
    participation: { type: "number", minimum: 0, maximum: 1 },
    employment: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["cohort", "survival", "participation", "employment"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { laborForce: { type: "number" }, employed: { type: "number" } },
  required: ["laborForce", "employed"],
} as const;
/** Calculate labor force entry cohort size factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cohort, survival, participation, employment } = request;
  const compute = (): Output => {
    H.integer(cohort, 0);
    H.probability(survival);
    H.probability(participation);
    H.probability(employment);
    return {
      laborForce: cohort * survival * participation,
      employed: cohort * survival * participation * employment,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { cohort: 1000, survival: 0.9, participation: 0.8, employment: 0.75 },
  output: { laborForce: 720, employed: 540 },
} satisfies ToolExample<Input, Output>;
export const laborForceEntryCohortSizeFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "demographic-economics/labor-force-entry-cohort-size-factor",
    title: "Labor Force Entry Cohort Size Factor Tool",
    description:
      "Calculate labor force entry cohort size factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cohort: { type: "integer", minimum: 0 },
        survival: { type: "number", minimum: 0, maximum: 1 },
        participation: { type: "number", minimum: 0, maximum: 1 },
        employment: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["cohort", "survival", "participation", "employment"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        laborForce: { type: "number" },
        employed: { type: "number" },
      },
      required: ["laborForce", "employed"],
    },
    ports: {
      inputs: [
        {
          id: "cohort",
          label: "Cohort",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "survival",
          label: "Survival",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "participation",
          label: "Participation",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "employment",
          label: "Employment",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "laborForce",
          label: "Labor Force",
          valueType: { type: "number" },
        },
        { id: "employed", label: "Employed", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = laborForceEntryCohortSizeFactorTool.execute;
export default laborForceEntryCohortSizeFactorTool;
