import matplotlib
matplotlib.use('Agg')

import sys
import os

sys.path.insert(0, os.path.dirname(__file__) or '.')

import main as demo

def build():
    print("Regenerating figures...")
    demo.demo_t1_decay()
    demo.demo_t2_dephasing()
    demo.demo_both_t1_t2()
    demo.demo_all_noise_channels()
    demo.demo_driven_tls()
    demo.demo_steady_state_sweep()
    print("Build complete.")

if __name__ == '__main__':
    build()
