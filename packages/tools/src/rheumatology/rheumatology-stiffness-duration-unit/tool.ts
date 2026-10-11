import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly duration: number; readonly inputUnit: string };
export type Output = { readonly minutes: number; readonly hours: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    duration: { type: "number", minimum: 0 },
    inputUnit: { type: "string", maxLength: 8192, enum: ["minutes", "hours"] },
  },
  required: ["duration", "inputUnit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { minutes: { type: "number" }, hours: { type: "number" } },
  required: ["minutes", "hours"],
} as const;
/** Convert an explicitly reported stiffness duration between minutes and hours without severity interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { duration, inputUnit } = request;
  const compute = (): Output => {
    H.domain(duration >= 0, "duration");
    H.domain(["minutes", "hours"].includes(inputUnit), "inputUnit");
    return {
      minutes: inputUnit === "hours" ? duration * 60 : duration,
      hours: inputUnit === "minutes" ? duration / 60 : duration,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { duration: 90, inputUnit: "minutes" },
  output: { minutes: 90, hours: 1.5 },
} satisfies ToolExample<Input, Output>;
export const rheumatologyStiffnessDurationUnitTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["rheumatology", "health and medicine"],
      keywords: ["rheumatology", "health and medicine"],
    },
    id: "rheumatology/rheumatology-stiffness-duration-unit",
    title: "Rheumatology Stiffness Duration Unit",
    description:
      "Convert an explicitly reported stiffness duration between minutes and hours without severity interpretation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        duration: { type: "number", minimum: 0 },
        inputUnit: {
          type: "string",
          maxLength: 8192,
          enum: ["minutes", "hours"],
        },
      },
      required: ["duration", "inputUnit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { minutes: { type: "number" }, hours: { type: "number" } },
      required: ["minutes", "hours"],
    },
    ports: {
      inputs: [
        {
          id: "duration",
          label: "Duration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "inputUnit",
          label: "Input Unit",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "minutes", label: "Minutes", valueType: { type: "number" } },
        { id: "hours", label: "Hours", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = rheumatologyStiffnessDurationUnitTool.execute;
export default rheumatologyStiffnessDurationUnitTool;
