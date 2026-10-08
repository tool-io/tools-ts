import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly quotedMass: number;
  readonly h: number;
  readonly exponent: number;
};
export type Output = { readonly physicalMass: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    quotedMass: { type: "number", minimum: 0 },
    h: { type: "number", exclusiveMinimum: 0 },
    exponent: { type: "number" },
  },
  required: ["quotedMass", "h", "exponent"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { physicalMass: { type: "number" } },
  required: ["physicalMass"],
} as const;
/** Apply an explicit h exponent to a quoted cosmological mass, making the scaling convention caller-supplied rather than inferred from notation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { quotedMass, h, exponent } = request;
  const compute = (): Output => {
    H.domain(quotedMass >= 0, "quotedMass");
    (H.domain(h > 0, "h"), h);
    return { physicalMass: quotedMass * h ** exponent };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { quotedMass: 100, h: 0.5, exponent: -1 },
  output: { physicalMass: 200 },
} satisfies ToolExample<Input, Output>;
export const cosmologicalHScaledMassCrosswalkTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["cosmology", "physics"],
      keywords: ["cosmology", "physics"],
    },
    id: "cosmology/cosmological-h-scaled-mass-crosswalk",
    title: "Cosmological H Scaled Mass Crosswalk",
    description:
      "Apply an explicit h exponent to a quoted cosmological mass, making the scaling convention caller-supplied rather than inferred from notation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        quotedMass: { type: "number", minimum: 0 },
        h: { type: "number", exclusiveMinimum: 0 },
        exponent: { type: "number" },
      },
      required: ["quotedMass", "h", "exponent"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { physicalMass: { type: "number" } },
      required: ["physicalMass"],
    },
    ports: {
      inputs: [
        {
          id: "quotedMass",
          label: "Quoted Mass",
          required: true,
          valueType: { type: "number" },
        },
        { id: "h", label: "H", required: true, valueType: { type: "number" } },
        {
          id: "exponent",
          label: "Exponent",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "physicalMass",
          label: "Physical Mass",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = cosmologicalHScaledMassCrosswalkTool.execute;
export default cosmologicalHScaledMassCrosswalkTool;
