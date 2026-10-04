import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly occupiedArea: number;
  readonly trayArea: number;
};
export type Output = { readonly ratio: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    occupiedArea: { type: "number", minimum: 0 },
    trayArea: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["occupiedArea", "trayArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { ratio: { type: "number" } },
  required: ["ratio"],
} as const;
/** Calculate tray occupancy area ratio from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { occupiedArea, trayArea } = request;
  const compute = (): Output => {
    H.positive(trayArea);
    H.domain(occupiedArea >= 0 && occupiedArea <= trayArea);
    return { ratio: occupiedArea / trayArea };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { occupiedArea: 3, trayArea: 12 },
  output: { ratio: 0.25 },
} satisfies ToolExample<Input, Output>;
export const trayOccupancyAreaRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "vertical-farming/tray-occupancy-area-ratio",
    title: "Tray Occupancy Area Ratio Tool",
    description:
      "Calculate tray occupancy area ratio from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        occupiedArea: { type: "number", minimum: 0 },
        trayArea: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["occupiedArea", "trayArea"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { ratio: { type: "number" } },
      required: ["ratio"],
    },
    ports: {
      inputs: [
        {
          id: "occupiedArea",
          label: "Occupied Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "trayArea",
          label: "Tray Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "ratio", label: "Ratio", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = trayOccupancyAreaRatioTool.execute;
export default trayOccupancyAreaRatioTool;
