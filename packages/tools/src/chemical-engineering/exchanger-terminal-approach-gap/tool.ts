import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly hotIn: number;
  readonly hotOut: number;
  readonly coldIn: number;
  readonly coldOut: number;
  readonly countercurrent: boolean;
};
export type Output = {
  readonly firstApproach: number;
  readonly secondApproach: number;
  readonly minimumApproach: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    hotIn: { type: "number" },
    hotOut: { type: "number" },
    coldIn: { type: "number" },
    coldOut: { type: "number" },
    countercurrent: { type: "boolean" },
  },
  required: ["hotIn", "hotOut", "coldIn", "coldOut", "countercurrent"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstApproach: { type: "number" },
    secondApproach: { type: "number" },
    minimumApproach: { type: "number" },
  },
  required: ["firstApproach", "secondApproach", "minimumApproach"],
} as const;
/** Compute signed terminal temperature approaches under an explicit flow arrangement without exchanger design. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { hotIn, hotOut, coldIn, coldOut, countercurrent } = request;
  const compute = (): Output => {
    return {
      firstApproach: hotIn - (countercurrent ? coldOut : coldIn),
      secondApproach: hotOut - (countercurrent ? coldIn : coldOut),
      minimumApproach: Math.min(
        hotIn - (countercurrent ? coldOut : coldIn),
        hotOut - (countercurrent ? coldIn : coldOut),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    hotIn: 100,
    hotOut: 60,
    coldIn: 20,
    coldOut: 50,
    countercurrent: true,
  },
  output: { firstApproach: 50, secondApproach: 40, minimumApproach: 40 },
} satisfies ToolExample<Input, Output>;
export const exchangerTerminalApproachGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "chemical-engineering/exchanger-terminal-approach-gap",
    title: "Exchanger Terminal Approach Gap Tool",
    description:
      "Compute signed terminal temperature approaches under an explicit flow arrangement without exchanger design.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        hotIn: { type: "number" },
        hotOut: { type: "number" },
        coldIn: { type: "number" },
        coldOut: { type: "number" },
        countercurrent: { type: "boolean" },
      },
      required: ["hotIn", "hotOut", "coldIn", "coldOut", "countercurrent"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstApproach: { type: "number" },
        secondApproach: { type: "number" },
        minimumApproach: { type: "number" },
      },
      required: ["firstApproach", "secondApproach", "minimumApproach"],
    },
    ports: {
      inputs: [
        {
          id: "hotIn",
          label: "Hot In",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "hotOut",
          label: "Hot Out",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "coldIn",
          label: "Cold In",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "coldOut",
          label: "Cold Out",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "countercurrent",
          label: "Countercurrent",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "firstApproach",
          label: "First Approach",
          valueType: { type: "number" },
        },
        {
          id: "secondApproach",
          label: "Second Approach",
          valueType: { type: "number" },
        },
        {
          id: "minimumApproach",
          label: "Minimum Approach",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = exchangerTerminalApproachGapTool.execute;
export default exchangerTerminalApproachGapTool;
