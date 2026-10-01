import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
import subtract from "../../arithmetic/subtract-two-numbers/tool.js";
export type Input = {
  readonly measuredAngle: number;
  readonly baselineAngle: number;
  readonly side: string;
  readonly axis: string;
  readonly protocol: string;
  readonly reverseAxis: boolean;
};
export type Output = {
  readonly relativeAngle: number;
  readonly protocolKey: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredAngle: { type: "number" },
    baselineAngle: { type: "number" },
    side: { type: "string", maxLength: 8192 },
    axis: { type: "string", maxLength: 8192 },
    protocol: { type: "string", maxLength: 8192 },
    reverseAxis: { type: "boolean" },
  },
  required: [
    "measuredAngle",
    "baselineAngle",
    "side",
    "axis",
    "protocol",
    "reverseAxis",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    relativeAngle: { type: "number" },
    protocolKey: { type: "string", maxLength: 8192 },
  },
  required: ["relativeAngle", "protocolKey"],
} as const;
/** Compare one supplied angle to an explicit orthopedic research baseline with side/axis metadata, reusing generic subtraction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measuredAngle, baselineAngle, side, axis, protocol, reverseAxis } =
    request;
  const compute = (): Output => {
    const r = subtract.execute({
      minuend: measuredAngle,
      subtrahend: baselineAngle,
    });
    H.domain(r.ok, "measuredAngle");
    H.domain(typeof r.output.difference === "number");
    return {
      relativeAngle: r.output.difference * (reverseAxis ? -1 : 1),
      protocolKey: JSON.stringify([protocol, side, axis]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    measuredAngle: 30,
    baselineAngle: 10,
    side: "left",
    axis: "axis-A",
    protocol: "research-P",
    reverseAxis: false,
  },
  output: { relativeAngle: 20, protocolKey: '["research-P","left","axis-A"]' },
} satisfies ToolExample<Input, Output>;
export const jointAngleReferenceOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "orthopedics/joint-angle-reference-offset",
    title: "Joint Angle Reference Offset Tool",
    description:
      "Compare one supplied angle to an explicit orthopedic research baseline with side/axis metadata, reusing generic subtraction.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredAngle: { type: "number" },
        baselineAngle: { type: "number" },
        side: { type: "string", maxLength: 8192 },
        axis: { type: "string", maxLength: 8192 },
        protocol: { type: "string", maxLength: 8192 },
        reverseAxis: { type: "boolean" },
      },
      required: [
        "measuredAngle",
        "baselineAngle",
        "side",
        "axis",
        "protocol",
        "reverseAxis",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        relativeAngle: { type: "number" },
        protocolKey: { type: "string", maxLength: 8192 },
      },
      required: ["relativeAngle", "protocolKey"],
    },
    ports: {
      inputs: [
        {
          id: "measuredAngle",
          label: "Measured Angle",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "baselineAngle",
          label: "Baseline Angle",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "side",
          label: "Side",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "axis",
          label: "Axis",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "protocol",
          label: "Protocol",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "reverseAxis",
          label: "Reverse Axis",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "relativeAngle",
          label: "Relative Angle",
          valueType: { type: "number" },
        },
        {
          id: "protocolKey",
          label: "Protocol Key",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = jointAngleReferenceOffsetTool.execute;
export default jointAngleReferenceOffsetTool;
