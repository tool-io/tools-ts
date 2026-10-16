import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  width: number;
  polynomial: string;
  initial: string;
  xorOut: string;
  reflectIn: boolean;
  reflectOut: boolean;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "width", kind: "integer", label: "width" },
  { id: "polynomial", kind: "string", label: "polynomial" },
  { id: "initial", kind: "string", label: "initial" },
  { id: "xorOut", kind: "string", label: "xorOut" },
  { id: "reflectIn", kind: "boolean", label: "reflectIn" },
  { id: "reflectOut", kind: "boolean", label: "reflectOut" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.int(i.width, 1, 128);
  const values = [
      H.bigint(i.polynomial),
      H.bigint(i.initial),
      H.bigint(i.xorOut),
    ],
    limit = 1n << BigInt(i.width);
  return H.finish({
    withinWidth: values.map((x) => x >= 0n && x < limit),
    polynomialHasConstant: values[0] >= 0n && values[0] % 2n === 1n,
    reflectIn: i.reflectIn,
    reflectOut: i.reflectOut,
    convention: "polynomial excludes leading coefficient",
  });
};
export const example = {
  input: {
    width: 4,
    polynomial: "3",
    initial: "16",
    xorOut: "0",
    reflectIn: false,
    reflectOut: false,
  },
  output: {
    result: {
      withinWidth: [true, false, true],
      polynomialHasConstant: true,
      reflectIn: false,
      reflectOut: false,
      convention: "polynomial excludes leading coefficient",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "integrity/crc-parameter-record-audit",
  title: "CRC Parameter Record Audit",
  description:
    "Audit explicit CRC parameter width evidence under the omitted-leading-coefficient convention; no CRC computation, polynomial quality or catalog identification.",
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
          withinWidth: { type: "array", items: { type: "boolean" } },
          polynomialHasConstant: { type: "boolean" },
          reflectIn: { type: "boolean" },
          reflectOut: { type: "boolean" },
          convention: { type: "string" },
        },
        required: [
          "withinWidth",
          "polynomialHasConstant",
          "reflectIn",
          "reflectOut",
          "convention",
        ],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
