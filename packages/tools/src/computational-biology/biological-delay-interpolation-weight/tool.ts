import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pastTime: number;
  readonly futureTime: number;
  readonly requestedTime: number;
  readonly pastValue: number;
  readonly futureValue: number;
};
export type Output = { readonly futureWeight: number; readonly value: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pastTime: { type: "number" },
    futureTime: { type: "number" },
    requestedTime: { type: "number" },
    pastValue: { type: "number" },
    futureValue: { type: "number" },
  },
  required: [
    "pastTime",
    "futureTime",
    "requestedTime",
    "pastValue",
    "futureValue",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { futureWeight: { type: "number" }, value: { type: "number" } },
  required: ["futureWeight", "value"],
} as const;
/** Linear interpolation between explicit history anchors for a delay-model query; no extrapolation or delay-equation solve. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pastTime, futureTime, requestedTime, pastValue, futureValue } =
    request;
  const compute = (): Output => {
    H.domain(
      futureTime > pastTime &&
        requestedTime >= pastTime &&
        requestedTime <= futureTime,
    );
    return {
      futureWeight: (requestedTime - pastTime) / (futureTime - pastTime),
      value:
        pastValue +
        ((futureValue - pastValue) * (requestedTime - pastTime)) /
          (futureTime - pastTime),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    pastTime: 0,
    futureTime: 2,
    requestedTime: 0.5,
    pastValue: 10,
    futureValue: 18,
  },
  output: { futureWeight: 0.25, value: 12 },
} satisfies ToolExample<Input, Output>;
export const biologicalDelayInterpolationWeightTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "computational-biology/biological-delay-interpolation-weight",
    title: "Biological Delay Interpolation Weight Tool",
    description:
      "Linear interpolation between explicit history anchors for a delay-model query; no extrapolation or delay-equation solve.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pastTime: { type: "number" },
        futureTime: { type: "number" },
        requestedTime: { type: "number" },
        pastValue: { type: "number" },
        futureValue: { type: "number" },
      },
      required: [
        "pastTime",
        "futureTime",
        "requestedTime",
        "pastValue",
        "futureValue",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        futureWeight: { type: "number" },
        value: { type: "number" },
      },
      required: ["futureWeight", "value"],
    },
    ports: {
      inputs: [
        {
          id: "pastTime",
          label: "Past Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "futureTime",
          label: "Future Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "requestedTime",
          label: "Requested Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "pastValue",
          label: "Past Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "futureValue",
          label: "Future Value",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "futureWeight",
          label: "Future Weight",
          valueType: { type: "number" },
        },
        { id: "value", label: "Value", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = biologicalDelayInterpolationWeightTool.execute;
export default biologicalDelayInterpolationWeightTool;
