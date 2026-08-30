import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type IppfAttributeInput = {
  readonly assessedPrinciples: ReadonlyArray<string>;
  readonly conformityResults: ReadonlyArray<number>;
  readonly requiredPrinciples: ReadonlyArray<string>;
};

export type IppfAttributeOutput = {
  readonly conformityRatePercent: number;
  readonly missingPrinciples: ReadonlyArray<string>;
  readonly unknownPrinciples: ReadonlyArray<string>;
};

export const evaluateIppfAttributeEvidence = (
  input: IppfAttributeInput,
): IppfAttributeOutput => {
  if (
    !Array.isArray(input.requiredPrinciples) ||
    !Array.isArray(input.assessedPrinciples) ||
    !Array.isArray(input.conformityResults)
  )
    simpleError(
      "",
      "Required principles, assessed principles, and results must be arrays.",
      "attribute_data_required",
    );
  if (input.requiredPrinciples.length === 0)
    simpleError(
      "requiredPrinciples",
      "At least one required principle is needed.",
      "required_principles_required",
    );
  if (input.assessedPrinciples.length !== input.conformityResults.length)
    simpleError(
      "conformityResults",
      "Each assessed principle must have one conformity result.",
      "attribute_data_length_mismatch",
    );
  const required = new Set(
    input.requiredPrinciples.map((value, index) => {
      if (typeof value !== "string" || value.trim() === "")
        simpleError(
          `requiredPrinciples.${index}`,
          "Principle labels must be nonempty strings.",
          "invalid_principle",
        );
      return value.trim().toLowerCase();
    }),
  );
  const assessed = new Set<string>();
  let conformant = 0;
  for (const [index, value] of input.assessedPrinciples.entries()) {
    if (typeof value !== "string" || value.trim() === "")
      simpleError(
        `assessedPrinciples.${index}`,
        "Principle labels must be nonempty strings.",
        "invalid_principle",
      );
    assessed.add(value.trim().toLowerCase());
    const result = input.conformityResults[index];
    if (result !== 0 && result !== 1)
      simpleError(
        `conformityResults.${index}`,
        "Conformity results must be 0 or 1.",
        "invalid_conformity_result",
      );
    conformant += result;
  }
  return {
    conformityRatePercent: (conformant / input.assessedPrinciples.length) * 100,
    missingPrinciples: [...required]
      .filter((principle) => !assessed.has(principle))
      .sort(),
    unknownPrinciples: [...assessed]
      .filter((principle) => !required.has(principle))
      .sort(),
  };
};

export const ippfAttributeExample = {
  input: {
    assessedPrinciples: ["Standard 1", "Standard 2", "Custom"],
    conformityResults: [1, 1, 0],
    requiredPrinciples: ["standard 1", "standard 2", "standard 3"],
  },
  output: {
    conformityRatePercent: 66.66666666666666,
    missingPrinciples: ["standard 3"],
    unknownPrinciples: ["custom"],
  },
} satisfies ToolExample<IppfAttributeInput, IppfAttributeOutput>;

export const ippfAttributeTool = createSimpleTool({
  calculate: (input) =>
    evaluateIppfAttributeEvidence({
      assessedPrinciples: input.assessedPrinciples as string[],
      conformityResults: input.conformityResults as number[],
      requiredPrinciples: input.requiredPrinciples as string[],
    }),
  description:
    "Compare assessed internal-audit principles with a caller-supplied required set, calculate conformity percent, and report missing or unknown labels.",
  id: "auditing/internal-audit-ippf-attribute-performance-framework-lookup",
  inputs: [
    {
      description: "Principle labels actually assessed.",
      id: "assessedPrinciples",
      kind: "stringList",
      label: "Assessed principles",
    },
    {
      description: "One 0 or 1 conformity result for each assessed principle.",
      id: "conformityResults",
      kind: "numberList",
      label: "Conformity results",
    },
    {
      description:
        "Principle labels required by the selected internal-audit framework.",
      id: "requiredPrinciples",
      kind: "stringList",
      label: "Required principles",
    },
  ],
  outputs: [
    {
      id: "conformityRatePercent",
      kind: "number",
      label: "Conformity rate",
      minimum: 0,
      maximum: 100,
      unit: "percent",
    },
    {
      id: "missingPrinciples",
      kind: "stringList",
      label: "Missing principles",
    },
    {
      id: "unknownPrinciples",
      kind: "stringList",
      label: "Unknown principles",
    },
  ],
  title: "Internal Audit IPPF Attribute Performance Framework Lookup",
});

export const runIppfAttribute = ippfAttributeTool.execute;
export default ippfAttributeTool;
