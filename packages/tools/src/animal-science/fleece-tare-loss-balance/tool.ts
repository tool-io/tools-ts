import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly gross: number;
  readonly tare: number;
  readonly removedContaminants: number;
  readonly recoveredClean: number;
};
export type Output = { readonly net: number; readonly residual: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gross: { type: "number", minimum: 0 },
    tare: { type: "number", minimum: 0 },
    removedContaminants: { type: "number", minimum: 0 },
    recoveredClean: { type: "number", minimum: 0 },
  },
  required: ["gross", "tare", "removedContaminants", "recoveredClean"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { net: { type: "number" }, residual: { type: "number" } },
  required: ["net", "residual"],
} as const;
/** Calculate fleece tare loss balance from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { gross, tare, removedContaminants, recoveredClean } = request;
  const compute = (): Output => {
    H.domain(
      gross >= 0 &&
        tare >= 0 &&
        removedContaminants >= 0 &&
        recoveredClean >= 0,
    );
    return {
      net: gross - tare - removedContaminants,
      residual: gross - tare - removedContaminants - recoveredClean,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { gross: 10, tare: 1, removedContaminants: 2, recoveredClean: 6 },
  output: { net: 7, residual: 1 },
} satisfies ToolExample<Input, Output>;
export const fleeceTareLossBalanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "animal-science/fleece-tare-loss-balance",
    title: "Fleece Tare Loss Balance Tool",
    description:
      "Calculate fleece tare loss balance from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        gross: { type: "number", minimum: 0 },
        tare: { type: "number", minimum: 0 },
        removedContaminants: { type: "number", minimum: 0 },
        recoveredClean: { type: "number", minimum: 0 },
      },
      required: ["gross", "tare", "removedContaminants", "recoveredClean"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { net: { type: "number" }, residual: { type: "number" } },
      required: ["net", "residual"],
    },
    ports: {
      inputs: [
        {
          id: "gross",
          label: "Gross",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "tare",
          label: "Tare",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "removedContaminants",
          label: "Removed Contaminants",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "recoveredClean",
          label: "Recovered Clean",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "net", label: "Net", valueType: { type: "number" } },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = fleeceTareLossBalanceTool.execute;
export default fleeceTareLossBalanceTool;
