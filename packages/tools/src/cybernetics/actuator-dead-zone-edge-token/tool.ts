import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly input: number;
  readonly lower: number;
  readonly upper: number;
  readonly includeEdges: boolean;
};
export type Output = { readonly inDeadZone: boolean; readonly side: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    input: { type: "number" },
    lower: { type: "number" },
    upper: { type: "number" },
    includeEdges: { type: "boolean" },
  },
  required: ["input", "lower", "upper", "includeEdges"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inDeadZone: { type: "boolean" },
    side: { type: "string", maxLength: 8192 },
  },
  required: ["inDeadZone", "side"],
} as const;
/** Classify a supplied actuator dead-zone boundary without predicting physical actuation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { input, lower, upper, includeEdges } = request;
  const compute = (): Output => {
    H.domain(upper >= lower);
    const inDeadZone = includeEdges
      ? input >= lower && input <= upper
      : input > lower && input < upper;
    return {
      inDeadZone,
      side: inDeadZone ? "inside" : input <= lower ? "lower" : "upper",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { input: 1, lower: -1, upper: 1, includeEdges: true },
  output: { inDeadZone: true, side: "inside" },
} satisfies ToolExample<Input, Output>;
export const actuatorDeadZoneEdgeTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cybernetics/actuator-dead-zone-edge-token",
    title: "Actuator Dead Zone Edge Token Tool",
    description:
      "Classify a supplied actuator dead-zone boundary without predicting physical actuation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        input: { type: "number" },
        lower: { type: "number" },
        upper: { type: "number" },
        includeEdges: { type: "boolean" },
      },
      required: ["input", "lower", "upper", "includeEdges"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        inDeadZone: { type: "boolean" },
        side: { type: "string", maxLength: 8192 },
      },
      required: ["inDeadZone", "side"],
    },
    ports: {
      inputs: [
        {
          id: "input",
          label: "Input",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lower",
          label: "Lower",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "upper",
          label: "Upper",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "includeEdges",
          label: "Include Edges",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "inDeadZone",
          label: "In Dead Zone",
          valueType: { type: "boolean" },
        },
        { id: "side", label: "Side", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = actuatorDeadZoneEdgeTokenTool.execute;
export default actuatorDeadZoneEdgeTokenTool;
