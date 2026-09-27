import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleRatio: number;
  readonly suppliedStandardRatio: number;
  readonly reportedDeltaPerMil: number;
};
export type Output = {
  readonly derivedDeltaPerMil: number;
  readonly residualPerMil: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleRatio: { type: "number", minimum: 0 },
    suppliedStandardRatio: { type: "number", exclusiveMinimum: 0 },
    reportedDeltaPerMil: { type: "number" },
  },
  required: ["sampleRatio", "suppliedStandardRatio", "reportedDeltaPerMil"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    derivedDeltaPerMil: { type: "number" },
    residualPerMil: { type: "number" },
  },
  required: ["derivedDeltaPerMil", "residualPerMil"],
} as const;
/** Compare a supplied isotope delta notation to a supplied positive standard ratio without choosing isotope standards. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampleRatio, suppliedStandardRatio, reportedDeltaPerMil } = request;
  const compute = (): Output => {
    H.domain(sampleRatio >= 0);
    H.positive(suppliedStandardRatio);
    return {
      derivedDeltaPerMil: (sampleRatio / suppliedStandardRatio - 1) * 1000,
      residualPerMil:
        reportedDeltaPerMil - (sampleRatio / suppliedStandardRatio - 1) * 1000,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sampleRatio: 1.1,
    suppliedStandardRatio: 1,
    reportedDeltaPerMil: 90,
  },
  output: {
    derivedDeltaPerMil: 100.00000000000009,
    residualPerMil: -10.000000000000085,
  },
} satisfies ToolExample<Input, Output>;
export const isotopeStandardDeltaResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geochemistry/isotope-standard-delta-residual",
    title: "Isotope Standard Delta Residual Tool",
    description:
      "Compare a supplied isotope delta notation to a supplied positive standard ratio without choosing isotope standards.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampleRatio: { type: "number", minimum: 0 },
        suppliedStandardRatio: { type: "number", exclusiveMinimum: 0 },
        reportedDeltaPerMil: { type: "number" },
      },
      required: ["sampleRatio", "suppliedStandardRatio", "reportedDeltaPerMil"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        derivedDeltaPerMil: { type: "number" },
        residualPerMil: { type: "number" },
      },
      required: ["derivedDeltaPerMil", "residualPerMil"],
    },
    ports: {
      inputs: [
        {
          id: "sampleRatio",
          label: "Sample Ratio",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedStandardRatio",
          label: "Supplied Standard Ratio",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reportedDeltaPerMil",
          label: "Reported Delta Per Mil",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "derivedDeltaPerMil",
          label: "Derived Delta Per Mil",
          valueType: { type: "number" },
        },
        {
          id: "residualPerMil",
          label: "Residual Per Mil",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = isotopeStandardDeltaResidualTool.execute;
export default isotopeStandardDeltaResidualTool;
