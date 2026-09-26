import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceQuanta: readonly number[];
  readonly selectedCases: readonly boolean[];
  readonly referenceQuantum: number;
};
export type Output = {
  readonly cases: number;
  readonly coarserCases: number;
  readonly maximumExcessQuantum: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceQuanta: { type: "array", maxItems: 256, items: { type: "number" } },
    selectedCases: { type: "array", maxItems: 256, items: { type: "boolean" } },
    referenceQuantum: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["sourceQuanta", "selectedCases", "referenceQuantum"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cases: { type: "integer" },
    coarserCases: { type: "integer" },
    maximumExcessQuantum: { type: "number" },
  },
  required: ["cases", "coarserCases", "maximumExcessQuantum"],
} as const;
/** Calculate case source precision gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourceQuanta, selectedCases, referenceQuantum } = request;
  const compute = (): Output => {
    H.sameLength(sourceQuanta, selectedCases);
    H.positive(referenceQuantum);
    H.domain(sourceQuanta.every((x) => x > 0));
    return (() => {
      const quanta = sourceQuanta.filter((x, i) => selectedCases[i]);
      return {
        cases: quanta.length,
        coarserCases: quanta.filter((x) => x > referenceQuantum).length,
        maximumExcessQuantum: Math.max(
          0,
          ...quanta.map((x) => x - referenceQuantum),
        ),
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sourceQuanta: [1, 3, 5],
    selectedCases: [true, true, false],
    referenceQuantum: 2,
  },
  output: { cases: 2, coarserCases: 1, maximumExcessQuantum: 1 },
} satisfies ToolExample<Input, Output>;
export const caseSourcePrecisionGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "epidemiology/case-source-precision-gap",
    title: "Case Source Precision Gap Tool",
    description:
      "Calculate case source precision gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceQuanta: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        selectedCases: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        referenceQuantum: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["sourceQuanta", "selectedCases", "referenceQuantum"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cases: { type: "integer" },
        coarserCases: { type: "integer" },
        maximumExcessQuantum: { type: "number" },
      },
      required: ["cases", "coarserCases", "maximumExcessQuantum"],
    },
    ports: {
      inputs: [
        {
          id: "sourceQuanta",
          label: "Source Quanta",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "selectedCases",
          label: "Selected Cases",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "referenceQuantum",
          label: "Reference Quantum",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "cases", label: "Cases", valueType: { type: "integer" } },
        {
          id: "coarserCases",
          label: "Coarser Cases",
          valueType: { type: "integer" },
        },
        {
          id: "maximumExcessQuantum",
          label: "Maximum Excess Quantum",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = caseSourcePrecisionGapTool.execute;
export default caseSourcePrecisionGapTool;
