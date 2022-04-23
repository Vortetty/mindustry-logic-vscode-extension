# Copyright 2022 Winter/Vortetty
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# see https://github.com/Anuken/Mindustry/blob/master/core/src/mindustry/logic/LogicOp.java
binary_ops = {
    "+": "add",
    "-": "sub",
    "*": "mul",
    "/": "div",
    "%": "mod",
    "==": "equal",
    "!=": "notEqual",
    "<": "lessThan",
    "<=": "lessThanEq",
    ">": "greaterThan",
    ">=": "greaterThanEq",
    ">>": "shl",
    "<<": "shr",
    "|": "or",
    "&": "and",
    "^": "xor"
}

condition_ops = {
    "==": "equal",
    "!=": "notEqual",
    "<": "lessThan",
    "<=": "lessThanEq",
    ">": "greaterThan",
    ">=": "greaterThanEq"
}
#TODO remove negate b/c its deprecated
unary_ops = {"-": "negate", "~": "not"}

binary_op_inverses = {"==": "!=", "!=": "==", "<": ">=", "<=": ">", ">": "<=", ">=": "<"}

func_binary_ops = ["pow", "max", "min", "atan2", "dst"]
func_unary_ops = ["abs", "log", "log10", "sin", "cos", "tan", "floor", "ceil", "sqrt", "rand"]
binary_ops.update(dict(zip(func_binary_ops, func_binary_ops)))
unary_ops.update(dict(zip(func_unary_ops, func_unary_ops)))

draw_funcs = {
    "draw" + func.lower(): func
    for func in
    ["clear", "color", "stroke", "line", "rect", "lineRect", "poly", "linePoly", "triangle"]
}

builtins = [
    "print", "printd", "printflush", "radar", "sensor", "enable", "shoot", "get_link", "read",
    "write", "drawflush", "end"
] + list(draw_funcs.keys())
