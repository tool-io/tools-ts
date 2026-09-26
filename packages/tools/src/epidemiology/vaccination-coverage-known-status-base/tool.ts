import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly vaccinated: number;
  readonly unvaccinated: number;
  readonly unknown: number;
};
export type Output = {
  readonly knownStatus: number;
  readonly knownCoverage: number;
  readonly allRecordsCoverage: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    vaccinated: { type: "integer", minimum: 0 },
    unvaccinated: { type: "integer", minimum: 0 },
    unknown: { type: "integer", minimum: 0 },
  },
  required: ["vaccinated", "unvaccinated", "unknown"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    knownStatus: { type: "integer" },
    knownCoverage: { type: "number" },
    allRecordsCoverage: { type: "number" },
  },
  required: ["knownStatus", "knownCoverage", "allRecordsCoverage"],
} as const;
/** Descriptive coverage with known-status and all-record denominators; not adjusted for missingness or vaccine schedule completeness. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { vaccinated, unvaccinated, unknown } = request;
  const compute = (): Output => {
    H.integer(vaccinated, 0);
    H.integer(unvaccinated, 0);
    H.integer(unknown, 0);
    H.domain(vaccinated + unvaccinated > 0);
    return {
      knownStatus: vaccinated + unvaccinated,
      knownCoverage: vaccinated / (vaccinated + unvaccinated),
      allRecordsCoverage: vaccinated / (vaccinated + unvaccinated + unknown),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { vaccinated: 80, unvaccinated: 20, unknown: 25 },
  output: { knownStatus: 100, knownCoverage: 0.8, allRecordsCoverage: 0.64 },
} satisfies ToolExample<Input, Output>;
export const vaccinationCoverageKnownStatusBaseTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "epidemiology/vaccination-coverage-known-status-base",
    title: "Vaccination Coverage Known Status Base Tool",
    description:
      "Descriptive coverage with known-status and all-record denominators; not adjusted for missingness or vaccine schedule completeness.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        vaccinated: { type: "integer", minimum: 0 },
        unvaccinated: { type: "integer", minimum: 0 },
        unknown: { type: "integer", minimum: 0 },
      },
      required: ["vaccinated", "unvaccinated", "unknown"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        knownStatus: { type: "integer" },
        knownCoverage: { type: "number" },
        allRecordsCoverage: { type: "number" },
      },
      required: ["knownStatus", "knownCoverage", "allRecordsCoverage"],
    },
    ports: {
      inputs: [
        {
          id: "vaccinated",
          label: "Vaccinated",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "unvaccinated",
          label: "Unvaccinated",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "unknown",
          label: "Unknown",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "knownStatus",
          label: "Known Status",
          valueType: { type: "integer" },
        },
        {
          id: "knownCoverage",
          label: "Known Coverage",
          valueType: { type: "number" },
        },
        {
          id: "allRecordsCoverage",
          label: "All Records Coverage",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = vaccinationCoverageKnownStatusBaseTool.execute;
export default vaccinationCoverageKnownStatusBaseTool;
