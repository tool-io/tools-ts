import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly dwellTime: number;
  readonly observedTime: number;
};
export type Output = { readonly share: number; readonly defined: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dwellTime: { type: "number", minimum: 0 },
    observedTime: { type: "number", minimum: 0 },
  },
  required: ["dwellTime", "observedTime"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { share: { type: "number" }, defined: { type: "boolean" } },
  required: ["share", "defined"],
} as const;
/** Calculate observation dwell time share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { dwellTime, observedTime } = request;
  const compute = (): Output => {
    H.domain(observedTime >= 0 && dwellTime >= 0 && dwellTime <= observedTime);
    return {
      share: observedTime > 0 ? dwellTime / observedTime : 0,
      defined: observedTime > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { dwellTime: 3, observedTime: 12 },
  output: { share: 0.25, defined: true },
} satisfies ToolExample<Input, Output>;
export const observationDwellTimeShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "zoology/observation-dwell-time-share",
    title: "Observation Dwell Time Share Tool",
    description:
      "Calculate observation dwell time share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dwellTime: { type: "number", minimum: 0 },
        observedTime: { type: "number", minimum: 0 },
      },
      required: ["dwellTime", "observedTime"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { share: { type: "number" }, defined: { type: "boolean" } },
      required: ["share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "dwellTime",
          label: "Dwell Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "observedTime",
          label: "Observed Time",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = observationDwellTimeShareTool.execute;
export default observationDwellTimeShareTool;
