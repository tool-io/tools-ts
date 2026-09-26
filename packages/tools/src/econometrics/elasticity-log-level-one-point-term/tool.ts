import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly coefficient: number;
  readonly regressor: number;
  readonly model: string;
  readonly fittedOutcome: number;
};
export type Output = { readonly elasticity: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coefficient: { type: "number" },
    regressor: { type: "number" },
    model: {
      type: "string",
      maxLength: 8192,
      enum: ["log-level", "level-level"],
    },
    fittedOutcome: { type: "number" },
  },
  required: ["coefficient", "regressor", "model", "fittedOutcome"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { elasticity: { type: "number" } },
  required: ["elasticity"],
} as const;
/** Calculate elasticity log level one point term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { coefficient, regressor, model, fittedOutcome } = request;
  const compute = (): Output => {
    H.domain(["log-level", "level-level"].includes(model));
    H.domain(model !== "level-level" || fittedOutcome !== 0);
    return {
      elasticity:
        model === "log-level"
          ? coefficient * regressor
          : (coefficient * regressor) / fittedOutcome,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    coefficient: 0.2,
    regressor: 5,
    model: "log-level",
    fittedOutcome: 10,
  },
  output: { elasticity: 1 },
} satisfies ToolExample<Input, Output>;
export const elasticityLogLevelOnePointTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "econometrics/elasticity-log-level-one-point-term",
    title: "Elasticity Log Level One Point Term Tool",
    description:
      "Calculate elasticity log level one point term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        coefficient: { type: "number" },
        regressor: { type: "number" },
        model: {
          type: "string",
          maxLength: 8192,
          enum: ["log-level", "level-level"],
        },
        fittedOutcome: { type: "number" },
      },
      required: ["coefficient", "regressor", "model", "fittedOutcome"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { elasticity: { type: "number" } },
      required: ["elasticity"],
    },
    ports: {
      inputs: [
        {
          id: "coefficient",
          label: "Coefficient",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "regressor",
          label: "Regressor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "model",
          label: "Model",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "fittedOutcome",
          label: "Fitted Outcome",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "elasticity",
          label: "Elasticity",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = elasticityLogLevelOnePointTermTool.execute;
export default elasticityLogLevelOnePointTermTool;
