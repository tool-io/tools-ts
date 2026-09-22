import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly time: number;
  readonly origin: number;
  readonly width: number;
  readonly rightClosed: boolean;
};
export type Output = {
  readonly index: number;
  readonly lower: number;
  readonly upper: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    time: { type: "number" },
    origin: { type: "number" },
    width: { type: "number", exclusiveMinimum: 0 },
    rightClosed: { type: "boolean" },
  },
  required: ["time", "origin", "width", "rightClosed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    index: { type: "integer" },
    lower: { type: "number" },
    upper: { type: "number" },
  },
  required: ["index", "lower", "upper"],
} as const;
/** Uniform bins with an explicit left-closed or right-closed boundary convention on an unfolded time axis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { time, origin, width, rightClosed } = request;
  const compute = (): Output => {
    H.positive(width);
    return {
      index: rightClosed
        ? Math.ceil((time - origin) / width) - 1
        : Math.floor((time - origin) / width),
      lower:
        origin +
        (rightClosed
          ? Math.ceil((time - origin) / width) - 1
          : Math.floor((time - origin) / width)) *
          width,
      upper:
        origin +
        (rightClosed
          ? Math.ceil((time - origin) / width)
          : Math.floor((time - origin) / width) + 1) *
          width,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { time: 20, origin: 0, width: 10, rightClosed: false },
  output: { index: 2, lower: 20, upper: 30 },
} satisfies ToolExample<Input, Output>;
export const behavioralDiaryTimebinBoundaryChoiceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "behavioral-science/behavioral-diary-timebin-boundary-choice",
      title: "Behavioral Diary Timebin Boundary Choice Tool",
      description:
        "Uniform bins with an explicit left-closed or right-closed boundary convention on an unfolded time axis.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          time: { type: "number" },
          origin: { type: "number" },
          width: { type: "number", exclusiveMinimum: 0 },
          rightClosed: { type: "boolean" },
        },
        required: ["time", "origin", "width", "rightClosed"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          index: { type: "integer" },
          lower: { type: "number" },
          upper: { type: "number" },
        },
        required: ["index", "lower", "upper"],
      },
      ports: {
        inputs: [
          {
            id: "time",
            label: "Time",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "origin",
            label: "Origin",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "width",
            label: "Width",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "rightClosed",
            label: "Right Closed",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          { id: "index", label: "Index", valueType: { type: "integer" } },
          { id: "lower", label: "Lower", valueType: { type: "number" } },
          { id: "upper", label: "Upper", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = behavioralDiaryTimebinBoundaryChoiceTool.execute;
export default behavioralDiaryTimebinBoundaryChoiceTool;
