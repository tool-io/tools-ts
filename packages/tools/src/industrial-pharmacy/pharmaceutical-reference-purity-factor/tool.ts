import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly nominalReferenceMass: number;
  readonly suppliedPurityFraction: number;
};
export type Output = { readonly pureEquivalentMass: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nominalReferenceMass: { type: "number", minimum: 0 },
    suppliedPurityFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["nominalReferenceMass", "suppliedPurityFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { pureEquivalentMass: { type: "number" } },
  required: ["pureEquivalentMass"],
} as const;
/** Apply an explicitly supplied reference purity fraction to nominal mass without authenticating purity or prescribing an assay. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { nominalReferenceMass, suppliedPurityFraction } = request;
  const compute = (): Output => {
    H.domain(nominalReferenceMass >= 0, "nominalReferenceMass");
    (H.domain(
      suppliedPurityFraction >= 0 && suppliedPurityFraction <= 1,
      "suppliedPurityFraction",
    ),
      suppliedPurityFraction);
    return {
      pureEquivalentMass: nominalReferenceMass * suppliedPurityFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { nominalReferenceMass: 20, suppliedPurityFraction: 0.98 },
  output: { pureEquivalentMass: 19.6 },
} satisfies ToolExample<Input, Output>;
export const pharmaceuticalReferencePurityFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data"],
        fields: ["industrial-pharmacy", "industrial pharmacy", "pharmacy"],
        keywords: ["industrial pharmacy", "pharmacy"],
      },
      id: "industrial-pharmacy/pharmaceutical-reference-purity-factor",
      title: "Pharmaceutical Reference Purity Factor",
      description:
        "Apply an explicitly supplied reference purity fraction to nominal mass without authenticating purity or prescribing an assay.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          nominalReferenceMass: { type: "number", minimum: 0 },
          suppliedPurityFraction: { type: "number", minimum: 0, maximum: 1 },
        },
        required: ["nominalReferenceMass", "suppliedPurityFraction"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { pureEquivalentMass: { type: "number" } },
        required: ["pureEquivalentMass"],
      },
      ports: {
        inputs: [
          {
            id: "nominalReferenceMass",
            label: "Nominal Reference Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "suppliedPurityFraction",
            label: "Supplied Purity Fraction",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "pureEquivalentMass",
            label: "Pure Equivalent Mass",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = pharmaceuticalReferencePurityFactorTool.execute;
export default pharmaceuticalReferencePurityFactorTool;
