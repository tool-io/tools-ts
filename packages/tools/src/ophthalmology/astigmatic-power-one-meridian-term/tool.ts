import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sphereDiopters: number;
  readonly cylinderDiopters: number;
  readonly axisRadians: number;
  readonly meridianRadians: number;
};
export type Output = { readonly meridianPower: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sphereDiopters: { type: "number" },
    cylinderDiopters: { type: "number" },
    axisRadians: { type: "number" },
    meridianRadians: { type: "number" },
  },
  required: [
    "sphereDiopters",
    "cylinderDiopters",
    "axisRadians",
    "meridianRadians",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { meridianPower: { type: "number" } },
  required: ["meridianPower"],
} as const;
/** Paraxial sphero-cylinder meridian power S+C*sin²(theta-axis) in radians, without a prescription recommendation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sphereDiopters, cylinderDiopters, axisRadians, meridianRadians } =
    request;
  const compute = (): Output => {
    return {
      meridianPower:
        sphereDiopters +
        cylinderDiopters * Math.sin(meridianRadians - axisRadians) ** 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sphereDiopters: -2,
    cylinderDiopters: -1,
    axisRadians: 0,
    meridianRadians: 1.5707963267948966,
  },
  output: { meridianPower: -3 },
} satisfies ToolExample<Input, Output>;
export const astigmaticPowerOneMeridianTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ophthalmology/astigmatic-power-one-meridian-term",
    title: "Astigmatic Power One Meridian Term Tool",
    description:
      "Paraxial sphero-cylinder meridian power S+C*sin²(theta-axis) in radians, without a prescription recommendation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sphereDiopters: { type: "number" },
        cylinderDiopters: { type: "number" },
        axisRadians: { type: "number" },
        meridianRadians: { type: "number" },
      },
      required: [
        "sphereDiopters",
        "cylinderDiopters",
        "axisRadians",
        "meridianRadians",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { meridianPower: { type: "number" } },
      required: ["meridianPower"],
    },
    ports: {
      inputs: [
        {
          id: "sphereDiopters",
          label: "Sphere Diopters",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cylinderDiopters",
          label: "Cylinder Diopters",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "axisRadians",
          label: "Axis Radians",
          required: true,
          valueType: { type: "number", unit: "rad" },
        },
        {
          id: "meridianRadians",
          label: "Meridian Radians",
          required: true,
          valueType: { type: "number", unit: "rad" },
        },
      ],
      outputs: [
        {
          id: "meridianPower",
          label: "Meridian Power",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = astigmaticPowerOneMeridianTermTool.execute;
export default astigmaticPowerOneMeridianTermTool;
