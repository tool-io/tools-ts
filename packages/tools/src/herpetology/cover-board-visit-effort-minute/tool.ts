import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly visitedBoards: number;
  readonly minutesPerBoard: number;
  readonly travelMinutes: number;
};
export type Output = {
  readonly boardMinutes: number;
  readonly totalEffortMinutes: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    visitedBoards: { type: "integer", minimum: 0 },
    minutesPerBoard: { type: "number", minimum: 0 },
    travelMinutes: { type: "number", minimum: 0 },
  },
  required: ["visitedBoards", "minutesPerBoard", "travelMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    boardMinutes: { type: "number" },
    totalEffortMinutes: { type: "number" },
  },
  required: ["boardMinutes", "totalEffortMinutes"],
} as const;
/** Budget explicit uniform board-check effort and separate nonoverlapping travel time without estimating detectability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { visitedBoards, minutesPerBoard, travelMinutes } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(visitedBoards) &&
        visitedBoards >= 0 &&
        visitedBoards <= Number.MAX_SAFE_INTEGER,
      "visitedBoards",
    ),
      visitedBoards);
    H.domain(minutesPerBoard >= 0 && travelMinutes >= 0, "minutesPerBoard");
    return {
      boardMinutes: visitedBoards * minutesPerBoard,
      totalEffortMinutes: visitedBoards * minutesPerBoard + travelMinutes,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { visitedBoards: 12, minutesPerBoard: 3, travelMinutes: 20 },
  output: { boardMinutes: 36, totalEffortMinutes: 56 },
} satisfies ToolExample<Input, Output>;
export const coverBoardVisitEffortMinuteTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["herpetology", "biology"],
      keywords: ["herpetology", "biology"],
    },
    id: "herpetology/cover-board-visit-effort-minute",
    title: "Cover Board Visit Effort Minute",
    description:
      "Budget explicit uniform board-check effort and separate nonoverlapping travel time without estimating detectability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        visitedBoards: { type: "integer", minimum: 0 },
        minutesPerBoard: { type: "number", minimum: 0 },
        travelMinutes: { type: "number", minimum: 0 },
      },
      required: ["visitedBoards", "minutesPerBoard", "travelMinutes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        boardMinutes: { type: "number" },
        totalEffortMinutes: { type: "number" },
      },
      required: ["boardMinutes", "totalEffortMinutes"],
    },
    ports: {
      inputs: [
        {
          id: "visitedBoards",
          label: "Visited Boards",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "minutesPerBoard",
          label: "Minutes Per Board",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "travelMinutes",
          label: "Travel Minutes",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "boardMinutes",
          label: "Board Minutes",
          valueType: { type: "number" },
        },
        {
          id: "totalEffortMinutes",
          label: "Total Effort Minutes",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = coverBoardVisitEffortMinuteTool.execute;
export default coverBoardVisitEffortMinuteTool;
