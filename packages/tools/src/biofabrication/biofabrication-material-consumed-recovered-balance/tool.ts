import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly loaded: number;
  readonly deposited: number;
  readonly recovered: number;
  readonly discarded: number;
};
export type Output = {
  readonly unaccounted: number;
  readonly recoveryShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    loaded: { type: "number", exclusiveMinimum: 0 },
    deposited: { type: "number", minimum: 0 },
    recovered: { type: "number", minimum: 0 },
    discarded: { type: "number", minimum: 0 },
  },
  required: ["loaded", "deposited", "recovered", "discarded"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unaccounted: { type: "number" },
    recoveryShare: { type: "number" },
  },
  required: ["unaccounted", "recoveryShare"],
} as const;
/** Calculate biofabrication material consumed recovered balance from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { loaded, deposited, recovered, discarded } = request;
  const compute = (): Output => {
    H.positive(loaded);
    H.domain(deposited >= 0 && recovered >= 0 && discarded >= 0);
    return {
      unaccounted: loaded - deposited - recovered - discarded,
      recoveryShare: recovered / loaded,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { loaded: 100, deposited: 70, recovered: 20, discarded: 5 },
  output: { unaccounted: 5, recoveryShare: 0.2 },
} satisfies ToolExample<Input, Output>;
export const biofabricationMaterialConsumedRecoveredBalanceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "biofabrication/biofabrication-material-consumed-recovered-balance",
      title: "Biofabrication Material Consumed Recovered Balance Tool",
      description:
        "Calculate biofabrication material consumed recovered balance from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          loaded: { type: "number", exclusiveMinimum: 0 },
          deposited: { type: "number", minimum: 0 },
          recovered: { type: "number", minimum: 0 },
          discarded: { type: "number", minimum: 0 },
        },
        required: ["loaded", "deposited", "recovered", "discarded"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          unaccounted: { type: "number" },
          recoveryShare: { type: "number" },
        },
        required: ["unaccounted", "recoveryShare"],
      },
      ports: {
        inputs: [
          {
            id: "loaded",
            label: "Loaded",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "deposited",
            label: "Deposited",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "recovered",
            label: "Recovered",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "discarded",
            label: "Discarded",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "unaccounted",
            label: "Unaccounted",
            valueType: { type: "number" },
          },
          {
            id: "recoveryShare",
            label: "Recovery Share",
            valueType: { type: "number", unit: "1" },
          },
        ],
      },
    },
    calculate,
  });
export const run = biofabricationMaterialConsumedRecoveredBalanceTool.execute;
export default biofabricationMaterialConsumedRecoveredBalanceTool;
