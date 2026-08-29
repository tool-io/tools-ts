import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type NailCountPerConnectionInput = Readonly<{
  readonly connectionCount: number;
  readonly nailsPerConnection: number;
}>;
export type NailCountPerConnectionOutput = Readonly<{ nailCount: number }>;

export const calculateNailCountPerConnection = (
  i: NailCountPerConnectionInput,
): NailCountPerConnectionOutput => {
  const value = i.connectionCount * i.nailsPerConnection;
  if (!Number.isFinite(value))
    simpleError("nailCount", "The inputs produce a non-finite result.");
  return { nailCount: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: { connectionCount: 24, nailsPerConnection: 4 },
  output: { nailCount: 96 },
} satisfies ToolExample<
  NailCountPerConnectionInput,
  NailCountPerConnectionOutput
>;

export const tool = createSimpleTool({
  id: "construction/nail-count-per-connection",
  title: "Nail Count Per Connection",
  description:
    "Calculate required nails from an integer number of identical connections and specified nails per connection; follow the actual connector schedule.",
  inputs: [
    {
      id: "connectionCount",
      kind: "integer",
      label: "Connection Count",
      minimum: 0,
    },
    {
      id: "nailsPerConnection",
      kind: "integer",
      label: "Nails Per Connection",
      minimum: 0,
    },
  ],
  outputs: [{ id: "nailCount", kind: "integer", label: "Nail Count" }],
  calculate: (input) =>
    calculateNailCountPerConnection({
      connectionCount: input.connectionCount as number,
      nailsPerConnection: input.nailsPerConnection as number,
    }),
});
export const nailCountPerConnectionTool = tool;
export const runNailCountPerConnection = tool.execute;
export default tool;
