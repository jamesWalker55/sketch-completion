import toml
import os.path

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

config_path = os.path.join(BASE_DIR, "config.toml")

with open(config_path, "r", encoding="utf8") as f:
    config = toml.load(f)
