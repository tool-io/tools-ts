import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstDay: number;
  readonly secondDay: number;
  readonly firstAvailable: boolean;
  readonly secondAvailable: boolean;
};
export type Output = {
  readonly dateGap: number;
  readonly earlierAvailable: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstDay: { type: "integer" },
    secondDay: { type: "integer" },
    firstAvailable: { type: "boolean" },
    secondAvailable: { type: "boolean" },
  },
  required: ["firstDay", "secondDay", "firstAvailable", "secondAvailable"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dateGap: { type: "integer" },
    earlierAvailable: { type: "string", maxLength: 8192 },
  },
  required: ["dateGap", "earlierAvailable"],
} as const;
/** Compare supplied publication chronology and availability flags without a nomenclatural priority ruling. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstDay, secondDay, firstAvailable, secondAvailable } = request;
  const compute = (): Output => {
    return {
      dateGap: secondDay - firstDay,
      earlierAvailable:
        !firstAvailable && !secondAvailable
          ? "neither"
          : !firstAvailable
            ? "second"
            : !secondAvailable
              ? "first"
              : firstDay === secondDay
                ? "tie"
                : firstDay < secondDay
                  ? "first"
                  : "second",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstDay: 100,
    secondDay: 120,
    firstAvailable: true,
    secondAvailable: true,
  },
  output: { dateGap: 20, earlierAvailable: "first" },
} satisfies ToolExample<Input, Output>;
export const taxonomicSynonymSourcePriorityDateTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biosystematics/taxonomic-synonym-source-priority-date",
    title: "Taxonomic Synonym Source Priority Date Tool",
    description:
      "Compare supplied publication chronology and availability flags without a nomenclatural priority ruling.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstDay: { type: "integer" },
        secondDay: { type: "integer" },
        firstAvailable: { type: "boolean" },
        secondAvailable: { type: "boolean" },
      },
      required: ["firstDay", "secondDay", "firstAvailable", "secondAvailable"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dateGap: { type: "integer" },
        earlierAvailable: { type: "string", maxLength: 8192 },
      },
      required: ["dateGap", "earlierAvailable"],
    },
    ports: {
      inputs: [
        {
          id: "firstDay",
          label: "First Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "secondDay",
          label: "Second Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "firstAvailable",
          label: "First Available",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "secondAvailable",
          label: "Second Available",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "dateGap", label: "Date Gap", valueType: { type: "integer" } },
        {
          id: "earlierAvailable",
          label: "Earlier Available",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = taxonomicSynonymSourcePriorityDateTool.execute;
export default taxonomicSynonymSourcePriorityDateTool;
