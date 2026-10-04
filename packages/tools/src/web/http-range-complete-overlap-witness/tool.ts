import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly start: number;
  readonly end: number;
  readonly otherStart: number;
  readonly otherEnd: number;
};
export type Output = {
  readonly contained: boolean;
  readonly witnessStart: number;
  readonly witnessEnd: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    start: { type: "integer", minimum: 0 },
    end: { type: "integer" },
    otherStart: { type: "integer", minimum: 0 },
    otherEnd: { type: "integer" },
  },
  required: ["start", "end", "otherStart", "otherEnd"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    contained: { type: "boolean" },
    witnessStart: { type: "integer" },
    witnessEnd: { type: "integer" },
  },
  required: ["contained", "witnessStart", "witnessEnd"],
} as const;
/** Witness complete containment of an inclusive byte range; zero witness endpoints are unused when containment is false. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { start, end, otherStart, otherEnd } = request;
  const compute = (): Output => {
    H.integer(start, 0);
    H.integer(end, start);
    H.integer(otherStart, 0);
    H.integer(otherEnd, otherStart);
    const contained = start >= otherStart && end <= otherEnd;
    return {
      contained,
      witnessStart: contained ? start : 0,
      witnessEnd: contained ? end : 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { start: 10, end: 20, otherStart: 0, otherEnd: 30 },
  output: { contained: true, witnessStart: 10, witnessEnd: 20 },
} satisfies ToolExample<Input, Output>;
export const httpRangeCompleteOverlapWitnessTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "web/http-range-complete-overlap-witness",
    title: "HTTP Range Complete Overlap Witness Tool",
    description:
      "Witness complete containment of an inclusive byte range; zero witness endpoints are unused when containment is false.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        start: { type: "integer", minimum: 0 },
        end: { type: "integer" },
        otherStart: { type: "integer", minimum: 0 },
        otherEnd: { type: "integer" },
      },
      required: ["start", "end", "otherStart", "otherEnd"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        contained: { type: "boolean" },
        witnessStart: { type: "integer" },
        witnessEnd: { type: "integer" },
      },
      required: ["contained", "witnessStart", "witnessEnd"],
    },
    ports: {
      inputs: [
        {
          id: "start",
          label: "Start",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "end",
          label: "End",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "otherStart",
          label: "Other Start",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "otherEnd",
          label: "Other End",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "contained", label: "Contained", valueType: { type: "boolean" } },
        {
          id: "witnessStart",
          label: "Witness Start",
          valueType: { type: "integer" },
        },
        {
          id: "witnessEnd",
          label: "Witness End",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = httpRangeCompleteOverlapWitnessTool.execute;
export default httpRangeCompleteOverlapWitnessTool;
