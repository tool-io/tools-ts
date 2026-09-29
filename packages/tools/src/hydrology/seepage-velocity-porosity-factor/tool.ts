import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly darcyFlux: number;
  readonly effectivePorosity: number;
};
export type Output = { readonly seepageVelocity: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    darcyFlux: { type: "number" },
    effectivePorosity: { type: "number", exclusiveMinimum: 0, maximum: 1 },
  },
  required: ["darcyFlux", "effectivePorosity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { seepageVelocity: { type: "number" } },
  required: ["seepageVelocity"],
} as const;
/** Calculate seepage velocity porosity factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { darcyFlux, effectivePorosity } = request;
  const compute = (): Output => {
    H.domain(effectivePorosity > 0 && effectivePorosity <= 1);
    return { seepageVelocity: darcyFlux / effectivePorosity };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { darcyFlux: 0.02, effectivePorosity: 0.25 },
  output: { seepageVelocity: 0.08 },
} satisfies ToolExample<Input, Output>;
export const seepageVelocityPorosityFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hydrology/seepage-velocity-porosity-factor",
    title: "Seepage Velocity Porosity Factor Tool",
    description:
      "Calculate seepage velocity porosity factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        darcyFlux: { type: "number" },
        effectivePorosity: { type: "number", exclusiveMinimum: 0, maximum: 1 },
      },
      required: ["darcyFlux", "effectivePorosity"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { seepageVelocity: { type: "number" } },
      required: ["seepageVelocity"],
    },
    ports: {
      inputs: [
        {
          id: "darcyFlux",
          label: "Darcy Flux",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "effectivePorosity",
          label: "Effective Porosity",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "seepageVelocity",
          label: "Seepage Velocity",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = seepageVelocityPorosityFactorTool.execute;
export default seepageVelocityPorosityFactorTool;
