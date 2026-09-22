import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly count: number;
  readonly area: number;
  readonly areaKnown: boolean;
};
export type Output = {
  readonly densityDefined: boolean;
  readonly density: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    count: { type: "integer", minimum: 0 },
    area: { type: "number", minimum: 0 },
    areaKnown: { type: "boolean" },
  },
  required: ["count", "area", "areaKnown"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    densityDefined: { type: "boolean" },
    density: { type: "number" },
  },
  required: ["densityDefined", "density"],
} as const;
/** Calculate benthic count unknown area flag from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { count, area, areaKnown } = request;
  const compute = (): Output => {
    H.integer(count, 0);
    H.domain(area >= 0);
    return {
      densityDefined: areaKnown && area > 0,
      density: areaKnown && area > 0 ? count / area : 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { count: 20, area: 0, areaKnown: false },
  output: { densityDefined: false, density: 0 },
} satisfies ToolExample<Input, Output>;
export const benthicCountUnknownAreaFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "aquatic-science/benthic-count-unknown-area-flag",
    title: "Benthic Count Unknown Area Flag Tool",
    description:
      "Calculate benthic count unknown area flag from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        count: { type: "integer", minimum: 0 },
        area: { type: "number", minimum: 0 },
        areaKnown: { type: "boolean" },
      },
      required: ["count", "area", "areaKnown"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        densityDefined: { type: "boolean" },
        density: { type: "number" },
      },
      required: ["densityDefined", "density"],
    },
    ports: {
      inputs: [
        {
          id: "count",
          label: "Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "area",
          label: "Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "areaKnown",
          label: "Area Known",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "densityDefined",
          label: "Density Defined",
          valueType: { type: "boolean" },
        },
        { id: "density", label: "Density", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = benthicCountUnknownAreaFlagTool.execute;
export default benthicCountUnknownAreaFlagTool;
