import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly delay: number;
  readonly inputUnit: string;
  readonly outputUnit: string;
};
export type Output = { readonly delay: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    delay: { type: "number", minimum: 0 },
    inputUnit: { type: "string", maxLength: 8192 },
    outputUnit: { type: "string", maxLength: 8192 },
  },
  required: ["delay", "inputUnit", "outputUnit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { delay: { type: "number" } },
  required: ["delay"],
} as const;
/** Convert an experimental reward delay using fixed 24-hour days and seven-day weeks rather than calendar-date intervals. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { delay, inputUnit, outputUnit } = request;
  const compute = (): Output => {
    H.domain(delay >= 0, "delay");
    const units = ["hours", "days", "weeks"],
      hours = [1, 24, 168];
    H.domain(units.includes(inputUnit), "inputUnit");
    H.domain(units.includes(outputUnit), "outputUnit");
    return {
      delay:
        (delay * hours[units.indexOf(inputUnit)]) /
        hours[units.indexOf(outputUnit)],
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { delay: 2, inputUnit: "weeks", outputUnit: "days" },
  output: { delay: 14 },
} satisfies ToolExample<Input, Output>;
export const rewardDelayUnitCrosswalkTool = H.defineSchemaCalculation<
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
    id: "behavioral-economics/reward-delay-unit-crosswalk",
    title: "Reward Delay Unit Crosswalk",
    description:
      "Convert an experimental reward delay using fixed 24-hour days and seven-day weeks rather than calendar-date intervals.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        delay: { type: "number", minimum: 0 },
        inputUnit: { type: "string", maxLength: 8192 },
        outputUnit: { type: "string", maxLength: 8192 },
      },
      required: ["delay", "inputUnit", "outputUnit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { delay: { type: "number" } },
      required: ["delay"],
    },
    ports: {
      inputs: [
        {
          id: "delay",
          label: "Delay",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "inputUnit",
          label: "Input Unit",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "outputUnit",
          label: "Output Unit",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "delay", label: "Delay", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = rewardDelayUnitCrosswalkTool.execute;
export default rewardDelayUnitCrosswalkTool;
