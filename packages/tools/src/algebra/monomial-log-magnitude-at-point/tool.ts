import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  sameLength,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly bases: readonly number[];
  readonly exponents: readonly number[];
  readonly coefficient: number;
};
export type Output = { readonly logMagnitude: number; readonly sign: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bases: { type: "array", maxItems: 256, items: { type: "number" } },
    exponents: { type: "array", maxItems: 256, items: { type: "integer" } },
    coefficient: { type: "number" },
  },
  required: ["bases", "exponents", "coefficient"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { logMagnitude: { type: "number" }, sign: { type: "integer" } },
  required: ["logMagnitude", "sign"],
} as const;
/** Compute monomial log magnitude at point from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { bases, exponents, coefficient } = input;
  const compute = (): Output => {
    sameLength(bases, exponents);
    domain(coefficient !== 0 && bases.every((x) => x !== 0));
    let sign = Math.sign(coefficient),
      logMagnitude = Math.log(Math.abs(coefficient));
    for (let i = 0; i < bases.length; i++) {
      logMagnitude += exponents[i] * Math.log(Math.abs(bases[i]));
      if (bases[i] < 0 && Math.abs(exponents[i] % 2) === 1) sign = -sign;
    }
    return { logMagnitude, sign };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { bases: [-2, 3], exponents: [3, 2], coefficient: -1 },
  output: { logMagnitude: 4.276666119016054, sign: 1 },
} satisfies ToolExample<Input, Output>;
export const monomialLogMagnitudeAtPointTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "algebra/monomial-log-magnitude-at-point",
  title: "Monomial Log Magnitude At Point Tool",
  description:
    "Compute monomial log magnitude at point from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "bases",
        label: "Bases",
        required: true,
        valueType: { type: "list", items: { type: "number" } },
      },
      {
        id: "exponents",
        label: "Exponents",
        required: true,
        valueType: { type: "list", items: { type: "integer" } },
      },
      {
        id: "coefficient",
        label: "Coefficient",
        required: true,
        valueType: { type: "number" },
      },
    ],
    outputs: [
      {
        id: "logMagnitude",
        label: "Log Magnitude",
        valueType: { type: "number" },
      },
      { id: "sign", label: "Sign", valueType: { type: "integer" } },
    ],
  },
});
export const run = monomialLogMagnitudeAtPointTool.execute;
export default monomialLogMagnitudeAtPointTool;
