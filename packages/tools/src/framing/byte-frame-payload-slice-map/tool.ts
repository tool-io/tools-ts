import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  frameBytes: number;
  headerBytes: number;
  trailerBytes: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "frameBytes", kind: "integer", label: "frameBytes" },
  { id: "headerBytes", kind: "integer", label: "headerBytes" },
  { id: "trailerBytes", kind: "integer", label: "trailerBytes" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.int(i.frameBytes, 0, 128);
  H.int(i.headerBytes, 0, i.frameBytes);
  H.int(i.trailerBytes, 0, i.frameBytes - i.headerBytes);
  return H.finish({
    header: [0, i.headerBytes],
    payload: [i.headerBytes, i.frameBytes - i.trailerBytes],
    trailer: [i.frameBytes - i.trailerBytes, i.frameBytes],
  });
};
export const example = {
  input: { frameBytes: 10, headerBytes: 2, trailerBytes: 3 },
  output: { result: { header: [0, 2], payload: [2, 7], trailer: [7, 10] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "framing/byte-frame-payload-slice-map",
  title: "Byte Frame Payload Slice Map",
  description:
    "Map explicit byte-frame header, payload and trailer half-open spans; zero-width regions remain explicit and impossible lengths are rejected.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          header: { type: "array", items: { type: "number" } },
          payload: { type: "array", items: { type: "number" } },
          trailer: { type: "array", items: { type: "number" } },
        },
        required: ["header", "payload", "trailer"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
