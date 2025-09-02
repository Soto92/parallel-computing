
#include <stdio.h>
#include <stddef.h>


void simt_kernel(float* a, size_t n) {
  for (size_t tid = 0; tid < n; ++tid) {
    float v = a[tid];

    int mask = (v > 10.0f);
    a[tid] = v + (float)mask * v;
  }
}

int main(void) {
  float values[] = {5, 12, 7, 20, 3, 15};
  const size_t n = sizeof(values) / sizeof(values[0]);

  printf("Before: ");
  for (size_t i = 0; i < n; ++i) printf("%.0f%s", values[i], (i+1==n) ? "\n" : " ");

  simt_kernel(values, n);

  printf("After:  ");
  for (size_t i = 0; i < n; ++i) printf("%.0f%s", values[i], (i+1==n) ? "\n" : " ");
  return 0;
}

/**
gcc simt_sim.c -O2 -o simt_sim
./simt_sim

LOGS
Before: 5 12 7 20 3 15
After:  5 24 7 40 3 30
*/