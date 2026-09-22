import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly procedures: readonly number[];
  readonly travelMinutes: number;
  readonly waitingMinutes: number;
  readonly visits: number;
};
export type Output = { readonly perVisit: number; readonly total: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    procedures: { type: "array", maxItems: 256, items: { type: "number" } },
    travelMinutes: { type: "number", minimum: 0 },
    waitingMinutes: { type: "number", minimum: 0 },
    visits: { type: "integer", minimum: 0 },
  },
  required: ["procedures", "travelMinutes", "waitingMinutes", "visits"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { perVisit: { type: "number" }, total: { type: "number" } },
  required: ["perVisit", "total"],
} as const;
/** Calculate participant burden per visit minute term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { procedures, travelMinutes, waitingMinutes, visits } = request;
  const compute = (): Output => {
    H.domain(
      procedures.every((x) => x >= 0) &&
        travelMinutes >= 0 &&
        waitingMinutes >= 0,
    );
    H.integer(visits, 0);
    return {
      perVisit:
        procedures.reduce((a, b) => a + b, 0) + travelMinutes + waitingMinutes,
      total:
        visits *
        (procedures.reduce((a, b) => a + b, 0) +
          travelMinutes +
          waitingMinutes),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    procedures: [10, 15],
    travelMinutes: 30,
    waitingMinutes: 5,
    visits: 4,
  },
  output: { perVisit: 60, total: 240 },
} satisfies ToolExample<Input, Output>;
export const participantBurdenPerVisitMinuteTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "bioethics/participant-burden-per-visit-minute-term",
      title: "Participant Burden Per Visit Minute Term Tool",
      description:
        "Calculate participant burden per visit minute term from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          procedures: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
          travelMinutes: { type: "number", minimum: 0 },
          waitingMinutes: { type: "number", minimum: 0 },
          visits: { type: "integer", minimum: 0 },
        },
        required: ["procedures", "travelMinutes", "waitingMinutes", "visits"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { perVisit: { type: "number" }, total: { type: "number" } },
        required: ["perVisit", "total"],
      },
      ports: {
        inputs: [
          {
            id: "procedures",
            label: "Procedures",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "travelMinutes",
            label: "Travel Minutes",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "waitingMinutes",
            label: "Waiting Minutes",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "visits",
            label: "Visits",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          { id: "perVisit", label: "Per Visit", valueType: { type: "number" } },
          { id: "total", label: "Total", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = participantBurdenPerVisitMinuteTermTool.execute;
export default participantBurdenPerVisitMinuteTermTool;
