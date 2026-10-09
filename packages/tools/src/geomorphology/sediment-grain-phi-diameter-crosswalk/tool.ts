import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly value: number; readonly direction: string };
export type Output = { readonly converted: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "number" },
    direction: {
      type: "string",
      maxLength: 8192,
      enum: ["millimeters-to-phi", "phi-to-millimeters"],
    },
  },
  required: ["value", "direction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { converted: { type: "number" } },
  required: ["converted"],
} as const;
/** Convert between millimeter grain diameter and phi=-log2(diameter in millimeters) without assigning sediment classes. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { value, direction } = request;
  const compute = (): Output => {
    H.domain(
      ["millimeters-to-phi", "phi-to-millimeters"].includes(direction),
      "direction",
    );
    H.domain(direction !== "millimeters-to-phi" || value > 0, "value");
    const converted =
      direction === "millimeters-to-phi" ? -Math.log2(value) : 2 ** -value;
    H.domain(
      direction !== "phi-to-millimeters" || converted > 0,
      "value",
      "The diameter is below the representable positive numeric range.",
    );
    return { converted };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { value: 0.25, direction: "millimeters-to-phi" },
  output: { converted: 2 },
} satisfies ToolExample<Input, Output>;
export const sedimentGrainPhiDiameterCrosswalkTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["geomorphology", "earth and environmental sciences"],
      keywords: ["geomorphology", "earth and environmental sciences"],
    },
    id: "geomorphology/sediment-grain-phi-diameter-crosswalk",
    title: "Sediment Grain Phi Diameter Crosswalk",
    description:
      "Convert between millimeter grain diameter and phi=-log2(diameter in millimeters) without assigning sediment classes.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        value: { type: "number" },
        direction: {
          type: "string",
          maxLength: 8192,
          enum: ["millimeters-to-phi", "phi-to-millimeters"],
        },
      },
      required: ["value", "direction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { converted: { type: "number" } },
      required: ["converted"],
    },
    ports: {
      inputs: [
        {
          id: "value",
          label: "Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "direction",
          label: "Direction",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "converted", label: "Converted", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = sedimentGrainPhiDiameterCrosswalkTool.execute;
export default sedimentGrainPhiDiameterCrosswalkTool;
