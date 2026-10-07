import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly primitivesPerShell: readonly number[] };
export type Output = { readonly totalPrimitives: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    primitivesPerShell: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
  },
  required: ["primitivesPerShell"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { totalPrimitives: { type: "integer" } },
  required: ["totalPrimitives"],
} as const;
/** Sum explicitly supplied per-shell primitive counts without expanding angular components or contractions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { primitivesPerShell } = request;
  const compute = (): Output => {
    primitivesPerShell.forEach(
      (value) => (
        H.domain(
          Number.isSafeInteger(value) &&
            value >= 0 &&
            value <= Number.MAX_SAFE_INTEGER,
          "primitivesPerShell",
        ),
        value
      ),
    );
    return {
      totalPrimitives: Number(
        primitivesPerShell.reduce((sum, value) => sum + BigInt(value), 0n),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { primitivesPerShell: [3, 2, 1] },
  output: { totalPrimitives: 6 },
} satisfies ToolExample<Input, Output>;
export const quantumChemistryBasisPrimitiveCountTool =
  H.defineSchemaCalculation<Input, Output>({
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
      id: "computational-chemistry/quantum-chemistry-basis-primitive-count",
      title: "Quantum Chemistry Basis Primitive Count",
      description:
        "Sum explicitly supplied per-shell primitive counts without expanding angular components or contractions.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          primitivesPerShell: {
            type: "array",
            maxItems: 256,
            items: { type: "integer" },
          },
        },
        required: ["primitivesPerShell"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { totalPrimitives: { type: "integer" } },
        required: ["totalPrimitives"],
      },
      ports: {
        inputs: [
          {
            id: "primitivesPerShell",
            label: "Primitives Per Shell",
            required: true,
            valueType: { type: "list", items: { type: "integer" } },
          },
        ],
        outputs: [
          {
            id: "totalPrimitives",
            label: "Total Primitives",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = quantumChemistryBasisPrimitiveCountTool.execute;
export default quantumChemistryBasisPrimitiveCountTool;
