import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly currentPicoamperes: number;
  readonly areaSquareMicrometers: number;
};
export type Output = { readonly picoamperesPerSquareMicrometer: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    currentPicoamperes: { type: "number" },
    areaSquareMicrometers: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["currentPicoamperes", "areaSquareMicrometers"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { picoamperesPerSquareMicrometer: { type: "number" } },
  required: ["picoamperesPerSquareMicrometer"],
} as const;
/** Normalize a signed measured membrane current by an explicitly positive membrane area without fitting conductance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { currentPicoamperes, areaSquareMicrometers } = request;
  const compute = (): Output => {
    (H.domain(areaSquareMicrometers > 0, "areaSquareMicrometers"),
      areaSquareMicrometers);
    return {
      picoamperesPerSquareMicrometer:
        currentPicoamperes / areaSquareMicrometers,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { currentPicoamperes: 50, areaSquareMicrometers: 10 },
  output: { picoamperesPerSquareMicrometer: 5 },
} satisfies ToolExample<Input, Output>;
export const membraneCurrentDensityAreaTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["biophysics", "physics"],
      keywords: ["biophysics", "physics"],
    },
    id: "biophysics/membrane-current-density-area",
    title: "Membrane Current Density Area",
    description:
      "Normalize a signed measured membrane current by an explicitly positive membrane area without fitting conductance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        currentPicoamperes: { type: "number" },
        areaSquareMicrometers: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["currentPicoamperes", "areaSquareMicrometers"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { picoamperesPerSquareMicrometer: { type: "number" } },
      required: ["picoamperesPerSquareMicrometer"],
    },
    ports: {
      inputs: [
        {
          id: "currentPicoamperes",
          label: "Current Picoamperes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "areaSquareMicrometers",
          label: "Area Square Micrometers",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "picoamperesPerSquareMicrometer",
          label: "Picoamperes Per Square Micrometer",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = membraneCurrentDensityAreaTool.execute;
export default membraneCurrentDensityAreaTool;
