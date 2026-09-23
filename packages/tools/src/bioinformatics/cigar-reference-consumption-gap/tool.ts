import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cigar: string;
  readonly suppliedReferenceSpan: string;
};
export type Output = {
  readonly consumedReferenceDecimal: string;
  readonly gapDecimal: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cigar: { type: "string", maxLength: 8192 },
    suppliedReferenceSpan: {
      type: "string",
      maxLength: 8192,
      format: "integer-decimal",
    },
  },
  required: ["cigar", "suppliedReferenceSpan"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    consumedReferenceDecimal: {
      type: "string",
      maxLength: 8192,
      format: "integer-decimal",
    },
    gapDecimal: { type: "string", maxLength: 8192, format: "integer-decimal" },
  },
  required: ["consumedReferenceDecimal", "gapDecimal"],
} as const;
/** Count SAM reference-consuming operations and compare an explicit span; alignment placement constraints are outside this operation counter. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cigar, suppliedReferenceSpan } = request;
  const compute = (): Output => {
    H.domain(
      /^(?:[1-9][0-9]{0,127}[MIDNSHP=X])+(?![\s\S])/.test(cigar),
      "cigar",
    );
    const span = H.decimal(suppliedReferenceSpan);
    H.domain(span >= 0n, "suppliedReferenceSpan");
    let total = 0n;
    for (const match of cigar.matchAll(/([0-9]+)([MIDNSHP=X])/g))
      if ("MDN=X".includes(match[2])) total += BigInt(match[1]);
    return {
      consumedReferenceDecimal: total.toString(),
      gapDecimal: (total - span).toString(),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { cigar: "3S6M1P1I4M", suppliedReferenceSpan: "10" },
  output: { consumedReferenceDecimal: "10", gapDecimal: "0" },
} satisfies ToolExample<Input, Output>;
export const cigarReferenceConsumptionGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bioinformatics/cigar-reference-consumption-gap",
    title: "CIGAR Reference Consumption Gap Tool",
    description:
      "Count SAM reference-consuming operations and compare an explicit span; alignment placement constraints are outside this operation counter.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cigar: { type: "string", maxLength: 8192 },
        suppliedReferenceSpan: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
      },
      required: ["cigar", "suppliedReferenceSpan"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        consumedReferenceDecimal: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
        gapDecimal: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
      },
      required: ["consumedReferenceDecimal", "gapDecimal"],
    },
    ports: {
      inputs: [
        {
          id: "cigar",
          label: "Cigar",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedReferenceSpan",
          label: "Supplied Reference Span",
          required: true,
          valueType: { type: "string", format: "integer-decimal" },
        },
      ],
      outputs: [
        {
          id: "consumedReferenceDecimal",
          label: "Consumed Reference Decimal",
          valueType: { type: "string", format: "integer-decimal" },
        },
        {
          id: "gapDecimal",
          label: "Gap Decimal",
          valueType: { type: "string", format: "integer-decimal" },
        },
      ],
    },
  },
  calculate,
});
export const run = cigarReferenceConsumptionGapTool.execute;
export default cigarReferenceConsumptionGapTool;
