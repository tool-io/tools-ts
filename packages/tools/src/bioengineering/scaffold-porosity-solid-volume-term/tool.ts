import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly bulkVolume: number;
  readonly solidVolume: number;
};
export type Output = {
  readonly voidVolume: number;
  readonly porosity: number;
  readonly solidFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bulkVolume: { type: "number", exclusiveMinimum: 0 },
    solidVolume: { type: "number", minimum: 0 },
  },
  required: ["bulkVolume", "solidVolume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    voidVolume: { type: "number" },
    porosity: { type: "number" },
    solidFraction: { type: "number" },
  },
  required: ["voidVolume", "porosity", "solidFraction"],
} as const;
/** Calculate scaffold porosity solid volume term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { bulkVolume, solidVolume } = request;
  const compute = (): Output => {
    H.positive(bulkVolume);
    H.domain(solidVolume >= 0 && solidVolume <= bulkVolume);
    return {
      voidVolume: bulkVolume - solidVolume,
      porosity: (bulkVolume - solidVolume) / bulkVolume,
      solidFraction: solidVolume / bulkVolume,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { bulkVolume: 100, solidVolume: 30 },
  output: { voidVolume: 70, porosity: 0.7, solidFraction: 0.3 },
} satisfies ToolExample<Input, Output>;
export const scaffoldPorositySolidVolumeTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bioengineering/scaffold-porosity-solid-volume-term",
    title: "Scaffold Porosity Solid Volume Term Tool",
    description:
      "Calculate scaffold porosity solid volume term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bulkVolume: { type: "number", exclusiveMinimum: 0 },
        solidVolume: { type: "number", minimum: 0 },
      },
      required: ["bulkVolume", "solidVolume"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        voidVolume: { type: "number" },
        porosity: { type: "number" },
        solidFraction: { type: "number" },
      },
      required: ["voidVolume", "porosity", "solidFraction"],
    },
    ports: {
      inputs: [
        {
          id: "bulkVolume",
          label: "Bulk Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "solidVolume",
          label: "Solid Volume",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "voidVolume",
          label: "Void Volume",
          valueType: { type: "number" },
        },
        { id: "porosity", label: "Porosity", valueType: { type: "number" } },
        {
          id: "solidFraction",
          label: "Solid Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = scaffoldPorositySolidVolumeTermTool.execute;
export default scaffoldPorositySolidVolumeTermTool;
