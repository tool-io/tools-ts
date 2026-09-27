import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly markerAt: number;
  readonly firstOrigin: number;
  readonly secondOrigin: number;
};
export type Output = {
  readonly firstElapsed: number;
  readonly secondElapsed: number;
  readonly elapsedGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    markerAt: { type: "number" },
    firstOrigin: { type: "number" },
    secondOrigin: { type: "number" },
  },
  required: ["markerAt", "firstOrigin", "secondOrigin"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstElapsed: { type: "number" },
    secondElapsed: { type: "number" },
    elapsedGap: { type: "number" },
  },
  required: ["firstElapsed", "secondElapsed", "elapsedGap"],
} as const;
/** Calculate nonclinical transit origin gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { markerAt, firstOrigin, secondOrigin } = request;
  const compute = (): Output => {
    return {
      firstElapsed: markerAt - firstOrigin,
      secondElapsed: markerAt - secondOrigin,
      elapsedGap: firstOrigin - secondOrigin,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { markerAt: 20, firstOrigin: 5, secondOrigin: 8 },
  output: { firstElapsed: 15, secondElapsed: 12, elapsedGap: -3 },
} satisfies ToolExample<Input, Output>;
export const nonclinicalTransitOriginGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gastroenterology/nonclinical-transit-origin-gap",
    title: "Nonclinical Transit Origin Gap Tool",
    description:
      "Calculate nonclinical transit origin gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        markerAt: { type: "number" },
        firstOrigin: { type: "number" },
        secondOrigin: { type: "number" },
      },
      required: ["markerAt", "firstOrigin", "secondOrigin"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstElapsed: { type: "number" },
        secondElapsed: { type: "number" },
        elapsedGap: { type: "number" },
      },
      required: ["firstElapsed", "secondElapsed", "elapsedGap"],
    },
    ports: {
      inputs: [
        {
          id: "markerAt",
          label: "Marker At",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstOrigin",
          label: "First Origin",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondOrigin",
          label: "Second Origin",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "firstElapsed",
          label: "First Elapsed",
          valueType: { type: "number" },
        },
        {
          id: "secondElapsed",
          label: "Second Elapsed",
          valueType: { type: "number" },
        },
        {
          id: "elapsedGap",
          label: "Elapsed Gap",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = nonclinicalTransitOriginGapTool.execute;
export default nonclinicalTransitOriginGapTool;
