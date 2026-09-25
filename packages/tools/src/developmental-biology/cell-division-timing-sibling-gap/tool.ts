import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstBirth: number;
  readonly firstDivision: number;
  readonly secondBirth: number;
  readonly secondDivision: number;
};
export type Output = {
  readonly firstCycle: number;
  readonly secondCycle: number;
  readonly cycleGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstBirth: { type: "number" },
    firstDivision: { type: "number" },
    secondBirth: { type: "number" },
    secondDivision: { type: "number" },
  },
  required: ["firstBirth", "firstDivision", "secondBirth", "secondDivision"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstCycle: { type: "number" },
    secondCycle: { type: "number" },
    cycleGap: { type: "number" },
  },
  required: ["firstCycle", "secondCycle", "cycleGap"],
} as const;
/** Calculate cell division timing sibling gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstBirth, firstDivision, secondBirth, secondDivision } = request;
  const compute = (): Output => {
    H.domain(firstDivision >= firstBirth && secondDivision >= secondBirth);
    return {
      firstCycle: firstDivision - firstBirth,
      secondCycle: secondDivision - secondBirth,
      cycleGap: secondDivision - secondBirth - firstDivision + firstBirth,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstBirth: 0,
    firstDivision: 10,
    secondBirth: 0,
    secondDivision: 12,
  },
  output: { firstCycle: 10, secondCycle: 12, cycleGap: 2 },
} satisfies ToolExample<Input, Output>;
export const cellDivisionTimingSiblingGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "developmental-biology/cell-division-timing-sibling-gap",
    title: "Cell Division Timing Sibling Gap Tool",
    description:
      "Calculate cell division timing sibling gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstBirth: { type: "number" },
        firstDivision: { type: "number" },
        secondBirth: { type: "number" },
        secondDivision: { type: "number" },
      },
      required: [
        "firstBirth",
        "firstDivision",
        "secondBirth",
        "secondDivision",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstCycle: { type: "number" },
        secondCycle: { type: "number" },
        cycleGap: { type: "number" },
      },
      required: ["firstCycle", "secondCycle", "cycleGap"],
    },
    ports: {
      inputs: [
        {
          id: "firstBirth",
          label: "First Birth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstDivision",
          label: "First Division",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondBirth",
          label: "Second Birth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondDivision",
          label: "Second Division",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "firstCycle",
          label: "First Cycle",
          valueType: { type: "number" },
        },
        {
          id: "secondCycle",
          label: "Second Cycle",
          valueType: { type: "number" },
        },
        { id: "cycleGap", label: "Cycle Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = cellDivisionTimingSiblingGapTool.execute;
export default cellDivisionTimingSiblingGapTool;
