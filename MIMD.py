import threading

def square_numbers(data):
    result = [x ** 2 for x in data]
    print("Squares:", result)

def cube_numbers(data):
    result = [x ** 3 for x in data]
    print("Cubes:", result)

def add_five(data):
    result = [x + 5 for x in data]
    print("Add 5:", result)

data1 = [1, 2, 3]
data2 = [4, 5, 6]
data3 = [7, 8, 9]

t1 = threading.Thread(target=square_numbers, args=(data1,))
t2 = threading.Thread(target=cube_numbers, args=(data2,))
t3 = threading.Thread(target=add_five, args=(data3,))

t1.start()
t2.start()
t3.start()

t1.join()
t2.join()
t3.join()

# Results:
# python .\MIMD.py
# Squares: [1, 4, 9]
# Cubes: [64, 125, 216]
# Add 5: [12, 13, 14]