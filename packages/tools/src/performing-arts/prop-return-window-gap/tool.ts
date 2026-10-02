import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly returnAt: number;
  readonly nextUseAt: number;
  readonly checkDuration: number;
  readonly storageTravelDuration: number;
};
export type Output = {
  readonly available: number;
  readonly required: number;
  readonly slack: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    returnAt: { type: "number" },
    nextUseAt: { type: "number" },
    checkDuration: { type: "number", minimum: 0 },
    storageTravelDuration: { type: "number", minimum: 0 },
  },
  required: ["returnAt", "nextUseAt", "checkDuration", "storageTravelDuration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    available: { type: "number" },
    required: { type: "number" },
    slack: { type: "number" },
  },
  required: ["available", "required", "slack"],
} as const;
/** Calculate prop return window gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { returnAt, nextUseAt, checkDuration, storageTravelDuration } = request;
  const compute = (): Output => {
    H.domain(checkDuration >= 0 && storageTravelDuration >= 0);
    return {
      available: nextUseAt - returnAt,
      required: checkDuration + storageTravelDuration,
      slack: nextUseAt - returnAt - checkDuration - storageTravelDuration,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    returnAt: 10,
    nextUseAt: 20,
    checkDuration: 2,
    storageTravelDuration: 3,
  },
  output: { available: 10, required: 5, slack: 5 },
} satisfies ToolExample<Input, Output>;
export const propReturnWindowGapTool = H.defineSchemaCalculation<Input, Output>(
  {
    ...{
      id: "performing-arts/prop-return-window-gap",
      title: "Prop Return Window Gap Tool",
      description:
        "Calculate prop return window gap from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          returnAt: { type: "number" },
          nextUseAt: { type: "number" },
          checkDuration: { type: "number", minimum: 0 },
          storageTravelDuration: { type: "number", minimum: 0 },
        },
        required: [
          "returnAt",
          "nextUseAt",
          "checkDuration",
          "storageTravelDuration",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          available: { type: "number" },
          required: { type: "number" },
          slack: { type: "number" },
        },
        required: ["available", "required", "slack"],
      },
      ports: {
        inputs: [
          {
            id: "returnAt",
            label: "Return At",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "nextUseAt",
            label: "Next Use At",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "checkDuration",
            label: "Check Duration",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "storageTravelDuration",
            label: "Storage Travel Duration",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "available",
            label: "Available",
            valueType: { type: "number" },
          },
          { id: "required", label: "Required", valueType: { type: "number" } },
          { id: "slack", label: "Slack", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  },
);
export const run = propReturnWindowGapTool.execute;
export default propReturnWindowGapTool;
