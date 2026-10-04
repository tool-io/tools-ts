import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly shelfWidth: number;
  readonly shelfDepth: number;
  readonly shelves: number;
  readonly excludedArea: number;
};
export type Output = {
  readonly grossCanopyArea: number;
  readonly netCanopyArea: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    shelfWidth: { type: "number", minimum: 0 },
    shelfDepth: { type: "number", minimum: 0 },
    shelves: { type: "integer", minimum: 0 },
    excludedArea: { type: "number", minimum: 0 },
  },
  required: ["shelfWidth", "shelfDepth", "shelves", "excludedArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossCanopyArea: { type: "number" },
    netCanopyArea: { type: "number" },
  },
  required: ["grossCanopyArea", "netCanopyArea"],
} as const;
/** Calculate rack shelf canopy netarea term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { shelfWidth, shelfDepth, shelves, excludedArea } = request;
  const compute = (): Output => {
    H.integer(shelves, 0);
    H.domain(
      shelfWidth >= 0 &&
        shelfDepth >= 0 &&
        excludedArea >= 0 &&
        excludedArea <= shelfWidth * shelfDepth * shelves,
    );
    return {
      grossCanopyArea: shelfWidth * shelfDepth * shelves,
      netCanopyArea: shelfWidth * shelfDepth * shelves - excludedArea,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { shelfWidth: 2, shelfDepth: 1, shelves: 5, excludedArea: 1 },
  output: { grossCanopyArea: 10, netCanopyArea: 9 },
} satisfies ToolExample<Input, Output>;
export const rackShelfCanopyNetareaTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "vertical-farming/rack-shelf-canopy-netarea-term",
    title: "Rack Shelf Canopy Netarea Term Tool",
    description:
      "Calculate rack shelf canopy netarea term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        shelfWidth: { type: "number", minimum: 0 },
        shelfDepth: { type: "number", minimum: 0 },
        shelves: { type: "integer", minimum: 0 },
        excludedArea: { type: "number", minimum: 0 },
      },
      required: ["shelfWidth", "shelfDepth", "shelves", "excludedArea"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossCanopyArea: { type: "number" },
        netCanopyArea: { type: "number" },
      },
      required: ["grossCanopyArea", "netCanopyArea"],
    },
    ports: {
      inputs: [
        {
          id: "shelfWidth",
          label: "Shelf Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "shelfDepth",
          label: "Shelf Depth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "shelves",
          label: "Shelves",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "excludedArea",
          label: "Excluded Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "grossCanopyArea",
          label: "Gross Canopy Area",
          valueType: { type: "number" },
        },
        {
          id: "netCanopyArea",
          label: "Net Canopy Area",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = rackShelfCanopyNetareaTermTool.execute;
export default rackShelfCanopyNetareaTermTool;
