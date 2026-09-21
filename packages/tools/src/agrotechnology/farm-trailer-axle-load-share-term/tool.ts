import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly load: number;
  readonly wheelbase: number;
  readonly centerFromFront: number;
  readonly frontTare: number;
  readonly rearTare: number;
};
export type Output = { readonly frontLoad: number; readonly rearLoad: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    load: { type: "number", minimum: 0 },
    wheelbase: { type: "number", exclusiveMinimum: 0 },
    centerFromFront: { type: "number", minimum: 0 },
    frontTare: { type: "number", minimum: 0 },
    rearTare: { type: "number", minimum: 0 },
  },
  required: ["load", "wheelbase", "centerFromFront", "frontTare", "rearTare"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { frontLoad: { type: "number" }, rearLoad: { type: "number" } },
  required: ["frontLoad", "rearLoad"],
} as const;
/** Static supplied two-support load balance without vehicle capacity approval. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { load, wheelbase, centerFromFront, frontTare, rearTare } = request;
  const compute = (): Output => {
    H.positive(wheelbase);
    H.domain(
      load >= 0 &&
        centerFromFront >= 0 &&
        centerFromFront <= wheelbase &&
        frontTare >= 0 &&
        rearTare >= 0,
    );
    return {
      frontLoad: (load * (wheelbase - centerFromFront)) / wheelbase + frontTare,
      rearLoad: (load * centerFromFront) / wheelbase + rearTare,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    load: 1000,
    wheelbase: 4,
    centerFromFront: 3,
    frontTare: 100,
    rearTare: 200,
  },
  output: { frontLoad: 350, rearLoad: 950 },
} satisfies ToolExample<Input, Output>;
export const farmTrailerAxleLoadShareTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agrotechnology/farm-trailer-axle-load-share-term",
    title: "Farm Trailer Axle Load Share Term Tool",
    description:
      "Static supplied two-support load balance without vehicle capacity approval.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        load: { type: "number", minimum: 0 },
        wheelbase: { type: "number", exclusiveMinimum: 0 },
        centerFromFront: { type: "number", minimum: 0 },
        frontTare: { type: "number", minimum: 0 },
        rearTare: { type: "number", minimum: 0 },
      },
      required: [
        "load",
        "wheelbase",
        "centerFromFront",
        "frontTare",
        "rearTare",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        frontLoad: { type: "number" },
        rearLoad: { type: "number" },
      },
      required: ["frontLoad", "rearLoad"],
    },
    ports: {
      inputs: [
        {
          id: "load",
          label: "Load",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "wheelbase",
          label: "Wheelbase",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "centerFromFront",
          label: "Center From Front",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "frontTare",
          label: "Front Tare",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rearTare",
          label: "Rear Tare",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "frontLoad", label: "Front Load", valueType: { type: "number" } },
        { id: "rearLoad", label: "Rear Load", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = farmTrailerAxleLoadShareTermTool.execute;
export default farmTrailerAxleLoadShareTermTool;
