import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly areaSquareCentimeters: number;
  readonly areaBasis: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    areaSquareCentimeters: { type: "number", minimum: 0 },
    areaBasis: {
      type: "string",
      maxLength: 8192,
      enum: ["geometric", "electrochemically-active", "BET", "other"],
    },
  },
  required: ["areaSquareCentimeters", "areaBasis"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicit electrode-area value and declared measurement basis without equating geometric, electrochemical and adsorption areas. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { areaSquareCentimeters, areaBasis } = request;
  const compute = (): Output => {
    H.domain(areaSquareCentimeters >= 0, "areaSquareCentimeters");
    H.domain(
      ["geometric", "electrochemically-active", "BET", "other"].includes(
        areaBasis,
      ),
      "areaBasis",
    );
    return { label: areaSquareCentimeters + " cm^2 [" + areaBasis + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { areaSquareCentimeters: 2, areaBasis: "geometric" },
  output: { label: "2 cm^2 [geometric]" },
} satisfies ToolExample<Input, Output>;
export const electrodeGeometricActiveAreaLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["electrochemistry", "chemistry"],
      keywords: ["electrochemistry", "chemistry"],
    },
    id: "electrochemistry/electrode-geometric-active-area-label",
    title: "Electrode Geometric Active Area Label",
    description:
      "Label an explicit electrode-area value and declared measurement basis without equating geometric, electrochemical and adsorption areas.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        areaSquareCentimeters: { type: "number", minimum: 0 },
        areaBasis: {
          type: "string",
          maxLength: 8192,
          enum: ["geometric", "electrochemically-active", "BET", "other"],
        },
      },
      required: ["areaSquareCentimeters", "areaBasis"],
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
          id: "areaSquareCentimeters",
          label: "Area Square Centimeters",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "areaBasis",
          label: "Area Basis",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = electrodeGeometricActiveAreaLabelTool.execute;
export default electrodeGeometricActiveAreaLabelTool;
