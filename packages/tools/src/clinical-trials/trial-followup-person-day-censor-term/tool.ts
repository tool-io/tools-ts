import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly entry: number;
  readonly eventDay: number;
  readonly censorDay: number;
  readonly studyEnd: number;
  readonly eventObserved: boolean;
};
export type Output = {
  readonly exit: number;
  readonly exposure: number;
  readonly eventCount: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    entry: { type: "integer" },
    eventDay: { type: "integer" },
    censorDay: { type: "integer" },
    studyEnd: { type: "integer" },
    eventObserved: { type: "boolean" },
  },
  required: ["entry", "eventDay", "censorDay", "studyEnd", "eventObserved"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    exit: { type: "integer" },
    exposure: { type: "integer" },
    eventCount: { type: "integer" },
  },
  required: ["exit", "exposure", "eventCount"],
} as const;
/** Calculate trial followup person day censor term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { entry, eventDay, censorDay, studyEnd, eventObserved } = request;
  const compute = (): Output => {
    H.domain(
      censorDay >= entry &&
        studyEnd >= entry &&
        (!eventObserved || eventDay >= entry),
    );
    return {
      exit: Math.min(studyEnd, censorDay, eventObserved ? eventDay : studyEnd),
      exposure:
        Math.min(studyEnd, censorDay, eventObserved ? eventDay : studyEnd) -
        entry,
      eventCount:
        eventObserved && eventDay <= censorDay && eventDay <= studyEnd ? 1 : 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    entry: 100,
    eventDay: 120,
    censorDay: 130,
    studyEnd: 140,
    eventObserved: true,
  },
  output: { exit: 120, exposure: 20, eventCount: 1 },
} satisfies ToolExample<Input, Output>;
export const trialFollowupPersonDayCensorTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "clinical-trials/trial-followup-person-day-censor-term",
    title: "Trial Followup Person Day Censor Term Tool",
    description:
      "Calculate trial followup person day censor term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        entry: { type: "integer" },
        eventDay: { type: "integer" },
        censorDay: { type: "integer" },
        studyEnd: { type: "integer" },
        eventObserved: { type: "boolean" },
      },
      required: ["entry", "eventDay", "censorDay", "studyEnd", "eventObserved"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        exit: { type: "integer" },
        exposure: { type: "integer" },
        eventCount: { type: "integer" },
      },
      required: ["exit", "exposure", "eventCount"],
    },
    ports: {
      inputs: [
        {
          id: "entry",
          label: "Entry",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "eventDay",
          label: "Event Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "censorDay",
          label: "Censor Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "studyEnd",
          label: "Study End",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "eventObserved",
          label: "Event Observed",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "exit", label: "Exit", valueType: { type: "integer" } },
        { id: "exposure", label: "Exposure", valueType: { type: "integer" } },
        {
          id: "eventCount",
          label: "Event Count",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = trialFollowupPersonDayCensorTermTool.execute;
export default trialFollowupPersonDayCensorTermTool;
