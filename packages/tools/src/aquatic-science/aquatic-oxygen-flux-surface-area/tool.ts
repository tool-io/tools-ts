import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly arealFlux: number;
  readonly surfaceArea: number;
  readonly duration: number;
};
export type Output = { readonly rate: number; readonly oxygenTransfer: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    arealFlux: { type: "number" },
    surfaceArea: { type: "number", minimum: 0 },
    duration: { type: "number", minimum: 0 },
  },
  required: ["arealFlux", "surfaceArea", "duration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { rate: { type: "number" }, oxygenTransfer: { type: "number" } },
  required: ["rate", "oxygenTransfer"],
} as const;
/** Signed areal oxygen flux times area and duration in consistent units. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { arealFlux, surfaceArea, duration } = request;
  const compute = (): Output => {
    H.domain(surfaceArea >= 0 && duration >= 0);
    return {
      rate: arealFlux * surfaceArea,
      oxygenTransfer: arealFlux * surfaceArea * duration,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { arealFlux: 2, surfaceArea: 100, duration: 3 },
  output: { rate: 200, oxygenTransfer: 600 },
} satisfies ToolExample<Input, Output>;
export const aquaticOxygenFluxSurfaceAreaTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "aquatic-science/aquatic-oxygen-flux-surface-area",
    title: "Aquatic Oxygen Flux Surface Area Tool",
    description:
      "Signed areal oxygen flux times area and duration in consistent units.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        arealFlux: { type: "number" },
        surfaceArea: { type: "number", minimum: 0 },
        duration: { type: "number", minimum: 0 },
      },
      required: ["arealFlux", "surfaceArea", "duration"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rate: { type: "number" },
        oxygenTransfer: { type: "number" },
      },
      required: ["rate", "oxygenTransfer"],
    },
    ports: {
      inputs: [
        {
          id: "arealFlux",
          label: "Areal Flux",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "surfaceArea",
          label: "Surface Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "duration",
          label: "Duration",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "rate", label: "Rate", valueType: { type: "number" } },
        {
          id: "oxygenTransfer",
          label: "Oxygen Transfer",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = aquaticOxygenFluxSurfaceAreaTool.execute;
export default aquaticOxygenFluxSurfaceAreaTool;
