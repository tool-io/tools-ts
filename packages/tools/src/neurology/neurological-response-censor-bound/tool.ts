import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly elapsed: number;
  readonly responseObserved: boolean;
  readonly suppliedCensorTime: number;
};
export type Output = { readonly time: number; readonly rightCensored: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    elapsed: { type: "number" },
    responseObserved: { type: "boolean" },
    suppliedCensorTime: { type: "number" },
  },
  required: ["elapsed", "responseObserved", "suppliedCensorTime"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { time: { type: "number" }, rightCensored: { type: "boolean" } },
  required: ["time", "rightCensored"],
} as const;
/** Represent an observed research response time or right-censor time without converting censoring into an event. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { elapsed, responseObserved, suppliedCensorTime } = request;
  const compute = (): Output => {
    H.domain(
      elapsed >= 0 &&
        suppliedCensorTime >= 0 &&
        (!responseObserved || elapsed <= suppliedCensorTime),
    );
    return {
      time: responseObserved ? elapsed : suppliedCensorTime,
      rightCensored: !responseObserved,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { elapsed: 12, responseObserved: true, suppliedCensorTime: 20 },
  output: { time: 12, rightCensored: false },
} satisfies ToolExample<Input, Output>;
export const neurologicalResponseCensorBoundTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "neurology/neurological-response-censor-bound",
    title: "Neurological Response Censor Bound Tool",
    description:
      "Represent an observed research response time or right-censor time without converting censoring into an event.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        elapsed: { type: "number" },
        responseObserved: { type: "boolean" },
        suppliedCensorTime: { type: "number" },
      },
      required: ["elapsed", "responseObserved", "suppliedCensorTime"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        time: { type: "number" },
        rightCensored: { type: "boolean" },
      },
      required: ["time", "rightCensored"],
    },
    ports: {
      inputs: [
        {
          id: "elapsed",
          label: "Elapsed",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "responseObserved",
          label: "Response Observed",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "suppliedCensorTime",
          label: "Supplied Censor Time",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "time", label: "Time", valueType: { type: "number" } },
        {
          id: "rightCensored",
          label: "Right Censored",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = neurologicalResponseCensorBoundTool.execute;
export default neurologicalResponseCensorBoundTool;
