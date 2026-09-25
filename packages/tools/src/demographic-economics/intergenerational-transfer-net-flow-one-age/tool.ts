import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly publicReceived: number;
  readonly privateReceived: number;
  readonly publicPaid: number;
  readonly privatePaid: number;
  readonly population: number;
};
export type Output = {
  readonly perPersonNet: number;
  readonly cohortNet: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    publicReceived: { type: "number" },
    privateReceived: { type: "number" },
    publicPaid: { type: "number" },
    privatePaid: { type: "number" },
    population: { type: "integer", minimum: 0 },
  },
  required: [
    "publicReceived",
    "privateReceived",
    "publicPaid",
    "privatePaid",
    "population",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    perPersonNet: { type: "number" },
    cohortNet: { type: "number" },
  },
  required: ["perPersonNet", "cohortNet"],
} as const;
/** Calculate intergenerational transfer net flow one age from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    publicReceived,
    privateReceived,
    publicPaid,
    privatePaid,
    population,
  } = request;
  const compute = (): Output => {
    H.domain(
      [publicReceived, privateReceived, publicPaid, privatePaid].every(
        (x) => x >= 0,
      ),
    );
    H.integer(population, 0);
    return {
      perPersonNet: publicReceived + privateReceived - publicPaid - privatePaid,
      cohortNet:
        (publicReceived + privateReceived - publicPaid - privatePaid) *
        population,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    publicReceived: 100,
    privateReceived: 50,
    publicPaid: 30,
    privatePaid: 20,
    population: 1000,
  },
  output: { perPersonNet: 100, cohortNet: 100000 },
} satisfies ToolExample<Input, Output>;
export const intergenerationalTransferNetFlowOneAgeTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "demographic-economics/intergenerational-transfer-net-flow-one-age",
      title: "Intergenerational Transfer Net Flow One Age Tool",
      description:
        "Calculate intergenerational transfer net flow one age from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          publicReceived: { type: "number" },
          privateReceived: { type: "number" },
          publicPaid: { type: "number" },
          privatePaid: { type: "number" },
          population: { type: "integer", minimum: 0 },
        },
        required: [
          "publicReceived",
          "privateReceived",
          "publicPaid",
          "privatePaid",
          "population",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          perPersonNet: { type: "number" },
          cohortNet: { type: "number" },
        },
        required: ["perPersonNet", "cohortNet"],
      },
      ports: {
        inputs: [
          {
            id: "publicReceived",
            label: "Public Received",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "privateReceived",
            label: "Private Received",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "publicPaid",
            label: "Public Paid",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "privatePaid",
            label: "Private Paid",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "population",
            label: "Population",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "perPersonNet",
            label: "Per Person Net",
            valueType: { type: "number" },
          },
          {
            id: "cohortNet",
            label: "Cohort Net",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = intergenerationalTransferNetFlowOneAgeTool.execute;
export default intergenerationalTransferNetFlowOneAgeTool;
