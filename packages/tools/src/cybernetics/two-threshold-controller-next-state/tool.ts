import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previousOn: boolean;
  readonly measuredValue: number;
  readonly lowerThreshold: number;
  readonly upperThreshold: number;
};
export type Output = { readonly nextOn: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previousOn: { type: "boolean" },
    measuredValue: { type: "number" },
    lowerThreshold: { type: "number" },
    upperThreshold: { type: "number" },
  },
  required: ["previousOn", "measuredValue", "lowerThreshold", "upperThreshold"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { nextOn: { type: "boolean" } },
  required: ["nextOn"],
} as const;
/** Evaluate one explicit heating-style hysteresis state: on at or below lower threshold, off at or above upper threshold, retain state between. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { previousOn, measuredValue, lowerThreshold, upperThreshold } = request;
  const compute = (): Output => {
    H.domain(upperThreshold > lowerThreshold, "upperThreshold");
    return {
      nextOn:
        measuredValue <= lowerThreshold
          ? true
          : measuredValue >= upperThreshold
            ? false
            : previousOn,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    previousOn: false,
    measuredValue: 2,
    lowerThreshold: 3,
    upperThreshold: 7,
  },
  output: { nextOn: true },
} satisfies ToolExample<Input, Output>;
export const twoThresholdControllerNextStateTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cybernetics/two-threshold-controller-next-state",
    title: "Two Threshold Controller Next State Tool",
    description:
      "Evaluate one explicit heating-style hysteresis state: on at or below lower threshold, off at or above upper threshold, retain state between.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        previousOn: { type: "boolean" },
        measuredValue: { type: "number" },
        lowerThreshold: { type: "number" },
        upperThreshold: { type: "number" },
      },
      required: [
        "previousOn",
        "measuredValue",
        "lowerThreshold",
        "upperThreshold",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { nextOn: { type: "boolean" } },
      required: ["nextOn"],
    },
    ports: {
      inputs: [
        {
          id: "previousOn",
          label: "Previous On",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "measuredValue",
          label: "Measured Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lowerThreshold",
          label: "Lower Threshold",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "upperThreshold",
          label: "Upper Threshold",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "nextOn", label: "Next On", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = twoThresholdControllerNextStateTool.execute;
export default twoThresholdControllerNextStateTool;
