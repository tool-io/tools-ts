import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previous: number;
  readonly revised: number;
  readonly actual: number;
};
export type Output = {
  readonly revision: number;
  readonly oldError: number;
  readonly newError: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previous: { type: "number" },
    revised: { type: "number" },
    actual: { type: "number" },
  },
  required: ["previous", "revised", "actual"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    revision: { type: "number" },
    oldError: { type: "number" },
    newError: { type: "number" },
  },
  required: ["revision", "oldError", "newError"],
} as const;
/** Calculate forecast delta revision one horizon from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { previous, revised, actual } = input;
  const compute = (): Output => {
    return {
      revision: revised - previous,
      oldError: previous - actual,
      newError: revised - actual,
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { previous: 10, revised: 12, actual: 11 },
  output: { revision: 2, oldError: -1, newError: 1 },
} satisfies ToolExample<Input, Output>;
export const forecastDeltaRevisionOneHorizonTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "metrics/forecast-delta-revision-one-horizon",
    title: "Forecast Delta Revision One Horizon Tool",
    description:
      "Calculate forecast delta revision one horizon from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        previous: { type: "number" },
        revised: { type: "number" },
        actual: { type: "number" },
      },
      required: ["previous", "revised", "actual"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        revision: { type: "number" },
        oldError: { type: "number" },
        newError: { type: "number" },
      },
      required: ["revision", "oldError", "newError"],
    },
    ports: {
      inputs: [
        {
          id: "previous",
          label: "Previous",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "revised",
          label: "Revised",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "actual",
          label: "Actual",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "revision", label: "Revision", valueType: { type: "number" } },
        { id: "oldError", label: "Old Error", valueType: { type: "number" } },
        { id: "newError", label: "New Error", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = forecastDeltaRevisionOneHorizonTool.execute;
export default forecastDeltaRevisionOneHorizonTool;
