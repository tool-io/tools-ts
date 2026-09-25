import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly unitTop: number;
  readonly unitBase: number;
  readonly logTop: number;
  readonly logBase: number;
};
export type Output = {
  readonly overlapThickness: number;
  readonly logShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unitTop: { type: "number" },
    unitBase: { type: "number" },
    logTop: { type: "number" },
    logBase: { type: "number" },
  },
  required: ["unitTop", "unitBase", "logTop", "logBase"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    overlapThickness: { type: "number" },
    logShare: { type: "number" },
  },
  required: ["overlapThickness", "logShare"],
} as const;
/** One logged lithology interval clipped to the supplied depth window, with depth increasing downward. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { unitTop, unitBase, logTop, logBase } = request;
  const compute = (): Output => {
    H.domain(unitBase >= unitTop && logBase > logTop);
    return {
      overlapThickness: Math.max(
        0,
        Math.min(unitBase, logBase) - Math.max(unitTop, logTop),
      ),
      logShare:
        Math.max(0, Math.min(unitBase, logBase) - Math.max(unitTop, logTop)) /
        (logBase - logTop),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { unitTop: 10, unitBase: 30, logTop: 0, logBase: 40 },
  output: { overlapThickness: 20, logShare: 0.5 },
} satisfies ToolExample<Input, Output>;
export const lithologyLogIntervalShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "earth-science/lithology-log-interval-share",
    title: "Lithology Log Interval Share Tool",
    description:
      "One logged lithology interval clipped to the supplied depth window, with depth increasing downward.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        unitTop: { type: "number" },
        unitBase: { type: "number" },
        logTop: { type: "number" },
        logBase: { type: "number" },
      },
      required: ["unitTop", "unitBase", "logTop", "logBase"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        overlapThickness: { type: "number" },
        logShare: { type: "number" },
      },
      required: ["overlapThickness", "logShare"],
    },
    ports: {
      inputs: [
        {
          id: "unitTop",
          label: "Unit Top",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "unitBase",
          label: "Unit Base",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "logTop",
          label: "Log Top",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "logBase",
          label: "Log Base",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "overlapThickness",
          label: "Overlap Thickness",
          valueType: { type: "number" },
        },
        { id: "logShare", label: "Log Share", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = lithologyLogIntervalShareTool.execute;
export default lithologyLogIntervalShareTool;
