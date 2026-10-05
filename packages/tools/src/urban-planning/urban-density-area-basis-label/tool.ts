import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly count: number;
  readonly areaHectares: number;
  readonly basis: string;
};
export type Output = {
  readonly densityPerHectare: number;
  readonly label: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    count: { type: "number", minimum: 0 },
    areaHectares: { type: "number", exclusiveMinimum: 0 },
    basis: {
      type: "string",
      maxLength: 8192,
      enum: ["gross", "net", "residential", "developable"],
    },
  },
  required: ["count", "areaHectares", "basis"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    densityPerHectare: { type: "number" },
    label: { type: "string", maxLength: 8192 },
  },
  required: ["densityPerHectare", "label"],
} as const;
/** Compute a density while retaining an explicit area-basis label; no gross/net boundary conversion is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { count, areaHectares, basis } = request;
  const compute = (): Output => {
    H.domain(count >= 0, "count");
    (H.domain(areaHectares > 0, "areaHectares"), areaHectares);
    H.domain(
      ["gross", "net", "residential", "developable"].includes(basis),
      "basis",
    );
    return {
      densityPerHectare: count / areaHectares,
      label: basis + " area basis",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { count: 200, areaHectares: 4, basis: "net" },
  output: { densityPerHectare: 50, label: "net area basis" },
} satisfies ToolExample<Input, Output>;
export const urbanDensityAreaBasisLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "urban-planning/urban-density-area-basis-label",
    title: "Urban Density Area Basis Label Tool",
    description:
      "Compute a density while retaining an explicit area-basis label; no gross/net boundary conversion is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        count: { type: "number", minimum: 0 },
        areaHectares: { type: "number", exclusiveMinimum: 0 },
        basis: {
          type: "string",
          maxLength: 8192,
          enum: ["gross", "net", "residential", "developable"],
        },
      },
      required: ["count", "areaHectares", "basis"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        densityPerHectare: { type: "number" },
        label: { type: "string", maxLength: 8192 },
      },
      required: ["densityPerHectare", "label"],
    },
    ports: {
      inputs: [
        {
          id: "count",
          label: "Count",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "areaHectares",
          label: "Area Hectares",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "basis",
          label: "Basis",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "densityPerHectare",
          label: "Density Per Hectare",
          valueType: { type: "number" },
        },
        { id: "label", label: "Label", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = urbanDensityAreaBasisLabelTool.execute;
export default urbanDensityAreaBasisLabelTool;
