import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly currentHours: number;
  readonly lastService: number;
  readonly intervalHours: number;
};
export type Output = {
  readonly elapsed: number;
  readonly remaining: number;
  readonly overdue: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    currentHours: { type: "number" },
    lastService: { type: "number" },
    intervalHours: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["currentHours", "lastService", "intervalHours"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    elapsed: { type: "number" },
    remaining: { type: "number" },
    overdue: { type: "boolean" },
  },
  required: ["elapsed", "remaining", "overdue"],
} as const;
/** Calculate farm machine service hour remainder from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { currentHours, lastService, intervalHours } = request;
  const compute = (): Output => {
    H.domain(currentHours >= lastService);
    H.positive(intervalHours);
    return {
      elapsed: currentHours - lastService,
      remaining: intervalHours - currentHours + lastService,
      overdue: currentHours - lastService > intervalHours,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { currentHours: 550, lastService: 400, intervalHours: 200 },
  output: { elapsed: 150, remaining: 50, overdue: false },
} satisfies ToolExample<Input, Output>;
export const farmMachineServiceHourRemainderTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agrotechnology/farm-machine-service-hour-remainder",
    title: "Farm Machine Service Hour Remainder Tool",
    description:
      "Calculate farm machine service hour remainder from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        currentHours: { type: "number" },
        lastService: { type: "number" },
        intervalHours: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["currentHours", "lastService", "intervalHours"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        elapsed: { type: "number" },
        remaining: { type: "number" },
        overdue: { type: "boolean" },
      },
      required: ["elapsed", "remaining", "overdue"],
    },
    ports: {
      inputs: [
        {
          id: "currentHours",
          label: "Current Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lastService",
          label: "Last Service",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "intervalHours",
          label: "Interval Hours",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "elapsed", label: "Elapsed", valueType: { type: "number" } },
        { id: "remaining", label: "Remaining", valueType: { type: "number" } },
        { id: "overdue", label: "Overdue", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = farmMachineServiceHourRemainderTool.execute;
export default farmMachineServiceHourRemainderTool;
