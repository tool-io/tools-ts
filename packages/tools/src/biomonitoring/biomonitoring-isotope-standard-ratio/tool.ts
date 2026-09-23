import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly analyteSignal: number;
  readonly standardSignal: number;
  readonly analyteBlank: number;
  readonly standardBlank: number;
  readonly suppliedReference: number;
};
export type Output = {
  readonly correctedAnalyte: number;
  readonly correctedStandard: number;
  readonly ratio: number;
  readonly normalized: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    analyteSignal: { type: "number" },
    standardSignal: { type: "number" },
    analyteBlank: { type: "number" },
    standardBlank: { type: "number" },
    suppliedReference: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "analyteSignal",
    "standardSignal",
    "analyteBlank",
    "standardBlank",
    "suppliedReference",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    correctedAnalyte: { type: "number" },
    correctedStandard: { type: "number" },
    ratio: { type: "number" },
    normalized: { type: "number" },
  },
  required: ["correctedAnalyte", "correctedStandard", "ratio", "normalized"],
} as const;
/** Calculate biomonitoring isotope standard ratio from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    analyteSignal,
    standardSignal,
    analyteBlank,
    standardBlank,
    suppliedReference,
  } = request;
  const compute = (): Output => {
    H.domain(standardSignal !== standardBlank);
    H.positive(suppliedReference);
    return {
      correctedAnalyte: analyteSignal - analyteBlank,
      correctedStandard: standardSignal - standardBlank,
      ratio: (analyteSignal - analyteBlank) / (standardSignal - standardBlank),
      normalized:
        ((analyteSignal - analyteBlank) * suppliedReference) /
        (standardSignal - standardBlank),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    analyteSignal: 120,
    standardSignal: 60,
    analyteBlank: 20,
    standardBlank: 10,
    suppliedReference: 2,
  },
  output: {
    correctedAnalyte: 100,
    correctedStandard: 50,
    ratio: 2,
    normalized: 4,
  },
} satisfies ToolExample<Input, Output>;
export const biomonitoringIsotopeStandardRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biomonitoring/biomonitoring-isotope-standard-ratio",
    title: "Biomonitoring Isotope Standard Ratio Tool",
    description:
      "Calculate biomonitoring isotope standard ratio from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        analyteSignal: { type: "number" },
        standardSignal: { type: "number" },
        analyteBlank: { type: "number" },
        standardBlank: { type: "number" },
        suppliedReference: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "analyteSignal",
        "standardSignal",
        "analyteBlank",
        "standardBlank",
        "suppliedReference",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        correctedAnalyte: { type: "number" },
        correctedStandard: { type: "number" },
        ratio: { type: "number" },
        normalized: { type: "number" },
      },
      required: [
        "correctedAnalyte",
        "correctedStandard",
        "ratio",
        "normalized",
      ],
    },
    ports: {
      inputs: [
        {
          id: "analyteSignal",
          label: "Analyte Signal",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "standardSignal",
          label: "Standard Signal",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "analyteBlank",
          label: "Analyte Blank",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "standardBlank",
          label: "Standard Blank",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedReference",
          label: "Supplied Reference",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "correctedAnalyte",
          label: "Corrected Analyte",
          valueType: { type: "number" },
        },
        {
          id: "correctedStandard",
          label: "Corrected Standard",
          valueType: { type: "number" },
        },
        { id: "ratio", label: "Ratio", valueType: { type: "number" } },
        {
          id: "normalized",
          label: "Normalized",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = biomonitoringIsotopeStandardRatioTool.execute;
export default biomonitoringIsotopeStandardRatioTool;
