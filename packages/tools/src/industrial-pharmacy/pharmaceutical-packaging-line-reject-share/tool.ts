import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly produced: number;
  readonly rejected: number;
  readonly reworked: number;
  readonly acceptedRework: number;
};
export type Output = {
  readonly firstPassAccepted: number;
  readonly finalAccepted: number;
  readonly firstPassYield: number;
  readonly finalYield: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    produced: { type: "integer", minimum: 1 },
    rejected: { type: "integer", minimum: 0 },
    reworked: { type: "integer", minimum: 0 },
    acceptedRework: { type: "integer", minimum: 0 },
  },
  required: ["produced", "rejected", "reworked", "acceptedRework"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstPassAccepted: { type: "integer" },
    finalAccepted: { type: "integer" },
    firstPassYield: { type: "number" },
    finalYield: { type: "number" },
  },
  required: [
    "firstPassAccepted",
    "finalAccepted",
    "firstPassYield",
    "finalYield",
  ],
} as const;
/** Calculate pharmaceutical packaging line reject share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { produced, rejected, reworked, acceptedRework } = request;
  const compute = (): Output => {
    H.integer(produced, 1);
    H.integer(rejected, 0, produced);
    H.integer(reworked, 0, rejected);
    H.integer(acceptedRework, 0, reworked);
    return {
      firstPassAccepted: produced - rejected,
      finalAccepted: produced - rejected + acceptedRework,
      firstPassYield: (produced - rejected) / produced,
      finalYield: (produced - rejected + acceptedRework) / produced,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { produced: 1000, rejected: 100, reworked: 80, acceptedRework: 60 },
  output: {
    firstPassAccepted: 900,
    finalAccepted: 960,
    firstPassYield: 0.9,
    finalYield: 0.96,
  },
} satisfies ToolExample<Input, Output>;
export const pharmaceuticalPackagingLineRejectShareTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "industrial-pharmacy/pharmaceutical-packaging-line-reject-share",
      title: "Pharmaceutical Packaging Line Reject Share Tool",
      description:
        "Calculate pharmaceutical packaging line reject share from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          produced: { type: "integer", minimum: 1 },
          rejected: { type: "integer", minimum: 0 },
          reworked: { type: "integer", minimum: 0 },
          acceptedRework: { type: "integer", minimum: 0 },
        },
        required: ["produced", "rejected", "reworked", "acceptedRework"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstPassAccepted: { type: "integer" },
          finalAccepted: { type: "integer" },
          firstPassYield: { type: "number" },
          finalYield: { type: "number" },
        },
        required: [
          "firstPassAccepted",
          "finalAccepted",
          "firstPassYield",
          "finalYield",
        ],
      },
      ports: {
        inputs: [
          {
            id: "produced",
            label: "Produced",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "rejected",
            label: "Rejected",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "reworked",
            label: "Reworked",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "acceptedRework",
            label: "Accepted Rework",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "firstPassAccepted",
            label: "First Pass Accepted",
            valueType: { type: "integer" },
          },
          {
            id: "finalAccepted",
            label: "Final Accepted",
            valueType: { type: "integer" },
          },
          {
            id: "firstPassYield",
            label: "First Pass Yield",
            valueType: { type: "number" },
          },
          {
            id: "finalYield",
            label: "Final Yield",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = pharmaceuticalPackagingLineRejectShareTool.execute;
export default pharmaceuticalPackagingLineRejectShareTool;
