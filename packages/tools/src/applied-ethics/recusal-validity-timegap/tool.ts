import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recusalStart: number;
  readonly recusalEnd: number;
  readonly decisionTime: number;
};
export type Output = {
  readonly insideWindow: boolean;
  readonly nearestBoundaryGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recusalStart: { type: "number" },
    recusalEnd: { type: "number" },
    decisionTime: { type: "number" },
  },
  required: ["recusalStart", "recusalEnd", "decisionTime"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    insideWindow: { type: "boolean" },
    nearestBoundaryGap: { type: "number" },
  },
  required: ["insideWindow", "nearestBoundaryGap"],
} as const;
/** Calculate recusal validity timegap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recusalStart, recusalEnd, decisionTime } = request;
  const compute = (): Output => {
    H.domain(recusalEnd >= recusalStart);
    return {
      insideWindow: decisionTime >= recusalStart && decisionTime <= recusalEnd,
      nearestBoundaryGap: Math.min(
        Math.abs(decisionTime - recusalStart),
        Math.abs(decisionTime - recusalEnd),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recusalStart: 10, recusalEnd: 20, decisionTime: 15 },
  output: { insideWindow: true, nearestBoundaryGap: 5 },
} satisfies ToolExample<Input, Output>;
export const recusalValidityTimegapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "applied-ethics/recusal-validity-timegap",
    title: "Recusal Validity Timegap Tool",
    description:
      "Calculate recusal validity timegap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recusalStart: { type: "number" },
        recusalEnd: { type: "number" },
        decisionTime: { type: "number" },
      },
      required: ["recusalStart", "recusalEnd", "decisionTime"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        insideWindow: { type: "boolean" },
        nearestBoundaryGap: { type: "number" },
      },
      required: ["insideWindow", "nearestBoundaryGap"],
    },
    ports: {
      inputs: [
        {
          id: "recusalStart",
          label: "Recusal Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "recusalEnd",
          label: "Recusal End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "decisionTime",
          label: "Decision Time",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "insideWindow",
          label: "Inside Window",
          valueType: { type: "boolean" },
        },
        {
          id: "nearestBoundaryGap",
          label: "Nearest Boundary Gap",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = recusalValidityTimegapTool.execute;
export default recusalValidityTimegapTool;
