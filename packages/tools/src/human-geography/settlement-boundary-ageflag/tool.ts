import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observationYear: number;
  readonly boundaryVintageYear: number;
  readonly suppliedMaxAge: number;
};
export type Output = {
  readonly ageYears: number;
  readonly currentUnderLimit: boolean;
  readonly futureVintage: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observationYear: { type: "integer" },
    boundaryVintageYear: { type: "integer" },
    suppliedMaxAge: { type: "integer", minimum: 0 },
  },
  required: ["observationYear", "boundaryVintageYear", "suppliedMaxAge"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ageYears: { type: "integer" },
    currentUnderLimit: { type: "boolean" },
    futureVintage: { type: "boolean" },
  },
  required: ["ageYears", "currentUnderLimit", "futureVintage"],
} as const;
/** Calculate settlement boundary ageflag from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observationYear, boundaryVintageYear, suppliedMaxAge } = request;
  const compute = (): Output => {
    H.integer(suppliedMaxAge, 0);
    return {
      ageYears: observationYear - boundaryVintageYear,
      currentUnderLimit:
        observationYear >= boundaryVintageYear &&
        observationYear - boundaryVintageYear <= suppliedMaxAge,
      futureVintage: boundaryVintageYear > observationYear,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    observationYear: 2026,
    boundaryVintageYear: 2020,
    suppliedMaxAge: 5,
  },
  output: { ageYears: 6, currentUnderLimit: false, futureVintage: false },
} satisfies ToolExample<Input, Output>;
export const settlementBoundaryAgeflagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "human-geography/settlement-boundary-ageflag",
    title: "Settlement Boundary Ageflag Tool",
    description:
      "Calculate settlement boundary ageflag from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observationYear: { type: "integer" },
        boundaryVintageYear: { type: "integer" },
        suppliedMaxAge: { type: "integer", minimum: 0 },
      },
      required: ["observationYear", "boundaryVintageYear", "suppliedMaxAge"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ageYears: { type: "integer" },
        currentUnderLimit: { type: "boolean" },
        futureVintage: { type: "boolean" },
      },
      required: ["ageYears", "currentUnderLimit", "futureVintage"],
    },
    ports: {
      inputs: [
        {
          id: "observationYear",
          label: "Observation Year",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "boundaryVintageYear",
          label: "Boundary Vintage Year",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "suppliedMaxAge",
          label: "Supplied Max Age",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "ageYears", label: "Age Years", valueType: { type: "integer" } },
        {
          id: "currentUnderLimit",
          label: "Current Under Limit",
          valueType: { type: "boolean" },
        },
        {
          id: "futureVintage",
          label: "Future Vintage",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = settlementBoundaryAgeflagTool.execute;
export default settlementBoundaryAgeflagTool;
