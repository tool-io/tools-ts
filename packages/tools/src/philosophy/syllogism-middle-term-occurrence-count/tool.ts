import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstTerms: readonly string[];
  readonly secondTerms: readonly string[];
  readonly conclusionTerms: readonly string[];
};
export type Output = {
  readonly middleTerms: readonly string[];
  readonly counts: readonly number[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstTerms: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    secondTerms: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    conclusionTerms: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["firstTerms", "secondTerms", "conclusionTerms"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    middleTerms: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    counts: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["middleTerms", "counts"],
} as const;
/** Find shared premise terms absent from the conclusion, without inferring syllogistic validity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstTerms, secondTerms, conclusionTerms } = request;
  const compute = (): Output => {
    const conclusion = new Set(conclusionTerms),
      middleTerms = [...new Set([...firstTerms, ...secondTerms])].filter(
        (t) =>
          !conclusion.has(t) &&
          firstTerms.includes(t) &&
          secondTerms.includes(t),
      );
    return {
      middleTerms,
      counts: middleTerms.map(
        (t) => [...firstTerms, ...secondTerms].filter((x) => x === t).length,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstTerms: ["A", "M"],
    secondTerms: ["M", "B"],
    conclusionTerms: ["A", "B"],
  },
  output: { middleTerms: ["M"], counts: [2] },
} satisfies ToolExample<Input, Output>;
export const syllogismMiddleTermOccurrenceCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "philosophy/syllogism-middle-term-occurrence-count",
    title: "Syllogism Middle Term Occurrence Count Tool",
    description:
      "Find shared premise terms absent from the conclusion, without inferring syllogistic validity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstTerms: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        secondTerms: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        conclusionTerms: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["firstTerms", "secondTerms", "conclusionTerms"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        middleTerms: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        counts: { type: "array", maxItems: 256, items: { type: "integer" } },
      },
      required: ["middleTerms", "counts"],
    },
    ports: {
      inputs: [
        {
          id: "firstTerms",
          label: "First Terms",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "secondTerms",
          label: "Second Terms",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "conclusionTerms",
          label: "Conclusion Terms",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "middleTerms",
          label: "Middle Terms",
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "counts",
          label: "Counts",
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
    },
  },
  calculate,
});
export const run = syllogismMiddleTermOccurrenceCountTool.execute;
export default syllogismMiddleTermOccurrenceCountTool;
