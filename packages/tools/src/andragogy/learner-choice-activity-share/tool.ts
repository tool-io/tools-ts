import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly chosenMinutes: number;
  readonly assignedMinutes: number;
  readonly excludedChosen: number;
};
export type Output = {
  readonly countedMinutes: number;
  readonly choiceShare: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    chosenMinutes: { type: "number", minimum: 0 },
    assignedMinutes: { type: "number", minimum: 0 },
    excludedChosen: { type: "number", minimum: 0 },
  },
  required: ["chosenMinutes", "assignedMinutes", "excludedChosen"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    countedMinutes: { type: "number" },
    choiceShare: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["countedMinutes", "choiceShare", "defined"],
} as const;
/** Audit supplied self-chosen versus assigned activity time without inferring motivation or learning effectiveness. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { chosenMinutes, assignedMinutes, excludedChosen } = request;
  const compute = (): Output => {
    H.domain(
      chosenMinutes >= 0 &&
        assignedMinutes >= 0 &&
        excludedChosen >= 0 &&
        excludedChosen <= chosenMinutes,
    );
    return {
      countedMinutes: chosenMinutes + assignedMinutes - excludedChosen,
      choiceShare:
        chosenMinutes + assignedMinutes - excludedChosen > 0
          ? (chosenMinutes - excludedChosen) /
            (chosenMinutes + assignedMinutes - excludedChosen)
          : 0,
      defined: chosenMinutes + assignedMinutes - excludedChosen > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { chosenMinutes: 60, assignedMinutes: 40, excludedChosen: 20 },
  output: { countedMinutes: 80, choiceShare: 0.5, defined: true },
} satisfies ToolExample<Input, Output>;
export const learnerChoiceActivityShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "andragogy/learner-choice-activity-share",
    title: "Learner Choice Activity Share Tool",
    description:
      "Audit supplied self-chosen versus assigned activity time without inferring motivation or learning effectiveness.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        chosenMinutes: { type: "number", minimum: 0 },
        assignedMinutes: { type: "number", minimum: 0 },
        excludedChosen: { type: "number", minimum: 0 },
      },
      required: ["chosenMinutes", "assignedMinutes", "excludedChosen"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        countedMinutes: { type: "number" },
        choiceShare: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["countedMinutes", "choiceShare", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "chosenMinutes",
          label: "Chosen Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "assignedMinutes",
          label: "Assigned Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "excludedChosen",
          label: "Excluded Chosen",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "countedMinutes",
          label: "Counted Minutes",
          valueType: { type: "number" },
        },
        {
          id: "choiceShare",
          label: "Choice Share",
          valueType: { type: "number" },
        },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = learnerChoiceActivityShareTool.execute;
export default learnerChoiceActivityShareTool;
