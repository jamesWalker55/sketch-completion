import tomli
import os.path

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

config_path = os.path.join(BASE_DIR, "config.toml")

with open(config_path, "rb") as f:
    config = tomli.load(f)
