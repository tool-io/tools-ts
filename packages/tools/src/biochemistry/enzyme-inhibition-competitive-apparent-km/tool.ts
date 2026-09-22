import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly km: number;
  readonly inhibitor: number;
  readonly ki: number;
};
export type Output = { readonly alpha: number; readonly apparentKm: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    km: { type: "number", minimum: 0 },
    inhibitor: { type: "number", minimum: 0 },
    ki: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["km", "inhibitor", "ki"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { alpha: { type: "number" }, apparentKm: { type: "number" } },
  required: ["alpha", "apparentKm"],
} as const;
/** Ideal reversible competitive inhibition changes Km by 1+I/Ki while Vmax is held fixed. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { km, inhibitor, ki } = request;
  const compute = (): Output => {
    H.domain(km >= 0 && inhibitor >= 0);
    H.positive(ki);
    return { alpha: 1 + inhibitor / ki, apparentKm: km * (1 + inhibitor / ki) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { km: 2, inhibitor: 3, ki: 1 },
  output: { alpha: 4, apparentKm: 8 },
} satisfies ToolExample<Input, Output>;
export const enzymeInhibitionCompetitiveApparentKmTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "biochemistry/enzyme-inhibition-competitive-apparent-km",
      title: "Enzyme Inhibition Competitive Apparent Km Tool",
      description:
        "Ideal reversible competitive inhibition changes Km by 1+I/Ki while Vmax is held fixed.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          km: { type: "number", minimum: 0 },
          inhibitor: { type: "number", minimum: 0 },
          ki: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["km", "inhibitor", "ki"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          alpha: { type: "number" },
          apparentKm: { type: "number" },
        },
        required: ["alpha", "apparentKm"],
      },
      ports: {
        inputs: [
          {
            id: "km",
            label: "Km",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "inhibitor",
            label: "Inhibitor",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "ki",
            label: "Ki",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "alpha", label: "Alpha", valueType: { type: "number" } },
          {
            id: "apparentKm",
            label: "Apparent Km",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = enzymeInhibitionCompetitiveApparentKmTool.execute;
export default enzymeInhibitionCompetitiveApparentKmTool;
