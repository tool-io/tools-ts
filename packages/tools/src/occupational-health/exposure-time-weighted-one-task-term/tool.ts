import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly concentration: number;
  readonly taskHours: number;
  readonly shiftHours: number;
  readonly background: number;
};
export type Output = {
  readonly taskContribution: number;
  readonly backgroundContribution: number;
  readonly weightedMean: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    concentration: { type: "number", minimum: 0 },
    taskHours: { type: "number", minimum: 0 },
    shiftHours: { type: "number", exclusiveMinimum: 0 },
    background: { type: "number", minimum: 0 },
  },
  required: ["concentration", "taskHours", "shiftHours", "background"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    taskContribution: { type: "number" },
    backgroundContribution: { type: "number" },
    weightedMean: { type: "number" },
  },
  required: ["taskContribution", "backgroundContribution", "weightedMean"],
} as const;
/** Calculate exposure time weighted one task term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { concentration, taskHours, shiftHours, background } = request;
  const compute = (): Output => {
    H.positive(shiftHours);
    H.domain(
      taskHours >= 0 &&
        taskHours <= shiftHours &&
        concentration >= 0 &&
        background >= 0,
    );
    return {
      taskContribution: (concentration * taskHours) / shiftHours,
      backgroundContribution:
        (background * (shiftHours - taskHours)) / shiftHours,
      weightedMean:
        (concentration * taskHours + background * (shiftHours - taskHours)) /
        shiftHours,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { concentration: 10, taskHours: 2, shiftHours: 8, background: 2 },
  output: {
    taskContribution: 2.5,
    backgroundContribution: 1.5,
    weightedMean: 4,
  },
} satisfies ToolExample<Input, Output>;
export const exposureTimeWeightedOneTaskTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "occupational-health/exposure-time-weighted-one-task-term",
    title: "Exposure Time Weighted One Task Term Tool",
    description:
      "Calculate exposure time weighted one task term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        concentration: { type: "number", minimum: 0 },
        taskHours: { type: "number", minimum: 0 },
        shiftHours: { type: "number", exclusiveMinimum: 0 },
        background: { type: "number", minimum: 0 },
      },
      required: ["concentration", "taskHours", "shiftHours", "background"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        taskContribution: { type: "number" },
        backgroundContribution: { type: "number" },
        weightedMean: { type: "number" },
      },
      required: ["taskContribution", "backgroundContribution", "weightedMean"],
    },
    ports: {
      inputs: [
        {
          id: "concentration",
          label: "Concentration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "taskHours",
          label: "Task Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "shiftHours",
          label: "Shift Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "background",
          label: "Background",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "taskContribution",
          label: "Task Contribution",
          valueType: { type: "number" },
        },
        {
          id: "backgroundContribution",
          label: "Background Contribution",
          valueType: { type: "number" },
        },
        {
          id: "weightedMean",
          label: "Weighted Mean",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = exposureTimeWeightedOneTaskTermTool.execute;
export default exposureTimeWeightedOneTaskTermTool;
