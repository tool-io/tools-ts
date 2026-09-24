import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observation: number;
  readonly earliest: number;
  readonly latest: number;
};
export type Output = {
  readonly center: number;
  readonly signedOffset: number;
  readonly halfWidth: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observation: { type: "number" },
    earliest: { type: "number" },
    latest: { type: "number" },
  },
  required: ["observation", "earliest", "latest"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    center: { type: "number" },
    signedOffset: { type: "number" },
    halfWidth: { type: "number" },
  },
  required: ["center", "signedOffset", "halfWidth"],
} as const;
/** Compare a supplied research observation with an explicit window center without assigning protocol eligibility. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observation, earliest, latest } = request;
  const compute = (): Output => {
    H.domain(earliest <= latest);
    return {
      center: earliest + (latest - earliest) / 2,
      signedOffset: observation - earliest - (latest - earliest) / 2,
      halfWidth: (latest - earliest) / 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observation: 15, earliest: 10, latest: 30 },
  output: { center: 20, signedOffset: -5, halfWidth: 10 },
} satisfies ToolExample<Input, Output>;
export const protocolWindowCenterOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "clinical-research/protocol-window-center-offset",
    title: "Protocol Window Center Offset Tool",
    description:
      "Compare a supplied research observation with an explicit window center without assigning protocol eligibility.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observation: { type: "number" },
        earliest: { type: "number" },
        latest: { type: "number" },
      },
      required: ["observation", "earliest", "latest"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        center: { type: "number" },
        signedOffset: { type: "number" },
        halfWidth: { type: "number" },
      },
      required: ["center", "signedOffset", "halfWidth"],
    },
    ports: {
      inputs: [
        {
          id: "observation",
          label: "Observation",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "earliest",
          label: "Earliest",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "latest",
          label: "Latest",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "center", label: "Center", valueType: { type: "number" } },
        {
          id: "signedOffset",
          label: "Signed Offset",
          valueType: { type: "number" },
        },
        { id: "halfWidth", label: "Half Width", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = protocolWindowCenterOffsetTool.execute;
export default protocolWindowCenterOffsetTool;
