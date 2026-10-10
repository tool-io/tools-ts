import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly duration: number; readonly inputUnit: string };
export type Output = { readonly hours: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    duration: { type: "number", minimum: 0 },
    inputUnit: {
      type: "string",
      maxLength: 8192,
      enum: ["minutes", "hours", "days"],
    },
  },
  required: ["duration", "inputUnit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { hours: { type: "number" } },
  required: ["hours"],
} as const;
/** Convert an explicitly recorded net soak duration to hours using fixed elapsed-time units. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { duration, inputUnit } = request;
  const compute = (): Output => {
    H.domain(duration >= 0, "duration");
    H.domain(["minutes", "hours", "days"].includes(inputUnit), "inputUnit");
    return {
      hours:
        duration *
        (inputUnit === "minutes" ? 1 / 60 : inputUnit === "days" ? 24 : 1),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { duration: 90, inputUnit: "minutes" },
  output: { hours: 1.5 },
} satisfies ToolExample<Input, Output>;
export const fishNetSoakTimeUnitTool = H.defineSchemaCalculation<Input, Output>(
  {
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: ["ichthyology", "biology"],
        keywords: ["ichthyology", "biology"],
      },
      id: "ichthyology/fish-net-soak-time-unit",
      title: "Fish Net Soak Time Unit",
      description:
        "Convert an explicitly recorded net soak duration to hours using fixed elapsed-time units.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          duration: { type: "number", minimum: 0 },
          inputUnit: {
            type: "string",
            maxLength: 8192,
            enum: ["minutes", "hours", "days"],
          },
        },
        required: ["duration", "inputUnit"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { hours: { type: "number" } },
        required: ["hours"],
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
          { id: "hours", label: "Hours", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  },
);
export const run = fishNetSoakTimeUnitTool.execute;
export default fishNetSoakTimeUnitTool;
