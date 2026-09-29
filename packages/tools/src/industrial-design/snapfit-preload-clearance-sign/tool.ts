import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly freeGap: number;
  readonly matingThickness: number;
  readonly thermalChange: number;
};
export type Output = {
  readonly interference: number;
  readonly preloadPresent: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    freeGap: { type: "number", minimum: 0 },
    matingThickness: { type: "number", minimum: 0 },
    thermalChange: { type: "number" },
  },
  required: ["freeGap", "matingThickness", "thermalChange"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    interference: { type: "number" },
    preloadPresent: { type: "boolean" },
  },
  required: ["interference", "preloadPresent"],
} as const;
/** Geometric interference sign only; force and allowable strain are not inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { freeGap, matingThickness, thermalChange } = request;
  const compute = (): Output => {
    H.domain(freeGap >= 0 && matingThickness >= 0);
    return {
      interference: matingThickness + thermalChange - freeGap,
      preloadPresent: matingThickness + thermalChange > freeGap,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { freeGap: 2, matingThickness: 2.2, thermalChange: 0 },
  output: { interference: 0.20000000000000018, preloadPresent: true },
} satisfies ToolExample<Input, Output>;
export const snapfitPreloadClearanceSignTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "industrial-design/snapfit-preload-clearance-sign",
    title: "Snapfit Preload Clearance Sign Tool",
    description:
      "Geometric interference sign only; force and allowable strain are not inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        freeGap: { type: "number", minimum: 0 },
        matingThickness: { type: "number", minimum: 0 },
        thermalChange: { type: "number" },
      },
      required: ["freeGap", "matingThickness", "thermalChange"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        interference: { type: "number" },
        preloadPresent: { type: "boolean" },
      },
      required: ["interference", "preloadPresent"],
    },
    ports: {
      inputs: [
        {
          id: "freeGap",
          label: "Free Gap",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "matingThickness",
          label: "Mating Thickness",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "thermalChange",
          label: "Thermal Change",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "interference",
          label: "Interference",
          valueType: { type: "number" },
        },
        {
          id: "preloadPresent",
          label: "Preload Present",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = snapfitPreloadClearanceSignTool.execute;
export default snapfitPreloadClearanceSignTool;
