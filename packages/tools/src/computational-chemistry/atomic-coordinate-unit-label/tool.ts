import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly coordinate: readonly number[];
  readonly unit: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coordinate: { type: "array", maxItems: 256, items: { type: "number" } },
    unit: {
      type: "string",
      maxLength: 8192,
      enum: ["angstrom", "bohr", "nanometer"],
    },
  },
  required: ["coordinate", "unit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label one supplied 3D atomic coordinate with its declared unit without performing coordinate or unit conversion. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { coordinate, unit } = request;
  const compute = (): Output => {
    H.domain(coordinate.length === 3, "coordinate");
    H.domain(["angstrom", "bohr", "nanometer"].includes(unit), "unit");
    return { label: "(" + coordinate.join(", ") + ") " + unit };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { coordinate: [1, 2, -3], unit: "angstrom" },
  output: { label: "(1, 2, -3) angstrom" },
} satisfies ToolExample<Input, Output>;
export const atomicCoordinateUnitLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: [
        "computational-chemistry",
        "computational chemistry",
        "chemistry",
      ],
      keywords: ["computational chemistry", "chemistry"],
    },
    id: "computational-chemistry/atomic-coordinate-unit-label",
    title: "Atomic Coordinate Unit Label",
    description:
      "Label one supplied 3D atomic coordinate with its declared unit without performing coordinate or unit conversion.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        coordinate: { type: "array", maxItems: 256, items: { type: "number" } },
        unit: {
          type: "string",
          maxLength: 8192,
          enum: ["angstrom", "bohr", "nanometer"],
        },
      },
      required: ["coordinate", "unit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "coordinate",
          label: "Coordinate",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "unit",
          label: "Unit",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = atomicCoordinateUnitLabelTool.execute;
export default atomicCoordinateUnitLabelTool;
