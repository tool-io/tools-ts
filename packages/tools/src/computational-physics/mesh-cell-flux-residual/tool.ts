import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly outwardFaceFluxes: readonly number[];
  readonly sourceRate: number;
  readonly cellVolume: number;
};
export type Output = {
  readonly netOutwardFlux: number;
  readonly sourceIntegrated: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    outwardFaceFluxes: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    sourceRate: { type: "number" },
    cellVolume: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["outwardFaceFluxes", "sourceRate", "cellVolume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    netOutwardFlux: { type: "number" },
    sourceIntegrated: { type: "number" },
    residual: { type: "number" },
  },
  required: ["netOutwardFlux", "sourceIntegrated", "residual"],
} as const;
/** Check a supplied signed finite-volume flux balance; face areas must already be included in fluxes. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { outwardFaceFluxes, sourceRate, cellVolume } = request;
  const compute = (): Output => {
    H.positive(cellVolume);
    return (() => {
      const netOutwardFlux = outwardFaceFluxes.reduce((a, b) => a + b, 0),
        sourceIntegrated = sourceRate * cellVolume;
      return {
        netOutwardFlux,
        sourceIntegrated,
        residual: netOutwardFlux - sourceIntegrated,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { outwardFaceFluxes: [2, -1, 3], sourceRate: 0.5, cellVolume: 6 },
  output: { netOutwardFlux: 4, sourceIntegrated: 3, residual: 1 },
} satisfies ToolExample<Input, Output>;
export const meshCellFluxResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "computational-physics/mesh-cell-flux-residual",
    title: "Mesh Cell Flux Residual Tool",
    description:
      "Check a supplied signed finite-volume flux balance; face areas must already be included in fluxes.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        outwardFaceFluxes: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        sourceRate: { type: "number" },
        cellVolume: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["outwardFaceFluxes", "sourceRate", "cellVolume"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        netOutwardFlux: { type: "number" },
        sourceIntegrated: { type: "number" },
        residual: { type: "number" },
      },
      required: ["netOutwardFlux", "sourceIntegrated", "residual"],
    },
    ports: {
      inputs: [
        {
          id: "outwardFaceFluxes",
          label: "Outward Face Fluxes",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "sourceRate",
          label: "Source Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cellVolume",
          label: "Cell Volume",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "netOutwardFlux",
          label: "Net Outward Flux",
          valueType: { type: "number" },
        },
        {
          id: "sourceIntegrated",
          label: "Source Integrated",
          valueType: { type: "number" },
        },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = meshCellFluxResidualTool.execute;
export default meshCellFluxResidualTool;
