import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly facadeArea: number;
  readonly openingArea: number;
};
export type Output = {
  readonly openingFraction: number;
  readonly solidArea: number;
  readonly solidFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    facadeArea: { type: "number", exclusiveMinimum: 0 },
    openingArea: { type: "number", minimum: 0 },
  },
  required: ["facadeArea", "openingArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    openingFraction: { type: "number" },
    solidArea: { type: "number" },
    solidFraction: { type: "number" },
  },
  required: ["openingFraction", "solidArea", "solidFraction"],
} as const;
/** Split a facade's gross area into nonoverlapping opening and solid shares. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { facadeArea, openingArea } = request;
  const compute = (): Output => {
    (H.domain(facadeArea > 0, "facadeArea"), facadeArea);
    H.domain(openingArea >= 0 && openingArea <= facadeArea, "openingArea");
    return {
      openingFraction: openingArea / facadeArea,
      solidArea: facadeArea - openingArea,
      solidFraction: (facadeArea - openingArea) / facadeArea,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { facadeArea: 120, openingArea: 30 },
  output: { openingFraction: 0.25, solidArea: 90, solidFraction: 0.75 },
} satisfies ToolExample<Input, Output>;
export const facadeOpeningSolidShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "architecture/facade-opening-solid-share",
    title: "Facade Opening Solid Share Tool",
    description:
      "Split a facade's gross area into nonoverlapping opening and solid shares.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        facadeArea: { type: "number", exclusiveMinimum: 0 },
        openingArea: { type: "number", minimum: 0 },
      },
      required: ["facadeArea", "openingArea"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        openingFraction: { type: "number" },
        solidArea: { type: "number" },
        solidFraction: { type: "number" },
      },
      required: ["openingFraction", "solidArea", "solidFraction"],
    },
    ports: {
      inputs: [
        {
          id: "facadeArea",
          label: "Facade Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "openingArea",
          label: "Opening Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "openingFraction",
          label: "Opening Fraction",
          valueType: { type: "number" },
        },
        { id: "solidArea", label: "Solid Area", valueType: { type: "number" } },
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
export const run = facadeOpeningSolidShareTool.execute;
export default facadeOpeningSolidShareTool;
