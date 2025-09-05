# Simulation of VLIW (Very Long Instruction Word)

# Program written by the programmer
program = [
    ("add", "a", ["b", "c"]),
    ("mul", "x", ["y", "z"]),
    ("mul", "r", ["a", 5])
]

# Values that are already available
ready = {"b", "c", "y", "z", 5}


def vliw_compiler(instructions, ready):
    """
    Groups independent instructions into bundles.
    """
    bundles = []
    current_bundle = []
    available = set(ready)

    for instr in instructions:
        op, dest, operands = instr
        # If all operands are ready, it can go into the current bundle
        if all(oprnd in available for oprnd in operands):
            current_bundle.append(instr)
            available.add(dest)
        else:
            # Close the current bundle and start a new one
            if current_bundle:
                bundles.append(current_bundle)
                current_bundle = []
            current_bundle.append(instr)
            available.add(dest)

    if current_bundle:
        bundles.append(current_bundle)

    return bundles


# Compiler creates the bundles
bundles = vliw_compiler(program, ready)

# Hardware executes the bundles
for cycle, bundle in enumerate(bundles, start=1):
    print(f"Cycle {cycle}: executing bundle -> {bundle}")
