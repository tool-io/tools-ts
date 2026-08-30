import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FuturesWheelInput = {
  readonly orderAssignments: ReadonlyArray<number>;
  readonly spokes: ReadonlyArray<string>;
};

export type FuturesWheelOutput = {
  readonly complete: boolean;
  readonly missingOrders: ReadonlyArray<number>;
  readonly orderCounts: ReadonlyArray<number>;
  readonly spokeCount: number;
};

export const mapFuturesWheelSpokes = (
  input: FuturesWheelInput,
): FuturesWheelOutput => {
  if (!Array.isArray(input.spokes) || !Array.isArray(input.orderAssignments))
    simpleError(
      "",
      "Spokes and order assignments must be arrays.",
      "wheel_data_required",
    );
  if (
    input.spokes.length === 0 ||
    input.spokes.length !== input.orderAssignments.length
  )
    simpleError(
      "orderAssignments",
      "Each nonempty spoke must have one order assignment.",
      "wheel_data_length_mismatch",
    );
  const orderCounts = [0, 0, 0];
  const represented = new Set<number>();
  for (const [index, spoke] of input.spokes.entries()) {
    if (typeof spoke !== "string" || spoke.trim() === "")
      simpleError(
        `spokes.${index}`,
        "Spoke labels must be nonempty strings.",
        "invalid_spoke",
      );
    const order = input.orderAssignments[index]!;
    if (!Number.isSafeInteger(order) || order < 1 || order > 3)
      simpleError(
        `orderAssignments.${index}`,
        "Order assignments must be 1, 2, or 3.",
        "invalid_order_assignment",
      );
    orderCounts[order - 1] += 1;
    represented.add(order);
  }
  const missingOrders = [1, 2, 3].filter((order) => !represented.has(order));
  return {
    complete: missingOrders.length === 0,
    missingOrders,
    orderCounts,
    spokeCount: input.spokes.length,
  };
};

export const futuresWheelExample = {
  input: {
    orderAssignments: [1, 2, 1, 3],
    spokes: ["Automation", "Climate", "Trade", "Energy"],
  },
  output: {
    complete: true,
    missingOrders: [],
    orderCounts: [2, 1, 1],
    spokeCount: 4,
  },
} satisfies ToolExample<FuturesWheelInput, FuturesWheelOutput>;

export const futuresWheelTool = createSimpleTool({
  calculate: (input) =>
    mapFuturesWheelSpokes({
      orderAssignments: input.orderAssignments as number[],
      spokes: input.spokes as string[],
    }),
  description:
    "Assign caller-supplied futures-wheel spokes to first-, second-, or third-order effects and report counts and uncovered orders.",
  id: "futurology/futures-wheel-first-second-third-order-spokes",
  inputs: [
    {
      description: "One order code 1, 2, or 3 for each spoke.",
      id: "orderAssignments",
      kind: "numberList",
      label: "Order assignments",
    },
    { id: "spokes", kind: "stringList", label: "Spoke labels" },
  ],
  outputs: [
    { id: "complete", kind: "boolean", label: "All orders represented" },
    { id: "missingOrders", kind: "numberList", label: "Missing order codes" },
    { id: "orderCounts", kind: "numberList", label: "Order counts" },
    { id: "spokeCount", kind: "integer", label: "Spoke count", minimum: 1 },
  ],
  title: "Futures Wheel First Second Third Order Spokes",
});

export const runFuturesWheel = futuresWheelTool.execute;
export default futuresWheelTool;
