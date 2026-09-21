import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reserved: number;
  readonly arrivals: number;
  readonly cancellations: number;
  readonly noShows: number;
  readonly releaseNoShows: boolean;
};
export type Output = {
  readonly occupied: number;
  readonly released: number;
  readonly stillReserved: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reserved: { type: "integer", minimum: 0 },
    arrivals: { type: "integer", minimum: 0 },
    cancellations: { type: "integer", minimum: 0 },
    noShows: { type: "integer", minimum: 0 },
    releaseNoShows: { type: "boolean" },
  },
  required: [
    "reserved",
    "arrivals",
    "cancellations",
    "noShows",
    "releaseNoShows",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    occupied: { type: "integer" },
    released: { type: "integer" },
    stillReserved: { type: "integer" },
  },
  required: ["occupied", "released", "stillReserved"],
} as const;
/** Calculate office queue no show release from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reserved, arrivals, cancellations, noShows, releaseNoShows } =
    request;
  const compute = (): Output => {
    H.integer(reserved, 0);
    H.integer(arrivals, 0);
    H.integer(cancellations, 0);
    H.integer(noShows, 0);
    H.domain(arrivals + cancellations + noShows <= reserved);
    return {
      occupied: arrivals,
      released: cancellations + (releaseNoShows ? noShows : 0),
      stillReserved:
        reserved - arrivals - cancellations - (releaseNoShows ? noShows : 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    reserved: 20,
    arrivals: 12,
    cancellations: 3,
    noShows: 2,
    releaseNoShows: true,
  },
  output: { occupied: 12, released: 5, stillReserved: 3 },
} satisfies ToolExample<Input, Output>;
export const officeQueueNoShowReleaseTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "administrative-science/office-queue-no-show-release",
    title: "Office Queue No Show Release Tool",
    description:
      "Calculate office queue no show release from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reserved: { type: "integer", minimum: 0 },
        arrivals: { type: "integer", minimum: 0 },
        cancellations: { type: "integer", minimum: 0 },
        noShows: { type: "integer", minimum: 0 },
        releaseNoShows: { type: "boolean" },
      },
      required: [
        "reserved",
        "arrivals",
        "cancellations",
        "noShows",
        "releaseNoShows",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        occupied: { type: "integer" },
        released: { type: "integer" },
        stillReserved: { type: "integer" },
      },
      required: ["occupied", "released", "stillReserved"],
    },
    ports: {
      inputs: [
        {
          id: "reserved",
          label: "Reserved",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "arrivals",
          label: "Arrivals",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "cancellations",
          label: "Cancellations",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "noShows",
          label: "No Shows",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "releaseNoShows",
          label: "Release No Shows",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "occupied", label: "Occupied", valueType: { type: "integer" } },
        { id: "released", label: "Released", valueType: { type: "integer" } },
        {
          id: "stillReserved",
          label: "Still Reserved",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = officeQueueNoShowReleaseTool.execute;
export default officeQueueNoShowReleaseTool;
