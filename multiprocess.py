import multiprocessing
import time

# A simple function to simulate a CPU-bound task
def compute_square(number):
    print(f"[Process {multiprocessing.current_process().name}] Computing square of {number}")
    time.sleep(1)  # Simulate time-consuming computation
    result = number * number
    print(f"[Process {multiprocessing.current_process().name}] Result: {result}")
    return result

if __name__ == '__main__':
    numbers = [1, 2, 3, 4, 5]

    with multiprocessing.Pool(processes=3) as pool:
        print("[Main Process] Starting multiprocessing pool...")

        results = pool.map(compute_square, numbers)

    print("\n[Main Process] Final Results:", results)

# Results:
# python .\multiprocess.py   
# [Main Process] Starting multiprocessing pool...
# [Process SpawnPoolWorker-2] Computing square of 1
# [Process SpawnPoolWorker-3] Computing square of 2
# [Process SpawnPoolWorker-1] Computing square of 3
# [Process SpawnPoolWorker-2] Result: 1
# [Process SpawnPoolWorker-2] Computing square of 4
# [Process SpawnPoolWorker-3] Result: 4
# [Process SpawnPoolWorker-3] Computing square of 5
# [Process SpawnPoolWorker-1] Result: 9
# [Process SpawnPoolWorker-2] Result: 16
# [Process SpawnPoolWorker-3] Result: 25
# [Main Process] Final Results: [1, 4, 9, 16, 25]
