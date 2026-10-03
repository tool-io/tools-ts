import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly orderedUnits: string;
  readonly caseCount: string;
  readonly unitsPerCase: string;
};
export type Output = {
  readonly packedUnitsDecimal: string;
  readonly residualDecimal: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    orderedUnits: {
      type: "string",
      maxLength: 8192,
      format: "integer-decimal",
    },
    caseCount: { type: "string", maxLength: 8192, format: "integer-decimal" },
    unitsPerCase: {
      type: "string",
      maxLength: 8192,
      format: "integer-decimal",
    },
  },
  required: ["orderedUnits", "caseCount", "unitsPerCase"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    packedUnitsDecimal: {
      type: "string",
      maxLength: 8192,
      format: "integer-decimal",
    },
    residualDecimal: {
      type: "string",
      maxLength: 8192,
      format: "integer-decimal",
    },
  },
  required: ["packedUnitsDecimal", "residualDecimal"],
} as const;
/** Calculate case pack unit residual from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { orderedUnits, caseCount, unitsPerCase } = request;
  const compute = (): Output => {
    return (() => {
      const a = H.decimal(orderedUnits),
        b = H.decimal(caseCount),
        c = H.decimal(unitsPerCase);
      H.domain(a >= 0n && b >= 0n && c > 0n);
      return {
        packedUnitsDecimal: (b * c).toString(),
        residualDecimal: (a - b * c).toString(),
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { orderedUnits: "103", caseCount: "4", unitsPerCase: "24" },
  output: { packedUnitsDecimal: "96", residualDecimal: "7" },
} satisfies ToolExample<Input, Output>;
export const casePackUnitResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "supply-chain/case-pack-unit-residual",
    title: "Case Pack Unit Residual Tool",
    description:
      "Calculate case pack unit residual from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        orderedUnits: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
        caseCount: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
        unitsPerCase: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
      },
      required: ["orderedUnits", "caseCount", "unitsPerCase"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        packedUnitsDecimal: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
        residualDecimal: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
      },
      required: ["packedUnitsDecimal", "residualDecimal"],
    },
    ports: {
      inputs: [
        {
          id: "orderedUnits",
          label: "Ordered Units",
          required: true,
          valueType: { type: "string", format: "integer-decimal" },
        },
        {
          id: "caseCount",
          label: "Case Count",
          required: true,
          valueType: { type: "string", format: "integer-decimal" },
        },
        {
          id: "unitsPerCase",
          label: "Units Per Case",
          required: true,
          valueType: { type: "string", format: "integer-decimal" },
        },
      ],
      outputs: [
        {
          id: "packedUnitsDecimal",
          label: "Packed Units Decimal",
          valueType: { type: "string", format: "integer-decimal" },
        },
        {
          id: "residualDecimal",
          label: "Residual Decimal",
          valueType: { type: "string", format: "integer-decimal" },
        },
      ],
    },
  },
  calculate,
});
export const run = casePackUnitResidualTool.execute;
export default casePackUnitResidualTool;
