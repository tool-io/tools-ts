import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly numbers: readonly string[] };
export type Output = {
  readonly uniqueNumbers: readonly string[];
  readonly repeatedPositions: readonly number[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    numbers: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["numbers"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    uniqueNumbers: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    repeatedPositions: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
  },
  required: ["uniqueNumbers", "repeatedPositions"],
} as const;
/** Identify repeated exact source numbering tokens without conflating editions or grading reports. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { numbers } = request;
  const compute = (): Output => {
    const seen = new Set<string>(),
      repeatedPositions: number[] = [];
    numbers.forEach((x, i) => {
      if (seen.has(x)) repeatedPositions.push(i);
      else seen.add(x);
    });
    return { uniqueNumbers: [...seen], repeatedPositions };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { numbers: ["12", "12a", "12", "13"] },
  output: { uniqueNumbers: ["12", "12a", "13"], repeatedPositions: [2] },
} satisfies ToolExample<Input, Output>;
export const hadithRepeatNumberMarkerTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "islamic-studies/hadith-repeat-number-marker",
    title: "Hadith Repeat Number Marker Tool",
    description:
      "Identify repeated exact source numbering tokens without conflating editions or grading reports.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        numbers: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["numbers"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        uniqueNumbers: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        repeatedPositions: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
      },
      required: ["uniqueNumbers", "repeatedPositions"],
    },
    ports: {
      inputs: [
        {
          id: "numbers",
          label: "Numbers",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "uniqueNumbers",
          label: "Unique Numbers",
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "repeatedPositions",
          label: "Repeated Positions",
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
    },
  },
  calculate,
});
export const run = hadithRepeatNumberMarkerTool.execute;
export default hadithRepeatNumberMarkerTool;
