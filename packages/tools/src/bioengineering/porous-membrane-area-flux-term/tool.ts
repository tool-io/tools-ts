import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly flow: number;
  readonly totalArea: number;
  readonly openFraction: number;
};
export type Output = {
  readonly grossFlux: number;
  readonly poreFlux: number;
  readonly openArea: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    flow: { type: "number" },
    totalArea: { type: "number", exclusiveMinimum: 0 },
    openFraction: { type: "number", exclusiveMinimum: 0, maximum: 1 },
  },
  required: ["flow", "totalArea", "openFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossFlux: { type: "number" },
    poreFlux: { type: "number" },
    openArea: { type: "number" },
  },
  required: ["grossFlux", "poreFlux", "openArea"],
} as const;
/** Signed volumetric flow per gross area and per explicit open-pore area, excluding pore tortuosity and pressure losses. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { flow, totalArea, openFraction } = request;
  const compute = (): Output => {
    H.positive(totalArea);
    H.domain(openFraction > 0 && openFraction <= 1);
    return {
      grossFlux: flow / totalArea,
      poreFlux: flow / (totalArea * openFraction),
      openArea: totalArea * openFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { flow: 10, totalArea: 5, openFraction: 0.2 },
  output: { grossFlux: 2, poreFlux: 10, openArea: 1 },
} satisfies ToolExample<Input, Output>;
export const porousMembraneAreaFluxTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bioengineering/porous-membrane-area-flux-term",
    title: "Porous Membrane Area Flux Term Tool",
    description:
      "Signed volumetric flow per gross area and per explicit open-pore area, excluding pore tortuosity and pressure losses.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        flow: { type: "number" },
        totalArea: { type: "number", exclusiveMinimum: 0 },
        openFraction: { type: "number", exclusiveMinimum: 0, maximum: 1 },
      },
      required: ["flow", "totalArea", "openFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossFlux: { type: "number" },
        poreFlux: { type: "number" },
        openArea: { type: "number" },
      },
      required: ["grossFlux", "poreFlux", "openArea"],
    },
    ports: {
      inputs: [
        {
          id: "flow",
          label: "Flow",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalArea",
          label: "Total Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "openFraction",
          label: "Open Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "grossFlux", label: "Gross Flux", valueType: { type: "number" } },
        { id: "poreFlux", label: "Pore Flux", valueType: { type: "number" } },
        { id: "openArea", label: "Open Area", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = porousMembraneAreaFluxTermTool.execute;
export default porousMembraneAreaFluxTermTool;
