import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly generated: number;
  readonly exported: number;
  readonly imported: number;
};
export type Output = {
  readonly selfUsed: number;
  readonly selfConsumptionShare: number;
  readonly renewableDemandShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    generated: { type: "number", exclusiveMinimum: 0 },
    exported: { type: "number", minimum: 0 },
    imported: { type: "number", minimum: 0 },
  },
  required: ["generated", "exported", "imported"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    selfUsed: { type: "number" },
    selfConsumptionShare: { type: "number" },
    renewableDemandShare: { type: "number" },
  },
  required: ["selfUsed", "selfConsumptionShare", "renewableDemandShare"],
} as const;
/** Calculate renewable farm electricity selfuse share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { generated, exported, imported } = request;
  const compute = (): Output => {
    H.positive(generated);
    H.domain(
      exported >= 0 &&
        exported <= generated &&
        imported >= 0 &&
        generated - exported + imported > 0,
    );
    return {
      selfUsed: generated - exported,
      selfConsumptionShare: (generated - exported) / generated,
      renewableDemandShare:
        (generated - exported) / (generated - exported + imported),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { generated: 100, exported: 30, imported: 50 },
  output: {
    selfUsed: 70,
    selfConsumptionShare: 0.7,
    renewableDemandShare: 0.5833333333333334,
  },
} satisfies ToolExample<Input, Output>;
export const renewableFarmElectricitySelfuseShareTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "sustainable-agriculture/renewable-farm-electricity-selfuse-share",
      title: "Renewable Farm Electricity Selfuse Share Tool",
      description:
        "Calculate renewable farm electricity selfuse share from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          generated: { type: "number", exclusiveMinimum: 0 },
          exported: { type: "number", minimum: 0 },
          imported: { type: "number", minimum: 0 },
        },
        required: ["generated", "exported", "imported"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          selfUsed: { type: "number" },
          selfConsumptionShare: { type: "number" },
          renewableDemandShare: { type: "number" },
        },
        required: ["selfUsed", "selfConsumptionShare", "renewableDemandShare"],
      },
      ports: {
        inputs: [
          {
            id: "generated",
            label: "Generated",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "exported",
            label: "Exported",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "imported",
            label: "Imported",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "selfUsed", label: "Self Used", valueType: { type: "number" } },
          {
            id: "selfConsumptionShare",
            label: "Self Consumption Share",
            valueType: { type: "number", unit: "1" },
          },
          {
            id: "renewableDemandShare",
            label: "Renewable Demand Share",
            valueType: { type: "number", unit: "1" },
          },
        ],
      },
    },
    calculate,
  });
export const run = renewableFarmElectricitySelfuseShareTool.execute;
export default renewableFarmElectricitySelfuseShareTool;
