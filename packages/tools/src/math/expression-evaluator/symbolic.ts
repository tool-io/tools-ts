import { simpleError } from "../../core/simple.js";
import { evaluateMathExpression, type MathNode } from "./parser.js";

const number = (value: number): MathNode => ({ kind: "number", value });
const zero = number(0);
const one = number(1);
const is = (node: MathNode, value: number) =>
  node.kind === "number" && node.value === value;
const call = (name: string, ...arguments_: MathNode[]): MathNode => ({
  kind: "call",
  name,
  arguments: arguments_,
});
const negate = (value: MathNode): MathNode =>
  value.kind === "number"
    ? number(-value.value)
    : is(value, 0)
      ? zero
      : { kind: "unary", value };
const binary = (
  operator: "+" | "-" | "*" | "/" | "^",
  left: MathNode,
  right: MathNode,
): MathNode => {
  if (operator === "+" && is(left, 0)) return right;
  if ((operator === "+" || operator === "-") && is(right, 0)) return left;
  if (operator === "*" && (is(left, 0) || is(right, 0))) return zero;
  if (
    (operator === "*" || operator === "/" || operator === "^") &&
    is(right, 1)
  )
    return left;
  if (operator === "*" && is(left, 1)) return right;
  if (operator === "^") {
    if (is(right, 0)) return one;
    if (is(left, 1)) return one;
  }
  if (left.kind === "number" && right.kind === "number")
    return number(
      evaluateMathExpression({ kind: "binary", operator, left, right }),
    );
  return { kind: "binary", operator, left, right };
};
const add = (a: MathNode, b: MathNode) => binary("+", a, b);
const subtract = (a: MathNode, b: MathNode) => binary("-", a, b);
const multiply = (a: MathNode, b: MathNode) => binary("*", a, b);
const divide = (a: MathNode, b: MathNode) => binary("/", a, b);
const power = (a: MathNode, b: MathNode) => binary("^", a, b);

// Shared internal constructors keep symbolic tools on the same AST and
// simplification rules. They are not part of a tool's public index export.
export const mathExpressionNodes = {
  number,
  zero,
  one,
  call,
  negate,
  add,
  subtract,
  multiply,
  divide,
  power,
};

// Standard product, quotient, power and chain rules, on points where the
// original real expression and its derivative are defined. Unsupported
// piecewise/discontinuous functions do not silently produce a derivative.
export const differentiateMathExpression = (
  tree: MathNode,
  variable: string,
): MathNode => {
  let visited = 0;
  const derive = (node: MathNode): MathNode => {
    if (++visited > 4096)
      simpleError("expression", "Derivative is too complex.", "resource_limit");
    if (node.kind === "number") return zero;
    if (node.kind === "symbol") return node.name === variable ? one : zero;
    if (node.kind === "unary") return negate(derive(node.value));
    if (node.kind === "binary") {
      const a = node.left,
        b = node.right,
        da = derive(a),
        db = derive(b);
      if (is(da, 0) && is(db, 0)) return zero;
      switch (node.operator) {
        case "+":
          return add(da, db);
        case "-":
          return subtract(da, db);
        case "*":
          return add(multiply(da, b), multiply(a, db));
        case "/":
          return divide(
            subtract(multiply(da, b), multiply(a, db)),
            power(b, number(2)),
          );
        case "^":
          if (is(b, 0)) return zero;
          if (is(db, 0))
            return multiply(multiply(b, power(a, subtract(b, one))), da);
          return multiply(
            node,
            add(multiply(db, call("ln", a)), divide(multiply(b, da), a)),
          );
        case "%":
          return simpleError(
            "expression",
            "Symbolic remainder derivatives are unsupported.",
            "unsupported_expression",
          );
      }
    }
    if (node.name === "pow")
      return derive({
        kind: "binary",
        operator: "^",
        left: node.arguments[0],
        right: node.arguments[1],
      });
    const derivatives = node.arguments.map(derive);
    if (derivatives.every((value) => is(value, 0))) return zero;
    const a = node.arguments[0],
      da = derivatives[0];
    let outer: MathNode;
    switch (node.name) {
      case "sin":
        outer = call("cos", a);
        break;
      case "cos":
        outer = negate(call("sin", a));
        break;
      case "tan":
        outer = divide(one, power(call("cos", a), number(2)));
        break;
      case "asin":
        outer = divide(one, call("sqrt", subtract(one, power(a, number(2)))));
        break;
      case "acos":
        outer = negate(
          divide(one, call("sqrt", subtract(one, power(a, number(2))))),
        );
        break;
      case "atan":
        outer = divide(one, add(one, power(a, number(2))));
        break;
      case "sinh":
        outer = call("cosh", a);
        break;
      case "cosh":
        outer = call("sinh", a);
        break;
      case "tanh":
        outer = divide(one, power(call("cosh", a), number(2)));
        break;
      case "ln":
        outer = divide(one, a);
        break;
      case "log":
      case "log10":
        outer = divide(one, multiply(a, number(Math.LN10)));
        break;
      case "log2":
        outer = divide(one, multiply(a, number(Math.LN2)));
        break;
      case "exp":
        outer = node;
        break;
      case "sqrt":
        outer = divide(one, multiply(number(2), node));
        break;
      case "cbrt":
        outer = divide(one, multiply(number(3), power(node, number(2))));
        break;
      case "atan2": {
        const b = node.arguments[1],
          db = derivatives[1];
        return divide(
          subtract(multiply(b, da), multiply(a, db)),
          add(power(a, number(2)), power(b, number(2))),
        );
      }
      case "hypot":
        return divide(
          node.arguments.reduce(
            (sum, value, index) =>
              add(sum, multiply(value, derivatives[index])),
            zero,
          ),
          node,
        );
      default:
        return simpleError(
          "expression",
          `Symbolic derivatives of ${node.name} are unsupported.`,
          "unsupported_expression",
        );
    }
    return multiply(outer, da);
  };
  return derive(tree);
};

export const renderMathExpression = (tree: MathNode): string => {
  let rendered = 0;
  const render = (node: MathNode): string => {
    if (++rendered > 4096)
      simpleError("expression", "Derivative is too complex.", "resource_limit");
    let result: string;
    switch (node.kind) {
      case "number":
        result = String(node.value);
        break;
      case "symbol":
        result = node.name;
        break;
      case "unary":
        result = `(-${render(node.value)})`;
        break;
      case "binary":
        result = `(${render(node.left)} ${node.operator} ${render(node.right)})`;
        break;
      case "call":
        result = `${node.name}(${node.arguments.map(render).join(", ")})`;
        break;
    }
    if (result.length > 4096)
      simpleError(
        "expression",
        "Derivative exceeds the output limit.",
        "resource_limit",
      );
    return result;
  };
  const result = render(tree);
  return result.startsWith("(") ? result.slice(1, -1) : result;
};
