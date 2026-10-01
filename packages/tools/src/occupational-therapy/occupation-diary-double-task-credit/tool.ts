import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstDuration: number;
  readonly secondDuration: number;
  readonly simultaneous: number;
  readonly splitCredit: boolean;
};
export type Output = {
  readonly uniqueDuration: number;
  readonly firstCredited: number;
  readonly secondCredited: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstDuration: { type: "number", minimum: 0 },
    secondDuration: { type: "number", minimum: 0 },
    simultaneous: { type: "number", minimum: 0 },
    splitCredit: { type: "boolean" },
  },
  required: ["firstDuration", "secondDuration", "simultaneous", "splitCredit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    uniqueDuration: { type: "number" },
    firstCredited: { type: "number" },
    secondCredited: { type: "number" },
  },
  required: ["uniqueDuration", "firstCredited", "secondCredited"],
} as const;
/** Allocate supplied simultaneous diary time equally or to the first task under an explicit policy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstDuration, secondDuration, simultaneous, splitCredit } = request;
  const compute = (): Output => {
    H.domain(
      firstDuration >= 0 &&
        secondDuration >= 0 &&
        simultaneous >= 0 &&
        simultaneous <= Math.min(firstDuration, secondDuration),
    );
    return {
      uniqueDuration: firstDuration + secondDuration - simultaneous,
      firstCredited: firstDuration - (splitCredit ? simultaneous / 2 : 0),
      secondCredited:
        secondDuration - (splitCredit ? simultaneous / 2 : simultaneous),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstDuration: 40,
    secondDuration: 20,
    simultaneous: 10,
    splitCredit: true,
  },
  output: { uniqueDuration: 50, firstCredited: 35, secondCredited: 15 },
} satisfies ToolExample<Input, Output>;
export const occupationDiaryDoubleTaskCreditTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "occupational-therapy/occupation-diary-double-task-credit",
    title: "Occupation Diary Double Task Credit Tool",
    description:
      "Allocate supplied simultaneous diary time equally or to the first task under an explicit policy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstDuration: { type: "number", minimum: 0 },
        secondDuration: { type: "number", minimum: 0 },
        simultaneous: { type: "number", minimum: 0 },
        splitCredit: { type: "boolean" },
      },
      required: [
        "firstDuration",
        "secondDuration",
        "simultaneous",
        "splitCredit",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        uniqueDuration: { type: "number" },
        firstCredited: { type: "number" },
        secondCredited: { type: "number" },
      },
      required: ["uniqueDuration", "firstCredited", "secondCredited"],
    },
    ports: {
      inputs: [
        {
          id: "firstDuration",
          label: "First Duration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondDuration",
          label: "Second Duration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "simultaneous",
          label: "Simultaneous",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "splitCredit",
          label: "Split Credit",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "uniqueDuration",
          label: "Unique Duration",
          valueType: { type: "number" },
        },
        {
          id: "firstCredited",
          label: "First Credited",
          valueType: { type: "number" },
        },
        {
          id: "secondCredited",
          label: "Second Credited",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = occupationDiaryDoubleTaskCreditTool.execute;
export default occupationDiaryDoubleTaskCreditTool;
