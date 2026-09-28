import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly copies: number;
  readonly baseUnitCost: number;
  readonly accessibleCopies: number;
  readonly accessibleUnitCost: number;
  readonly fixedConversion: number;
};
export type Output = {
  readonly standardCopies: number;
  readonly productionCost: number;
  readonly totalCost: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    copies: { type: "integer", minimum: 0 },
    baseUnitCost: { type: "number", minimum: 0 },
    accessibleCopies: { type: "integer", minimum: 0 },
    accessibleUnitCost: { type: "number", minimum: 0 },
    fixedConversion: { type: "number", minimum: 0 },
  },
  required: [
    "copies",
    "baseUnitCost",
    "accessibleCopies",
    "accessibleUnitCost",
    "fixedConversion",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    standardCopies: { type: "integer" },
    productionCost: { type: "number" },
    totalCost: { type: "number" },
  },
  required: ["standardCopies", "productionCost", "totalCost"],
} as const;
/** Calculate policy notice accessible format cost term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    copies,
    baseUnitCost,
    accessibleCopies,
    accessibleUnitCost,
    fixedConversion,
  } = request;
  const compute = (): Output => {
    H.integer(copies, 0);
    H.integer(accessibleCopies, 0, copies);
    H.domain(
      baseUnitCost >= 0 && accessibleUnitCost >= 0 && fixedConversion >= 0,
    );
    return {
      standardCopies: copies - accessibleCopies,
      productionCost:
        (copies - accessibleCopies) * baseUnitCost +
        accessibleCopies * accessibleUnitCost,
      totalCost:
        (copies - accessibleCopies) * baseUnitCost +
        accessibleCopies * accessibleUnitCost +
        (accessibleCopies > 0 ? fixedConversion : 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    copies: 100,
    baseUnitCost: 1,
    accessibleCopies: 20,
    accessibleUnitCost: 3,
    fixedConversion: 50,
  },
  output: { standardCopies: 80, productionCost: 140, totalCost: 190 },
} satisfies ToolExample<Input, Output>;
export const policyNoticeAccessibleFormatCostTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "health-policy/policy-notice-accessible-format-cost-term",
      title: "Policy Notice Accessible Format Cost Term Tool",
      description:
        "Calculate policy notice accessible format cost term from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          copies: { type: "integer", minimum: 0 },
          baseUnitCost: { type: "number", minimum: 0 },
          accessibleCopies: { type: "integer", minimum: 0 },
          accessibleUnitCost: { type: "number", minimum: 0 },
          fixedConversion: { type: "number", minimum: 0 },
        },
        required: [
          "copies",
          "baseUnitCost",
          "accessibleCopies",
          "accessibleUnitCost",
          "fixedConversion",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          standardCopies: { type: "integer" },
          productionCost: { type: "number" },
          totalCost: { type: "number" },
        },
        required: ["standardCopies", "productionCost", "totalCost"],
      },
      ports: {
        inputs: [
          {
            id: "copies",
            label: "Copies",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "baseUnitCost",
            label: "Base Unit Cost",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "accessibleCopies",
            label: "Accessible Copies",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "accessibleUnitCost",
            label: "Accessible Unit Cost",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "fixedConversion",
            label: "Fixed Conversion",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "standardCopies",
            label: "Standard Copies",
            valueType: { type: "integer" },
          },
          {
            id: "productionCost",
            label: "Production Cost",
            valueType: { type: "number" },
          },
          {
            id: "totalCost",
            label: "Total Cost",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = policyNoticeAccessibleFormatCostTermTool.execute;
export default policyNoticeAccessibleFormatCostTermTool;
