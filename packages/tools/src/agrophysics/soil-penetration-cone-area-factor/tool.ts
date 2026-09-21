import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly force: number;
  readonly coneDiameter: number;
  readonly blankForce: number;
};
export type Output = { readonly resistance: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    force: { type: "number" },
    coneDiameter: { type: "number", exclusiveMinimum: 0 },
    blankForce: { type: "number" },
  },
  required: ["force", "coneDiameter", "blankForce"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { resistance: { type: "number" } },
  required: ["resistance"],
} as const;
/** Calculate soil penetration cone area factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { force, coneDiameter, blankForce } = request;
  const compute = (): Output => {
    H.positive(coneDiameter);
    return {
      resistance: (4 * (force - blankForce)) / (Math.PI * coneDiameter ** 2),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { force: 110, coneDiameter: 2, blankForce: 10 },
  output: { resistance: 31.830988618379067 },
} satisfies ToolExample<Input, Output>;
export const soilPenetrationConeAreaFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agrophysics/soil-penetration-cone-area-factor",
    title: "Soil Penetration Cone Area Factor Tool",
    description:
      "Calculate soil penetration cone area factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        force: { type: "number" },
        coneDiameter: { type: "number", exclusiveMinimum: 0 },
        blankForce: { type: "number" },
      },
      required: ["force", "coneDiameter", "blankForce"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { resistance: { type: "number" } },
      required: ["resistance"],
    },
    ports: {
      inputs: [
        {
          id: "force",
          label: "Force",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "coneDiameter",
          label: "Cone Diameter",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "blankForce",
          label: "Blank Force",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "resistance",
          label: "Resistance",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = soilPenetrationConeAreaFactorTool.execute;
export default soilPenetrationConeAreaFactorTool;
