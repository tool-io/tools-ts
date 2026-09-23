import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly moment: number;
  readonly angularSpeedRadiansPerSecond: number;
};
export type Output = { readonly power: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    moment: { type: "number" },
    angularSpeedRadiansPerSecond: { type: "number" },
  },
  required: ["moment", "angularSpeedRadiansPerSecond"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { power: { type: "number" } },
  required: ["power"],
} as const;
/** Signed rotational mechanical power; SI moment in N*m gives watts. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { moment, angularSpeedRadiansPerSecond } = request;
  const compute = (): Output => {
    return { power: moment * angularSpeedRadiansPerSecond };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { moment: 50, angularSpeedRadiansPerSecond: 2 },
  output: { power: 100 },
} satisfies ToolExample<Input, Output>;
export const jointPowerMomentAngularSpeedTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biomechanics/joint-power-moment-angular-speed-term",
    title: "Joint Power Moment Angular Speed Term Tool",
    description:
      "Signed rotational mechanical power; SI moment in N*m gives watts.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        moment: { type: "number" },
        angularSpeedRadiansPerSecond: { type: "number" },
      },
      required: ["moment", "angularSpeedRadiansPerSecond"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { power: { type: "number" } },
      required: ["power"],
    },
    ports: {
      inputs: [
        {
          id: "moment",
          label: "Moment",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "angularSpeedRadiansPerSecond",
          label: "Angular Speed Radians Per Second",
          required: true,
          valueType: { type: "number", unit: "rad/s" },
        },
      ],
      outputs: [{ id: "power", label: "Power", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = jointPowerMomentAngularSpeedTermTool.execute;
export default jointPowerMomentAngularSpeedTermTool;
