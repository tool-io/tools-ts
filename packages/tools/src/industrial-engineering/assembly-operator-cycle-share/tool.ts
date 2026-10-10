import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly operatorBusySeconds: number;
  readonly cycleSeconds: number;
};
export type Output = {
  readonly busyFraction: number;
  readonly idleSeconds: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    operatorBusySeconds: { type: "number", minimum: 0 },
    cycleSeconds: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["operatorBusySeconds", "cycleSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    busyFraction: { type: "number" },
    idleSeconds: { type: "number" },
  },
  required: ["busyFraction", "idleSeconds"],
} as const;
/** Normalize explicit nonoverlapping operator busy time to one assembly cycle duration. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { operatorBusySeconds, cycleSeconds } = request;
  const compute = (): Output => {
    (H.domain(cycleSeconds > 0, "cycleSeconds"), cycleSeconds);
    H.domain(
      operatorBusySeconds >= 0 && operatorBusySeconds <= cycleSeconds,
      "operatorBusySeconds",
    );
    return {
      busyFraction: operatorBusySeconds / cycleSeconds,
      idleSeconds: cycleSeconds - operatorBusySeconds,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { operatorBusySeconds: 42, cycleSeconds: 60 },
  output: { busyFraction: 0.7, idleSeconds: 18 },
} satisfies ToolExample<Input, Output>;
export const assemblyOperatorCycleShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: [
        "industrial-engineering",
        "industrial engineering",
        "engineering",
      ],
      keywords: ["industrial engineering", "engineering"],
    },
    id: "industrial-engineering/assembly-operator-cycle-share",
    title: "Assembly Operator Cycle Share",
    description:
      "Normalize explicit nonoverlapping operator busy time to one assembly cycle duration.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        operatorBusySeconds: { type: "number", minimum: 0 },
        cycleSeconds: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["operatorBusySeconds", "cycleSeconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        busyFraction: { type: "number" },
        idleSeconds: { type: "number" },
      },
      required: ["busyFraction", "idleSeconds"],
    },
    ports: {
      inputs: [
        {
          id: "operatorBusySeconds",
          label: "Operator Busy Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cycleSeconds",
          label: "Cycle Seconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "busyFraction",
          label: "Busy Fraction",
          valueType: { type: "number" },
        },
        {
          id: "idleSeconds",
          label: "Idle Seconds",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = assemblyOperatorCycleShareTool.execute;
export default assemblyOperatorCycleShareTool;
