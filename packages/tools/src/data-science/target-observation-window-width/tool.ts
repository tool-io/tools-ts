import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly start: number;
  readonly end: number;
  readonly excludedDuration: number;
};
export type Output = { readonly width: number; readonly eligibleWidth: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    start: { type: "number" },
    end: { type: "number" },
    excludedDuration: { type: "number", minimum: 0 },
  },
  required: ["start", "end", "excludedDuration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { width: { type: "number" }, eligibleWidth: { type: "number" } },
  required: ["width", "eligibleWidth"],
} as const;
/** Calculate target observation window width from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { start, end, excludedDuration } = request;
  const compute = (): Output => {
    H.domain(
      end >= start && excludedDuration >= 0 && excludedDuration <= end - start,
    );
    return {
      width: end - start,
      eligibleWidth: end - start - excludedDuration,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { start: 10, end: 30, excludedDuration: 5 },
  output: { width: 20, eligibleWidth: 15 },
} satisfies ToolExample<Input, Output>;
export const targetObservationWindowWidthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "data-science/target-observation-window-width",
    title: "Target Observation Window Width Tool",
    description:
      "Calculate target observation window width from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        start: { type: "number" },
        end: { type: "number" },
        excludedDuration: { type: "number", minimum: 0 },
      },
      required: ["start", "end", "excludedDuration"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        width: { type: "number" },
        eligibleWidth: { type: "number" },
      },
      required: ["width", "eligibleWidth"],
    },
    ports: {
      inputs: [
        {
          id: "start",
          label: "Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "end",
          label: "End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "excludedDuration",
          label: "Excluded Duration",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "width", label: "Width", valueType: { type: "number" } },
        {
          id: "eligibleWidth",
          label: "Eligible Width",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = targetObservationWindowWidthTool.execute;
export default targetObservationWindowWidthTool;
