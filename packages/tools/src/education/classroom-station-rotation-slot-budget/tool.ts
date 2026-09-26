import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sessionMinutes: number;
  readonly transitions: number;
  readonly transitionMinutes: number;
  readonly stations: number;
};
export type Output = { readonly minutesPerStation: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sessionMinutes: { type: "number" },
    transitions: { type: "integer", minimum: 0 },
    transitionMinutes: { type: "number", minimum: 0 },
    stations: { type: "integer", minimum: 1 },
  },
  required: ["sessionMinutes", "transitions", "transitionMinutes", "stations"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { minutesPerStation: { type: "number" } },
  required: ["minutesPerStation"],
} as const;
/** Calculate classroom station rotation slot budget from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sessionMinutes, transitions, transitionMinutes, stations } = request;
  const compute = (): Output => {
    H.integer(transitions, 0);
    H.integer(stations, 1);
    H.domain(
      transitionMinutes >= 0 &&
        sessionMinutes >= transitions * transitionMinutes,
    );
    return {
      minutesPerStation:
        (sessionMinutes - transitions * transitionMinutes) / stations,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sessionMinutes: 60,
    transitions: 3,
    transitionMinutes: 2,
    stations: 4,
  },
  output: { minutesPerStation: 13.5 },
} satisfies ToolExample<Input, Output>;
export const classroomStationRotationSlotBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "education/classroom-station-rotation-slot-budget",
    title: "Classroom Station Rotation Slot Budget Tool",
    description:
      "Calculate classroom station rotation slot budget from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sessionMinutes: { type: "number" },
        transitions: { type: "integer", minimum: 0 },
        transitionMinutes: { type: "number", minimum: 0 },
        stations: { type: "integer", minimum: 1 },
      },
      required: [
        "sessionMinutes",
        "transitions",
        "transitionMinutes",
        "stations",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { minutesPerStation: { type: "number" } },
      required: ["minutesPerStation"],
    },
    ports: {
      inputs: [
        {
          id: "sessionMinutes",
          label: "Session Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "transitions",
          label: "Transitions",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "transitionMinutes",
          label: "Transition Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "stations",
          label: "Stations",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "minutesPerStation",
          label: "Minutes Per Station",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = classroomStationRotationSlotBudgetTool.execute;
export default classroomStationRotationSlotBudgetTool;
