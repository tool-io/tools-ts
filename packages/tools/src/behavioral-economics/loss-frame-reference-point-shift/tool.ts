import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly outcome: number;
  readonly oldReference: number;
  readonly newReference: number;
};
export type Output = {
  readonly oldRelative: number;
  readonly newRelative: number;
  readonly framingShift: number;
  readonly crossesZero: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    outcome: { type: "number" },
    oldReference: { type: "number" },
    newReference: { type: "number" },
  },
  required: ["outcome", "oldReference", "newReference"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    oldRelative: { type: "number" },
    newRelative: { type: "number" },
    framingShift: { type: "number" },
    crossesZero: { type: "boolean" },
  },
  required: ["oldRelative", "newRelative", "framingShift", "crossesZero"],
} as const;
/** Calculate loss frame reference point shift from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { outcome, oldReference, newReference } = request;
  const compute = (): Output => {
    return {
      oldRelative: outcome - oldReference,
      newRelative: outcome - newReference,
      framingShift: oldReference - newReference,
      crossesZero: outcome - oldReference < 0 !== outcome - newReference < 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { outcome: 100, oldReference: 80, newReference: 120 },
  output: {
    oldRelative: 20,
    newRelative: -20,
    framingShift: -40,
    crossesZero: true,
  },
} satisfies ToolExample<Input, Output>;
export const lossFrameReferencePointShiftTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "behavioral-economics/loss-frame-reference-point-shift",
    title: "Loss Frame Reference Point Shift Tool",
    description:
      "Calculate loss frame reference point shift from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        outcome: { type: "number" },
        oldReference: { type: "number" },
        newReference: { type: "number" },
      },
      required: ["outcome", "oldReference", "newReference"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        oldRelative: { type: "number" },
        newRelative: { type: "number" },
        framingShift: { type: "number" },
        crossesZero: { type: "boolean" },
      },
      required: ["oldRelative", "newRelative", "framingShift", "crossesZero"],
    },
    ports: {
      inputs: [
        {
          id: "outcome",
          label: "Outcome",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "oldReference",
          label: "Old Reference",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "newReference",
          label: "New Reference",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "oldRelative",
          label: "Old Relative",
          valueType: { type: "number" },
        },
        {
          id: "newRelative",
          label: "New Relative",
          valueType: { type: "number" },
        },
        {
          id: "framingShift",
          label: "Framing Shift",
          valueType: { type: "number" },
        },
        {
          id: "crossesZero",
          label: "Crosses Zero",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = lossFrameReferencePointShiftTool.execute;
export default lossFrameReferencePointShiftTool;
