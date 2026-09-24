import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pages: number;
  readonly unitPages: number;
  readonly unitFee: number;
  readonly roundPartialUnit: boolean;
  readonly exemptPages: number;
};
export type Output = {
  readonly billableUnits: number;
  readonly charge: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pages: { type: "number", minimum: 0 },
    unitPages: { type: "number", exclusiveMinimum: 0 },
    unitFee: { type: "number", minimum: 0 },
    roundPartialUnit: { type: "boolean" },
    exemptPages: { type: "number", minimum: 0 },
  },
  required: [
    "pages",
    "unitPages",
    "unitFee",
    "roundPartialUnit",
    "exemptPages",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { billableUnits: { type: "number" }, charge: { type: "number" } },
  required: ["billableUnits", "charge"],
} as const;
/** Copy-fee arithmetic from supplied exemptions, units and rounding policy; no court fee schedule is selected. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pages, unitPages, unitFee, roundPartialUnit, exemptPages } = request;
  const compute = (): Output => {
    H.positive(unitPages);
    H.domain(
      pages >= 0 && exemptPages >= 0 && exemptPages <= pages && unitFee >= 0,
    );
    return {
      billableUnits: roundPartialUnit
        ? Math.ceil((pages - exemptPages) / unitPages)
        : (pages - exemptPages) / unitPages,
      charge:
        (roundPartialUnit
          ? Math.ceil((pages - exemptPages) / unitPages)
          : (pages - exemptPages) / unitPages) * unitFee,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    pages: 12,
    unitPages: 5,
    unitFee: 2,
    roundPartialUnit: true,
    exemptPages: 2,
  },
  output: { billableUnits: 2, charge: 4 },
} satisfies ToolExample<Input, Output>;
export const courtFeeCopyFractionBaseTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "criminal-justice/court-fee-copy-fraction-base",
    title: "Court Fee Copy Fraction Base Tool",
    description:
      "Copy-fee arithmetic from supplied exemptions, units and rounding policy; no court fee schedule is selected.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pages: { type: "number", minimum: 0 },
        unitPages: { type: "number", exclusiveMinimum: 0 },
        unitFee: { type: "number", minimum: 0 },
        roundPartialUnit: { type: "boolean" },
        exemptPages: { type: "number", minimum: 0 },
      },
      required: [
        "pages",
        "unitPages",
        "unitFee",
        "roundPartialUnit",
        "exemptPages",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        billableUnits: { type: "number" },
        charge: { type: "number" },
      },
      required: ["billableUnits", "charge"],
    },
    ports: {
      inputs: [
        {
          id: "pages",
          label: "Pages",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "unitPages",
          label: "Unit Pages",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "unitFee",
          label: "Unit Fee",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "roundPartialUnit",
          label: "Round Partial Unit",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "exemptPages",
          label: "Exempt Pages",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "billableUnits",
          label: "Billable Units",
          valueType: { type: "number" },
        },
        { id: "charge", label: "Charge", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = courtFeeCopyFractionBaseTool.execute;
export default courtFeeCopyFractionBaseTool;
