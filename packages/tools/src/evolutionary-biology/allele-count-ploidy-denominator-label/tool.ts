import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampledIndividuals: number;
  readonly ploidy: number;
  readonly callableAlleles: number;
  readonly alleleCount: number;
};
export type Output = {
  readonly possibleAlleles: number;
  readonly missingAlleles: number;
  readonly observedFrequency: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampledIndividuals: { type: "integer", minimum: 0 },
    ploidy: { type: "integer", minimum: 1 },
    callableAlleles: { type: "integer", minimum: 0 },
    alleleCount: { type: "integer", minimum: 0 },
  },
  required: ["sampledIndividuals", "ploidy", "callableAlleles", "alleleCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    possibleAlleles: { type: "integer" },
    missingAlleles: { type: "integer" },
    observedFrequency: { type: "number" },
    defined: { type: "boolean" },
  },
  required: [
    "possibleAlleles",
    "missingAlleles",
    "observedFrequency",
    "defined",
  ],
} as const;
/** Reconcile explicit allele counts and a supplied ploidy denominator without assuming diploidy or a population model. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampledIndividuals, ploidy, callableAlleles, alleleCount } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(sampledIndividuals) &&
        sampledIndividuals >= 0 &&
        sampledIndividuals <= Number.MAX_SAFE_INTEGER,
      "sampledIndividuals",
    ),
      sampledIndividuals);
    (H.domain(
      Number.isSafeInteger(ploidy) &&
        ploidy >= 1 &&
        ploidy <= Number.MAX_SAFE_INTEGER,
      "ploidy",
    ),
      ploidy);
    (H.domain(
      Number.isSafeInteger(callableAlleles) &&
        callableAlleles >= 0 &&
        callableAlleles <= sampledIndividuals * ploidy,
      "callableAlleles",
    ),
      callableAlleles);
    (H.domain(
      Number.isSafeInteger(alleleCount) &&
        alleleCount >= 0 &&
        alleleCount <= callableAlleles,
      "alleleCount",
    ),
      alleleCount);
    return (() => {
      const possibleAlleles = sampledIndividuals * ploidy;
      return {
        possibleAlleles,
        missingAlleles: possibleAlleles - callableAlleles,
        observedFrequency:
          callableAlleles > 0 ? alleleCount / callableAlleles : 0,
        defined: callableAlleles > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sampledIndividuals: 10,
    ploidy: 2,
    callableAlleles: 18,
    alleleCount: 6,
  },
  output: {
    possibleAlleles: 20,
    missingAlleles: 2,
    observedFrequency: 0.3333333333333333,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const alleleCountPloidyDenominatorLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["evolutionary-biology", "evolutionary biology", "biology"],
      keywords: ["evolutionary biology", "biology"],
    },
    id: "evolutionary-biology/allele-count-ploidy-denominator-label",
    title: "Allele Count Ploidy Denominator Label",
    description:
      "Reconcile explicit allele counts and a supplied ploidy denominator without assuming diploidy or a population model.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampledIndividuals: { type: "integer", minimum: 0 },
        ploidy: { type: "integer", minimum: 1 },
        callableAlleles: { type: "integer", minimum: 0 },
        alleleCount: { type: "integer", minimum: 0 },
      },
      required: [
        "sampledIndividuals",
        "ploidy",
        "callableAlleles",
        "alleleCount",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        possibleAlleles: { type: "integer" },
        missingAlleles: { type: "integer" },
        observedFrequency: { type: "number" },
        defined: { type: "boolean" },
      },
      required: [
        "possibleAlleles",
        "missingAlleles",
        "observedFrequency",
        "defined",
      ],
    },
    ports: {
      inputs: [
        {
          id: "sampledIndividuals",
          label: "Sampled Individuals",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "ploidy",
          label: "Ploidy",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "callableAlleles",
          label: "Callable Alleles",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "alleleCount",
          label: "Allele Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "possibleAlleles",
          label: "Possible Alleles",
          valueType: { type: "integer" },
        },
        {
          id: "missingAlleles",
          label: "Missing Alleles",
          valueType: { type: "integer" },
        },
        {
          id: "observedFrequency",
          label: "Observed Frequency",
          valueType: { type: "number" },
        },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = alleleCountPloidyDenominatorLabelTool.execute;
export default alleleCountPloidyDenominatorLabelTool;
