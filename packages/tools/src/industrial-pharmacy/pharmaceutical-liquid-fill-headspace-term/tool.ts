import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly containerVolume: number;
  readonly fillMass: number;
  readonly density: number;
  readonly closureDisplacement: number;
};
export type Output = {
  readonly fillVolume: number;
  readonly headspace: number;
  readonly fillFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    containerVolume: { type: "number" },
    fillMass: { type: "number", minimum: 0 },
    density: { type: "number", exclusiveMinimum: 0 },
    closureDisplacement: { type: "number", minimum: 0 },
  },
  required: ["containerVolume", "fillMass", "density", "closureDisplacement"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fillVolume: { type: "number" },
    headspace: { type: "number" },
    fillFraction: { type: "number" },
  },
  required: ["fillVolume", "headspace", "fillFraction"],
} as const;
/** Calculate pharmaceutical liquid fill headspace term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { containerVolume, fillMass, density, closureDisplacement } = request;
  const compute = (): Output => {
    H.domain(
      containerVolume > closureDisplacement &&
        closureDisplacement >= 0 &&
        fillMass >= 0,
    );
    H.positive(density);
    return {
      fillVolume: fillMass / density,
      headspace: containerVolume - closureDisplacement - fillMass / density,
      fillFraction:
        fillMass / (density * (containerVolume - closureDisplacement)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    containerVolume: 100,
    fillMass: 80,
    density: 1,
    closureDisplacement: 5,
  },
  output: { fillVolume: 80, headspace: 15, fillFraction: 0.8421052631578947 },
} satisfies ToolExample<Input, Output>;
export const pharmaceuticalLiquidFillHeadspaceTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "industrial-pharmacy/pharmaceutical-liquid-fill-headspace-term",
      title: "Pharmaceutical Liquid Fill Headspace Term Tool",
      description:
        "Calculate pharmaceutical liquid fill headspace term from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          containerVolume: { type: "number" },
          fillMass: { type: "number", minimum: 0 },
          density: { type: "number", exclusiveMinimum: 0 },
          closureDisplacement: { type: "number", minimum: 0 },
        },
        required: [
          "containerVolume",
          "fillMass",
          "density",
          "closureDisplacement",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          fillVolume: { type: "number" },
          headspace: { type: "number" },
          fillFraction: { type: "number" },
        },
        required: ["fillVolume", "headspace", "fillFraction"],
      },
      ports: {
        inputs: [
          {
            id: "containerVolume",
            label: "Container Volume",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "fillMass",
            label: "Fill Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "density",
            label: "Density",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "closureDisplacement",
            label: "Closure Displacement",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "fillVolume",
            label: "Fill Volume",
            valueType: { type: "number" },
          },
          {
            id: "headspace",
            label: "Headspace",
            valueType: { type: "number" },
          },
          {
            id: "fillFraction",
            label: "Fill Fraction",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = pharmaceuticalLiquidFillHeadspaceTermTool.execute;
export default pharmaceuticalLiquidFillHeadspaceTermTool;
