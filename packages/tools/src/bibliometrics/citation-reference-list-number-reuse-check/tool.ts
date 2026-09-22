import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly numbers: readonly number[];
  readonly identifiers: readonly string[];
};
export type Output = {
  readonly reusedNumbers: readonly number[];
  readonly inconsistentNumbers: readonly number[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    numbers: { type: "array", maxItems: 256, items: { type: "integer" } },
    identifiers: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["numbers", "identifiers"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reusedNumbers: { type: "array", maxItems: 256, items: { type: "integer" } },
    inconsistentNumbers: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
  },
  required: ["reusedNumbers", "inconsistentNumbers"],
} as const;
/** Calculate citation reference list number reuse check from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { numbers, identifiers } = request;
  const compute = (): Output => {
    H.sameLength(numbers, identifiers);
    H.domain(numbers.every((x) => x >= 1));
    const unique = [...new Set(numbers)],
      reusedNumbers = unique.filter(
        (x) => numbers.filter((n) => n === x).length > 1,
      ),
      inconsistentNumbers = reusedNumbers.filter(
        (x) => new Set(identifiers.filter((_, i) => numbers[i] === x)).size > 1,
      );
    return { reusedNumbers, inconsistentNumbers };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { numbers: [1, 2, 1], identifiers: ["A", "B", "C"] },
  output: { reusedNumbers: [1], inconsistentNumbers: [1] },
} satisfies ToolExample<Input, Output>;
export const citationReferenceListNumberReuseCheckTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "bibliometrics/citation-reference-list-number-reuse-check",
      title: "Citation Reference List Number Reuse Check Tool",
      description:
        "Calculate citation reference list number reuse check from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          numbers: { type: "array", maxItems: 256, items: { type: "integer" } },
          identifiers: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
        },
        required: ["numbers", "identifiers"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          reusedNumbers: {
            type: "array",
            maxItems: 256,
            items: { type: "integer" },
          },
          inconsistentNumbers: {
            type: "array",
            maxItems: 256,
            items: { type: "integer" },
          },
        },
        required: ["reusedNumbers", "inconsistentNumbers"],
      },
      ports: {
        inputs: [
          {
            id: "numbers",
            label: "Numbers",
            required: true,
            valueType: { type: "list", items: { type: "integer" } },
          },
          {
            id: "identifiers",
            label: "Identifiers",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
        ],
        outputs: [
          {
            id: "reusedNumbers",
            label: "Reused Numbers",
            valueType: { type: "list", items: { type: "integer" } },
          },
          {
            id: "inconsistentNumbers",
            label: "Inconsistent Numbers",
            valueType: { type: "list", items: { type: "integer" } },
          },
        ],
      },
    },
    calculate,
  });
export const run = citationReferenceListNumberReuseCheckTool.execute;
export default citationReferenceListNumberReuseCheckTool;
