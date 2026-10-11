import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly behaviorCode: string;
  readonly recordKind: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    behaviorCode: { type: "string", maxLength: 8192, minLength: 1 },
    recordKind: {
      type: "string",
      maxLength: 8192,
      enum: ["state", "event", "unknown"],
    },
  },
  required: ["behaviorCode", "recordKind"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label a caller-classified ethogram code as state, event or unknown without classifying observed behavior. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { behaviorCode, recordKind } = request;
  const compute = (): Output => {
    H.domain(behaviorCode.length > 0, "behaviorCode");
    H.domain(["state", "event", "unknown"].includes(recordKind), "recordKind");
    return { label: behaviorCode + " [" + recordKind + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { behaviorCode: "B17", recordKind: "state" },
  output: { label: "B17 [state]" },
} satisfies ToolExample<Input, Output>;
export const ethogramStateEventClassLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "zoology/ethogram-state-event-class-label",
    title: "Ethogram State Event Class Label Tool",
    description:
      "Label a caller-classified ethogram code as state, event or unknown without classifying observed behavior.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        behaviorCode: { type: "string", maxLength: 8192, minLength: 1 },
        recordKind: {
          type: "string",
          maxLength: 8192,
          enum: ["state", "event", "unknown"],
        },
      },
      required: ["behaviorCode", "recordKind"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "behaviorCode",
          label: "Behavior Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "recordKind",
          label: "Record Kind",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = ethogramStateEventClassLabelTool.execute;
export default ethogramStateEventClassLabelTool;
