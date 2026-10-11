import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly catchmentPopulation: number;
  readonly totalPopulation: number;
};
export type Output = { readonly weight: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    catchmentPopulation: { type: "integer", minimum: 0 },
    totalPopulation: { type: "integer", minimum: 1 },
  },
  required: ["catchmentPopulation", "totalPopulation"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { weight: { type: "number" } },
  required: ["weight"],
} as const;
/** Normalize an explicit service-catchment population to a supplied containing total without delineating a catchment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { catchmentPopulation, totalPopulation } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(totalPopulation) &&
        totalPopulation >= 1 &&
        totalPopulation <= Number.MAX_SAFE_INTEGER,
      "totalPopulation",
    ),
      totalPopulation);
    (H.domain(
      Number.isSafeInteger(catchmentPopulation) &&
        catchmentPopulation >= 0 &&
        catchmentPopulation <= totalPopulation,
      "catchmentPopulation",
    ),
      catchmentPopulation);
    return { weight: catchmentPopulation / totalPopulation };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { catchmentPopulation: 2500, totalPopulation: 10000 },
  output: { weight: 0.25 },
} satisfies ToolExample<Input, Output>;
export const publicHealthServiceCatchmentWeightTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["public-health", "public health", "health and medicine"],
      keywords: ["public health", "health and medicine"],
    },
    id: "public-health/public-health-service-catchment-weight",
    title: "Public Health Service Catchment Weight",
    description:
      "Normalize an explicit service-catchment population to a supplied containing total without delineating a catchment.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        catchmentPopulation: { type: "integer", minimum: 0 },
        totalPopulation: { type: "integer", minimum: 1 },
      },
      required: ["catchmentPopulation", "totalPopulation"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { weight: { type: "number" } },
      required: ["weight"],
    },
    ports: {
      inputs: [
        {
          id: "catchmentPopulation",
          label: "Catchment Population",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "totalPopulation",
          label: "Total Population",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "weight", label: "Weight", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = publicHealthServiceCatchmentWeightTool.execute;
export default publicHealthServiceCatchmentWeightTool;
