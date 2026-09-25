import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly scheduled: number;
  readonly administered: number;
  readonly valid: number;
};
export type Output = {
  readonly administrationFraction: number;
  readonly validOfAdministered: number;
  readonly validOfScheduled: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scheduled: { type: "integer", minimum: 1 },
    administered: { type: "integer", minimum: 1 },
    valid: { type: "integer", minimum: 0 },
  },
  required: ["scheduled", "administered", "valid"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    administrationFraction: { type: "number" },
    validOfAdministered: { type: "number" },
    validOfScheduled: { type: "number" },
  },
  required: [
    "administrationFraction",
    "validOfAdministered",
    "validOfScheduled",
  ],
} as const;
/** Calculate child task valid trial proportion from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { scheduled, administered, valid } = request;
  const compute = (): Output => {
    H.integer(scheduled, 1);
    H.integer(administered, 1, scheduled);
    H.integer(valid, 0, administered);
    return {
      administrationFraction: administered / scheduled,
      validOfAdministered: valid / administered,
      validOfScheduled: valid / scheduled,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { scheduled: 30, administered: 24, valid: 18 },
  output: {
    administrationFraction: 0.8,
    validOfAdministered: 0.75,
    validOfScheduled: 0.6,
  },
} satisfies ToolExample<Input, Output>;
export const childTaskValidTrialProportionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "developmental-psychology/child-task-valid-trial-proportion",
    title: "Child Task Valid Trial Proportion Tool",
    description:
      "Calculate child task valid trial proportion from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        scheduled: { type: "integer", minimum: 1 },
        administered: { type: "integer", minimum: 1 },
        valid: { type: "integer", minimum: 0 },
      },
      required: ["scheduled", "administered", "valid"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        administrationFraction: { type: "number" },
        validOfAdministered: { type: "number" },
        validOfScheduled: { type: "number" },
      },
      required: [
        "administrationFraction",
        "validOfAdministered",
        "validOfScheduled",
      ],
    },
    ports: {
      inputs: [
        {
          id: "scheduled",
          label: "Scheduled",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "administered",
          label: "Administered",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "valid",
          label: "Valid",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "administrationFraction",
          label: "Administration Fraction",
          valueType: { type: "number" },
        },
        {
          id: "validOfAdministered",
          label: "Valid Of Administered",
          valueType: { type: "number" },
        },
        {
          id: "validOfScheduled",
          label: "Valid Of Scheduled",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = childTaskValidTrialProportionTool.execute;
export default childTaskValidTrialProportionTool;
