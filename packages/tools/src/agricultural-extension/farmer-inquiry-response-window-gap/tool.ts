import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly received: number;
  readonly responded: number;
  readonly deadline: number;
  readonly pausedDays: number;
};
export type Output = { readonly activeLag: number; readonly margin: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    received: { type: "integer" },
    responded: { type: "integer" },
    deadline: { type: "integer" },
    pausedDays: { type: "integer", minimum: 0 },
  },
  required: ["received", "responded", "deadline", "pausedDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { activeLag: { type: "integer" }, margin: { type: "integer" } },
  required: ["activeLag", "margin"],
} as const;
/** Calculate farmer inquiry response window gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { received, responded, deadline, pausedDays } = request;
  const compute = (): Output => {
    H.integer(pausedDays, 0);
    H.domain(responded >= received + pausedDays && deadline >= received);
    return {
      activeLag: responded - received - pausedDays,
      margin: deadline - responded + pausedDays,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { received: 100, responded: 108, deadline: 110, pausedDays: 2 },
  output: { activeLag: 6, margin: 4 },
} satisfies ToolExample<Input, Output>;
export const farmerInquiryResponseWindowGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agricultural-extension/farmer-inquiry-response-window-gap",
    title: "Farmer Inquiry Response Window Gap Tool",
    description:
      "Calculate farmer inquiry response window gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        received: { type: "integer" },
        responded: { type: "integer" },
        deadline: { type: "integer" },
        pausedDays: { type: "integer", minimum: 0 },
      },
      required: ["received", "responded", "deadline", "pausedDays"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        activeLag: { type: "integer" },
        margin: { type: "integer" },
      },
      required: ["activeLag", "margin"],
    },
    ports: {
      inputs: [
        {
          id: "received",
          label: "Received",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "responded",
          label: "Responded",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "deadline",
          label: "Deadline",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "pausedDays",
          label: "Paused Days",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "activeLag",
          label: "Active Lag",
          valueType: { type: "integer" },
        },
        { id: "margin", label: "Margin", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = farmerInquiryResponseWindowGapTool.execute;
export default farmerInquiryResponseWindowGapTool;
