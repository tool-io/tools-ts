import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lostAt: number;
  readonly reconnectAt: number;
  readonly exerciseEnd: number;
  readonly reconnected: boolean;
};
export type Output = {
  readonly gap: number;
  readonly rightCensored: boolean;
  readonly remainingExercise: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lostAt: { type: "number" },
    reconnectAt: { type: "number" },
    exerciseEnd: { type: "number" },
    reconnected: { type: "boolean" },
  },
  required: ["lostAt", "reconnectAt", "exerciseEnd", "reconnected"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gap: { type: "number" },
    rightCensored: { type: "boolean" },
    remainingExercise: { type: "number" },
  },
  required: ["gap", "rightCensored", "remainingExercise"],
} as const;
/** Calculate biosafety drill lostcontact reconnect gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lostAt, reconnectAt, exerciseEnd, reconnected } = request;
  const compute = (): Output => {
    H.domain(
      exerciseEnd >= lostAt &&
        (!reconnected || (reconnectAt >= lostAt && reconnectAt <= exerciseEnd)),
    );
    return {
      gap: (reconnected ? reconnectAt : exerciseEnd) - lostAt,
      rightCensored: !reconnected,
      remainingExercise: reconnected ? exerciseEnd - reconnectAt : 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { lostAt: 10, reconnectAt: 18, exerciseEnd: 30, reconnected: true },
  output: { gap: 8, rightCensored: false, remainingExercise: 12 },
} satisfies ToolExample<Input, Output>;
export const biosafetyDrillLostcontactReconnectGapTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "biosafety/biosafety-drill-lostcontact-reconnect-gap",
      title: "Biosafety Drill Lostcontact Reconnect Gap Tool",
      description:
        "Calculate biosafety drill lostcontact reconnect gap from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          lostAt: { type: "number" },
          reconnectAt: { type: "number" },
          exerciseEnd: { type: "number" },
          reconnected: { type: "boolean" },
        },
        required: ["lostAt", "reconnectAt", "exerciseEnd", "reconnected"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          gap: { type: "number" },
          rightCensored: { type: "boolean" },
          remainingExercise: { type: "number" },
        },
        required: ["gap", "rightCensored", "remainingExercise"],
      },
      ports: {
        inputs: [
          {
            id: "lostAt",
            label: "Lost At",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "reconnectAt",
            label: "Reconnect At",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "exerciseEnd",
            label: "Exercise End",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "reconnected",
            label: "Reconnected",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          { id: "gap", label: "Gap", valueType: { type: "number" } },
          {
            id: "rightCensored",
            label: "Right Censored",
            valueType: { type: "boolean" },
          },
          {
            id: "remainingExercise",
            label: "Remaining Exercise",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = biosafetyDrillLostcontactReconnectGapTool.execute;
export default biosafetyDrillLostcontactReconnectGapTool;
