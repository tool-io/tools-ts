import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lowerTemperature: number;
  readonly upperTemperature: number;
  readonly thicknessMetres: number;
  readonly referenceKelvinPerKilometre: number;
};
export type Output = {
  readonly lapseKelvinPerKilometre: number;
  readonly gap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lowerTemperature: { type: "number" },
    upperTemperature: { type: "number" },
    thicknessMetres: { type: "number", exclusiveMinimum: 0 },
    referenceKelvinPerKilometre: { type: "number" },
  },
  required: [
    "lowerTemperature",
    "upperTemperature",
    "thicknessMetres",
    "referenceKelvinPerKilometre",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lapseKelvinPerKilometre: { type: "number" },
    gap: { type: "number" },
  },
  required: ["lapseKelvinPerKilometre", "gap"],
} as const;
/** Compare an explicit mean layer lapse rate with a supplied reference; this does not implement a full tropopause definition. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    lowerTemperature,
    upperTemperature,
    thicknessMetres,
    referenceKelvinPerKilometre,
  } = request;
  const compute = (): Output => {
    H.positive(thicknessMetres);
    return {
      lapseKelvinPerKilometre:
        (1000 * (lowerTemperature - upperTemperature)) / thicknessMetres,
      gap:
        (1000 * (lowerTemperature - upperTemperature)) / thicknessMetres -
        referenceKelvinPerKilometre,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    lowerTemperature: 220,
    upperTemperature: 216,
    thicknessMetres: 2000,
    referenceKelvinPerKilometre: 2,
  },
  output: { lapseKelvinPerKilometre: 2, gap: 0 },
} satisfies ToolExample<Input, Output>;
export const tropopauseLayerLapseRateGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "atmospheric-science/tropopause-layer-lapse-rate-gap",
    title: "Tropopause Layer Lapse Rate Gap Tool",
    description:
      "Compare an explicit mean layer lapse rate with a supplied reference; this does not implement a full tropopause definition.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lowerTemperature: { type: "number" },
        upperTemperature: { type: "number" },
        thicknessMetres: { type: "number", exclusiveMinimum: 0 },
        referenceKelvinPerKilometre: { type: "number" },
      },
      required: [
        "lowerTemperature",
        "upperTemperature",
        "thicknessMetres",
        "referenceKelvinPerKilometre",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lapseKelvinPerKilometre: { type: "number" },
        gap: { type: "number" },
      },
      required: ["lapseKelvinPerKilometre", "gap"],
    },
    ports: {
      inputs: [
        {
          id: "lowerTemperature",
          label: "Lower Temperature",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "upperTemperature",
          label: "Upper Temperature",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "thicknessMetres",
          label: "Thickness Metres",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceKelvinPerKilometre",
          label: "Reference Kelvin Per Kilometre",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "lapseKelvinPerKilometre",
          label: "Lapse Kelvin Per Kilometre",
          valueType: { type: "number" },
        },
        { id: "gap", label: "Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = tropopauseLayerLapseRateGapTool.execute;
export default tropopauseLayerLapseRateGapTool;
