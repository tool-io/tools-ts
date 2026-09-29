import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly rooms: number;
  readonly piecesPerRoom: number;
  readonly par: number;
  readonly usableStock: number;
};
export type Output = { readonly target: number; readonly shortfall: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rooms: { type: "integer", minimum: 0 },
    piecesPerRoom: { type: "integer", minimum: 0 },
    par: { type: "number", minimum: 0 },
    usableStock: { type: "integer", minimum: 0 },
  },
  required: ["rooms", "piecesPerRoom", "par", "usableStock"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { target: { type: "integer" }, shortfall: { type: "integer" } },
  required: ["target", "shortfall"],
} as const;
/** Calculate laundry linen par room factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { rooms, piecesPerRoom, par, usableStock } = request;
  const compute = (): Output => {
    H.integer(rooms, 0);
    H.integer(piecesPerRoom, 0);
    H.domain(par >= 0);
    H.integer(usableStock, 0);
    return {
      target: Math.ceil(rooms * piecesPerRoom * par),
      shortfall: Math.max(
        0,
        Math.ceil(rooms * piecesPerRoom * par) - usableStock,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { rooms: 50, piecesPerRoom: 3, par: 3, usableStock: 400 },
  output: { target: 450, shortfall: 50 },
} satisfies ToolExample<Input, Output>;
export const laundryLinenParRoomFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hospitality/laundry-linen-par-room-factor",
    title: "Laundry Linen PAR Room Factor Tool",
    description:
      "Calculate laundry linen par room factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rooms: { type: "integer", minimum: 0 },
        piecesPerRoom: { type: "integer", minimum: 0 },
        par: { type: "number", minimum: 0 },
        usableStock: { type: "integer", minimum: 0 },
      },
      required: ["rooms", "piecesPerRoom", "par", "usableStock"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        target: { type: "integer" },
        shortfall: { type: "integer" },
      },
      required: ["target", "shortfall"],
    },
    ports: {
      inputs: [
        {
          id: "rooms",
          label: "Rooms",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "piecesPerRoom",
          label: "Pieces Per Room",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "par",
          label: "Par",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "usableStock",
          label: "Usable Stock",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "target", label: "Target", valueType: { type: "integer" } },
        { id: "shortfall", label: "Shortfall", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = laundryLinenParRoomFactorTool.execute;
export default laundryLinenParRoomFactorTool;
