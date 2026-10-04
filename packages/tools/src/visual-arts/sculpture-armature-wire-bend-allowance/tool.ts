import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly innerRadius: number;
  readonly wireDiameter: number;
  readonly bendRadians: number;
};
export type Output = {
  readonly neutralRadius: number;
  readonly bendLength: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    innerRadius: { type: "number", minimum: 0 },
    wireDiameter: { type: "number", minimum: 0 },
    bendRadians: { type: "number", minimum: 0 },
  },
  required: ["innerRadius", "wireDiameter", "bendRadians"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    neutralRadius: { type: "number" },
    bendLength: { type: "number" },
  },
  required: ["neutralRadius", "bendLength"],
} as const;
/** Neutral axis at the center of round wire, neglecting deformation shifts. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { innerRadius, wireDiameter, bendRadians } = request;
  const compute = (): Output => {
    H.domain(innerRadius >= 0 && wireDiameter >= 0 && bendRadians >= 0);
    return {
      neutralRadius: innerRadius + wireDiameter / 2,
      bendLength: (innerRadius + wireDiameter / 2) * bendRadians,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { innerRadius: 2, wireDiameter: 1, bendRadians: 3.141592653589793 },
  output: { neutralRadius: 2.5, bendLength: 7.853981633974483 },
} satisfies ToolExample<Input, Output>;
export const sculptureArmatureWireBendAllowanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "visual-arts/sculpture-armature-wire-bend-allowance",
    title: "Sculpture Armature Wire Bend Allowance Tool",
    description:
      "Neutral axis at the center of round wire, neglecting deformation shifts.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        innerRadius: { type: "number", minimum: 0 },
        wireDiameter: { type: "number", minimum: 0 },
        bendRadians: { type: "number", minimum: 0 },
      },
      required: ["innerRadius", "wireDiameter", "bendRadians"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        neutralRadius: { type: "number" },
        bendLength: { type: "number" },
      },
      required: ["neutralRadius", "bendLength"],
    },
    ports: {
      inputs: [
        {
          id: "innerRadius",
          label: "Inner Radius",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "wireDiameter",
          label: "Wire Diameter",
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
          id: "bendLength",
          label: "Bend Length",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = sculptureArmatureWireBendAllowanceTool.execute;
export default sculptureArmatureWireBendAllowanceTool;
