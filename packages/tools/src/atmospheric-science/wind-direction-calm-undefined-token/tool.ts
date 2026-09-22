import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly speed: number;
  readonly calmThreshold: number;
  readonly suppliedDirection: number;
};
export type Output = {
  readonly directionDefined: boolean;
  readonly direction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    speed: { type: "number", minimum: 0 },
    calmThreshold: { type: "number", minimum: 0 },
    suppliedDirection: { type: "number" },
  },
  required: ["speed", "calmThreshold", "suppliedDirection"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    directionDefined: { type: "boolean" },
    direction: { type: "number" },
  },
  required: ["directionDefined", "direction"],
} as const;
/** Suppress an undefined calm direction using a supplied strict speed threshold; zero is a flagged placeholder. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { speed, calmThreshold, suppliedDirection } = request;
  const compute = (): Output => {
    H.domain(speed >= 0 && calmThreshold >= 0);
    const directionDefined = speed > calmThreshold,
      r = suppliedDirection % 360;
    return {
      directionDefined,
      direction: directionDefined ? (r < 0 ? r + 360 : r) : 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { speed: 0, calmThreshold: 0.2, suppliedDirection: 270 },
  output: { directionDefined: false, direction: 0 },
} satisfies ToolExample<Input, Output>;
export const windDirectionCalmUndefinedTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "atmospheric-science/wind-direction-calm-undefined-token",
    title: "Wind Direction Calm Undefined Token Tool",
    description:
      "Suppress an undefined calm direction using a supplied strict speed threshold; zero is a flagged placeholder.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        speed: { type: "number", minimum: 0 },
        calmThreshold: { type: "number", minimum: 0 },
        suppliedDirection: { type: "number" },
      },
      required: ["speed", "calmThreshold", "suppliedDirection"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        directionDefined: { type: "boolean" },
        direction: { type: "number" },
      },
      required: ["directionDefined", "direction"],
    },
    ports: {
      inputs: [
        {
          id: "speed",
          label: "Speed",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "calmThreshold",
          label: "Calm Threshold",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedDirection",
          label: "Supplied Direction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "directionDefined",
          label: "Direction Defined",
          valueType: { type: "boolean" },
        },
        { id: "direction", label: "Direction", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = windDirectionCalmUndefinedTokenTool.execute;
export default windDirectionCalmUndefinedTokenTool;
