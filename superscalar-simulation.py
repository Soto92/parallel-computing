
instructions = [
    ("add", "a", ["b", "c"]),
    ("mul", "x", ["y", "z"]),
    ("mul", "r", ["a", 5])
]

ready = {"b", "c", "y", "z", 5}

cycle_num = 1
while instructions:
    cycle = []
    for instr in instructions:
        op, dest, operands = instr
        if all(oprnd in ready for oprnd in operands):
            cycle.append(instr)

    if not cycle:
        print("No execution. Deadlock!")
        break

    print(f"Cycle {cycle_num}: running in parallel -> {cycle}")

    for instr in cycle:
        _, dest, _ = instr
        ready.add(dest)
        instructions.remove(instr)

    cycle_num += 1
