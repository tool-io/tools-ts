import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly passCount: number;
  readonly passLength: number;
  readonly speed: number;
  readonly turnSeconds: number;
};
export type Output = {
  readonly travelSeconds: number;
  readonly totalSeconds: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    passCount: { type: "integer", minimum: 0 },
    passLength: { type: "number", minimum: 0 },
    speed: { type: "number", exclusiveMinimum: 0 },
    turnSeconds: { type: "number", minimum: 0 },
  },
  required: ["passCount", "passLength", "speed", "turnSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    travelSeconds: { type: "number" },
    totalSeconds: { type: "number" },
  },
  required: ["travelSeconds", "totalSeconds"],
} as const;
/** Calculate field pass turnaround time term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { passCount, passLength, speed, turnSeconds } = request;
  const compute = (): Output => {
    H.integer(passCount, 0);
    H.domain(passLength >= 0 && turnSeconds >= 0);
    H.positive(speed);
    return {
      travelSeconds: (passCount * passLength) / speed,
      totalSeconds:
        (passCount * passLength) / speed +
        Math.max(0, passCount - 1) * turnSeconds,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { passCount: 5, passLength: 100, speed: 2, turnSeconds: 20 },
  output: { travelSeconds: 250, totalSeconds: 330 },
} satisfies ToolExample<Input, Output>;
export const fieldPassTurnaroundTimeTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agrotechnology/field-pass-turnaround-time-term",
    title: "Field Pass Turnaround Time Term Tool",
    description:
      "Calculate field pass turnaround time term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        passCount: { type: "integer", minimum: 0 },
        passLength: { type: "number", minimum: 0 },
        speed: { type: "number", exclusiveMinimum: 0 },
        turnSeconds: { type: "number", minimum: 0 },
      },
      required: ["passCount", "passLength", "speed", "turnSeconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        travelSeconds: { type: "number" },
        totalSeconds: { type: "number" },
      },
      required: ["travelSeconds", "totalSeconds"],
    },
    ports: {
      inputs: [
        {
          id: "passCount",
          label: "Pass Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "passLength",
          label: "Pass Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "speed",
          label: "Speed",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "turnSeconds",
          label: "Turn Seconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "travelSeconds",
          label: "Travel Seconds",
          valueType: { type: "number" },
        },
        {
          id: "totalSeconds",
          label: "Total Seconds",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = fieldPassTurnaroundTimeTermTool.execute;
export default fieldPassTurnaroundTimeTermTool;
