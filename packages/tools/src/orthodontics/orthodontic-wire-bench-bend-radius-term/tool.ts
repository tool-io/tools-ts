import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly wireDiameter: number;
  readonly insideRadius: number;
  readonly bendRadians: number;
};
export type Output = {
  readonly neutralRadius: number;
  readonly neutralArcLength: number;
  readonly outerFiberStrain: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wireDiameter: { type: "number", exclusiveMinimum: 0 },
    insideRadius: { type: "number", minimum: 0 },
    bendRadians: { type: "number" },
  },
  required: ["wireDiameter", "insideRadius", "bendRadians"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    neutralRadius: { type: "number" },
    neutralArcLength: { type: "number" },
    outerFiberStrain: { type: "number" },
  },
  required: ["neutralRadius", "neutralArcLength", "outerFiberStrain"],
} as const;
/** Ideal circular neutral-axis bend geometry with a supplied inside radius. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { wireDiameter, insideRadius, bendRadians } = request;
  const compute = (): Output => {
    H.positive(wireDiameter);
    H.domain(insideRadius >= 0);
    return {
      neutralRadius: insideRadius + wireDiameter / 2,
      neutralArcLength:
        (insideRadius + wireDiameter / 2) * Math.abs(bendRadians),
      outerFiberStrain: wireDiameter / (2 * insideRadius + wireDiameter),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { wireDiameter: 2, insideRadius: 9, bendRadians: 1.5707963267948966 },
  output: {
    neutralRadius: 10,
    neutralArcLength: 15.707963267948966,
    outerFiberStrain: 0.1,
  },
} satisfies ToolExample<Input, Output>;
export const orthodonticWireBenchBendRadiusTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "orthodontics/orthodontic-wire-bench-bend-radius-term",
    title: "Orthodontic Wire Bench Bend Radius Term Tool",
    description:
      "Ideal circular neutral-axis bend geometry with a supplied inside radius.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        wireDiameter: { type: "number", exclusiveMinimum: 0 },
        insideRadius: { type: "number", minimum: 0 },
        bendRadians: { type: "number" },
      },
      required: ["wireDiameter", "insideRadius", "bendRadians"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        neutralRadius: { type: "number" },
        neutralArcLength: { type: "number" },
        outerFiberStrain: { type: "number" },
      },
      required: ["neutralRadius", "neutralArcLength", "outerFiberStrain"],
    },
    ports: {
      inputs: [
        {
          id: "wireDiameter",
          label: "Wire Diameter",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "insideRadius",
          label: "Inside Radius",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "bendRadians",
          label: "Bend Radians",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "neutralRadius",
          label: "Neutral Radius",
          valueType: { type: "number" },
        },
        {
          id: "neutralArcLength",
          label: "Neutral Arc Length",
          valueType: { type: "number" },
        },
        {
          id: "outerFiberStrain",
          label: "Outer Fiber Strain",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = orthodonticWireBenchBendRadiusTermTool.execute;
export default orthodonticWireBenchBendRadiusTermTool;
