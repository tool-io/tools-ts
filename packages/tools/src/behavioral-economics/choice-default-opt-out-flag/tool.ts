import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly defaultSelected: boolean;
  readonly activelyChanged: boolean;
};
export type Output = {
  readonly defaultRetained: boolean;
  readonly optedOut: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    defaultSelected: { type: "boolean" },
    activelyChanged: { type: "boolean" },
  },
  required: ["defaultSelected", "activelyChanged"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    defaultRetained: { type: "boolean" },
    optedOut: { type: "boolean" },
  },
  required: ["defaultRetained", "optedOut"],
} as const;
/** Combine an explicit current default-selection flag and recorded change flag without inferring a participant’s intent. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { defaultSelected, activelyChanged } = request;
  const compute = (): Output => {
    return {
      defaultRetained: defaultSelected && !activelyChanged,
      optedOut: activelyChanged && !defaultSelected,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { defaultSelected: true, activelyChanged: false },
  output: { defaultRetained: true, optedOut: false },
} satisfies ToolExample<Input, Output>;
export const choiceDefaultOptoutFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["behavioral-economics", "behavioral economics", "economics"],
      keywords: ["behavioral economics", "economics"],
    },
    id: "behavioral-economics/choice-default-opt-out-flag",
    title: "Choice Default Opt Out Flag",
    description:
      "Combine an explicit current default-selection flag and recorded change flag without inferring a participant’s intent.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        defaultSelected: { type: "boolean" },
        activelyChanged: { type: "boolean" },
      },
      required: ["defaultSelected", "activelyChanged"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        defaultRetained: { type: "boolean" },
        optedOut: { type: "boolean" },
      },
      required: ["defaultRetained", "optedOut"],
    },
    ports: {
      inputs: [
        {
          id: "defaultSelected",
          label: "Default Selected",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "activelyChanged",
          label: "Actively Changed",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "defaultRetained",
          label: "Default Retained",
          valueType: { type: "boolean" },
        },
        { id: "optedOut", label: "Opted Out", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = choiceDefaultOptoutFlagTool.execute;
export default choiceDefaultOptoutFlagTool;
