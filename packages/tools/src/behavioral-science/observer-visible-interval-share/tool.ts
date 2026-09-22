import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly visibleDuration: number;
  readonly observationDuration: number;
};
export type Output = { readonly share: number; readonly defined: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    visibleDuration: { type: "number", minimum: 0 },
    observationDuration: { type: "number", minimum: 0 },
  },
  required: ["visibleDuration", "observationDuration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { share: { type: "number" }, defined: { type: "boolean" } },
  required: ["share", "defined"],
} as const;
/** Calculate observer visible interval share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { visibleDuration, observationDuration } = request;
  const compute = (): Output => {
    H.domain(
      observationDuration >= 0 &&
        visibleDuration >= 0 &&
        visibleDuration <= observationDuration,
    );
    return {
      share:
        observationDuration > 0 ? visibleDuration / observationDuration : 0,
      defined: observationDuration > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { visibleDuration: 15, observationDuration: 20 },
  output: { share: 0.75, defined: true },
} satisfies ToolExample<Input, Output>;
export const observerVisibleIntervalShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "behavioral-science/observer-visible-interval-share",
    title: "Observer Visible Interval Share Tool",
    description:
      "Calculate observer visible interval share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        visibleDuration: { type: "number", minimum: 0 },
        observationDuration: { type: "number", minimum: 0 },
      },
      required: ["visibleDuration", "observationDuration"],
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
          id: "visibleDuration",
          label: "Visible Duration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "observationDuration",
          label: "Observation Duration",
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
export const run = observerVisibleIntervalShareTool.execute;
export default observerVisibleIntervalShareTool;
